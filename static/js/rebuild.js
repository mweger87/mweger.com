
let make = '';
let model = '';
let year = '';



let form = `
<h1>Setup</h1>
<p>No save was found for your account.</p>
    <form id='start-form' class='my-form'>
    <div>
    <label class='my-form-label'>Make: </label>
    <input id='make-input'>
    </div>
    <div>
    <label>Model: </label>
    <input id='model-input'>
    </div>
    <div>
    <label>Year: </label>
    <input id='year-input'>
    </div>
    <button onClick=saveStartForm() type='button'>Save</button>
    <p style="color: red; margin: 4px auto; text-align: center;" id='start-form-error-text'></p>
    </form>
`

async function saveStartForm() {
    year = document.getElementById('year-input').value;
    make = document.getElementById('make-input').value;
    model = document.getElementById('model-input').value;

    if (year != '' && make != '' && model != '') {
        if (/^\d+$/.test(year)) {
            document.getElementById('start-form-error-text').innerText = ''
            alert("passed");
        } else {
            document.getElementById('start-form-error-text').innerText = 'Year must be only digits.'
        }
    } else {
        document.getElementById('start-form-error-text').innerText = 'All 3 fields are required.'
    }

}



async function initalize_dashboard() {
    const user = window.user;
    const userID = window.userID;
    let mainContentDiv = document.getElementById('main-content');

    if (user) {
        mainContentDiv.insertAdjacentHTML('beforeend', `<h1>loading content..${userID}</h1> `);
    } else {
        mainContentDiv.insertAdjacentHTML('beforeend', form);
    };
};

initalize_dashboard()