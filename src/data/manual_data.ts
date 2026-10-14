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
    {role: 'Front-end developer',company: 'Wipro', time: '01-2023 : 10-2025', stack: 'Javascript, React.js, Node.js, Storybook, Git'},
    {role: 'Programming teacher',company: 'CNA', time: '10-2025 : 06-2026', stack: 'Javascript, React.js, Node.js, Storybook, Git'}
]

const excluded_repos = [
    'Migalha0'
]

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
    coding_languages,
    human_languages,
    nationalities,
    hobbies,
    professional_experience,
    excluded_repos,
    technical_skills
}