import React, { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Calendar,
  Clock,
  MessageCircle,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import MathSymbol from "@/components/MathSymbol";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ContactPage: React.FC = () => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subscribe: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: language === "en" ? "Message Sent!" : "Mensagem Enviada!",
        description:
          language === "en"
            ? "I will get back to you as soon as possible."
            : "Entrarei em contato com você o mais breve possível.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        subscribe: false,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-orange-400 via-orange-500 to-primary-600 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-20 text-white/30"
            >
              <MathSymbol symbol="∫" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 left-1/3 text-white/20"
            >
              <MathSymbol symbol="π" size="3xl" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-xl"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
              >
                <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                <span className="text-white font-semibold text-sm tracking-wide">
                  {language === "en"
                    ? "Let's Connect & Start Learning"
                    : "Vamos Nos Conectar & Começar a Aprender"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {language === "en" ? "Contact Me" : "Entre em Contato"}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-32 h-2 bg-white rounded-full mb-10 shadow-lg"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl max-w-4xl text-white/95 leading-relaxed font-medium"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                {language === "en"
                  ? "Ready to begin your mathematical journey? I'm here to guide you every step of the way."
                  : "Pronto para começar sua jornada matemática? Estou aqui para te guiar em cada passo do caminho."}
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
                    {language === "en"
                      ? "Send a Message"
                      : "Envie uma Mensagem"}
                  </h2>
                </div>

                <p className="text-gray-700 mb-8">
                  {language === "en"
                    ? "Fill out the form below and I'll get back to you as soon as possible."
                    : "Preencha o formulário abaixo e entrarei em contato com você o mais breve possível."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {language === "en" ? "Your Name" : "Seu Nome"}*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={
                          language === "en" ? "John Doe" : "João Silva"
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {language === "en"
                          ? "Email Address"
                          : "Endereço de Email"}
                        *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={
                          language === "en"
                            ? "john@example.com"
                            : "joao@exemplo.com"
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {language === "en"
                          ? "Phone Number"
                          : "Número de Telefone"}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={
                          language === "en"
                            ? "(123) 456-7890"
                            : "(12) 3456-7890"
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {language === "en" ? "Subject" : "Assunto"}*
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder={
                          language === "en"
                            ? "Inquiry about tutoring"
                            : "Pergunta sobre tutoria"
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {language === "en" ? "Message" : "Mensagem"}*
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={
                        language === "en"
                          ? "How can I help you?"
                          : "Como posso ajudá-lo?"
                      }
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
                      {language === "en"
                        ? "Subscribe to newsletter for math tips and updates"
                        : "Inscrever-se no boletim informativo para dicas de matemática e atualizações"}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting
                      ? language === "en"
                        ? "Sending..."
                        : "Enviando..."
                      : language === "en"
                      ? "Send Message"
                      : "Enviar Mensagem"}
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
                      {language === "en"
                        ? "Contact Information"
                        : "Informações de Contato"}
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
                            <h3 className="font-bold mb-1">
                              {language === "en" ? "Email" : "E-mail"}
                            </h3>
                            <a
                              href="mailto:info@mathtutorpro.com"
                              className="text-primary hover:underline"
                            >
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
                            <h3 className="font-bold mb-1">
                              {language === "en" ? "Phone" : "Telefone"}
                            </h3>
                            <a
                              href="tel:+447592156251"
                              className="text-primary hover:underline"
                            >
                              +44 7592156251
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-3 rounded-full mr-4">
                            <MessageCircle className="text-primary h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold mb-1">WhatsApp</h3>
                            <a
                              href="https://wa.me/447592156251"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              +44 7592156251
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
                            <h3 className="font-bold mb-1">
                              {language === "en" ? "Location" : "Localização"}
                            </h3>
                            <p>20 Ring Fort Road, Cambridge. CB42GW</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <Calendar className="text-primary mr-2" size={24} />
                      <h3 className="text-xl font-bold">
                        {language === "en"
                          ? "Office Hours"
                          : "Horário de Atendimento"}
                      </h3>
                    </div>

                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <Clock className="text-primary mr-2" size={16} />
                          <p className="font-medium">
                            {language === "en"
                              ? "Monday - Friday"
                              : "Segunda - Sexta"}
                          </p>
                        </div>
                        <p>9:00 AM - 6:00 PM</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <Clock className="text-primary mr-2" size={16} />
                          <p className="font-medium">
                            {language === "en" ? "Saturday" : "Sábado"}
                          </p>
                        </div>
                        <p>10:00 AM - 4:00 PM</p>
                      </div>

                      <CollapsibleContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center">
                            <Clock className="text-primary mr-2" size={16} />
                            <p className="font-medium">
                              {language === "en" ? "Sunday" : "Domingo"}
                            </p>
                          </div>
                          <p>{language === "en" ? "Closed" : "Fechado"}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {language === "en"
                            ? "* Hours may vary on holidays"
                            : "* O horário pode variar em feriados"}
                        </p>
                      </CollapsibleContent>

                      <CollapsibleTrigger asChild>
                        <Button variant="link" className="px-0 mt-1 h-auto">
                          {isOpen
                            ? language === "en"
                              ? "Show less"
                              : "Mostrar menos"
                            : language === "en"
                            ? "Show more"
                            : "Mostrar mais"}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>

                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.8707154507195!2d0.11636551570312877!3d52.208477679747474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d870a4a2b44e9d%3A0xa1b2c3d4e5f6789a!2sRing%20Fort%20Rd%2C%20Cambridge%2C%20UK!5e0!3m2!1sen!2sus!4v1705000000000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office location - Cambridge"
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
