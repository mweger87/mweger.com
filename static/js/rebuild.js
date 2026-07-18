
let mainContentDiv = document.getElementById('main-content');
let saveHeaderDiv = document.getElementById('save-header');
let setupFormDiv = document.getElementById('setup-form');
let selectSaveDiv = document.getElementById('select-save');

let currentSaves = [];
let rowID = '';
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
    currentSaves = data;
    let html = `
    <h2>Select your save</h2>
    <div class="card-container">
    `;
    for (const row of data) {
        html += ` 
            <div 
            class="card"
            onClick=load_save(${row.saveID}); 
            >
                <p>Year: ${row.year}</p>
                <p>Make: ${row.make}</p>
                <p>Model: ${row.model}</p>
            </div>
        `
    }
    html += '</div>'
    selectSaveDiv.insertAdjacentHTML('beforeend', html)
}

async function load_shopping_cart() {
    let resposne = await fetch(`/api/get_shopping_cart`, {
        mehtod: "POST",
        headers: { "Content-type": "application/json" },
        body: json.stringify({ rowID: rowID })
    })
    const data = response.json();
    console.log(data);
}

async function load_header() {
    let html = `
    <h2>${year} ${make} ${model}</h2>
    `
    saveHeaderDiv.insertAdjacentHTML('beforeend', html)
}

async function load_save(saveID) {
    selectSaveDiv.innerHTML = '';
    const save = currentSaves.find(s => s.saveID === saveID)
    year = save.year;
    make = save.make;
    model = save.model;
    rowID = save.saveID;
    await load_dashboard();
}


async function load_start_form() {
    const response = await fetch(`/api/render_dashboard_start_form`);
    const html = await response.text();
    setupFormDiv.insertAdjacentHTML('beforeend', html);
}

async function saveStartForm() {
    year = document.getElementById('year-input').value;
    make = document.getElementById('make-input').value;
    model = document.getElementById('model-input').value;

    if (year != '' && make != '' && model != '') {
        if (/^\d+$/.test(year)) {
            document.getElementById('start-form-error-text').innerText = ''
            setupFormDiv.innerHTML = '';
            await load_dashboard()
        } else {
            document.getElementById('start-form-error-text').innerText = 'Year must be only digits.'
        }
    } else {
        document.getElementById('start-form-error-text').innerText = 'All 3 fields are required.'
    }

}

async function load_dashboard() {
    await load_header()
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