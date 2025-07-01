import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const ListaTribunais = () => {
  const navigate = useNavigate();
  const [tribunais, setTribunais] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLetter, setActiveLetter] = useState<string>('a');

  useEffect(() => {
    const fetchAllTribunais = async () => {
      setIsLoading(true);
      try {
        let apiUrl = 'http://localhost:3001/api/all-tribunais';
        if (activeLetter !== 'all') {
          apiUrl += `?letter=${activeLetter}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch all tribunais');
        }
        const data = await response.json();
        setTribunais(data);
      } catch (error) {
        console.error('Error fetching all tribunais:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTribunais();
  }, [activeLetter]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleViewDetails = (tribunal: any) => {
    navigate(`/detalhes/tribunal/${encodeURIComponent(tribunal.ID || tribunal.Nome)}`);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8 flex-grow transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl font-semibold text-foreground mb-8 transition-colors duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Lista de Tribunais {activeLetter !== 'all' ? `- Letra ${activeLetter.toUpperCase()}` : ''}
        </motion.h1>

        {/* Alphabetical Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={() => setActiveLetter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLetter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-accent'}`}
          >
            Todos
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter.toLowerCase())}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLetter === letter.toLowerCase() ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-accent'}`}
            >
              {letter}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <p className="text-muted-foreground">A carregar tribunais...</p>
        ) : tribunais.length === 0 ? (
          <p className="text-muted-foreground">Nenhum tribunal encontrado para a letra selecionada.</p>
        ) : (
          <>
            <motion.div 
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {tribunais.map((tribunal, index) => (
                <motion.div 
                  key={tribunal.ID}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                >
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center space-x-2">
                    <span>{tribunal.Nome}</span>
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                         onClick={() => handleViewDetails(tribunal)} />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {tribunal.Morada && tribunal.Morada !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Morada</p>
                        <p className="text-muted-foreground">{tribunal.Morada}</p>
                      </div>
                    )}
                    
                    {tribunal.telefone && tribunal.telefone !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Telefone</p>
                        <p className="text-muted-foreground">{tribunal.telefone}</p>
                      </div>
                    )}

                    {tribunal.Email && tribunal.Email !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Email</p>
                        <p className="text-muted-foreground">{tribunal.Email}</p>
                      </div>
                    )}
                    
                    {tribunal.Tipo && tribunal.Tipo !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Tipo</p>
                        <p className="text-muted-foreground">{tribunal.Tipo}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ListaTribunais; 