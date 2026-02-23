import fetchCountries from "./fetchCountries.js";

const input = document.querySelector("#search-input");
const resultRef = document.querySelector("#result");

input.addEventListener("input", _.debounce(onSearch, 500));

function onSearch(e) {
  const query = e.target.value.trim();

  clearMarkup();

  if (!query) return;

  fetchCountries(query)
    .then(handleCountries)
    .catch(handleError);
}

function handleCountries(countries) {
  if (countries.length > 10) {
    PNotify.alert({
      text: "Занадто багато збігів. Уточніть запит.",
      type: "info",
    });
    return;
  }

  if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
    return;
  }

  if (countries.length === 1) {
    renderCountryCard(countries[0]);
  }
}

function renderCountryList(countries) {
  const markup = `
    <ul class="country-list">
      ${countries.map(c => `<li>${c.name.common}</li>`).join("")}
    </ul>
  `;
  resultRef.innerHTML = markup;
}

function renderCountryCard(country) {
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";

  const markup = `
    <div class="country-card">
      <h2>${country.name.common}</h2>
      <p><strong>Столиця:</strong> ${country.capital?.[0] ?? "—"}</p>
      <p><strong>Населення:</strong> ${country.population}</p>
      <p><strong>Мови:</strong> ${languages}</p>
      <img src="${country.flags.svg}" alt="flag of ${country.name.common}" />
    </div>
  `;

  resultRef.innerHTML = markup;
}

function handleError() {
  PNotify.alert({
    text: "Країну не знайдено.",
    type: "error",
  });
}

function clearMarkup() {
  resultRef.innerHTML = "";
}