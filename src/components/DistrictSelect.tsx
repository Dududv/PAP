
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface District {
  id: string;
  name: string;
}

// List of districts in Portugal
export const districts: District[] = [
  { id: 'aveiro', name: 'Aveiro' },
  { id: 'beja', name: 'Beja' },
  { id: 'braga', name: 'Braga' },
  { id: 'braganca', name: 'Bragança' },
  { id: 'castelo-branco', name: 'Castelo Branco' },
  { id: 'coimbra', name: 'Coimbra' },
  { id: 'evora', name: 'Évora' },
  { id: 'faro', name: 'Faro' },
  { id: 'guarda', name: 'Guarda' },
  { id: 'leiria', name: 'Leiria' },
  { id: 'lisboa', name: 'Lisboa' },
  { id: 'portalegre', name: 'Portalegre' },
  { id: 'porto', name: 'Porto' },
  { id: 'santarem', name: 'Santarém' },
  { id: 'setubal', name: 'Setúbal' },
  { id: 'viana-do-castelo', name: 'Viana do Castelo' },
  { id: 'vila-real', name: 'Vila Real' },
  { id: 'viseu', name: 'Viseu' },
];

// Reference links for data sources
export const dataSourceLinks = [
  { name: "Pesquisa de Sociedades de Advogados", url: "https://portal.oa.pt/advogados/pesquisa-de-sociedades-de-advogados/" },
  { name: "Pesquisa de Advogados Estagiários", url: "https://portal.oa.pt/advogados/pesquisa-de-advogados-estagiarios/" },
  { name: "Pesquisa de Advogados", url: "https://portal.oa.pt/advogados/pesquisa-de-advogados/" },
  { name: "Contactos Tribunais", url: "https://www.citius.mj.pt/portal/contactostribunais.aspx" },
  { name: "OSAE Pesquisa", url: "https://osae.pt/pt/pesquisas/1/1/1" },
  { name: "Julgados de Paz", url: "https://dgpj.justica.gov.pt/resolucao-de-litigios/julgados-de-paz/encontrar-um-julgado-de-paz" },
  { name: "Advogados Inscritos OAANG", url: "http://www.oaang.org/content/advogados-inscritos" },
  { name: "Contactos Câmaras Municipais", url: "https://anmp.pt/municipios/municipios/contactos-camaras-municipais/" },
  { name: "Atlas CPLP", url: "https://www.atlascplp.csm.org.pt/" },
];

// Database schema representation for lawyers
export interface LawyerSchema {
  codigo: number; // AutoIncrement
  nome: string;
  morada: string;
  codPostal: string;
  localidade: string;
  telefone: string;
  telemovel: string;
  fax: string;
  email: string;
  cedula: string; // Professional ID number
  site: string;
  tipo: string; // Type of legal professional
  distrito: string; // District
}

interface DistrictSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const DistrictSelect: React.FC<DistrictSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um distrito em Portugal" />
      </SelectTrigger>
      <SelectContent>
        {districts.map((district) => (
          <SelectItem key={district.id} value={district.id}>
            {district.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
