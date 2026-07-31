    async function initalize_projects() {
        const response = await fetch('/api/get_projects_from_db');
        const projects = await response.json();

        let projectsDiv = document.getElementById('projects-container');
        projectsDiv.innerHTML = "";
        let projectMap = {}

        for (const row of projects) {
            if (!projectMap[row.projectID]) {
                projectMap[row.projectID] = {
                    title: row.title,
                    description: row.description,
                    links: []
                };
            }
            projectMap[row.projectID].links.push({ name: row.linkName, url: row.link });
        }

        const projectIDs = Object.keys(projectMap);

        projectIDs.forEach((projectID, i) => {
            const project = projectMap[projectID];

            let linksHTML = '';
            for (const link of project.links) {
                if (link.url == 'https://mweger.com' || link.url.startsWith('/')) {
                    linksHTML += ` <a href="${link.url}">${link.name}</a>`;
                } else {
                    linksHTML += ` <a target="_blank" href="${link.url}">${link.name}</a>`;
                }
            }

            let projectHTML = `
            <div>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <p>Links:${linksHTML}</p>
                
            <div>
            `;

            if (i < projectIDs.length - 1) {
                projectHTML += `<div class="divider"></div>`
            }

            projectsDiv.insertAdjacentHTML('beforeend', projectHTML);
        });
    }

    initalize_projects()

