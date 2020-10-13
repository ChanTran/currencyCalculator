/**
Chan Le
10/12/20
**/

/**
Add event listeners to both the input boxes and the dropdown menus
**/
function AddEventListeners()
{
	fromAmt.addEventListener("input", firstToSecondExchange);
	firstCurrency.addEventListener("change", firstToSecondExchange);
	
	toAmt.addEventListener("input", secondToFirstExchange);
	secondCurrency.addEventListener("change", firstToSecondExchange);
}

/**
Grabs all the currencies that exists and puts it into an array to sort.
Populates the two select elements with option elements of the different currencies
**/
function fetchCurrencies() 
{
	let selectFrom = document.getElementById("fromCurrency");
	let selectTo = document.getElementById("toCurrency");
	try 
	{
		fetch(BASE_URL)
		.then(result => result.json())
		.then(function(data)
		{
			let base = data.base;
			let currencies = data.rates;
			let arr = [];
			
			arr.push(base);
			for(let country in currencies)
			{
				arr.push(country);
			}
			arr.sort();
			console.log(arr);
			for(let i = 0; i < arr.length; i++)
			{
				let options = document.createElement("option");
				options.value = arr[i];
				options.innerHTML = arr[i];
				selectFrom.appendChild(options);
				
				options = document.createElement("option");
				options.value = arr[i];
				options.innerHTML = arr[i];
				selectTo.appendChild(options);
			}
		})
	}
	catch(e)
	{
		console.log(e);
	}
}

/**
Grabs the rates in the scenario where the user changes the first input box or first drop down menu
Grabs cached data pulled from API if the base currency did not change.
**/
function firstToSecondExchange()
{
	let fromCurrency = firstCurrency.value;
	let toCurrency = secondCurrency.value;
	let rate = 0;
	fromAmt.value = Math.round(fromAmt.value*100)/100; // limit input to two decimal places by rounding
	
	if(toAmt.value>=0 && fromAmt.value>=0 && cachedData != null && cachedData.base == fromCurrency)
	{
		rate = cachedData.rates[toCurrency];
		toAmt.value = (fromAmt.value * rate).toFixed(2);
		convertText.innerHTML = fromAmt.value + " " + fromCurrency + " equals " + 
							toAmt.value + " " + toCurrency;
	}
	else if(toAmt.value>=0 && fromAmt.value>=0)
	{
		try
		{
			fetch(BASE_URL+"?base="+fromCurrency)
			.then(result => result.json())
			.then(function(data)
				{
					cachedData = data;
					rate = cachedData.rates[toCurrency];
					toAmt.value = (fromAmt.value * rate).toFixed(2);
					convertText.innerHTML = fromAmt.value + " " + fromCurrency + " equals " + 
							toAmt.value + " " + toCurrency;
				})
			}
		catch(e)
		{
			console.log(e);
		}		
	}
}

/**
Works the same way as firstToSecondExchange, except that the second input box is now our base currency
in the scenario where the user chooses to change the second drop down option/input box.
**/
function secondToFirstExchange()
{
	let fromCurrency = firstCurrency.value;
	let toCurrency = secondCurrency.value;
	let rate = 0;
	fromAmt.value = Math.round(fromAmt.value*100)/100; // limit input to two decimal places by rounding
	
	if(toAmt.value>=0 && fromAmt.value>=0 && cachedData != null && cachedData.base == fromCurrency)
	{
		rate = cachedData.rates[toCurrency];
		fromAmt.value = (toAmt.value / rate).toFixed(2);
		convertText.innerHTML = fromAmt.value + " " + fromCurrency + " equals " + 
							toAmt.value + " " + toCurrency;
	}
	else if(toAmt.value>=0 && fromAmt.value>=0)
	{
		try
		{
			fetch(BASE_URL+"?base="+fromCurrency)
			.then(result => result.json())
			.then(function(data)
				{
					cachedData = data;
					rate = cachedData.rates[toCurrency];
					fromAmt.value = (toAmt.value / rate).toFixed(2);
					convertText.innerHTML = fromAmt.value + " " + fromCurrency + " equals " + 
							toAmt.value + " " + toCurrency;
				})
			}
		catch(e)
		{
			console.log(e);
		}		
	}
}

const BASE_URL = "https://api.exchangeratesapi.io/latest";
//Second drop down and input box
var secondCurrency = document.getElementById("toCurrency");
var toAmt = document.getElementById("toAmt");

//First drop down and input box
var fromAmt = document.getElementById("fromAmt");
var firstCurrency = document.getElementById("fromCurrency");

var convertText = document.getElementById("convertText");
var cachedData = null;

function main()
{
	fetchCurrencies();
	AddEventListeners();
}


main();