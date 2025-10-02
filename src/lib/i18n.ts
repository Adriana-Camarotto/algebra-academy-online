// Dictionary for translations
const translations = {
  en: {
    // Common
    appName: "Calcul8",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    welcome: "Welcome",
    language: "Language",
    english: "English",
    portuguese: "Português",

    // Landing Page
    heroTitle: "Advanced Mathematics Tutoring",
    heroSubtitle: "Personalised lessons for students at all levels",
    learnMore: "Learn More",
    bookLesson: "Book a Lesson",
    aboutTitle: "About Me",
    aboutDesc:
      "I'm a passionate mathematics tutor with over 10 years of experience teaching students from primary to university level.",
    servicesTitle: "My Services",
    service1: "One-to-One Tutoring",
    service1Desc: "Personalised lessons tailored to your learning needs",
    service2: "Group Sessions",
    service2Desc: "Cost-effective learning in small focused groups",
    service3: "GCSE & A-Level Preparation",
    service3Desc:
      "Targeted preparation for GCSE, A-Level, and university entrance exams",
    testimonials: "Testimonials",
    faq: "Frequently Asked Questions",
    contact: "Contact Me",

    // Auth Pages
    selectRole: "Select Your Role",
    student: "Student",
    parent: "Parent",
    tutor: "Tutor",
    admin: "Administrator",
    service: "Service Provider",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    loginAs: "Login as",

    // Dashboard
    dashboard: "Dashboard",
    overview: "Overview",
    upcomingLessons: "Upcoming Lessons",
    profile: "Profile",
    settings: "Settings",

    // Student Dashboard
    myLessons: "My Lessons",
    schedule: "Schedule",
    history: "History",
    progress: "Progress",
    bookings: "Bookings",
    resources: "Resources",
    feedback: "Feedback",
    lessonHistory: "Lesson History",

    // Error Messages
    error404: "Page not found",
    unauthorized: "You don't have access to this page",

    // Forms
    firstName: "First Name",
    lastName: "Surname",
    message: "Message",
    submit: "Submit",
    cancel: "Cancel",

    // Booking
    selectDate: "Select Date",
    selectTime: "Select Time",
    paymentDetails: "Payment Details",
    confirmation: "Confirmation",
    price: "Price",
    hours: "Hours",

    // Booking Status
    available: "Available",
    booked: "Booked",
    alreadyBooked: "Not Available",
    tooSoon: "Too Soon",
    notAvailable: "Not Available",
    spots: "spots",
    pickDate: "Pick a date",
    chooseDate: "Choose your preferred date and time",
    bookingNotice: "Bookings must be made at least 30 minutes in advance",
    availableTimeSlots: "Available Time Slots",

    // Payment Status
    paid: "Paid",
    pending: "Payment Pending",
    cancelled: "Cancelled",
    failed: "Failed",
    refunded: "Refunded",

    // Lesson Status
    scheduled: "Scheduled",
    completed: "Completed",

    // Error Messages
    error: "Error",
    errorLoadingBookings:
      "There was an error loading your bookings. Please try again.",

    // Services
    individualTutoring: "Individual Tutoring",
    groupSessions: "Group Sessions",
    examPreparation: "GCSE & A-Level Preparation",
  },

  pt: {
    // Common
    appName: "Calcul8",
    login: "Entrar",
    signup: "Registar",
    logout: "Sair",
    welcome: "Bem-vindo",
    language: "Idioma",
    english: "Inglês",
    portuguese: "Português",

    // Landing Page
    heroTitle: "Aulas de Matemática Avançada",
    heroSubtitle: "Aulas personalizadas para estudantes de todos os níveis",
    learnMore: "Saiba Mais",
    bookLesson: "Agendar Aula",
    aboutTitle: "Sobre Mim",
    aboutDesc:
      "Sou uma tutora de matemática apaixonada com mais de 10 anos de experiência a ensinar estudantes do ensino básico ao universitário.",
    servicesTitle: "Os Meus Serviços",
    service1: "Aulas Particulares",
    service1Desc:
      "Aulas personalizadas adaptadas às suas necessidades de aprendizagem",
    service2: "Sessões em Grupo",
    service2Desc: "Aprendizagem económica em pequenos grupos focados",
    service3: "Preparação para Exames",
    service3Desc:
      "Preparação direcionada para exames nacionais, ENEM e outros concursos",
    testimonials: "Testemunhos",
    faq: "Perguntas Frequentes",
    contact: "Contacto",

    // Auth Pages
    selectRole: "Selecione o Seu Papel",
    student: "Estudante",
    parent: "Encarregado de Educação",
    tutor: "Tutor",
    admin: "Administrador",
    service: "Prestador de Serviço",
    email: "Email",
    password: "Palavra-passe",
    forgotPassword: "Esqueceu a Palavra-passe?",
    loginAs: "Entrar como",

    // Dashboard
    dashboard: "Painel",
    overview: "Vista Geral",
    upcomingLessons: "Próximas Aulas",
    profile: "Perfil",
    settings: "Definições",

    // Student Dashboard
    myLessons: "As Minhas Aulas",
    schedule: "Horário",
    history: "Histórico",
    progress: "Progresso",
    bookings: "Marcações",
    resources: "Recursos",
    feedback: "Comentários",
    lessonHistory: "Histórico de Aulas",

    // Error Messages
    error404: "Página não encontrada",
    unauthorized: "Não tem acesso a esta página",

    // Forms
    firstName: "Nome Próprio",
    lastName: "Apelido",
    message: "Mensagem",
    submit: "Enviar",
    cancel: "Cancelar",

    // Booking
    selectDate: "Seleccionar Data",
    selectTime: "Seleccionar Horário",
    paymentDetails: "Detalhes do Pagamento",
    confirmation: "Confirmação",
    price: "Preço",
    hours: "Horas",

    // Booking Status
    available: "Disponível",
    booked: "Reservado",
    alreadyBooked: "Não Disponível",
    tooSoon: "Muito Cedo",
    notAvailable: "Indisponível",
    spots: "vagas",
    pickDate: "Escolha uma data",
    chooseDate: "Escolha sua data e horário preferido",
    bookingNotice:
      "Agendamentos devem ser feitos com pelo menos 30 minutos de antecedência",
    availableTimeSlots: "Horários Disponíveis",

    // Payment Status
    paid: "Pago",
    pending: "Pagamento Pendente",
    cancelled: "Cancelado",
    failed: "Falhou",
    refunded: "Reembolsado",

    // Lesson Status
    scheduled: "Agendada",
    completed: "Concluída",

    // Error Messages
    error: "Erro",
    errorLoadingBookings:
      "Houve um erro ao carregar os seus agendamentos. Tente novamente.",

    // Services
    individualTutoring: "Tutoria Individual",
    groupSessions: "Sessões em Grupo",
    examPreparation: "Preparação para Exames",
  },
};

export type Language = "en" | "pt";
export type TranslationKey = keyof typeof translations.en;

// Function to get translation
export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || key;
}

export default translations;
