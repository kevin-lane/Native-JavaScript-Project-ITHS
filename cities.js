let list = document.querySelector('#cities-list');
let cityInput = document.querySelector('#city-input');
let idInput = document.querySelector('#id-input');
let populationInput = document.querySelector('#population-input');
let submitBtn = document.getElementById('submit-button');
let editBtn = document.getElementById('submit-edit-button');
editBtn.hidden = true;

let iconClassNames = ['bi bi-pencil-square', 'bi bi-trash'];
//GET cities
fetch('https://avancera.app/cities/').then(resp => resp.json())
.then(res => {
  console.log(res);

  for (let i = 0; i < res.length; i++) {
    //Uses AppendChild to add items to list
    let city = list.appendChild(document.createElement('li'));
    //Bootstrap icons
    let editIcon = list.appendChild(document.createElement('i'));
    let deleteIcon = list.appendChild(document.createElement('i'));
    editIcon.className = iconClassNames[0];
    deleteIcon.className = iconClassNames[1];
    city.className = 'city-list-item';
    submitBtn.addEventListener('click', function() {
      postCity();
    })
    editIcon.addEventListener('click', function() {
      editBtn.hidden = false;
      submitBtn.hidden = true;

      idInput.value = res[i].id;
      cityInput.value = res[i].name;
      populationInput.value = res[i].population;
      editBtn.addEventListener('click', function(){
        editCity(idInput.value, cityInput.value, populationInput.value);
        editBtn.hidden = true;
        submitBtn.hidden = false
      });
    })

    //Delete button with eventlistener
    deleteIcon.addEventListener('click', function(){
      deleteCity(res[i].id)
    })
    city.textContent = res[i].name;
  }
})

//POST Cities
function postCity() {
  fetch('https://avancera.app/cities/', {
    body: `{ "name": "${cityInput.value}", "population": ${populationInput.value} }`,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
  })
}

//Delete City
function deleteCity(id){
  fetch(`https://avancera.app/cities/${id}`, {
    method: 'DELETE'
  })
  .then(response => console.log(response))
}

//Edit City
function editCity(id, name, pop){
  console.log(id);
  console.log(name);
  console.log(pop);
  fetch(`https://avancera.app/cities/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      "population": Number(pop)
    })
  })
  .then(response => response.json())
  .then(result => console.log(result))
}
