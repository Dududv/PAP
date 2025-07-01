import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { lazy, Suspense } from "react";
import DarkModeFloatButton from "./components/DarkModeFloatButton";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Advogados = lazy(() => import("./pages/Advogados"));
const Sociedades = lazy(() => import("./pages/Sociedades"));
const Estagiarios = lazy(() => import("./pages/Estagiarios"));
const Tribunais = lazy(() => import("./pages/Tribunais"));
const ListaSociedades = lazy(() => import("./pages/ListaSociedades"));
const ListaEstagiarios = lazy(() => import("./pages/ListaEstagiarios"));
const ListaAdvogados = lazy(() => import("./pages/ListaAdvogados"));
const ListaTribunais = lazy(() => import("./pages/ListaTribunais"));
const Pesquisa = lazy(() => import("./pages/Pesquisa"));
const Detalhes = lazy(() => import("./pages/Detalhes"));
const Mapa = lazy(() => import("./pages/Mapa"));

const queryClient = new QueryClient();

// Animated page wrapper component
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Routes with animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Index />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/about" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/contact" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Contact />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/advogados" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Advogados />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/sociedades" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Sociedades />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/sociedades/list" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <ListaSociedades />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/estagiarios" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Estagiarios />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/estagiarios/list" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <ListaEstagiarios />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/advogados/list" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <ListaAdvogados />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/tribunais" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Tribunais />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/tribunais/list" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <ListaTribunais />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/pesquisa" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Pesquisa />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/detalhes/:tipo/:id" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Detalhes />
            </Suspense>
          </AnimatedPage>
        } />
        <Route path="/mapa" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <Mapa />
            </Suspense>
          </AnimatedPage>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={
          <AnimatedPage>
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          </AnimatedPage>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
      <DarkModeFloatButton />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
