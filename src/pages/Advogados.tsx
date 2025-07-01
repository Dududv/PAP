import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MapPin, Search, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Advogados = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const resultsPerPage = 10;
  
  // Form state
  const [formData, setFormData] = useState({
    conselho: '',
    cedula: '',
    name: '',
    morada: '',
    localidade: '',
    codigoPostal: '',
    ordenarPor: '',
    ordenacao: ''
  });
  
  // Animation variants
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          if (key === 'conselho') {
            queryParams.append('conselho', value);
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const apiUrl = `http://localhost:3001/api/advogados?${queryParams.toString()}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setResults(data);
      // Filter out inactive lawyers before setting the search results count
      const activeLawyers = data.filter((lawyer: { estado: string; }) => lawyer.estado !== 'Inativo');
      setSearchResults(activeLawyers.length);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (result: any) => {
    navigate(`/detalhes?tipo=advogado&id=${encodeURIComponent(result.id || result.name)}&nome=${encodeURIComponent(result.name)}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.filter(result => result.estado !== 'Inativo').slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Number of pages to always show around the current page
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // Less than maxVisiblePages total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than maxVisiblePages total pages, calculate dynamic range
      const maxPagesBeforeCurrentPage = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        // Near the beginning
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // Always include the first page if it's not in the visible range
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("..."); // Ellipsis for skipped pages
      }
    }

    // Add the calculated range of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always include the last page if it's not in the visible range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("..."); // Ellipsis for skipped pages
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8 transition-colors duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl font-semibold text-foreground mb-8 transition-colors duration-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Pesquisa de Advogados
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Search form */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm border border-border transition-colors duration-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <motion.h2 
                className="text-lg font-medium text-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Filtros
              </motion.h2>
              
              <motion.form 
                onSubmit={handleSearch} 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div custom={0} variants={formFieldVariants}>
                    <label htmlFor="conselho" className="block text-sm font-medium text-foreground mb-1">
                      Conselho Regional
                    </label>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value) => handleSelectChange('conselho', value)} value={formData.conselho}>
                        <SelectTrigger id="conselho" className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lisboa">Lisboa</SelectItem>
                          <SelectItem value="porto">Porto</SelectItem>
                          <SelectItem value="coimbra">Coimbra</SelectItem>
                          <SelectItem value="evora">Évora</SelectItem>
                          <SelectItem value="faro">Faro</SelectItem>
                          <SelectItem value="madeira">Madeira</SelectItem>
                          <SelectItem value="acores">Açores</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.conselho && (
                        <button
                          type="button"
                          onClick={() => handleSelectChange('conselho', '')}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div custom={1} variants={formFieldVariants}>
                    <label htmlFor="cedula" className="block text-sm font-medium text-foreground mb-1">
                      Número
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="cedula" 
                        placeholder="Número de cédula" 
                        value={formData.cedula} 
                        onChange={handleInputChange} 
                      />
                      {formData.cedula && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'cedula', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div custom={2} variants={formFieldVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Nome
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="name" 
                        placeholder="Nome do Advogado" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                      {formData.name && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'name', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div custom={3} variants={formFieldVariants}>
                    <label htmlFor="morada" className="block text-sm font-medium text-foreground mb-1">
                      Morada
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="morada" 
                        placeholder="Morada" 
                        value={formData.morada} 
                        onChange={handleInputChange} 
                      />
                      {formData.morada && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'morada', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div custom={4} variants={formFieldVariants}>
                    <label htmlFor="localidade" className="block text-sm font-medium text-foreground mb-1">
                      Localidade
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="localidade" 
                        placeholder="Localidade" 
                        value={formData.localidade} 
                        onChange={handleInputChange} 
                      />
                      {formData.localidade && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'localidade', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div custom={5} variants={formFieldVariants}>
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-foreground mb-1">
                      Código Postal
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="codigoPostal" 
                        placeholder="0000-000" 
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                      />
                      {formData.codigoPostal && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'codigoPostal', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                <motion.div custom={6} variants={formFieldVariants} className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-2">Ordenar</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ordenarPor" className="block text-sm font-medium text-foreground mb-1">
                        Ordenar Por
                      </label>
                      <Select onValueChange={(value) => handleSelectChange('ordenarPor', value)} value={formData.ordenarPor}>
                        <SelectTrigger id="ordenarPor">
                          <SelectValue placeholder="Ordenar Por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cedula">Cédula</SelectItem>
                          <SelectItem value="name">Nome</SelectItem>
                          <SelectItem value="morada">Morada</SelectItem>
                          <SelectItem value="codigoPostal">Código Postal</SelectItem>
                          <SelectItem value="localidade">Localidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="ordenacao" className="block text-sm font-medium text-foreground mb-1">
                        Ordenação
                      </label>
                      <Select onValueChange={(value) => handleSelectChange('ordenacao', value)} value={formData.ordenacao}>
                        <SelectTrigger id="ordenacao">
                          <SelectValue placeholder="Ordenação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascendente</SelectItem>
                          <SelectItem value="desc">Descendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={7} 
                  variants={formFieldVariants}
                  className="pt-4"
                >
                  <motion.button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'A PESQUISAR...' : 'PESQUISAR'}
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
            
            {hasSearched && (
              <>
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground mb-2">Foram Encontrados</p>
                  <h2 className="text-xl font-bold text-foreground">{searchResults} Resultados</h2>
                </motion.div>

                {currentResults.length > 0 && (
                  <motion.div 
                    className="mt-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {currentResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        className="bg-card rounded-lg shadow-sm border border-border p-6 transition-colors duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                      >
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                          <span>{result.name}</span>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                               onClick={() => handleViewDetails(result)} />
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {result.conselho && result.conselho !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Conselho Regional</p>
                              <p className="text-muted-foreground">{result.conselho}</p>
                            </div>
                          )}
                          {result.morada && result.morada !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Morada</p>
                              <p className="text-muted-foreground">{result.morada}</p>
                            </div>
                          )}
                          {result.cedula && result.cedula !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Cédula</p>
                              <p className="text-muted-foreground">{result.cedula}</p>
                            </div>
                          )}
                          
                          {result.localidade && result.localidade !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Localidade</p>
                              <p className="text-muted-foreground">{result.localidade}</p>
                            </div>
                          )}
                          {result.codigo_postal && result.codigo_postal !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Código Postal</p>
                              <p className="text-muted-foreground">{result.codigo_postal}</p>
                            </div>
                          )}
                          {result.dataConstituicao && result.dataConstituicao !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Data de Constituição</p>
                              <p className="text-muted-foreground">{result.dataConstituicao}</p>
                            </div>
                          )}
                          
                          {result.email && result.email !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Email</p>
                              <p className="text-muted-foreground">{result.email}</p>
                            </div>
                          )}
                          
                          {result.telefone && result.telefone !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Telefone</p>
                              <p className="text-muted-foreground">{result.telefone}</p>
                            </div>
                          )}
                          
                          {result.fax && result.fax !== "N/D" && (
                            <div>
                              <p className="font-medium text-muted-foreground">Fax</p>
                              <p className="text-muted-foreground">{result.fax}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Pagination Section */}
                    {totalPages > 1 && (
                      <motion.div 
                        className="mt-8 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            
                            {getPageNumbers().map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
          
          {/* Right column - Featured lawyers/firms */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm border border-border transition-colors duration-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-lg font-medium text-foreground mb-4">Advogados em Destaque</h2>
              <p className="text-muted-foreground text-sm mb-4">Descubra advogados e as suas informações comprovadas.</p>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 bg-muted p-4 rounded-lg shadow-sm border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    whileHover={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)" }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Advogado de Exemplo {index + 1}</h3>
                      <p className="text-sm text-muted-foreground">Lisboa, Portugal</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Advogados;
