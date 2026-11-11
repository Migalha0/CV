import type { Lang } from "./language";

const en = {
  meta: {
    title: "Gabriel Magalhães Barros — Full-Stack Developer",
    description:
      "Portfolio of Gabriel Magalhães Barros, full-stack developer specializing in JavaScript and Python. Projects in web, 3D, data visualization and AI.",
  },
  skipToContent: "Skip to content",
  opensInNewTab: " (opens in a new tab)",
  contact: {
    email: "EMAIL",
    github: "GITHUB",
    linkedin: "LINKEDIN",
    call: "CALL",
    callLabel: (phone: string) => `Call ${phone}`,
    downloadCv: "DOWNLOAD CV",
  },
  copy: {
    copy: "COPY",
    copied: "COPIED",
    label: (text: string) => `Copy ${text}`,
    status: "Email address copied",
  },
  theme: {
    label: "Dark mode",
  },
  language: {
    label: "Language",
  },
  footer: {
    builtWith: "Built from scratch with React, Tailwind CSS & WebGL shaders.",
    source: "SOURCE",
  },
  card: {
    liveDemo: "LIVE DEMO",
    onGithub: (title: string) => `${title} on GitHub`,
    screenshotOf: (title: string) => `Screenshot of ${title}`,
    technologies: "Technologies and topics",
  },
  rail: {
    navLabel: "On this page",
    navTitle: "On this page",
  },
  stats: {
    email: "Email",
    phone: "Phone",
    availability: "Availability",
    workModes: "Onsite · Hybrid · Remote",
    relocation: "Relocation",
    relocationValue: "Open to relocating",
  },
  sections: {
    about: "About me",
    aboutNav: "About me",
    experience: "Professional experience",
    experienceNav: "Experience",
    projects: "Projects",
    projectsNav: "Projects",
  },
  about: [
    "Software developer working mainly with JavaScript and Python, with 2+ years of professional experience. At Wipro I built front-end for a state government service and led the accessibility effort that earned it an official web accessibility seal.",
    "Graduated in software development and currently taking a specialization in cybersecurity at CESAR School, bringing a security mindset to the code I write.",
    "Looking for: onsite, hybrid, or remote opportunities in software engineering, web development, cybersecurity (SOC), data analysis, or GIS.",
  ],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  projects: {
    loading: "Loading projects…",
    error: "Unable to load repositories from GitHub.",
    seeOnGithub: "See my projects directly on GitHub",
  },
  sidebar: {
    label: "Skills and profile",
    codingLanguages: "CODING LANGUAGES",
    languages: "LANGUAGES",
    technicalSkills: "TECHNICAL SKILLS",
    nationalities: "NATIONALITIES",
    interests: "INTERESTS",
    open: "SKILLS",
    close: "CLOSE",
    panel: " panel",
  },
  level: (title: string, current: number, max: number) =>
    `${title}: ${current} of ${max}`,
};

export type Dictionary = typeof en;

const pt: Dictionary = {
  meta: {
    title: "Gabriel Magalhães Barros — Desenvolvedor Full-Stack",
    description:
      "Portfólio de Gabriel Magalhães Barros, desenvolvedor full-stack especializado em JavaScript e Python. Projetos de web, 3D, visualização de dados e IA.",
  },
  skipToContent: "Pular para o conteúdo",
  opensInNewTab: " (abre em uma nova aba)",
  contact: {
    email: "E-MAIL",
    github: "GITHUB",
    linkedin: "LINKEDIN",
    call: "LIGAR",
    callLabel: (phone: string) => `Ligar para ${phone}`,
    downloadCv: "BAIXAR CV",
  },
  copy: {
    copy: "COPIAR",
    copied: "COPIADO",
    label: (text: string) => `Copiar ${text}`,
    status: "Endereço de e-mail copiado",
  },
  theme: {
    label: "Modo escuro",
  },
  language: {
    label: "Idioma",
  },
  footer: {
    builtWith: "Feito do zero com React, Tailwind CSS e shaders WebGL.",
    source: "CÓDIGO",
  },
  card: {
    liveDemo: "VER ONLINE",
    onGithub: (title: string) => `${title} no GitHub`,
    screenshotOf: (title: string) => `Captura de tela de ${title}`,
    technologies: "Tecnologias e tópicos",
  },
  rail: {
    navLabel: "Nesta página",
    navTitle: "Nesta página",
  },
  stats: {
    email: "E-mail",
    phone: "Telefone",
    availability: "Disponibilidade",
    workModes: "Presencial · Híbrido · Remoto",
    relocation: "Mudança",
    relocationValue: "Disponível para mudança",
  },
  sections: {
    about: "Sobre mim",
    aboutNav: "Sobre mim",
    experience: "Experiência profissional",
    experienceNav: "Experiência",
    projects: "Projetos",
    projectsNav: "Projetos",
  },
  about: [
    "Desenvolvedor de software trabalhando principalmente com JavaScript e Python, com mais de 2 anos de experiência profissional. Na Wipro, desenvolvi o front-end de um serviço do governo estadual e liderei o trabalho de acessibilidade que rendeu ao site um selo oficial de acessibilidade web.",
    "Formado em desenvolvimento de software e atualmente cursando especialização em cibersegurança na CESAR School, trazendo uma mentalidade de segurança para o código que escrevo.",
    "Procuro: oportunidades presenciais, híbridas ou remotas em engenharia de software, desenvolvimento web, cibersegurança (SOC), análise de dados ou GIS.",
  ],
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  projects: {
    loading: "Carregando projetos…",
    error: "Não foi possível carregar os repositórios do GitHub.",
    seeOnGithub: "Veja meus projetos diretamente no GitHub",
  },
  sidebar: {
    label: "Habilidades e perfil",
    codingLanguages: "LINGUAGENS DE PROGRAMAÇÃO",
    languages: "IDIOMAS",
    technicalSkills: "HABILIDADES TÉCNICAS",
    nationalities: "NACIONALIDADES",
    interests: "INTERESSES",
    open: "PERFIL",
    close: "FECHAR",
    panel: " painel",
  },
  level: (title: string, current: number, max: number) =>
    `${title}: ${current} de ${max}`,
};

export const translations: Record<Lang, Dictionary> = { en, pt };
