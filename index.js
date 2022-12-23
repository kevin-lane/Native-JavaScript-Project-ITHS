var selectFrom = document.querySelector('#convert-from');
let amountInput = document.querySelector('#convert-from-input');
let exchangedOutput = document.querySelector('#convert-to-output');
var selectTo = document.querySelector('#convert-to');

let apiURL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';

//Fetches all currencies and append to dropdown lists
fetch(apiURL + '.json')
  .then((currenciesResponse) => currenciesResponse.json())
  .then((currenciesResult) => {
    let currencies = Object.values(currenciesResult);
    currencies = currencies.sort(); //Sort in alpabetical order

    //Convert currency object to Array
    let currenciesToArray = Object.entries(currenciesResult);

    //Append currencies to two dropdown lists that chooses the currencies to convert between
    for (let i = 0; i < currencies.length; i++) {
      selectFrom.innerHTML += `<option id="convert-from-option">${currencies[i]}</option>`;
      selectTo.innerHTML += `<option id="convert-to-option">${currencies[i]}</option>`;
    }

    selectFrom.addEventListener('change', (event) => {
      const chosenCurrencyFrom = currenciesToArray.filter(function([code, name]){
        return name === selectFrom.value;
      });
      let chosenCurrencyFromCode = chosenCurrencyFrom[0][0];

      fetch(apiURL + `/${chosenCurrencyFromCode}.json`)
        .then(response => response.json())
        .then(res => {
          console.log(res);
          //Currency you want to convert to
          selectTo.addEventListener('change', () => {
            const chosenCurrencyTo = currenciesToArray.filter(function([code, name]){
              return name === selectTo.value;
            })
            let chosenCurrencyToCode = chosenCurrencyTo[0][0];
            //Check from one currency to another
            fetch(apiURL + `/${chosenCurrencyFromCode}/${chosenCurrencyToCode}.json`)
              .then(response => response.json())
              .then(res => {
                let resArrKeys = Object.keys(res);
                let resArrValues = Object.values(res);
                amountInput.addEventListener('input', (e) => {
                  exchangedOutput.innerHTML = e.target.value * resArrValues[1] + ` ${resArrKeys[1].toUpperCase()}`;
                })
              })
          });
        })
    })
  })
