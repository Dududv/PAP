import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, User, Building, Gavel, GraduationCap, MapPin, Phone, Mail, Globe, Calendar, Hash, Send, Map } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmailModal from '@/components/EmailModal';

interface DetalhesProps {}

const Detalhes: React.FC<DetalhesProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get('tipo');
    const id = params.get('id');
    const nome = params.get('nome');

    if (!tipo || !id) {
      navigate('/');
      return;
    }

    const fetchItemDetails = async () => {
      try {
        let apiUrl = '';
        
        switch (tipo) {
          case 'advogado':
            apiUrl = `http://localhost:3001/api/advogados?id=${id}`;
            break;
          case 'tribunal':
            apiUrl = `http://localhost:3001/api/tribunais?id=${id}`;
            break;
          case 'sociedade':
            apiUrl = `http://localhost:3001/api/sociedades?id=${id}`;
            break;
          case 'estagiario':
            apiUrl = `http://localhost:3001/api/estagiarios?id=${id}`;
            break;
          default:
            throw new Error('Tipo inválido');
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes');
        }

        const data = await response.json();
        setItem(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        // Se não conseguir buscar da API, criar um objeto com os dados básicos
        setItem({
          name: nome || 'Nome não disponível',
          tipo: tipo,
          id: id,
          // Dados de exemplo baseados no tipo
          ...(tipo === 'advogado' && {
            conselho: 'Conselho Regional',
            cedula: 'Cédula não disponível',
            morada: 'Morada não disponível',
            localidade: 'Localidade não disponível',
            codigo_postal: 'Código postal não disponível',
            email: 'Email não disponível',
            telefone: 'Telefone não disponível',
            fax: 'Fax não disponível'
          }),
          ...(tipo === 'tribunal' && {
            Morada: 'Morada não disponível',
            Email: 'Email não disponível',
            telefone: 'Telefone não disponível',
            Tipo: 'Tipo não disponível'
          }),
          ...(tipo === 'sociedade' && {
            conselho: 'Conselho Regional',
            registo: 'Registo não disponível',
            data_constituicao: 'Data não disponível',
            morada: 'Morada não disponível',
            localidade: 'Localidade não disponível',
            codigo_postal: 'Código postal não disponível',
            email: 'Email não disponível',
            telefone: 'Telefone não disponível',
            fax: 'Fax não disponível'
          }),
          ...(tipo === 'estagiario' && {
            conselho: 'Conselho Regional',
            cedula: 'Cédula não disponível',
            morada: 'Morada não disponível',
            localidade: 'Localidade não disponível',
            codigo_postal: 'Código postal não disponível',
            email: 'Email não disponível',
            telefone: 'Telefone não disponível',
            fax: 'Fax não disponível'
          })
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [location.search, navigate]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'advogado':
        return <User className="h-8 w-8 text-blue-600" />;
      case 'tribunal':
        return <Gavel className="h-8 w-8 text-green-600" />;
      case 'sociedade':
        return <Building className="h-8 w-8 text-purple-600" />;
      case 'estagiario':
        return <GraduationCap className="h-8 w-8 text-orange-600" />;
      default:
        return <Eye className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'advogado':
        return 'Advogado';
      case 'tribunal':
        return 'Tribunal';
      case 'sociedade':
        return 'Sociedade de Advogados';
      case 'estagiario':
        return 'Estagiário';
      default:
        return 'Item';
    }
  };

  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const getEmailFromItem = () => {
    return item.email || item.Email;
  };

  const hasValidEmail = () => {
    const email = getEmailFromItem();
    return email && email !== 'N/D' && email !== 'Email não disponível';
  };

  const handleViewMap = () => {
    const morada = item?.morada || item?.Morada;
    const localidade = item?.localidade;
    if (morada && morada !== 'Morada não disponível') {
      const query = encodeURIComponent(`${morada}, ${localidade || ''}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const renderInfoSection = () => {
    if (!item) return null;

    const infoItems = [];

    // Informações comuns
    if (item.conselho && item.conselho !== 'N/D') {
      infoItems.push({
        icon: <Building className="h-5 w-5 text-blue-500" />,
        label: 'Conselho Regional',
        value: item.conselho
      });
    }

    if (item.cedula && item.cedula !== 'N/D') {
      infoItems.push({
        icon: <Hash className="h-5 w-5 text-green-500" />,
        label: 'Cédula',
        value: item.cedula
      });
    }

    if (item.registo && item.registo !== 'N/D') {
      infoItems.push({
        icon: <Hash className="h-5 w-5 text-green-500" />,
        label: 'Registo',
        value: item.registo
      });
    }

    if (item.data_constituicao && item.data_constituicao !== 'N/D') {
      infoItems.push({
        icon: <Calendar className="h-5 w-5 text-purple-500" />,
        label: 'Data de Constituição',
        value: item.data_constituicao
      });
    }

    const moradaValue = item.morada || item.Morada;
    if (moradaValue && moradaValue !== 'N/D' && moradaValue !== 'Morada não disponível') {
      infoItems.push({
        icon: <MapPin className="h-5 w-5 text-red-500" />,
        label: 'Morada',
        value: moradaValue,
        action: handleViewMap,
      });
    } else if (moradaValue) {
        infoItems.push({
            icon: <MapPin className="h-5 w-5 text-red-500" />,
            label: 'Morada',
            value: moradaValue,
        });
    }
    
    if (item.localidade && item.localidade !== 'N/D') {
      infoItems.push({
        icon: <MapPin className="h-5 w-5 text-red-500" />,
        label: 'Localidade',
        value: item.localidade
      });
    }

    if (item.codigo_postal && item.codigo_postal !== 'N/D') {
      infoItems.push({
        icon: <MapPin className="h-5 w-5 text-red-500" />,
        label: 'Código Postal',
        value: item.codigo_postal
      });
    }

    // Informações de contacto
    if (item.email && item.email !== 'N/D') {
      infoItems.push({
        icon: <Mail className="h-5 w-5 text-blue-500" />,
        label: 'Email',
        value: item.email
      });
    }

    if (item.Email && item.Email !== 'N/D') {
      infoItems.push({
        icon: <Mail className="h-5 w-5 text-blue-500" />,
        label: 'Email',
        value: item.Email
      });
    }

    if (item.telefone && item.telefone !== 'N/D') {
      infoItems.push({
        icon: <Phone className="h-5 w-5 text-green-500" />,
        label: 'Telefone',
        value: item.telefone
      });
    }

    if (item.fax && item.fax !== 'N/D') {
      infoItems.push({
        icon: <Phone className="h-5 w-5 text-green-500" />,
        label: 'Fax',
        value: item.fax
      });
    }

    if (item.Tipo && item.Tipo !== 'N/D') {
      infoItems.push({
        icon: <Gavel className="h-5 w-5 text-purple-500" />,
        label: 'Tipo',
        value: item.Tipo
      });
    }

    return infoItems;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Item não encontrado</h1>
            <Button onClick={() => navigate('/')}>Voltar ao início</Button>
          </div>
        </div>
      </div>
    );
  }

  const infoItems = renderInfoSection();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-4">
            {getTipoIcon(item.tipo)}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {item.name || item.Nome || 'Nome não disponível'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {getTipoLabel(item.tipo)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botão de Enviar Email */}
        {hasValidEmail() && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button 
              onClick={handleOpenEmailModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar Mensagem por Email
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Clique para abrir o formulário de email personalizado
            </p>
          </motion.div>
        )}

        {/* Informações detalhadas */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              Informações Detalhadas
            </h2>
            
            <div className="space-y-4">
              {infoItems.length > 0 ? (
                infoItems.map((info, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">
                        {info.label}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-foreground break-words">
                          {info.value}
                        </p>
                        {info.action && (
                          <button onClick={info.action} className="ml-2 p-1 rounded-full hover:bg-muted transition-colors">
                            <Map className="h-4 w-4 text-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma informação adicional disponível.
                </p>
              )}
            </div>
          </Card>

          {/* Card adicional para informações extras */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Informações Adicionais
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Sobre este {getTipoLabel(item.tipo).toLowerCase()}
                </h3>
                <p className="text-blue-700 dark:text-blue-200 text-sm">
                  Esta página contém todas as informações disponíveis sobre {item.name || item.Nome || 'este item'}.
                  Para mais detalhes ou contacto direto, utilize as informações de contacto fornecidas.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Como contactar
                </h3>
                <p className="text-green-700 dark:text-green-200 text-sm">
                  {hasValidEmail() 
                    ? `Utilize o botão "Enviar Mensagem por Email" acima para abrir um formulário personalizado ou contacte diretamente através do email ${getEmailFromItem()}.`
                    : 'Para questões urgentes, recomendamos o contacto telefónico.'
                  }
                </p>
              </div>

              {!hasValidEmail() && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Email não disponível
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-200 text-sm">
                    Este item não possui um email de contacto válido. Utilize o telefone ou morada fornecidos para entrar em contacto.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseEmailModal}
        recipientEmail={getEmailFromItem()}
        recipientName={item.name || item.Nome || 'Destinatário'}
        recipientType={item.tipo}
      />
    </div>
  );
};

export default Detalhes; 