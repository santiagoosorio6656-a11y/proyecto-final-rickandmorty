// ================================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
// ================================================

// Escribe tu nombre y código estudiantil exactos.
const developerName = "Kevin Santiago Osorio Gallegi";
const developerId = "20211020049";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los personajes favoritos.
let favoritesArray = [];
let currentData = [];
let currentSection = "character";

// ================================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ================================================
const dataContainer = document.getElementById("dataContainer");
const btnCharacters = document.getElementById("btnCharacters");
const btnLocations = document.getElementById("btnLocations");
const btnEpisodes = document.getElementById("btnEpisodes");
const btnFavorites = document.getElementById("btnFavorites");
const mainFooter = document.getElementById("mainFooter");

// ================================================
// 3. INYECCIÓN DINÁMICA DE LA FIRMA (FOOTER)
// ================================================
mainFooter.innerHTML = `
    <p>Developed by <strong>${developerName}</strong></p>
    <p>ID: ${developerId}</p>
    <p>Rick and Morty Explorer | Proyecto final</p>
`;

// ================================================
// 4. FUNCIÓN PARA OBTENER DATOS (ASINCRONÍA)
// ================================================
// Recibe el endpoint y consulta la API.
async function fetchData(endpoint) {
    dataContainer.innerHTML =
        '<p class="loading-text">Loading multiverse data...</p>';

    try {
        const response = await fetch(`${baseUrl}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error("Error al consultar la API:", error);

        dataContainer.innerHTML =
            '<p class="loading-text" style="color:red;">Connection error. Try again.</p>';

        return null;
    }
}

// ================================================
// 5. FUNCIONES DE RENDERIZADO (DOM)
// ================================================

// Función para dibujar personajes.
function renderCharacters(charactersData) {
    currentData = charactersData;
    dataContainer.innerHTML = "";

    if (charactersData.length === 0) {
        dataContainer.innerHTML =
            '<p class="loading-text">No characters found.</p>';
        return;
    }

    charactersData.forEach((character) => {
        const statusColor =
            character.status === "Alive" ? "lime" :
            character.status === "Dead" ? "red" : "gray";

        const isFavorite = favoritesArray.some(
            (favorite) => favorite.id === character.id
        );

        const cardHTML = `
            <article class="data-card">
                <img src="${character.image}"
                     alt="${character.name}"
                     loading="lazy">

                <div class="card-info">
                    <h2>${character.name}</h2>

                    <p class="info-label">
                        Status:
                        <span style="color:${statusColor}">
                            ${character.status}
                        </span>
                    </p>

                    <p class="info-label">
                        Species: ${character.species}
                    </p>

                    <p class="info-label">
                        Origin: ${character.origin.name}
                    </p>

                    <button class="btn-add-fav"
                        data-character-id="${character.id}">
                        ${isFavorite
                            ? "★ Remove from Favorites"
                            : "★ Add to Favorites"}
                    </button>
                </div>
            </article>
        `;

        dataContainer.innerHTML += cardHTML;
    });
}

// Función para dibujar ubicaciones.
function renderLocations(locationsData) {
    currentData = locationsData;
    dataContainer.innerHTML = "";

    if (locationsData.length === 0) {
        dataContainer.innerHTML =
            '<p class="loading-text">No locations found.</p>';
        return;
    }

    locationsData.forEach((location) => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>${location.name}</h2>

                    <p class="info-label">
                        Type: ${location.type}
                    </p>

                    <p class="info-label">
                        Dimension: ${location.dimension}
                    </p>

                    <p class="info-label">
                        Residents: ${location.residents.length}
                    </p>
                </div>
            </article>
        `;
    });
}

// Función para dibujar episodios.
function renderEpisodes(episodesData) {
    currentData = episodesData;
    dataContainer.innerHTML = "";

    if (episodesData.length === 0) {
        dataContainer.innerHTML =
            '<p class="loading-text">No episodes found.</p>';
        return;
    }

    episodesData.forEach((episode) => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>${episode.name}</h2>

                    <p class="info-label">
                        Code: ${episode.episode}
                    </p>

                    <p class="info-label">
                        Air Date: ${episode.air_date}
                    </p>

                    <p class="info-label">
                        Characters: ${episode.characters.length}
                    </p>
                </div>
            </article>
        `;
    });
}

// ================================================
// 6. PERSISTENCIA DE FAVORITOS (LOCALSTORAGE)
// ================================================

// Agrega o elimina un personaje de favoritos.
function addToFavorites(characterId) {
    const character = currentData.find(
        (item) => item.id === characterId
    );

    if (!character) return;

    const existingIndex = favoritesArray.findIndex(
        (favorite) => favorite.id === characterId
    );

    if (existingIndex !== -1) {
        favoritesArray.splice(existingIndex, 1);
    } else {
        favoritesArray.push({
            id: character.id,
            name: character.name,
            image: character.image,
            status: character.status,
            species: character.species,
            origin: character.origin
        });
    }

    // Guardamos los favoritos en el navegador.
    localStorage.setItem(
        "myFavCharacters",
        JSON.stringify(favoritesArray)
    );

    if (currentSection === "favorites") {
        renderFavorites();
    } else {
        renderCharacters(currentData);
    }
}

// Muestra los favoritos guardados.
function renderFavorites() {
    currentSection = "favorites";
    currentData = [...favoritesArray];
    dataContainer.innerHTML = "";

    if (favoritesArray.length === 0) {
        dataContainer.innerHTML =
            '<p class="loading-text">No favorites added yet.</p>';
        return;
    }

    favoritesArray.forEach((favorite) => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <img src="${favorite.image}"
                     alt="${favorite.name}"
                     loading="lazy">

                <div class="card-info">
                    <h2>★ ${favorite.name}</h2>

                    <p class="info-label">
                        Status: ${favorite.status}
                    </p>

                    <button class="btn-add-fav"
                        data-character-id="${favorite.id}">
                        Remove from Favorites
                    </button>
                </div>
            </article>
        `;
    });
}

// ================================================
// 7. MANEJO DE EVENTOS DEL MENÚ
// ================================================

// Resalta el botón seleccionado.
function setActiveButton(activeButton) {
    [
        btnCharacters,
        btnLocations,
        btnEpisodes,
        btnFavorites
    ].forEach((button) => {
        button.classList.remove("active");
    });

    activeButton.classList.add("active");
}

// Evento: personajes.
btnCharacters.addEventListener("click", async () => {
    setActiveButton(btnCharacters);
    currentSection = "character";

    const data = await fetchData("/character");

    if (data !== null) {
        renderCharacters(data);
    }
});

// Evento: ubicaciones.
btnLocations.addEventListener("click", async () => {
    setActiveButton(btnLocations);
    currentSection = "location";

    const data = await fetchData("/location");

    if (data !== null) {
        renderLocations(data);
    }
});

// Evento: episodios.
btnEpisodes.addEventListener("click", async () => {
    setActiveButton(btnEpisodes);
    currentSection = "episode";

    const data = await fetchData("/episode");

    if (data !== null) {
        renderEpisodes(data);
    }
});

// Evento: favoritos.
btnFavorites.addEventListener("click", () => {
    setActiveButton(btnFavorites);
    renderFavorites();
});

// Detecta los clics en los botones de favoritos.
dataContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-character-id]");

    if (button) {
        addToFavorites(Number(button.dataset.characterId));
    }
});

// ================================================
// 8. INICIO AUTOMÁTICO
// ================================================

// Recuperamos los favoritos guardados anteriormente.
try {
    const previousFavs = localStorage.getItem("myFavCharacters");

    if (previousFavs) {
        favoritesArray = JSON.parse(previousFavs);

        if (!Array.isArray(favoritesArray)) {
            favoritesArray = [];
        }
    }
} catch (error) {
    console.error("Error al recuperar favoritos:", error);
    favoritesArray = [];
}

// Simulamos un clic para mostrar personajes al iniciar.
btnCharacters.click();