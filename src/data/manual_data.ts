import type { Text } from '../i18n/language'

// Fields typed as Text take either one string (same in every language)
// or { en, pt }

const personal_info = {
    name: 'Gabriel Magalhães Barros',
    headline: {
        en: 'Full-stack developer · JavaScript & Python',
        pt: 'Desenvolvedor full-stack · JavaScript e Python',
    } as Text,
    phone: '+55 (81) 99895-6083',
    email: 'gabrielmigalhabarros@gmail.com',
    github: 'https://github.com/Migalha0',
    linkedin: {
        en: 'https://www.linkedin.com/in/gabriel-magalh%C3%A3es-barros/?locale=en-US',
        pt: 'https://www.linkedin.com/in/gabriel-magalh%C3%A3es-barros/?locale=pt-BR',
    } as Text,
    cv: '/cv.pdf',
}

const coding_languages: { name: Text, proficiency: number }[] = [
    {name: 'Python',     proficiency: 4},
    {name: 'JavaScript', proficiency: 4},
    {name: 'GLSL',       proficiency: 2}
]

const human_languages: { name: Text, proficiency: number }[] = [
    {name: {en: 'English',    pt: 'Inglês'},    proficiency: 5},
    {name: {en: 'Portuguese', pt: 'Português'}, proficiency: 5},
    {name: {en: 'German',     pt: 'Alemão'},    proficiency: 1}
]

const nationalities: { name: Text }[] = [
    {name: {en: 'Portuguese', pt: 'Portuguesa'}},
    {name: {en: 'Brazilian',  pt: 'Brasileira'}},
]

const hobbies: { name: Text }[] = [
    {name: {en: 'Fishkeeping', pt: 'Aquarismo'}},
    {name: {en: 'Painting',    pt: 'Pintura'}},
    {name: {en: 'Hiking',      pt: 'Trilhas'}},
    {name: {en: 'Reading',     pt: 'Leitura'}}
]

const professional_experience: {
    role: Text, company: string, time: string, stack: string, summary: Text
}[] = [
    {
        role: {en: 'Programming teacher', pt: 'Professor de programação'},
        company: 'CNA',
        time: '10-2025 : 06-2026',
        stack: 'Python, C#, Arduino',
        summary: {
            en: 'Taught programming to kids, using Arduino projects with C# to make code tangible through hardware, and Python to build a solid foundation in logic and general programming.',
            pt: 'Ensinei programação para crianças, usando projetos com Arduino em C# para tornar o código palpável através do hardware, e Python para construir uma base sólida em lógica e programação em geral.',
        }
    },
    {
        role: {en: 'Front-end developer', pt: 'Desenvolvedor front-end'},
        company: 'Wipro',
        time: '01-2023 : 10-2025',
        stack: 'JavaScript, React.js, Node.js, Storybook, Git',
        summary: {
            en: 'Front-end development for the Detran-PE (Pernambuco State Department of Transit) website, a public service used by over 2.6 million licensed drivers in the state. Led accessibility work that brought the site in line with web accessibility standards, earning the Web Accessibility Seal 2025-SAD/001 and recognition at a national award.',
            pt: 'Desenvolvimento front-end do site do Detran-PE (Departamento Estadual de Trânsito de Pernambuco), um serviço público usado por mais de 2,6 milhões de condutores habilitados no estado. Liderei o trabalho de acessibilidade que adequou o site aos padrões de acessibilidade web, conquistando o Selo de Acessibilidade Web 2025-SAD/001 e reconhecimento em uma premiação nacional.',
        }
    }
]

const excluded_repos = [
    'Migalha0'
]

// Repos listed here are shown first, in this order; the rest follow by last push
const featured_repos: string[] = []

const technical_skills: { category: Text, skills: Text[] }[] = [
    {
        category: {en: 'Development', pt: 'Desenvolvimento'},
        skills: [
            {en: 'Frontend Development', pt: 'Desenvolvimento Front-end'},
            'React',
            'HTML & CSS',
            'Tailwind CSS',
            'Node.js',
            'Three.js',
            'Git',
        ]
    },
    {
        category: {en: 'AI & Data', pt: 'IA e Dados'},
        skills: [
            {en: 'Large Language Models (LLMs)', pt: 'Modelos de Linguagem (LLMs)'},
            {en: 'Generative AI',      pt: 'IA Generativa'},
            {en: 'Image Generation',   pt: 'Geração de Imagens'},
            {en: 'Data Science',       pt: 'Ciência de Dados'},
            {en: 'Data Visualization', pt: 'Visualização de Dados'},
            {en: 'Computer Vision',    pt: 'Visão Computacional'}
        ]
    },
    {
        category: {en: 'Other Technologies', pt: 'Outras Tecnologias'},
        skills: [
            'SQL',
            {en: '3D Modeling',        pt: 'Modelagem 3D'},
            {en: 'Shader Programming', pt: 'Programação de Shaders'},
            {en: 'REST APIs',          pt: 'APIs REST'}
        ]
    }
]

export {
    personal_info,
    coding_languages,
    human_languages,
    nationalities,
    hobbies,
    professional_experience,
    excluded_repos,
    featured_repos,
    technical_skills
}
