
let mainContentDiv = document.getElementById('main-content');


let make = '';
let model = '';
let year = '';


async function load_start_form() {
    const response = await fetch(`/api/render_dashboard_start_form`);
    const html = await response.text();
    mainContentDiv.innerHTML = '';
    mainContentDiv.insertAdjacentHTML('beforeend', html);
}

async function buildDashboardHTML() {
    const response = await fetch(`/api/render_dashboard?year=${year}&make=${make}&model=${model}`);
    const html = await response.text();
    mainContentDiv.innerHTML = '';
    mainContentDiv.insertAdjacentHTML('beforeend', html);
} 
async function saveStartForm() {
    year = document.getElementById('year-input').value;
    make = document.getElementById('make-input').value;
    model = document.getElementById('model-input').value;

    if (year != '' && make != '' && model != '') {
        if (/^\d+$/.test(year)) {
            document.getElementById('start-form-error-text').innerText = ''
            load_dashboard()
        } else {
            document.getElementById('start-form-error-text').innerText = 'Year must be only digits.'
        }
    } else {
        document.getElementById('start-form-error-text').innerText = 'All 3 fields are required.'
    }

}

async function load_dashboard() {
    mainContentDiv.innerHTML = '';
    await buildDashboardHTML();
}


async function initalize_dashboard() {
    const user = window.user;
    const userID = window.userID;

    if (user) {
        mainContentDiv.insertAdjacentHTML('beforeend', `<h1>loading content..${userID}</h1> `);
    } else {
        mainContentDiv.insertAdjacentHTML('beforeend', load_start_form());
    };
};

initalize_dashboard()