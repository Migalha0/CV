const personal_info = {
    name: 'Gabriel Magalhães Barros',
    headline: 'Full-stack developer · JavaScript & Python',
    phone: '+55 (81) 99895-6083',
    email: 'gabrielmigalhabarros@gmail.com',
    github: 'https://github.com/Migalha0',
    linkedin: 'https://www.linkedin.com/in/gabriel-magalh%C3%A3es-barros/?locale=en-US',
    cv: '/cv.pdf',
}

const coding_languages = [
    {name: 'Python',     proficiency: 4},
    {name: 'JavaScript', proficiency: 4},
    {name: 'GLSL',       proficiency: 2}
]

const human_languages = [
    {name: 'English',     proficiency: 5},
    {name: 'Portuguese', proficiency: 5},
    {name: 'German',       proficiency: 1}
]

const nationalities = [
    {name:'Portuguese'},
    {name:'Brazilian'},
]

const hobbies = [
    {name:'Fishkeeping'},
    {name:'Painting'},
    {name:'Hiking'},
    {name:'Reading'}
]

const professional_experience = [
    {
        role: 'Programming teacher',
        company: 'CNA',
        time: '10-2025 : 06-2026',
        stack: 'Python, C#, Arduino',
        summary: 'Taught programming to kids, using Arduino projects with C# to make code tangible through hardware, and Python to build a solid foundation in logic and general programming.'
    },
    {
        role: 'Front-end developer',
        company: 'Wipro',
        time: '01-2023 : 10-2025',
        stack: 'JavaScript, React.js, Node.js, Storybook, Git',
        summary: 'Front-end development for the Detran-PE (Pernambuco State Department of Transit) website, a public service used by over 2.6 million licensed drivers in the state. Led accessibility work that brought the site in line with web accessibility standards, earning the Web Accessibility Seal 2025-SAD/001 and recognition at a national award.'
    }
]

const excluded_repos = [
    'Migalha0'
]

// Repos listed here are shown first, in this order; the rest follow by last push
const featured_repos: string[] = []

const technical_skills = [
    {
        category: 'Development',
        skills: [
            'Frontend Development',
            'React',
            'HTML & CSS',
            'Tailwind CSS',
            'Node.js',
            'Three.js',
            'Git',
        ]
    },
    {
        category: 'AI & Data',
        skills: [
            'Large Language Models (LLMs)',
            'Generative AI',
            'Image Generation',
            'Data Science',
            'Data Visualization',
            'Computer Vision'
        ]
    },
    {
        category: 'Other Technologies',
        skills: [
            'SQL',
            '3D Modeling',
            'Shader Programming',
            'REST APIs'
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