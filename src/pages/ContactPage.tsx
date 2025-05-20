
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ContactPage: React.FC = () => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    subscribe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subscribe: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: language === 'en' ? 'Message Sent!' : 'Mensagem Enviada!',
        description: language === 'en'
          ? 'I will get back to you as soon as possible.'
          : 'Entrarei em contato com você o mais breve possível.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        subscribe: false,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-tutor-dark text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                {language === 'en' ? 'Contact Me' : 'Entre em Contato'}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-1 bg-primary mb-8"
              ></motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl max-w-3xl"
              >
                {language === 'en' 
                  ? 'Have questions or ready to start your math journey? Get in touch with me today.' 
                  : 'Tem perguntas ou está pronto para começar sua jornada matemática? Entre em contato comigo hoje.'}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-6">
                  <MessageSquare className="text-primary mr-2" size={24} />
                  <h2 className="text-3xl font-bold gradient-text">
                    {language === 'en' ? 'Send a Message' : 'Envie uma Mensagem'}
                  </h2>
                </div>
                
                <p className="text-gray-700 mb-8">
                  {language === 'en'
                    ? 'Fill out the form below and I\'ll get back to you as soon as possible.'
                    : 'Preencha o formulário abaixo e entrarei em contato com você o mais breve possível.'}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Your Name' : 'Seu Nome'}*
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={language === 'en' ? 'John Doe' : 'João Silva'}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Email Address' : 'Endereço de Email'}*
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={language === 'en' ? 'john@example.com' : 'joao@exemplo.com'}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Phone Number' : 'Número de Telefone'}
                      </label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'en' ? '(123) 456-7890' : '(12) 3456-7890'}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Subject' : 'Assunto'}*
                      </label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder={language === 'en' ? 'Inquiry about tutoring' : 'Pergunta sobre tutoria'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Message' : 'Mensagem'}*
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={language === 'en' ? 'How can I help you?' : 'Como posso ajudá-lo?'}
                      rows={5}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="subscribe" 
                      checked={formData.subscribe}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="subscribe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language === 'en'
                        ? 'Subscribe to newsletter for math tips and updates'
                        : 'Inscrever-se no boletim informativo para dicas de matemática e atualizações'}
                    </label>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 
                      (language === 'en' ? 'Sending...' : 'Enviando...') : 
                      (language === 'en' ? 'Send Message' : 'Enviar Mensagem')}
                  </Button>
                </form>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div>
                  <div className="flex items-center mb-6">
                    <Phone className="text-primary mr-2" size={24} />
                    <h2 className="text-3xl font-bold gradient-text">
                      {language === 'en' ? 'Contact Information' : 'Informações de Contato'}
                    </h2>
                  </div>
                  
                  <div className="space-y-6 mb-12">
                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-3 rounded-full mr-4">
                            <Mail className="text-primary h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold mb-1">{language === 'en' ? 'Email' : 'E-mail'}</h3>
                            <a href="mailto:info@mathtutorpro.com" className="text-primary hover:underline">
                              info@mathtutorpro.com
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-3 rounded-full mr-4">
                            <Phone className="text-primary h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold mb-1">{language === 'en' ? 'Phone' : 'Telefone'}</h3>
                            <a href="tel:+15551234567" className="text-primary hover:underline">
                              +1 (555) 123-4567
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-3 rounded-full mr-4">
                            <MapPin className="text-primary h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold mb-1">{language === 'en' ? 'Location' : 'Localização'}</h3>
                            <p>123 Math Avenue, New York, NY 10001</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <Calendar className="text-primary mr-2" size={24} />
                      <h3 className="text-xl font-bold">
                        {language === 'en' ? 'Office Hours' : 'Horário de Atendimento'}
                      </h3>
                    </div>
                    
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <Clock className="text-primary mr-2" size={16} />
                          <p className="font-medium">{language === 'en' ? 'Monday - Friday' : 'Segunda - Sexta'}</p>
                        </div>
                        <p>9:00 AM - 6:00 PM</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <Clock className="text-primary mr-2" size={16} />
                          <p className="font-medium">{language === 'en' ? 'Saturday' : 'Sábado'}</p>
                        </div>
                        <p>10:00 AM - 4:00 PM</p>
                      </div>
                      
                      <CollapsibleContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center">
                            <Clock className="text-primary mr-2" size={16} />
                            <p className="font-medium">{language === 'en' ? 'Sunday' : 'Domingo'}</p>
                          </div>
                          <p>{language === 'en' ? 'Closed' : 'Fechado'}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {language === 'en' 
                            ? '* Hours may vary on holidays'
                            : '* O horário pode variar em feriados'}
                        </p>
                      </CollapsibleContent>
                      
                      <CollapsibleTrigger asChild>
                        <Button variant="link" className="px-0 mt-1 h-auto">
                          {isOpen 
                            ? (language === 'en' ? 'Show less' : 'Mostrar menos')
                            : (language === 'en' ? 'Show more' : 'Mostrar mais')}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                  
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2185559334703!2d-73.98565702381948!3d40.75899557138718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1684782013965!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office location"
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
