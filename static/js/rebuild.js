
let mainContentDiv = document.getElementById('main-content');


let make = '';
let model = '';
let year = '';


async function load_dashboard_saves() {
    const response = await fetch('/api/get_dashboard_saves_from_db', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userID: window.userID})
    });
    const data = await response.json();
    console.log(data);
    for (const row of data) {
        console.log("row: ", row)
    }
    if (data.length > 0) {
        load_save_select(data);
    }
}

function testFunction() {
    alert("worked");
}

function load_save_select(data) {
    let html = `
    <h1>Rebuild Dashboard<h1>
    <h2>Select your save</h2>
    <div class="card-container">
    `;
    for (const row of data) {
        html += ` 
            <div 
            class="card"
            onClick=testFunction(); 
            >
                <p>Year: ${row.year}</p>
                <p>Make: ${row.make}</p>
                <p>Model: ${row.model}</p>
            </div>
        `
    }
    html += '</div>'
    mainContentDiv.insertAdjacentHTML('beforeend', html)
}


async function load_start_form() {
    const response = await fetch(`/api/render_dashboard_start_form`);
    const html = await response.text();
    mainContentDiv.innerHTML = '';
    mainContentDiv.insertAdjacentHTML('beforeend', html);
}

async function buildDashboardHTML() {
    //const response = await fetch(`/api/render_dashboard?year=${year}&make=${make}&model=${model}`);
    const response = await fetch('/api/render_dashboard', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ 
            year: year,
            make: make,
            model: model,
        })
    });
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
        load_dashboard_saves()
    } else {
        await load_start_form()
    };
};

initalize_dashboard()