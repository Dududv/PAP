import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test crawl to verify the API key
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found. Please set your Firecrawl API key first.' };
    }

    try {
      console.log('Making crawl request to Firecrawl API for:', url);
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      // Configure specific crawl options based on the URL
      const crawlOptions = {
        limit: 50, // Limit number of pages to crawl
        scrapeOptions: {
          formats: ["markdown", "html"] as ("markdown" | "html" | "rawHtml" | "content" | "links" | "screenshot" | "screenshot@fullPage" | "extract" | "json" | "changeTracking")[],
          waitForSelector: this.getWaitSelectorForUrl(url),
          evaluateScripts: this.shouldEvaluateScriptsForUrl(url),
          // Add more specific options for each website as needed
        }
      };

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, crawlOptions) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Falha ao extrair dados do website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Falha ao conectar com o serviço de web scraping' 
      };
    }
  }

  // Get specific wait selector based on the URL
  private static getWaitSelectorForUrl(url: string): string | undefined {
    if (url.includes('portal.oa.pt')) {
      return '.search-results'; // Example selector for OA portal
    } else if (url.includes('citius.mj.pt')) {
      return 'table'; // Example selector for Citius
    } else if (url.includes('osae.pt')) {
      return '.results'; // Example selector for OSAE
    }
    return undefined;
  }

  // Determine if we should evaluate scripts for this URL
  private static shouldEvaluateScriptsForUrl(url: string): boolean {
    // Some sites may require JavaScript execution
    return url.includes('portal.oa.pt') || url.includes('osae.pt');
  }

  // Helper function to extract lawyer information from crawled data
  static extractLawyerInfo(data: any[]): any[] {
    if (!data || !Array.isArray(data)) return [];
    
    // First attempt: Try to match structured data from the websites
    const extractedLawyers = data.flatMap(page => {
      const content = typeof page.content === 'string' ? page.content : JSON.stringify(page);
      
      // Try to extract lawyer information using regex patterns
      // This is a simplified approach - in a real implementation, 
      // we would use more sophisticated parsing
      
      // Look for lawyer entries in the HTML content
      const lawyerEntries = this.extractLawyerEntries(content);
      
      if (lawyerEntries.length > 0) {
        return lawyerEntries;
      }
      
      // Fallback: Try to find any contact information that looks like a lawyer
      return this.extractPotentialLawyerContactInfo(content, page.url);
    });
    
    // If we found structured data, return it
    if (extractedLawyers.length > 0) {
      return extractedLawyers;
    }
    
    // Fallback to basic information extraction
    return this.extractBasicInformation(data);
  }
  
  // Extract lawyer entries from structured HTML
  private static extractLawyerEntries(content: string): any[] {
    const lawyers = [];
    
    // Example patterns for different websites
    // This is simplified and would need to be adapted for each specific site
    
    // Try to match table rows or list items that might contain lawyer information
    const rowMatches = content.match(/<tr[^>]*>.*?<\/tr>/gis);
    if (rowMatches) {
      for (const row of rowMatches) {
        const name = this.extractTextBetweenTags(row, 'td');
        const contact = this.extractTextBetweenTags(row, 'td', 1);
        const location = this.extractTextBetweenTags(row, 'td', 2);
        
        if (name) {
          lawyers.push({
            nome: name,
            morada: location || '',
            telefone: contact || '',
            email: this.extractEmail(row) || '',
            cedula: this.extractIdNumber(row) || '',
            tipo: 'Advogado', // Default type
            distrito: this.extractDistrict(location || '') || '',
          });
        }
      }
    }
    
    return lawyers;
  }
  
  // Extract potential lawyer contact information from unstructured content
  private static extractPotentialLawyerContactInfo(content: string, url?: string): any[] {
    const lawyers = [];
    
    // Look for name patterns often used for lawyers
    const nameMatches = content.match(/(?:Dr[a]?\.?\s+)([A-Z][a-z]+\s+[A-Z][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-Z][a-záàâãéèêíïóôõöúçñ]+)?)/g);
    
    if (nameMatches) {
      for (const nameMatch of nameMatches) {
        const name = nameMatch.replace(/Dr[a]?\.?\s+/, '');
        const email = this.extractEmailNear(content, name);
        const phone = this.extractPhoneNear(content, name);
        const address = this.extractAddressNear(content, name);
        
        if (name && name.length > 0) {
          lawyers.push({
            nome: name,
            cedula: this.extractIdNumber(content) || '',
            morada: address || '',
            telefone: phone || '',
            email: email || '',
            conselhoRegional: this.extractDistrict(address || '') || '',
            dataExtracao: new Date().toISOString()
          });
        }
      }
    }
    
    return lawyers;
  }
  
  // Basic information extraction as a last resort
  private static extractBasicInformation(data: any[]): any[] {
    return data.map((page, index) => {
      const content = typeof page.content === 'string' ? page.content : JSON.stringify(page);
      
      // Create a generic lawyer object with whatever information we can find
      return {
        codigo: index + 1,
        nome: this.extractTitle(page) || `Advogado ${index + 1}`,
        morada: this.extractAddress(content) || '',
        codPostal: this.extractPostalCode(content) || '',
        localidade: this.extractLocality(content) || '',
        telefone: this.extractPhone(content) || '',
        email: this.extractEmail(content) || '',
        cedula: '', // Cannot reliably extract cedula without structured data
        site: page.url || '',
        tipo: 'Advogado', // Default type
        distrito: this.extractDistrict(content) || '',
      };
    });
  }
  
  // Helper extraction methods
  private static extractTitle(page: any): string | null {
    return page.title || null;
  }
  
  private static extractTextBetweenTags(html: string, tag: string, index: number = 0): string | null {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gis');
    const matches = [...html.matchAll(regex)];
    
    if (matches && matches[index]) {
      return matches[index][1].replace(/<[^>]+>/g, '').trim();
    }
    
    return null;
  }
  
  private static extractEmail(text: string): string | null {
    const emailRegex = /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i;
    const match = text.match(emailRegex);
    return match ? match[1] : null;
  }
  
  private static extractPhone(text: string): string | null {
    // Match common Portuguese phone number formats
    const phoneRegex = /(?:\+351|00351)?[\s-]?(?:9[1-36]\d|2\d|3\d)[\s-]?(?:\d[\s-]?){7}/;
    const match = text.match(phoneRegex);
    return match ? match[0].trim() : null;
  }
  
  private static extractAddress(text: string): string | null {
    // Simple address detection - look for common address patterns
    // This is a simplified version and would need to be more sophisticated in a real app
    const addressRegex = /(?:Rua|Avenida|Av\.|R\.|Praça|Largo)[\s\w,\.]+(?:\d+)?(?:,[\s\w]+)*/i;
    const match = text.match(addressRegex);
    return match ? match[0].trim() : null;
  }
  
  private static extractPostalCode(text: string): string | null {
    // Portuguese postal code format: ####-###
    const postalCodeRegex = /\b\d{4}-\d{3}\b/;
    const match = text.match(postalCodeRegex);
    return match ? match[0] : null;
  }
  
  private static extractLocality(text: string): string | null {
    // This is a very simplified approach
    // In a real app, we would need a database of Portuguese localities
    const localities = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Évora', 'Aveiro'];
    
    for (const locality of localities) {
      if (text.includes(locality)) {
        return locality;
      }
    }
    
    return null;
  }
  
  private static extractIdNumber(text: string): string | null {
    // Looking for cedula pattern - usually numbers or alphanumeric codes
    const cedulaRegex = /(?:Cédula|Cedula)[^\d]*(\d+)/i;
    const match = text.match(cedulaRegex);
    return match ? match[1] : null;
  }
  
  private static extractDistrict(text: string): string | null {
    // Check if any district name appears in the text
    const portugueseDistricts = [
      'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 
      'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 
      'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 
      'Vila Real', 'Viseu'
    ];
    
    for (const district of portugueseDistricts) {
      if (text.includes(district)) {
        return district;
      }
    }
    
    return null;
  }
  
  // Extract information near specific text
  private static extractEmailNear(text: string, name: string): string | null {
    // Try to find an email within 200 characters after the name
    const namePos = text.indexOf(name);
    if (namePos > -1) {
      const searchText = text.substring(namePos, namePos + 200);
      return this.extractEmail(searchText);
    }
    return null;
  }
  
  private static extractPhoneNear(text: string, name: string): string | null {
    // Try to find a phone number within 200 characters after the name
    const namePos = text.indexOf(name);
    if (namePos > -1) {
      const searchText = text.substring(namePos, namePos + 200);
      return this.extractPhone(searchText);
    }
    return null;
  }
  
  private static extractAddressNear(text: string, name: string): string | null {
    // Try to find an address within 200 characters after the name
    const namePos = text.indexOf(name);
    if (namePos > -1) {
      const searchText = text.substring(namePos, namePos + 200);
      return this.extractAddress(searchText);
    }
    return null;
  }
}
