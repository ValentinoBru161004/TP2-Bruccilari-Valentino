const container = document.getElementById("favoritos-container");
const searchInput = document.getElementById("search");
const filtroRol = document.getElementById("filtroRol");
const filtroId = document.getElementById("filtroId");
const ordenarPor = document.getElementById("ordenarPor");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let favoritosFiltrados = [...favoritos];

function aplicarFiltrosYOrden() {
  favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritosFiltrados = [...favoritos];
  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  if (searchValue) {
    favoritosFiltrados = favoritosFiltrados.filter(c => c.character.name.toLowerCase().includes(searchValue));
  }
  if (filtroRol && filtroRol.value) {
    favoritosFiltrados = favoritosFiltrados.filter(c => c.role === filtroRol.value);
  }
  if (filtroId && filtroId.value) {
    if (filtroId.value === 'menor') {
      favoritosFiltrados = favoritosFiltrados.filter(c => c.character.mal_id < 10000);
    } else if (filtroId.value === 'mayor') {
      favoritosFiltrados = favoritosFiltrados.filter(c => c.character.mal_id >= 10000);
    }
  }
  if (ordenarPor) {
    if (ordenarPor.value === 'alfabetico') {
      favoritosFiltrados.sort((a, b) => a.character.name.localeCompare(b.character.name));
    } else if (ordenarPor.value === 'id') {
      favoritosFiltrados.sort((a, b) => a.character.mal_id - b.character.mal_id);
    }
  }
  renderFavoritos();
}

function renderFavoritos() {
  container.innerHTML = "";
  if (favoritosFiltrados.length === 0) {
    container.innerHTML = `
      <div class="no-favs-msg">
        <h2>No tienes personajes favoritos</h2>
        <img src="../src/styles/images/logosinfondo.png" alt="WikiNobi" />
        <p>Agrega personajes desde el inicio para verlos aquí.</p>
      </div>
    `;
  } else {
    favoritosFiltrados.forEach((char, idx) => {
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
      card.innerHTML = `
        <h2>${char.character.name}</h2>
        <img src="${char.character.images.jpg.image_url}" alt="${char.character.name}" />
        <button class="btn-favorito" style="visibility:hidden;height:0;padding:0;margin:0;border:none;">(placeholder)</button>
        <button class="btn-mas-info" data-idx="${idx}">Más información</button>
        <div class="extra-info" style="display:none;">
          <p><strong>Rol:</strong> ${char.role}</p>
          <p><a href="${char.character.url}" target="_blank">Ver en MyAnimeList</a></p>
          <p><strong>ID:</strong> ${char.character.mal_id}</p>
          ${voiceActors}
          <button class="btn-ocultar-info">Ocultar información</button>
        </div>
      `;
      const toggleBtn = card.querySelector(".btn-mas-info");
      const extraInfo = card.querySelector(".extra-info");
      const hideBtn = card.querySelector(".btn-ocultar-info");
      toggleBtn.addEventListener("click", () => {
        extraInfo.style.display = "block";
        toggleBtn.style.display = "none";
      });
      hideBtn.addEventListener("click", () => {
        extraInfo.style.display = "none";
        toggleBtn.style.display = "inline-block";
      });
      container.appendChild(card);
    });
  }
}

if (searchInput) searchInput.addEventListener("input", aplicarFiltrosYOrden);
if (filtroRol) filtroRol.addEventListener("change", aplicarFiltrosYOrden);
if (filtroId) filtroId.addEventListener("change", aplicarFiltrosYOrden);
if (ordenarPor) ordenarPor.addEventListener("change", aplicarFiltrosYOrden);

aplicarFiltrosYOrden();
