import React, { useState, useEffect } from 'react';
import { X, Send, User, Building, Gavel, GraduationCap, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  recipientType: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  recipientType
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    contactType: '',
    urgency: 'normal',
    includePhone: false,
    includeAddress: false
  });

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'advogado':
        return <User className="h-5 w-5 text-blue-600" />;
      case 'tribunal':
        return <Gavel className="h-5 w-5 text-green-600" />;
      case 'sociedade':
        return <Building className="h-5 w-5 text-purple-600" />;
      case 'estagiario':
        return <GraduationCap className="h-5 w-5 text-orange-600" />;
      default:
        return <Mail className="h-5 w-5 text-gray-600" />;
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSubject = () => {
    if (formData.subject) return formData.subject;
    
    const baseSubject = `Contacto - ${recipientName}`;
    if (formData.contactType) {
      return `${formData.contactType} - ${baseSubject}`;
    }
    return baseSubject;
  };

  const generateBody = () => {
    let body = formData.body || 'Olá,\n\nGostaria de entrar em contacto consigo.';
    
    if (formData.contactType) {
      body += `\n\nMotivo do contacto: ${formData.contactType}`;
    }
    
    if (formData.urgency !== 'normal') {
      const urgencyText = formData.urgency === 'urgent' ? 'URGENTE' : 'Importante';
      body += `\n\nUrgência: ${urgencyText}`;
    }
    
    body += '\n\nAtenciosamente,\n[Seu nome]';
    
    if (formData.includePhone) {
      body += '\n\nP.S.: Pode contactar-me por telefone se preferir.';
    }
    
    if (formData.includeAddress) {
      body += '\n\nP.S.: Pode enviar documentação por correio se necessário.';
    }
    
    return body;
  };

  const handleSendEmail = () => {
    setIsSending(true);
    
    const subject = generateSubject();
    const body = generateBody();
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Simular um pequeno delay para mostrar o loading
    setTimeout(() => {
      window.open(mailtoLink, '_blank');
      setIsSending(false);
      onClose();
      // Reset form
      setFormData({
        subject: '',
        body: '',
        contactType: '',
        urgency: 'normal',
        includePhone: false,
        includeAddress: false
      });
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      subject: '',
      body: '',
      contactType: '',
      urgency: 'normal',
      includePhone: false,
      includeAddress: false
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                {getTipoIcon(recipientType)}
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Enviar Email
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Para: {recipientName} ({recipientEmail})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Tipo de Contacto */}
              <div className="space-y-2">
                <Label htmlFor="contactType">Tipo de Contacto</Label>
                <Select onValueChange={(value) => handleInputChange('contactType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta Jurídica</SelectItem>
                    <SelectItem value="agendamento">Agendamento de Reunião</SelectItem>
                    <SelectItem value="documentacao">Envio de Documentação</SelectItem>
                    <SelectItem value="parceria">Proposta de Parceria</SelectItem>
                    <SelectItem value="informacao">Pedido de Informação</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Urgência */}
              <div className="space-y-2">
                <Label htmlFor="urgency">Nível de Urgência</Label>
                <Select onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assunto */}
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Assunto do email (opcional - será gerado automaticamente)"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                />
                {!formData.subject && (
                  <p className="text-xs text-muted-foreground">
                    Assunto sugerido: {generateSubject()}
                  </p>
                )}
              </div>

              {/* Corpo da Mensagem */}
              <div className="space-y-2">
                <Label htmlFor="body">Mensagem</Label>
                <Textarea
                  id="body"
                  placeholder="Escreva a sua mensagem aqui..."
                  value={formData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                {!formData.body && (
                  <p className="text-xs text-muted-foreground">
                    Mensagem sugerida: {generateBody().split('\n')[0]}...
                  </p>
                )}
              </div>

              {/* Opções Adicionais */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Opções Adicionais</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includePhone"
                      checked={formData.includePhone}
                      onChange={(e) => handleInputChange('includePhone', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="includePhone" className="text-sm">
                      Incluir referência a contacto telefónico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeAddress"
                      checked={formData.includeAddress}
                      onChange={(e) => handleInputChange('includeAddress', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="includeAddress" className="text-sm">
                      Incluir referência a envio por correio
                    </Label>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Pré-visualização</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Para:</strong> {recipientEmail}</p>
                  <p><strong>Assunto:</strong> {generateSubject()}</p>
                  <p><strong>Mensagem:</strong></p>
                  <div className="bg-background p-2 rounded text-xs whitespace-pre-line">
                    {generateBody()}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSendEmail}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    A enviar...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Email
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal; 