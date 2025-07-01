import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState('advogados');
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const categoryVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };
  
  // Function to navigate to different pages
  const navigateTo = (path) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Animations */}
        <motion.section 
          className="bg-background py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto text-foreground"
              variants={itemVariants}
            >
              Conecte-se à Justiça. Encontre o apoio jurídico que precisa.
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              variants={itemVariants}
            >
              Cuide dos assuntos jurídicos com mais facilidade, usando tecnologia
              que avisa, organiza e simplifica cada etapa do processo.
            </motion.p>
            
            {/* Search Bar with Animations */}
            <motion.div 
              className="max-w-xl mx-auto mt-12 relative"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center bg-card rounded-full shadow-md overflow-hidden"
                initial={{ width: "90%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)" }}
              >
                <Input 
                  type="text" 
                  placeholder="Procure Advogados/Tribunais" 
                  className="flex-1 py-3 px-6 bg-transparent border-none focus:ring-0 focus:outline-none rounded-l-full text-foreground" 
                  disabled
                />
                {/* Fix: Wrap the Button with motion.div for animations */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="bg-primary hover:bg-primary/80 px-6 py-3 rounded-full text-primary-foreground" disabled>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      Procurar
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-6 flex justify-center items-center space-x-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.div 
                  className="text-sm text-muted-foreground"
                  whileHover={{ scale: 1.05, color: "#9b87f5" }}
                >
                  <Link to="/advogados">
                    Procura Advogados
                  </Link>
                </motion.div>
                <motion.div 
                  className="text-sm text-muted-foreground"
                  whileHover={{ scale: 1.05, color: "#9b87f5" }}
                >
                  <Link to="/advogados/list">
                    Form de Advogados
                  </Link>
                </motion.div>
              </motion.div>
              
              <div className="mt-8">
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <motion.button 
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground text-sm mb-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explorar
                    <motion.svg 
                      className="w-4 h-4 ml-1 text-green-500 dark:text-green-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ y: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </motion.svg>
                  </motion.button>
                  
                  {/* Categories Grid with Original Colors and Animations */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delayChildren: 1.2, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow-sm flex items-center justify-center flex-col cursor-pointer border border-purple-200 dark:border-purple-800"
                      variants={categoryVariants}
                      whileHover="hover"
                      onClick={() => navigateTo('/advogados')}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-purple-500 dark:bg-purple-400 rounded-full flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white font-semibold">A</span>
                      </motion.div>
                      <span className="text-sm text-purple-800 dark:text-purple-100 font-medium">Advogados</span>
                    </motion.div>
                    <motion.div 
                      className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-sm flex items-center justify-center flex-col cursor-pointer border border-blue-200 dark:border-blue-800"
                      variants={categoryVariants}
                      whileHover="hover"
                      onClick={() => navigateTo('/sociedades')}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white font-semibold">S</span>
                      </motion.div>
                      <span className="text-sm text-blue-800 dark:text-blue-100 font-medium">Sociedades</span>
                    </motion.div>
                    <motion.div 
                      className="bg-orange-100 p-4 rounded-lg shadow-sm flex items-center justify-center flex-col cursor-pointer border border-orange-200"
                      variants={categoryVariants}
                      whileHover="hover"
                      onClick={() => navigateTo('/estagiarios')}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white font-semibold">E</span>
                      </motion.div>
                      <span className="text-sm text-orange-800 font-medium">Estagiários</span>
                    </motion.div>
                    {/* New Tribunais category with original styling */}
                    <motion.div 
                      className="bg-green-100 p-4 rounded-lg shadow-sm flex items-center justify-center flex-col cursor-pointer border border-green-200"
                      variants={categoryVariants}
                      whileHover="hover"
                      onClick={() => navigateTo('/tribunais')}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white font-semibold">T</span>
                      </motion.div>
                      <span className="text-sm text-green-800 font-medium">Tribunais</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Tabs Section with Animations */}
        <motion.section 
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="sociedades" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-transparent space-x-2">
                <TabsTrigger 
                  value="sociedades" 
                  className="rounded-full px-6 py-2 transition-transform hover:scale-105 active:scale-95 data-[state=active]:bg-coral-500 data-[state=active]:text-white"
                >
                  Sociedade de Advogados
                </TabsTrigger>
                <TabsTrigger 
                  value="advogados" 
                  className="rounded-full px-6 py-2 transition-transform hover:scale-105 active:scale-95 data-[state=active]:bg-coral-500 data-[state=active]:text-white"
                >
                  Advogados
                </TabsTrigger>
                <TabsTrigger 
                  value="tribunais" 
                  className="rounded-full px-6 py-2 transition-transform hover:scale-105 active:scale-95 data-[state=active]:bg-coral-500 data-[state=active]:text-white"
                >
                  Tribunais
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="sociedades" className="mt-6">
              <motion.div 
                className="bg-card rounded-lg p-6 shadow-sm"
              >
                <motion.h2 
                  className="text-2xl font-medium mb-4"
                >
                  Sociedade de Advogados
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6"
                >
                  Resolva suas questões legais de forma fácil, rápida e sem complicações.
                </motion.p>
                <div>
                  <Button className="flex items-center space-x-2">
                    <span>Explorar Agora</span>
                    <motion.svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </motion.svg>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="advogados">
              <motion.div 
                className="bg-card rounded-lg p-6 shadow-sm"
              >
                <motion.h2 
                  className="text-2xl font-medium mb-4"
                >
                  Encontre apoio jurídico com confiança
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6"
                >
                  Resolva suas questões legais de forma fácil, rápida e sem complicações.
                </motion.p>
                <div>
                  <Button className="flex items-center space-x-2" onClick={() => navigateTo('/advogados')}>
                    <span>Explorar Agora</span>
                    <motion.svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </motion.svg>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="tribunais">
              <motion.div 
                className="bg-card rounded-lg p-6 shadow-sm"
              >
                <motion.h2 
                  className="text-2xl font-medium mb-4"
                >
                  Procure Tribunais de forma eficiente
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6"
                >
                  Acesse informações de tribunais nacionais com facilidade e rapidez.
                </motion.p>
                <div>
                  <Button className="flex items-center space-x-2" onClick={() => navigateTo('/tribunais')}>
                    <span>Ver Tribunais</span>
                    <motion.svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </motion.svg>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
