
let mainContentDiv = document.getElementById('main-content');
let saveHeaderDiv = document.getElementById('save-header');
let setupFormDiv = document.getElementById('setup-form');
let selectSaveDiv = document.getElementById('select-save');
let shoppingCartDiv = document.getElementById('shopping-cart');

let currentSaves = [];
let shoppingcart = [];
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
    await get_shopping_cart();
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



async function get_shopping_cart() {
    const response = await fetch(`/api/get_shopping_cart`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ rowID: rowID })
    })
    const data = await response.json();
    for (const row of data) {
        console.log("row: ", row)
    }
    return data;
}

async function load_shopping_cart() {
    shoppingcart = await get_shopping_cart();
    let buttonIDs = [];
    html = `

    <table>
        <tr class='cart-row'>
            <th>Item</th>
            <th>Link</th>
            <th>Actions</th>
        </tr>
    `;
    for (const item of shoppingcart) {
        html += `
        <tr class='cart-row'>
            <td>${item.itemName}</td>
            <td><a href="${item.link}" target="_blank">Link</a></td>
            <td><button id="edit-button-${item.itemID}" class='basic-button'>Edit</button></td>
        </tr>
        `;
        buttonIDs.push(item.itemID);

    }
    html += `
    </table>
    </div>
    `;
    shoppingCartDiv.style.display = 'block'
    shoppingCartDiv.insertAdjacentHTML('beforeend', html);
    await initalizeActionButtons(buttonIDs);

}

async function initalizeActionButtons(buttonIDs) {
    console.log("Button ids: ", buttonIDs)
    for (const id of buttonIDs) {
        let button = document.getElementById(`edit-button-${id}`);
        button.onclick = function() {
            var modal = document.getElementById('edit-item-modal')
            var span = document.getElementsByClassName("close")[0];
            modal.style.display = "block";


            var modalContentDiv = document.getElementById('edit-item-modal-content')

            html = `
                <span class="close">&times;</span>
                <p>Edit item ${id}</p>
            `
            modalContentDiv.innerHTML = html;





            span.onclick = function() {
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    }
}

async function openAddItem() {
    var modal = document.getElementById('add-item-modal')
    var btn = document.getElementById('add-item-button')
    var span = document.getElementsByClassName("close")[0];
    


    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

async function load_dashboard() {
    await load_header();
    await load_shopping_cart();
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