import fs from 'fs'
import puppeteer from "puppeteer"

async function repo_scraper() {
    // repos that we will ignore when building our list
    const ignore_repos = [
        'Migalha0',
        'OpenFrontIO',
        'storybook-dark-mode'
    ]

    // repos url
    const url = 'https://github.com/Migalha0?tab=repositories'

    // using puppeteer
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await page.setViewport({width:1000, height:1000})

    const projects = await page.$$eval('#user-repositories-list li', (items, ignore_repos) => {
        
        return items.map(el => {

            const title = el.querySelector('a[itemprop="name codeRepository"]').innerText.trim();
            const description = el.querySelector('p[itemprop="description"]')?.innerText.trim();

            if(ignore_repos.some(name => title === name)){
                return null
            }

            return{
                title: title,
                description: description
            }

        }).filter(Boolean);

    }, ignore_repos);

    // closing browser
    await browser.close();

    return projects
}

async function generate_html_projects(){
    console.log('initializing projects list creation');

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

    const template_path = '../template.html';
    let htmlContent = fs.readFileSync(template_path, 'utf-8');

    const finished_path = '../../index.html'

    htmlContent = htmlContent.replace('<!-- PROJECTS_LIST -->', project_cards_html);

    fs.writeFileSync(finished_path, htmlContent, 'utf-8');
    console.log('list generated');
}

generate_html_projects();