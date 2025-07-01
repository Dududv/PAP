
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Key, Loader2 } from 'lucide-react';

export const ApiKeyForm = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedKey = FirecrawlService.getApiKey();
    if (savedKey) {
      setHasKey(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setHasKey(true);
        toast({
          title: "Success",
          description: "API key verified and saved successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('firecrawl_api_key');
    setHasKey(false);
    setApiKey('');
    toast({
      title: "API Key Reset",
      description: "Your API key has been removed.",
      duration: 3000,
    });
  };

  if (hasKey) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-green-600" />
            <p className="text-green-700">API key configured</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="text-sm"
          >
            Reset API Key
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="h-5 w-5 text-amber-600" />
          <h3 className="font-medium text-amber-800">Firecrawl API Key Required</h3>
        </div>
        
        <p className="text-amber-700 text-sm mb-4">
          To use the web scraping functionality, please enter your Firecrawl API key.
          You can get one at <a href="https://mendable.ai/firecrawl" target="_blank" rel="noopener noreferrer" className="underline">Mendable Firecrawl</a>.
        </p>
        
        <div className="flex space-x-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Firecrawl API key"
            className="flex-1"
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Save Key"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
