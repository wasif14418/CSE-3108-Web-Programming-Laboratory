// ---- Constants ----
const API_BASE = "https://pokeapi.co/api/v2/pokemon/";

// ---- DOM references ----
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultArea = document.getElementById("result-area");
const quickButtons = document.querySelectorAll(".quick-btn");

// ---- Event listeners ----
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const name = input.value.trim().toLowerCase();
  if (name) {
    searchPokemon(name);
  }
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    input.value = name;
    searchPokemon(name);
  });
});

// ---- Main search flow ----
async function searchPokemon(name) {
  showLoading();

  try {
    const response = await fetch(API_BASE + encodeURIComponent(name));

    if (!response.ok) {
      // 404 = Pokémon not found, anything else = server/network issue
      throw new Error(
        response.status === 404
          ? `"${name}" is not a recognized Pokémon.`
          : `Request failed (status ${response.status}).`
      );
    }

    const data = await response.json();
    const pokemon = extractPokemonData(data);
    renderCard(pokemon);

  } catch (error) {
    // Covers both the thrown errors above and network failures (fetch rejects)
    showError(error.message || "Something went wrong. Please try again.");
  }
}

// ---- Transform raw API data into only what the card needs ----
function extractPokemonData(data) {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      "",
    types: data.types.map((t) => t.type.name),
    height: data.height / 10, // API gives decimetres -> convert to metres
    weight: data.weight / 10, // API gives hectograms -> convert to kilograms
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    abilities: data.abilities.slice(0, 2).map((a) => a.ability.name),
  };
}

// ---- Render: loading state ----
function showLoading() {
  resultArea.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
}

// ---- Render: error state ----
function showError(message) {
  resultArea.innerHTML = `
    <div class="error-box">
      <strong>Oops!</strong>
      <p>${message}</p>
    </div>
  `;
}

// ---- Render: success state (the card) ----
function renderCard(pokemon) {
  const primaryType = pokemon.types[0];
  const maxStat = 255; // roughly the highest possible base stat, used to scale bars

  const typeBadges = pokemon.types
    .map((type) => `<span class="type-badge">${type}</span>`)
    .join("");

  const statRows = pokemon.stats
    .map((stat) => {
      const percent = Math.min(100, (stat.value / maxStat) * 100);
      return `
        <div class="stat-row">
          <span class="stat-label">${formatStatName(stat.name)}</span>
          <span class="stat-bar-bg">
            <span class="stat-bar-fill" style="width:${percent}%"></span>
          </span>
          <span class="stat-value">${stat.value}</span>
        </div>
      `;
    })
    .join("");

  const abilityBadges = pokemon.abilities
    .map((ability) => `<span class="ability-badge">${ability.replace("-", " ")}</span>`)
    .join("");

  resultArea.innerHTML = `
    <div class="card type-${primaryType}">
      <div class="card-header">
        <span class="card-name">${pokemon.name}</span>
        <span class="card-id">#${String(pokemon.id).padStart(3, "0")}</span>
      </div>

      <div class="type-badges">${typeBadges}</div>

      <div class="card-image-wrap">
        <img src="${pokemon.image}" alt="${pokemon.name}">
      </div>

      <div class="info-row">
        <span>Height: ${pokemon.height} m</span>
        <span>Weight: ${pokemon.weight} kg</span>
      </div>

      <div class="stats-title">Base Stats</div>
      ${statRows}

      <div class="abilities-title">Abilities</div>
      <div class="abilities-list">${abilityBadges}</div>
    </div>
  `;
}

// ---- Small helper to make stat names readable ----
function formatStatName(name) {
  const nameMap = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return nameMap[name] || name;
}
