import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Pesquisa = () => {
  const query = useQuery().get("q") || "";
  const navigate = useNavigate();
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setResultados([]);
    const fetchData = async () => {
      const advogadosPromise = fetch(`http://localhost:3001/api/advogados?name=${encodeURIComponent(query)}`).then(res => res.json());
      const tribunaisPromise = fetch(`http://localhost:3001/api/tribunais?nome=${encodeURIComponent(query)}`).then(res => res.json());
      const [advogados, tribunais] = await Promise.all([advogadosPromise, tribunaisPromise]);
      setResultados([
        ...advogados.map((a: any) => ({ ...a, tipo: "Advogado" })),
        ...tribunais.map((t: any) => ({ ...t, tipo: "Tribunal" }))
      ]);
      setLoading(false);
    };
    fetchData();
  }, [query]);

  const handleViewDetails = (item: any) => {
    const tipo = item.tipo === "Advogado" ? "advogado" : "tribunal";
    const nome = item.name || item.Nome;
    const id = item.id || item.ID || nome;
    navigate(`/detalhes?tipo=${tipo}&id=${encodeURIComponent(id)}&nome=${encodeURIComponent(nome)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Resultados para: <span className="text-primary">{query}</span></h1>
        {loading && <p className="mb-4">A pesquisar...</p>}
        {!loading && resultados.length === 0 && (
          <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
        )}
        <div className="space-y-4">
          {resultados.map((item, idx) => (
            <div key={idx} className="bg-card p-4 rounded shadow flex flex-col">
              <span className="text-xs text-muted-foreground">{item.tipo}</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">{item.name || item.Nome}</span>
                <Eye className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                     onClick={() => handleViewDetails(item)} />
              </div>
              {item.morada && <span className="text-sm">{item.morada}</span>}
              {item.Morada && <span className="text-sm">{item.Morada}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pesquisa; 