import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Building, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Sociedades = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const resultsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    conselhoRegional: '',
    numero: '',
    nome: '',
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
          queryParams.append(key, value);
        }
      });

      const apiUrl = `http://localhost:3001/api/sociedades?${queryParams.toString()}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setResults(data);
      setSearchResults(data.length);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (sociedade: any) => {
    navigate(`/detalhes?tipo=sociedade&id=${encodeURIComponent(sociedade.id || sociedade.name)}&nome=${encodeURIComponent(sociedade.name)}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl font-semibold text-foreground mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Pesquisa de Sociedades
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Search form */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm border border-border transition-colors duration-300"
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
                    <label htmlFor="conselhoRegional" className="block text-sm font-medium text-foreground mb-1">
                      Conselho Regional
                    </label>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value) => handleSelectChange('conselhoRegional', value)} value={formData.conselhoRegional}>
                        <SelectTrigger id="conselhoRegional" className="w-full">
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
                      {formData.conselhoRegional && (
                        <button
                          type="button"
                          onClick={() => handleSelectChange('conselhoRegional', '')}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div custom={1} variants={formFieldVariants}>
                    <label htmlFor="numero" className="block text-sm font-medium text-foreground mb-1">
                      Número
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="numero" 
                        placeholder="Número de registo" 
                        value={formData.numero}
                        onChange={handleInputChange}
                      />
                      {formData.numero && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'numero', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
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
                    <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-1">
                      Nome
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="nome" 
                        placeholder="Nome da Sociedade" 
                        value={formData.nome}
                        onChange={handleInputChange}
                      />
                      {formData.nome && (
                        <button
                          type="button"
                          onClick={() => handleInputChange({ target: { id: 'nome', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
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
                    <Input 
                      id="localidade" 
                      placeholder="Localidade" 
                      value={formData.localidade}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                  
                  <motion.div custom={5} variants={formFieldVariants}>
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-foreground mb-1">
                      Código Postal
                    </label>
                    <Input 
                      id="codigoPostal" 
                      placeholder="0000-000" 
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                </div>
                
                <motion.div custom={6} variants={formFieldVariants} className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-2">Ordenar</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ordenarPor" className="block text-sm font-medium text-foreground mb-1">
                        Ordenar Por
                      </label>
                      <Select onValueChange={(value) => handleSelectChange('ordenarPor', value)}>
                        <SelectTrigger id="ordenarPor">
                          <SelectValue placeholder="Ordenar Por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="registo">Registo</SelectItem>
                          <SelectItem value="nome">Nome</SelectItem>
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
                      <Select onValueChange={(value) => handleSelectChange('ordenacao', value)}>
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
                    className="w-full bg-[#0EA5E9] hover:bg-[#0891D1] text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-sm text-foreground mb-2">Foram Encontrados</p>
                  <h2 className="text-xl font-bold">{searchResults} Resultados</h2>
                </motion.div>

                {currentResults.length > 0 && (
                  <motion.div 
                    className="mt-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {currentResults.map((sociedade, index) => (
                      <motion.div 
                        key={sociedade.id}
                        className="bg-card p-6 rounded-lg shadow-sm border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                      >
                        <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center space-x-2">
                          <span>{sociedade.name}</span>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                               onClick={() => handleViewDetails(sociedade)} />
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Conselho Regional</p>
                            <p className="text-foreground">{sociedade.conselho}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Registo</p>
                            <p className="text-foreground">{sociedade.registo}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Data de Constituição</p>
                            <p className="text-foreground">{sociedade.data_constituicao}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-foreground">Morada</p>
                            <p className="text-foreground">{sociedade.morada}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Localidade</p>
                            <p className="text-foreground">{sociedade.localidade}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Código Postal</p>
                            <p className="text-foreground">{sociedade.codigo_postal}</p>
                          </div>
                          
                          {sociedade.email !== 'N/D' && (
                            <div>
                              <p className="font-medium text-foreground">Email</p>
                              <p className="text-foreground">{sociedade.email}</p>
                            </div>
                          )}
                          
                          {sociedade.telefone !== 'N/D' && (
                            <div>
                              <p className="font-medium text-foreground">Telefone</p>
                              <p className="text-foreground">{sociedade.telefone}</p>
                            </div>
                          )}
                          
                          {sociedade.fax !== 'N/D' && (
                            <div>
                              <p className="font-medium text-foreground">Fax</p>
                              <p className="text-foreground">{sociedade.fax}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {currentResults.length > 0 && totalPages > 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex justify-center mt-6"
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
          
          {/* Right column - Featured societies */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-lg font-medium text-foreground mb-4">Sociedades em Destaque</h2>
              <p className="text-foreground text-sm mb-4">Descubra sociedades de advogados e as suas informações comprovadas.</p>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 bg-card p-4 rounded-lg shadow-sm border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    whileHover={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)" }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Building size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Sociedade de Exemplo {index + 1}</h3>
                      <p className="text-sm text-foreground">Lisboa, Portugal</p>
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

export default Sociedades;
