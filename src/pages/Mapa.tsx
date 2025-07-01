import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, Building, GraduationCap, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

// Corrige o problema do ícone padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Criar ícones personalizados para cada tipo
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const icons = {
  advogado: createCustomIcon('#9b87f5'),
  sociedade: createCustomIcon('#0EA5E9'),
  estagiario: createCustomIcon('#F97316'),
  tribunal: createCustomIcon('#10B981'),
};

const typeLabels = {
  advogado: 'Advogado',
  sociedade: 'Sociedade',
  estagiario: 'Estagiário',
  tribunal: 'Tribunal',
};

const typeColors = {
  advogado: '#9b87f5',
  sociedade: '#0EA5E9',
  estagiario: '#F97316',
  tribunal: '#10B981',
};

interface ApiResultItem {
  id: string;
  name: string;
  morada: string;
  localidade: string;
  tipo: 'advogado' | 'sociedade' | 'estagiario' | 'tribunal';
  codigo_postal?: string;
}

interface MapPoint extends ApiResultItem {
  lat: number;
  lon: number;
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Função para introduzir um atraso
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Rate limiter para a API do Nominatim
class RateLimiter {
  private lastCall = 0;
  private minInterval = 1100; // 1.1 segundos entre chamadas

  async waitForNextCall() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await delay(this.minInterval - timeSinceLastCall);
    }
    
    this.lastCall = Date.now();
  }
}

const rateLimiter = new RateLimiter();

const Mapa = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.557191, -7.85368]);
  const [zoom, setZoom] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState<MapPoint[]>([]);

  const getCoordinates = async (address: string): Promise<[number, number] | null> => {
    try {
      await rateLimiter.waitForNextCall();
      
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=pt&addressdetails=1`;
      console.log('Fazendo requisição de geocodificação para:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Resposta da geocodificação:', data);
      
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        console.log('Coordenadas encontradas:', coords);
        return coords;
      } else {
        console.log('Nenhuma coordenada encontrada para:', address);
      return null;
      }
    } catch (error) {
      console.error('Erro na geocodificação para', address, ':', error);
      return null;
    }
  };

  // Função para construir endereços mais precisos
  const buildAddressString = (item: ApiResultItem): string[] => {
    const addresses: string[] = [];
    
    // Limpar e validar os campos
    const morada = item.morada?.trim() || '';
    const localidade = item.localidade?.trim() || '';
    const codigoPostal = item.codigo_postal?.trim() || '';
    
    console.log('Construindo endereços para:', { name: item.name, morada, localidade, codigoPostal });
    
    // Estratégia 1: Endereço completo (morada + localidade + código postal)
    if (morada && localidade) {
      let fullAddress = morada;
      if (codigoPostal) {
        fullAddress += `, ${codigoPostal}`;
      }
      fullAddress += `, ${localidade}, Portugal`;
      addresses.push(fullAddress);
      console.log('Estratégia 1 - Endereço completo:', fullAddress);
    }
    
    // Estratégia 2: Apenas localidade + código postal
    if (localidade && codigoPostal) {
      const address = `${codigoPostal}, ${localidade}, Portugal`;
      addresses.push(address);
      console.log('Estratégia 2 - Localidade + código postal:', address);
    }
    
    // Estratégia 3: Apenas localidade
    if (localidade) {
      const address = `${localidade}, Portugal`;
      addresses.push(address);
      console.log('Estratégia 3 - Apenas localidade:', address);
    }
    
    // Estratégia 4: Apenas morada (se contiver informações suficientes)
    if (morada && morada.length > 10) {
      const address = `${morada}, Portugal`;
      addresses.push(address);
      console.log('Estratégia 4 - Apenas morada:', address);
    }
    
    console.log('Endereços construídos:', addresses);
    return addresses;
  };

  // Função para tentar geocodificar com múltiplas estratégias
  const tryGeocodeWithFallback = async (item: ApiResultItem): Promise<[number, number] | null> => {
    const addresses = buildAddressString(item);
    
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      console.log(`Tentativa ${i + 1}/${addresses.length} - Geocodificando: ${address}`);
      const coords = await getCoordinates(address);
      if (coords) {
        console.log(`Geocodificação bem-sucedida na tentativa ${i + 1} para: ${address}`);
        return coords;
      } else {
        console.log(`Falha na tentativa ${i + 1} para: ${address}`);
      }
    }
    
    console.warn(`Não foi possível geocodificar nenhum endereço para: ${item.name}`);
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning("Por favor, insira uma localidade para pesquisar.");
      return;
    }
    setIsLoading(true);
    setPoints([]); // Limpa os pontos anteriores

    try {
      console.log('Iniciando pesquisa para:', searchQuery);
      
      // 1. Geocodificar a localidade pesquisada para centrar o mapa rapidamente
      const cityCoords = await getCoordinates(`${searchQuery}, Portugal`);
      if (cityCoords) {
        console.log('Coordenadas da cidade encontradas:', cityCoords);
        setMapCenter(cityCoords);
        setZoom(13);
      } else {
        console.warn('Não foi possível geocodificar a cidade:', searchQuery);
        toast.warning(`Não foi possível encontrar a localidade "${searchQuery}". A tentar procurar na base de dados.`);
      }

      // 2. Buscar dados do nosso backend
      const apiUrl = `http://localhost:3001/api/search-by-location?localidade=${encodeURIComponent(searchQuery)}`;
      console.log('Fazendo requisição para:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Falha ao buscar dados da localidade: ${response.status} ${response.statusText}`);
      }
      const results: ApiResultItem[] = await response.json();
      console.log('Resultados recebidos da API:', results);

      if (results.length === 0) {
        toast.info("Nenhum resultado encontrado para esta localidade.");
        setIsLoading(false);
        return;
      }
      
      toast.info(`Encontrados ${results.length} resultados. A obter localizações...`);

      // 3. Geocodificar cada resultado com estratégias de fallback
      let geocodedCount = 0;
      const newPoints: MapPoint[] = [];
      
      for (const item of results) {
        console.log('Processando item:', item);
        const itemCoords = await tryGeocodeWithFallback(item);
        
        if (itemCoords) {
          geocodedCount++;
          const newPoint: MapPoint = { 
            ...item, 
            lat: itemCoords[0], 
            lon: itemCoords[1] 
          };
          newPoints.push(newPoint);
          
          console.log('Ponto adicionado ao mapa:', newPoint);
          // Atualizar o mapa em tempo real com cada novo ponto
          setPoints(prevPoints => [...prevPoints, newPoint]);
        } else {
          console.warn(`Não foi possível obter coordenadas para: ${item.name} (${item.morada})`);
        }
      }

      console.log('Resumo da geocodificação:', { total: results.length, geocoded: geocodedCount });

      if (geocodedCount === 0) {
        toast.error("Não foi possível geolocalizar nenhum dos resultados. Verifique se as moradas estão completas.");
      } else {
        toast.success(`Foram localizados ${geocodedCount} de ${results.length} resultados no mapa.`);
        
        // Se não conseguimos geocodificar a cidade inicial, centrar no primeiro ponto encontrado
        if (!cityCoords && newPoints.length > 0) {
          const firstPoint = newPoints[0];
          console.log('Centrando mapa no primeiro ponto:', firstPoint);
          setMapCenter([firstPoint.lat, firstPoint.lon]);
          setZoom(12);
        }
      }

    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error(`Ocorreu um erro ao realizar a pesquisa: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'advogado': return <Briefcase className="w-4 h-4" />;
      case 'sociedade': return <Building className="w-4 h-4" />;
      case 'estagiario': return <GraduationCap className="w-4 h-4" />;
      case 'tribunal': return <Landmark className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <div className="flex-grow flex flex-col">
        {/* Search Bar */}
        <motion.div 
          className="container mx-auto px-4 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-2">
            <Input 
              placeholder="Pesquisar por localidade (ex: Lisboa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'A Pesquisar...' : 'Pesquisar'}
            </Button>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#9b87f5]"></div>
              <span>Advogados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0EA5E9]"></div>
              <span>Sociedades</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
              <span>Estagiários</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span>Tribunais</span>
            </div>
          </div>
          
          {/* Status */}
          {isLoading && (
            <div className="mt-2 text-sm text-muted-foreground">
              A processar resultados... Isto pode demorar alguns segundos.
            </div>
          )}
        </motion.div>

        {/* Map */}
        <div className="flex-grow" style={{ zIndex: 0 }}>
          <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} zoom={zoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {points.map(point => (
              <Marker 
                key={`${point.tipo}-${point.id}`} 
                position={[point.lat, point.lon]}
                icon={icons[point.tipo]}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: typeColors[point.tipo] }}
                      >
                        {getTypeIcon(point.tipo)}
                      </div>
                      <span className="font-bold text-sm" style={{ color: typeColors[point.tipo] }}>
                        {typeLabels[point.tipo]}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">{point.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{point.morada}</div>
                    {point.localidade && (
                      <div className="text-xs text-gray-500 mb-2">{point.localidade}</div>
                    )}
                    <Link 
                      to={`/detalhes/${point.tipo}/${point.id}`} 
                      className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Mapa; 