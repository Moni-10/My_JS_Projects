// Define base URL for currency API
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Function to populate dropdowns with currency codes
const populateDropdowns = () => {
  const dropdowns = document.querySelectorAll(".dropdown select");
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      select.appendChild(newOption);
    }
    select.addEventListener("change", () => updateFlag(select));
  }
};

// Function to update flag based on selected currency
const updateFlag = (select) => {
  let currCode = select.value;
  let countryCode = countryList[currCode];
  let img = select.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Function to update exchange rate
const updateExchangeRate = async () => {
  const fromCurr = document.querySelector(".from select").value.toLowerCase();
  const toCurr = document.querySelector(".to select").value.toLowerCase();
  const amount = parseFloat(document.querySelector(".amount input").value) || 1;

  try {
    const response = await fetch(`${BASE_URL}/${fromCurr}/${toCurr}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const rate = data[toCurr];
    if (rate === undefined) {
      throw new Error(`Exchange rate for ${fromCurr.toUpperCase()} to ${toCurr.toUpperCase()} not available`);
    }
    const finalAmount = amount * rate;
    document.querySelector(".msg").innerText = `${amount} ${fromCurr.toUpperCase()} = ${finalAmount.toFixed(2)} ${toCurr.toUpperCase()}`;
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(".msg").innerText = "Error fetching exchange rate. Please try again later.";
  }
};

// Event listener for conversion button
document.querySelector("form button").addEventListener("click", (event) => {
  event.preventDefault();
  updateExchangeRate();
});

// Event listener for window load
window.addEventListener("load", () => {
  populateDropdowns();
  updateExchangeRate();
});
