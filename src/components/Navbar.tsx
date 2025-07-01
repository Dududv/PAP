import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Briefcase, Building, GraduationCap, Landmark } from 'lucide-react';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const handleDropdownOpen = (item) => {
    setActiveDropdown(item);
  };
  
  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleDropdownClose();
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.4, transition: { duration: 0.3 } }
  };
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180, transition: { duration: 0.2 } }
  };
  
  return (
    <>
      {/* Overlay that darkens the entire screen */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div 
            className="fixed inset-0 bg-black z-10" 
            onClick={handleDropdownClose}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          />
        )}
      </AnimatePresence>
      
      <header className="bg-background shadow-sm py-4 relative z-20 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="rounded-full p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Gavel className="w-8 h-8 text-emerald-800" />
            </motion.div>
            <motion.span
              className="text-xl font-semibold text-foreground"
              initial={{ opacity: 1 }}
              whileHover={{
                color: "#9b87f5",
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-foreground">Gravidade</span><span className="text-orange-500">Zero</span>
            </motion.span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <motion.button 
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                onClick={() => activeDropdown === 'advogados' ? handleDropdownClose() : handleDropdownOpen('advogados')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Advogados
                <motion.svg 
                  className="w-4 h-4 ml-1 dark:text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  variants={iconVariants}
                  animate={activeDropdown === 'advogados' ? 'open' : 'closed'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </motion.svg>
              </motion.button>
              
              <AnimatePresence>
                {activeDropdown === 'advogados' && (
                  <motion.div 
                    className="absolute transform -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-lg z-20 flex overflow-hidden"
                    style={{ left: "50%" }}  
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <motion.div 
                      className="w-1/2 bg-[#9b87f5] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#7E69AB" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/advogados')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <Briefcase className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        Advogados
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Procura Advogados através de Filtros
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="w-1/2 bg-[#7E69AB] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#6E59A5" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/advogados/list')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <Briefcase className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Lista de Advogados
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Todos os Advogados Disponíveis
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative group">
              <motion.button 
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                onClick={() => activeDropdown === 'sociedades' ? handleDropdownClose() : handleDropdownOpen('sociedades')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sociedades
                <motion.svg 
                  className="w-4 h-4 ml-1 dark:text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  variants={iconVariants}
                  animate={activeDropdown === 'sociedades' ? 'open' : 'closed'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </motion.svg>
              </motion.button>
              
              <AnimatePresence>
                {activeDropdown === 'sociedades' && (
                  <motion.div 
                    className="absolute transform -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-lg z-20 flex overflow-hidden"
                    style={{ left: "50%" }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <motion.div 
                      className="w-1/2 bg-[#0EA5E9] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#0891D1" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/sociedades')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <Building className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        Sociedades
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Procura Sociedades através de Filtros
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="w-1/2 bg-[#0891D1] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#077EB8" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/sociedades/list')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <Building className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Lista de Sociedades
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Todas as Sociedades Disponíveis
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative group">
              <motion.button 
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                onClick={() => activeDropdown === 'estagiarios' ? handleDropdownClose() : handleDropdownOpen('estagiarios')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Estagiários
                <motion.svg 
                  className="w-4 h-4 ml-1 dark:text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  variants={iconVariants}
                  animate={activeDropdown === 'estagiarios' ? 'open' : 'closed'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </motion.svg>
              </motion.button>
              
              <AnimatePresence>
                {activeDropdown === 'estagiarios' && (
                  <motion.div 
                    className="absolute transform -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-lg z-20 flex overflow-hidden"
                    style={{ left: "50%" }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <motion.div 
                      className="w-1/2 bg-[#F97316] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#E65E05" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/estagiarios')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <GraduationCap className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        Estagiários
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Procura Estagiários através de Filtros
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="w-1/2 bg-[#e08c55] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#FDB483" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/estagiarios/list')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <GraduationCap className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Lista de Estagiários
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Todos os Estagiários Disponíveis
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Adding Tribunais dropdown */}
            <div className="relative group">
              <motion.button 
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                onClick={() => activeDropdown === 'tribunais' ? handleDropdownClose() : handleDropdownOpen('tribunais')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tribunais
                <motion.svg 
                  className="w-4 h-4 ml-1 dark:text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  variants={iconVariants}
                  animate={activeDropdown === 'tribunais' ? 'open' : 'closed'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </motion.svg>
              </motion.button>
              
              <AnimatePresence>
                {activeDropdown === 'tribunais' && (
                  <motion.div 
                    className="absolute transform -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-lg z-20 flex overflow-hidden"
                    style={{ left: "50%" }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <motion.div 
                      className="w-1/2 bg-[#10B981] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#059669" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/tribunais')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <Landmark className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        Tribunais
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Procura Tribunais através de Filtros
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="w-1/2 bg-[#34D399] p-4 text-white cursor-pointer"
                      whileHover={{ backgroundColor: "#10B981" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleNavigation('/tribunais/list')}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <Landmark className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-sm font-medium mb-1 text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        Lista de Tribunais
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-center"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Todos os Tribunais Disponíveis
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/mapa" className="relative">
              <motion.span 
                className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Mapa
              </motion.span>
            </Link>
            
            <Link to="/about" className="relative">
              <motion.span 
                className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Sobre
              </motion.span>
            </Link>
          </nav>
          
          <Link to="/contact">
            <motion.button 
              className="bg-coral-500 text-white px-4 py-2 rounded-md transition-all"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#ea3a15",
                transition: { duration: 0.2 } 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Contacte-nos
            </motion.button>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
