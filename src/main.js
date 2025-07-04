const ordenarPor = document.getElementById("ordenarPor");

function aplicarOrden() {
  let personajesOrdenados = [...characters];
  if (ordenarPor) {
    if (ordenarPor.value === "alfabetico") {
      personajesOrdenados.sort((a, b) =>
        a.character.name.localeCompare(b.character.name)
      );
    } else if (ordenarPor.value === "id") {
      personajesOrdenados.sort(
        (a, b) => a.character.mal_id - b.character.mal_id
      );
    }
  }
  renderCharacters(personajesOrdenados);
}

if (ordenarPor) ordenarPor.addEventListener("change", aplicarOrden);
const container = document.getElementById("character-container");
const searchInput = document.getElementById("search");

let characters = [];

async function fetchCharacters() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/anime/20/characters");
    const data = await res.json();
    characters = data.data;
    renderCharacters(characters);
  } catch (error) {
    console.error("ERROR:", error);
    container.innerHTML = "<p>Error al cargar personajes.</p>";
  }
}

function renderCharacters(data) {
  container.innerHTML = "";
  data.forEach((char, idx) => {
    const card = document.createElement("div");
    card.classList.add("card");

    let voiceActors = "";
    if (char.voice_actors && char.voice_actors.length > 0) {
      voiceActors = `<p><strong>Actores de voz:</strong></p><ul>`;
      char.voice_actors.forEach((va) => {
        voiceActors += `<li>${va.person.name} (${va.language}) <a href="${va.person.url}" target="_blank">Perfil</a></li>`;
      });
      voiceActors += `</ul>`;
    }

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const yaEsFavorito = favoritos.some(
      (f) => f.character.mal_id === char.character.mal_id
    );

    card.innerHTML = `
      <h2>${char.character.name}</h2>
      <img src="${char.character.images.jpg.image_url}" alt="${
      char.character.name
    }" />
      <button class="btn-favorito" data-idx="${idx}">${
      yaEsFavorito ? "Quitar de Favoritos" : "Agregar a Favoritos"
    }</button>
      <button class="btn-mas-info" data-idx="${idx}">Más información</button>
      <div class="extra-info" style="display:none;">
        <p><strong>Rol:</strong> ${char.role}</p>
        <p><a href="${
          char.character.url
        }" target="_blank">Ver en MyAnimeList</a></p>
        <p><strong>ID:</strong> ${char.character.mal_id}</p>
        ${voiceActors}
        <button class="btn-ocultar-info">Ocultar información</button>
      </div>
    `;

    const toggleBtn = card.querySelector(".btn-mas-info");
    const extraInfo = card.querySelector(".extra-info");
    const hideBtn = card.querySelector(".btn-ocultar-info");
    const favBtn = card.querySelector(".btn-favorito");

    toggleBtn.addEventListener("click", () => {
      extraInfo.style.display = "block";
      toggleBtn.style.display = "none";
    });
    hideBtn.addEventListener("click", () => {
      extraInfo.style.display = "none";
      toggleBtn.style.display = "inline-block";
    });

    favBtn.addEventListener("click", () => {
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      const idxFav = favoritos.findIndex(
        (f) => f.character.mal_id === char.character.mal_id
      );
      if (idxFav === -1) {
        favoritos.push(char);
        favBtn.textContent = "Quitar de Favoritos";
      } else {
        favoritos.splice(idxFav, 1);
        favBtn.textContent = "Agregar a Favoritos";
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filtered = characters.filter((c) =>
    c.character.name.toLowerCase().includes(searchValue)
  );
  renderCharacters(filtered);
});

fetchCharacters();
