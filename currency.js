/**
Chan Le
10/12/20
**/

/**
Add event listeners to both the input boxes and the dropdown menus
**/
function AddEventListeners()
{
	fromAmt.addEventListener("input", function() { exchange(false); });
	firstCurrency.addEventListener("change", function() { exchange(false); });
	
	toAmt.addEventListener("input", function() { exchange(true); });
	secondCurrency.addEventListener("change", function() { exchange(false); });
}

/**
Grabs all the currencies that exists and puts it into an array to sort.
Populates the two select elements with option elements of the different currencies
**/
function fetchCurrencies() 
{
	let selectFrom = document.getElementById("fromCurrency");
	let selectTo = document.getElementById("toCurrency");
	let date = document.getElementById("date");
	
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
			date.innerHTML = "Date: " + data.date;
		})
	}
	catch(e)
	{
		console.log(e);
	}
}

/**
Grabs the rates in the scenario where the user changes the input box or drop down menus
Grabs cached data pulled from API if the base currency did not change.
@param secondRow Boolean to check if input is coming from the first row of input or second row of input. We need to divide by the rate
in the case where user elects to change the second row's value.
**/
function exchange(secondRow)
{
	let fromCurrency = firstCurrency.value;
	let toCurrency = secondCurrency.value;
	let rate = 0;
	
	if(secondRow)
	{
		toAmt.value = Math.round(toAmt.value*100)/100;
	}
	else
	{
		fromAmt.value = Math.round(fromAmt.value*100)/100;
	}
	
	if(toAmt.value>=0 && fromAmt.value>=0 && cachedData != null && cachedData.base == fromCurrency)
	{
		rate = cachedData.rates[toCurrency];
		if(secondRow)
		{
			fromAmt.value = (toAmt.value / rate).toFixed(2);
		}
		else
		{
			toAmt.value = (fromAmt.value * rate).toFixed(2);
		}
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
					if(secondRow)
					{
						fromAmt.value = (toAmt.value / rate).toFixed(2);
					}
					else
					{
						toAmt.value = (fromAmt.value * rate).toFixed(2);
					}
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