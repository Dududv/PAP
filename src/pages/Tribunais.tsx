import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Gavel, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';

const Tribunais = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 10;
  
  const [nome, setNome] = useState<string>('');
  const [morada, setMorada] = useState<string>('');
  const [ordenarPor, setOrdenarPor] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<string>('');
  
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
  
  // Add debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchParams: URLSearchParams) => {
      try {
        const apiUrl = `http://localhost:3001/api/tribunais?${searchParams.toString()}`;
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
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert(`Erro ao buscar dados: ${error.message}`);
      }
    }, 500),
    []
  );

  // Update search function to use debounced search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    const queryParams = new URLSearchParams();
    if (nome) queryParams.append('nome', nome);
    if (morada) queryParams.append('morada', morada);
    if (ordenarPor) queryParams.append('ordenarPor', ordenarPor);
    if (ordenacao) queryParams.append('ordenacao', ordenacao);

    await debouncedSearch(queryParams);
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
    };

    // Always include the last page if it's not in the visible range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("..."); // Ellipsis for skipped pages
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const location = useLocation();

  const handleViewDetails = (tribunal: any) => {
    navigate(`/detalhes?tipo=tribunal&id=${encodeURIComponent(tribunal.ID || tribunal.Nome)}&nome=${encodeURIComponent(tribunal.Nome)}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8 flex-grow"
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
          Pesquisa de Tribunais
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
                    <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-1">
                      Nome
                    </label>
                    <div className="flex space-x-2">
                      <Input id="nome" placeholder="Nome do Tribunal" value={nome} onChange={(e) => setNome(e.target.value)} />
                      {nome && (
                        <button
                          type="button"
                          onClick={() => setNome('')}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div custom={1} variants={formFieldVariants}>
                    <label htmlFor="morada" className="block text-sm font-medium text-foreground mb-1">
                      Morada
                    </label>
                    <div className="flex space-x-2">
                      <Input id="morada" placeholder="Morada" value={morada} onChange={(e) => setMorada(e.target.value)} />
                      {morada && (
                        <button
                          type="button"
                          onClick={() => setMorada('')}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                <motion.div custom={2} variants={formFieldVariants} className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-2">Ordenar</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ordenar-por" className="block text-sm font-medium text-foreground mb-1">
                        Ordenar Por
                      </label>
                      <Select onValueChange={setOrdenarPor}>
                        <SelectTrigger id="ordenar-por">
                          <SelectValue placeholder="Ordenar Por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nome">Nome</SelectItem>
                          <SelectItem value="morada">Morada</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="ordenacao" className="block text-sm font-medium text-foreground mb-1">
                        Ordenação
                      </label>
                      <Select onValueChange={setOrdenacao}>
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
                  custom={3} 
                  variants={formFieldVariants}
                  className="pt-4"
                >
                  <motion.button 
                    type="submit" 
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    PESQUISAR
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
            
            {hasSearched && (
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm text-foreground mb-2">Foram Encontrados</p>
                <h2 className="text-xl font-bold">{searchResults} Resultados</h2>
              </motion.div>
            )}

            {/* Results Section */}
            {hasSearched && results.length > 0 && (
              <>
                <motion.div 
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {currentResults.map((tribunal, index) => (
                    <motion.div
                      key={tribunal.ID}
                      className="bg-card rounded-lg shadow-sm border border-border p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                        <span>{tribunal.Nome}</span>
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                             onClick={() => handleViewDetails(tribunal)} />
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {tribunal.Morada && tribunal.Morada !== "N/D" && (
                          <div>
                            <p className="font-medium text-foreground">Morada</p>
                            <p className="text-foreground">{tribunal.Morada}</p>
                          </div>
                        )}
                        {tribunal.Email && tribunal.Email !== "N/D" && (
                          <div>
                            <p className="font-medium text-foreground">Email</p>
                            <p className="text-foreground">{tribunal.Email}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

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
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                        
                        {getPageNumbers().map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {totalPages > 10 && (
                          <PaginationItem>
                            <PaginationNext 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </motion.div>
                )}
              </>
            )}
          </div>
          
          {/* Right column - Featured tribunals */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h2 className="text-lg font-medium text-foreground mb-4">Tribunais em Destaque</h2>
              <p className="text-foreground text-sm mb-4">Descubra tribunais e as suas informações comprovadas.</p>
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
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 dark:text-green-700">
                        <Gavel size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Tribunal de Exemplo {index + 1}</h3>
                      <p className="text-sm text-foreground">Lisboa, Portugal</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {location.pathname !== '/tribunais' && location.pathname !== '/tribunais/list' && <Footer />}
    </div>
  );
};

export default Tribunais;
