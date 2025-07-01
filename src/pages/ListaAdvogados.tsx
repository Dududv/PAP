import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye } from 'lucide-react'; // Changed from Building to Briefcase
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const ListaAdvogados = () => { // Changed from ListaSociedades
  const navigate = useNavigate();
  const [advogados, setAdvogados] = useState<any[]>([]); // Changed from societies
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLetter, setActiveLetter] = useState<string>('a'); // Iniciar com a letra 'a' selecionada

  useEffect(() => {
    const fetchAllAdvogados = async () => { // Changed from fetchAllSocieties
      setIsLoading(true);
      try {
        let apiUrl = 'http://localhost:3001/api/all-advogados'; // Changed API endpoint
        if (activeLetter !== 'all') {
          apiUrl += `?letter=${activeLetter}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch all advogados'); // Changed error message
        }
        const data = await response.json();
        // Filter out inactive lawyers
        const activeAdvogados = data.filter((advogado: { estado: string; }) => advogado.estado !== 'Inativo');
        setAdvogados(activeAdvogados);
      } catch (error) {
        console.error('Error fetching all advogados:', error); // Changed error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAdvogados(); // Changed function call
  }, [activeLetter]); // Re-fetch when activeLetter changes

  const handleViewDetails = (advogado: any) => {
    navigate(`/detalhes/advogado/${encodeURIComponent(advogado.id || advogado.name)}`);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
          className="text-2xl font-semibold text-foreground mb-8 transition-colors duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Lista de Advogados {activeLetter !== 'all' ? `- Letra ${activeLetter.toUpperCase()}` : ''}
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
          <p className="text-muted-foreground">A carregar advogados...</p>
        ) : advogados.length === 0 ? (
          <p className="text-muted-foreground">Nenhum advogado encontrado para a letra selecionada.</p>
        ) : (
          <>
            <motion.div 
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {advogados.map((advogado, index) => (
                <motion.div 
                  key={advogado.id}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                >
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center space-x-2">
                    <span>{advogado.name}</span>
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                         onClick={() => handleViewDetails(advogado)} />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {advogado.conselho && advogado.conselho !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Conselho Regional</p>
                        <p className="text-muted-foreground">{advogado.conselho}</p>
                      </div>
                    )}
                    {advogado.cedula && advogado.cedula !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Cédula</p> 
                        <p className="text-muted-foreground">{advogado.cedula}</p> 
                      </div>
                    )}
                    {advogado.dataConstituicao && advogado.dataConstituicao !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Data de Constituição</p>
                        <p className="text-muted-foreground">{advogado.dataConstituicao}</p> 
                      </div>
                    )}
                    {advogado.morada && advogado.morada !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Morada</p>
                        <p className="text-muted-foreground">{advogado.morada}</p>
                      </div>
                    )}
                    {advogado.localidade && advogado.localidade !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Localidade</p>
                        <p className="text-muted-foreground">{advogado.localidade}</p> 
                      </div>
                    )}
                    {advogado.codigo_postal && advogado.codigo_postal !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Código Postal</p>
                        <p className="text-muted-foreground">{advogado.codigo_postal}</p> 
                      </div>
                    )}
                    {advogado.email && advogado.email !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Email</p>
                        <p className="text-muted-foreground">{advogado.email}</p>
                      </div>
                    )}
                    {advogado.telefone && advogado.telefone !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Telefone</p>
                        <p className="text-muted-foreground">{advogado.telefone}</p>
                      </div>
                    )}
                    {advogado.fax && advogado.fax !== "N/D" && (
                      <div>
                        <p className="font-medium text-muted-foreground">Fax</p>
                        <p className="text-muted-foreground">{advogado.fax}</p>
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

export default ListaAdvogados; 