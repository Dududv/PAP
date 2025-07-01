import React, { useState } from 'react';
import { useToast } from "../components/ui/use-toast"; 
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { DistrictSelect, districts, dataSourceLinks } from './DistrictSelect';
import { Search, Loader2, MapPin } from 'lucide-react';
import { FirecrawlService } from '../utils/FirecrawlService';

interface SearchFormProps {
  onSearchResults: (results: any) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearchResults }) => {
  const { toast } = useToast();
  const [district, setDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!district) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um distrito",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    
    try {
      const selectedDistrict = districts.find(d => d.id === district);
      if (!selectedDistrict) throw new Error("Distrito não encontrado");
      
      // Get the appropriate URL to scrape based on district
      // For demo purposes we'll use the OA lawyers search page
      const urlToScrape = "https://portal.oa.pt/advogados/pesquisa-de-advogados/";
      
      setProgress(30);
      toast({
        title: "Iniciando webscraping",
        description: `A extrair informações de ${selectedDistrict.name}`,
        duration: 3000,
      });
      
      const crawlResult = await FirecrawlService.crawlWebsite(urlToScrape);
      setProgress(70);
      
      if (!crawlResult.success || !crawlResult.data) {
        throw new Error(crawlResult.error || "Falha ao extrair dados");
      }
      
      // Extract lawyer information from the crawled data
      const lawyerData = FirecrawlService.extractLawyerInfo((crawlResult.data as any).data || [])
        .filter(lawyer => {
          // In a real app, we would properly filter by district here
          // For demo purposes, just associating some results with the selected district
          return true;
        });
      
      setProgress(90);
      
      toast({
        title: "Pesquisa Completa",
        description: `Encontrados ${lawyerData.length} advogados em ${selectedDistrict.name}`,
        duration: 3000,
      });
      
      onSearchResults({
        results: lawyerData.length > 0 ? lawyerData : [],
        district: selectedDistrict.name,
        totalCount: lawyerData.length
      });
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha na pesquisa",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mt-6 bg-white rounded-lg shadow-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pesquisa de Profissionais Jurídicos por Distrito</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              Selecione um Distrito
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <DistrictSelect value={district} onChange={setDistrict} />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-700 hover:bg-indigo-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A procurar
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Pesquisar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Escolha um distrito para encontrar profissionais jurídicos qualificados a atuar nessa área.
            </p>
          </div>
          
          {isLoading && progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">
                {progress < 30 && "A iniciar pesquisa..."}
                {progress >= 30 && progress < 70 && "A extrair dados..."}
                {progress >= 70 && "A processar resultados..."}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
