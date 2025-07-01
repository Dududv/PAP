
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, MapPin, Phone, Mail, Globe, User, Info, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface LawyerResultsProps {
  results: any[] | null;
  searchUrl: string | null;
}

export const LawyerResults: React.FC<LawyerResultsProps> = ({ results, searchUrl }) => {
  const navigate = useNavigate();

  if (!results || results.length === 0) {
    return null;
  }

  // Helper function to extract potential fields of interest
  const extractInfo = (item: any) => {
    const contentStr = typeof item.content === 'string' ? item.content : JSON.stringify(item);
    const urlStr = item.url || '';
    
    // Extract potential fields with basic pattern matching
    // In a real app, this would use more sophisticated extraction
    const extractPattern = (pattern: RegExp) => {
      const match = contentStr.match(pattern);
      return match ? match[1] : null;
    };

    return {
      name: extractPattern(/name[\":s]+([^"}\n,]{3,30})/i) || 
            extractPattern(/([A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s+(?:Attorney|Lawyer|Partner|Associate)/i),
      title: extractPattern(/title[\":s]+([^"}\n,]{3,50})/i) || 
             extractPattern(/(Partner|Associate|Attorney at Law|Senior Counsel|Managing Partner)/i),
      practiceareas: extractPattern(/practice areas?[\":s]+([^"}\n.]{3,100})/i) || 
                     extractPattern(/specializ(?:es|ing) in ([^.]{3,100})/i),
      phone: extractPattern(/(?:phone|tel)[\":s]+([\d\s()+\-\.]{7,20})/i) || 
             extractPattern(/(\(\d{3}\)\s*\d{3}-\d{4})/i),
      email: extractPattern(/email[\":s]+([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i) || 
             extractPattern(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i),
      url: urlStr,
      location: extractPattern(/location[\":s]+([^"}\n,]{3,50})/i) || 
                extractPattern(/address[\":s]+([^"}\n,]{3,100})/i) ||
                extractPattern(/([\w\s]+,\s*[A-Z]{2})/i),
      bio: contentStr.substring(0, 300) + (contentStr.length > 300 ? '...' : ''),
    };
  };

  const handleViewDetails = (info: any) => {
    navigate(`/detalhes?tipo=advogado&id=${encodeURIComponent(info.name || 'unknown')}&nome=${encodeURIComponent(info.name || 'Advogado')}`);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Lawyer Search Results
        </h2>
        {searchUrl && (
          <p className="text-sm text-gray-500">
            Source: {searchUrl}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => {
          const info = extractInfo(item);
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-transparent">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 bg-indigo-100 border-2 border-indigo-200">
                    <User className="h-6 w-6 text-indigo-600" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-indigo-900">
                        {info.name || "Unnamed Attorney"}
                      </h3>
                      <Eye className="h-4 w-4 text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors" 
                           onClick={() => handleViewDetails(info)} />
                    </div>
                    <p className="text-sm text-gray-600">{info.title || "Attorney"}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                {info.practiceareas && (
                  <div className="flex space-x-2">
                    <Briefcase className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{info.practiceareas}</p>
                  </div>
                )}
                
                {info.location && (
                  <div className="flex space-x-2">
                    <MapPin className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{info.location}</p>
                  </div>
                )}
                
                {info.phone && (
                  <div className="flex space-x-2">
                    <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{info.phone}</p>
                  </div>
                )}
                
                {info.email && (
                  <div className="flex space-x-2">
                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm break-all text-gray-700">{info.email}</p>
                  </div>
                )}
                
                {info.url && (
                  <div className="flex space-x-2">
                    <Globe className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <a 
                      href={info.url.startsWith('http') ? info.url : `http://${info.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {info.url.length > 30 ? info.url.substring(0, 30) + '...' : info.url}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => handleViewDetails(info)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  More Info
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
