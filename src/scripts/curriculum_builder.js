import fs from 'fs'
import { repo_scraper } from './github_scraper.js';

const template_path = '../template.html';
const finished_path = '../../index.html';

async function generate_projects(html){
    console.log('   projects gen initializing...');

    const projects = await repo_scraper();
    const project_cards_html = projects.map(project => `    
        <div class="grid-content">
            <a href="https://github.com/Migalha0/${project.title}" class="hyperlink left-box title">
                ${project.title}
            </a>
            <p>
                ${project.description}
            </p>
        </div>
    `).join('\n');

    console.log('   projects gen finished.');
    return html.replace('<!-- PROJECTS_LIST -->', project_cards_html);
}

function generate_languages(html){
    console.log('   language gen initializing...');

    const languages = [
        {name:'ENGLISH'    ,proficiency: 5},
        {name:'PORTUGUESE' ,proficiency: 5},
        {name:'GERMAN'     ,proficiency: 1},
    ]

    const language_cards_html = languages.map(language => `
            <div class="left-box inner">          
                <div class="left-box title small">
                <div class="prof-scale" data-level="${language.proficiency}"></div>
                ${language.name}
                </div>
            </div>
        `).join('\n')

    console.log('   language gen finished.');
    return html.replace('<!-- LANGUAGES_LIST -->', language_cards_html);
}

function generate_p_languages(html){
    console.log('   programming language gen initializing...');

    const languages = [
        {name:'Python'    ,proficiency: 4},
        {name:'Javascript' ,proficiency: 4},
        {name:'GLSL'     ,proficiency: 2},
    ]

    const language_cards_html = languages.map(language => `
            <div class="left-box inner">          
                <div class="left-box title small">
                    <div class="prof-scale" data-level="${language.proficiency}"></div>
                    ${language.name}
                </div>
            </div>
        `).join('\n')

    console.log('   programming language gen finished.');
    return html.replace('<!-- P_LANGUAGES_LIST -->', language_cards_html);
}

function generate_nationality(html){
    console.log('   nationality gen initializing...');

    const nationalities = [
        {name:'PORTUGUESE [EU]'},
        {name:'BRAZILIAN'},
    ]

    const language_cards_html = nationalities.map(nationality => `
            <div class="left-box inner tag">          
                <div class="left-box title small">
                    ${nationality.name}
                </div>
            </div>
        `).join('\n')

    console.log('   nationality gen finished.');
    return html.replace('<!-- NATIONALITY_LIST -->', language_cards_html);
}

function generate_interests(html){
    console.log('   interest gen initializing...');

    const interests = [
        {name:'Fishkeeping'},
        {name:'Painting'},
        {name:'Hiking'},
        {name:'Science fiction'},
    ]

    const interest_cards_html = interests.map(interest => `
            <div class="left-box inner tag">          
                <div class="left-box title small">
                    ${interest.name}
                </div>
            </div>
        `).join('\n')

    console.log('   interest gen finished.');
    return html.replace('<!-- INTERESTS_LIST -->', interest_cards_html);
}

function generate_experiences(html){
    console.log('   experience gen initializing...');

    const experiences = [
        {role:'Frontend developer', company:'Wipro', time_range:'01-2023 : 12-2024', stack:'Javascript, React.js, Node.js, Storybook, TortoiseGit, Git'},
        {role:'Frontend developer', company:'G4F', time_range:'12-2024 : 10-2025', stack:'Javascript, React.js, Node.js, Storybook, TortoiseGit, Git'},
        {role:'Programming teacher', company:'CNA - Linguas', time_range:'10-2025 : 05-2026', stack:'Python, Scratch'},
    ]

    const experiences_cards_html = experiences.map(experience => `
            <div class="grid-content card">
                <h3 class="left-box title">${experience.role}</h3>
                <p>
                    Company: ${experience.company}
                </p>
                <p>
                    ${experience.time_range}
                </p>
                <p>
                    Stack: ${experience.stack}
                </p>
            </div>
        `).join('\n')

    console.log('   experience gen finished.');
    return html.replace('<!-- EXPERIENCES_LIST -->', experiences_cards_html);
}

function write_file(finalHtml){
    console.log('   cv gen initializing...');

    fs.writeFileSync(finished_path, finalHtml, 'utf-8');

    console.log('   cv gen finished.');
}

async function build_cv(){
    console.log('🟠 cv build initializing...');

    let html_content = fs.readFileSync(template_path, 'utf-8');

    html_content = await generate_projects(html_content);
    html_content = generate_p_languages(html_content);
    html_content = generate_languages(html_content);
    html_content = generate_nationality(html_content);
    html_content = generate_interests(html_content);
    html_content = generate_experiences(html_content);

    write_file(html_content);

    console.log('🟢 cv build finished.');
}

build_cv();