import puppeteer from "puppeteer"

export async function repo_scraper() {
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