import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PesquisaGlobal = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    // Redireciona para a página de resultados, passando o termo de pesquisa na query string
    navigate(`/pesquisa?q=${encodeURIComponent(query)}`);
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSearch} className="flex w-full max-w-2xl mb-8">
        <input
          type="text"
          className="flex-1 rounded-l-full px-6 py-3 bg-muted text-foreground focus:outline-none focus:border-none focus:ring-0"
          placeholder="Procure Advogados/Tribunais"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-r-full px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition"
          disabled={loading}
        >
          Procurar
        </button>
      </form>
    </div>
  );
};

export default PesquisaGlobal; 