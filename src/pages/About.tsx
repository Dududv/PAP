import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Scale, Shield, Users, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Sobre GravidadeZero
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
              Encontrar o advogado certo através de tecnologia e de informação detalhada para os suas necessidades.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">Nossa Missão</h2>
            <Card className="p-8 bg-card shadow-lg border border-border">
              <div className="flex justify-center mb-6">
                <Scale className="h-16 w-16 text-amber-500" />
              </div>
              <p className="text-lg text-foreground mb-6 leading-relaxed text-center">
                  GravidadeZero é dedicada a tornar os recursos legais mais acessíveis a todos. 
                  Acreditamos que encontrar o advogado certo deve ser simples e eficiente, 
                  com a capacidade de identificar rapidamente profissionais que correspondam às suas necessidades específicas.
              </p>
              <p className="text-lg text-foreground leading-relaxed text-center">
                Utilizando este Website, ajudamos a conectar pessoas e empresas 
                com advogados em várias áreas de atuação, localidades e especializações.
              </p>
            </Card>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-foreground">Nossos Valores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card shadow-md flex flex-col items-center border border-border">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Shield className="h-8 w-8 text-indigo-700 dark:text-indigo-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Integridade</h3>
              <p className="text-muted-foreground text-center">
                Estamos comprometidos em fornecer informações transparentes, confiáveis e sem viés ou preferência.
              </p>
            </Card>
            
            <Card className="p-6 bg-card shadow-md flex flex-col items-center border border-border">
              <div className="bg-amber-100 dark:bg-amber-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Users className="h-8 w-8 text-amber-700 dark:text-amber-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Acessibilidade</h3>
              <p className="text-muted-foreground text-center">
                Tornar a ajuda legal acessível a todos através de tecnologia intuitiva e informação clara.
              </p>
            </Card>
            
            <Card className="p-6 bg-card shadow-md flex flex-col items-center border border-border">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Inovação</h3>
              <p className="text-muted-foreground text-center">
                Construir uma plataforma que seja acessível e fácil de usar, com informações detalhadas e precisas.
              </p>
            </Card>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-12 bg-muted rounded-lg my-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-foreground">Como a nossa tecnologia funciona</h2>
          
          <div className="max-w-4xl mx-auto">
            <ol className="relative border-l border-indigo-300 dark:border-indigo-600 ml-6">
              <li className="mb-10 ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full -left-4 ring-4 ring-background">
                  <span className="text-indigo-800 dark:text-indigo-200 font-bold">1</span>
                </span>
                <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">Web Crawling</h3>
                <p className="text-foreground mt-2">
                  Nosso sistema rastreia websites, diretórios e bases de dados legais para coletar informações sobre advogados e sociedades de advogados.
                </p>
              </li>
              
              <li className="mb-10 ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full -left-4 ring-4 ring-background">
                  <span className="text-indigo-800 dark:text-indigo-200 font-bold">2</span>
                </span>
                <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">Extração</h3>
                <p className="text-foreground mt-2">
                  Usando padrões avançados de correspondência e processamento de linguagem natural, extraímos informações chave sobre advogados e sociedades de advogados.
                </p>
              </li>
              
              <li className="mb-10 ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full -left-4 ring-4 ring-background">
                  <span className="text-indigo-800 dark:text-indigo-200 font-bold">3</span>
                </span>
                <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">Categorização</h3>
                <p className="text-foreground mt-2">
                  Os advogados são categorizados por área de atuação, localidade e outros fatores relevantes para uma busca mais fácil.
                </p>
              </li>
              
              <li className="ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full -left-4 ring-4 ring-background">
                  <span className="text-indigo-800 dark:text-indigo-200 font-bold">4</span>
                </span>
                <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">Apresentação</h3>
                <p className="text-foreground mt-2">
                  Os resultados são apresentados em um formato limpo e organizado, facilitando a comparação e o contacto com advogados e sociedades de advogados.
                </p>
              </li>
            </ol>
          </div>
        </section>
        
        {/* Legal Notice Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 border-amber-200 dark:border-amber-800 bg-card">
              <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-200">Aviso Legal</h3>
              <p className="text-foreground mb-4">
                GravidadeZero é uma ferramenta de web scraping que coleta informações públicas sobre advogados e sociedades de advogados. 
                Não somos uma empresa de advocacia e não fornecemos conselhos legais ou serviços.
              </p>
              <p className="text-foreground">
                As informações fornecidas através deste serviço são apenas informativas. Os utilizadores são responsáveis
                por verificar as credenciais e adequação de qualquer profissional legal antes de envolver os seus serviços.
              </p>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
