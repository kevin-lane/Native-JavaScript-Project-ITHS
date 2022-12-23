let url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';
let selector = document.querySelector('#currency-selector');
let list = document.querySelector('#top-ten-list');
let myChart = document.getElementById('top-ten-chart').getContext('2d');
let currencyChart = null; //Set the chart to null initially

fetch(url + '.json')
  .then(response => response.json())
  .then(result => {
    let resArr = Object.entries(result);
    let currencies = Object.values(result);
    currencies = currencies.sort();

    //Add all currencies to dropdown list
    let x = 0;
    for (let i = 0; i < currencies.length; i++) {
      /*Show the chosen value which is stored in LocalStorage after refresh
      and that user has chosen a value in dropdown menu */
      if(localStorage.getItem('index') !== -1 && x === 0) {
        selector.innerHTML = `<option id="currency-option" selected>${localStorage.getItem('item')}</option>`;
        x++;
      }
      else{
        selector.innerHTML += `<option id="currency-option">${currencies[i]}</option>`;
      }
    }

    selector.addEventListener('change', (e) => {
      //Remove list items every time we choose new value in dropdown
      list.innerHTML = '';

      let selectedItem = selector.value;
      let selectedIndex = selector.selectedIndex;

      //Set index and item to LocalStorage
      localStorage.setItem('item', selectedItem);
      localStorage.setItem('index', selectedIndex);

      const chosenCurrency = resArr.filter(function([code, name]){
        return name === selector.value;
      });

      let chosenCurrencyCode = chosenCurrency[0][0];
      fetch(url + '/' + chosenCurrencyCode + '.json')
        .then(response => response.json())
        .then(result => {
          let currVal = Object.values(result);
          let convertedToValues = currVal[1];
          let convertedToValuesArray = Object.entries(convertedToValues)
          let filteredCurr = convertedToValuesArray.filter(curr => {
            return curr[0] === 'eur' || curr[0] === 'usd' || curr[0] === 'gbp' || curr[0] === 'chf' ||
                   curr[0] === 'aud' || curr[0] === 'nzd' || curr[0] === 'jpy' || curr[0] === 'krw' ||
                   curr[0] === 'cad' || curr[0] === 'kwd';
          })

          //Populate the list
          for (let i = 0; i < filteredCurr.length; i++) {
            //Get amount and currency units
            const amount = filteredCurr[i][1];
            const unit = filteredCurr[i][0];
            //Used child nodes here by appending a li as a child to list
            let currencyItem = list.appendChild(document.createElement('li'));
            currencyItem.className = 'currency-list-item';
            //Append values to the appended List item
            currencyItem.textContent = `${amount.toFixed(3)}
                                        ${unit.toUpperCase()}`;

            //Send filtered currencies to the method that handles the Chart to get values
            chartHandler(filteredCurr);
          }
        })
    })
  })

  //Function that handles the chart
  function chartHandler(currencyValues){
    //Make array for unit and amount to easier separate them
    let units = [];
    let amounts = [];
    for (let i = 0; i < currencyValues.length; i++) {
      //Populate the arrays with units and values to populate to Chart
      units.push(currencyValues[i][0])
      amounts.push(currencyValues[i][1]);
    }

    if (currencyChart !== null) {
      currencyChart.destroy();
    }
    currencyChart = new Chart(myChart, {
      type: 'bar',
      data:{
        labels: units,
        datasets:[{
          label: 'Amount',
          data: amounts
        }]
      },
      options:{}
    });
  }
