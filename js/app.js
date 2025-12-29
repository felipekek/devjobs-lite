(function () {
  const jobsList = document.getElementById("jobsList");
  const searchInput = document.getElementById("searchInput");
  const locationFilter = document.getElementById("locationFilter");

  function getFavorites() {
    try {
      const raw = localStorage.getItem("devjobs_favorites");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setFavorites(favs) {
    localStorage.setItem("devjobs_favorites", JSON.stringify(favs));
  }

  function isFavorite(jobId) {
    return getFavorites().includes(jobId);
  }

  function toggleFavorite(jobId) {
    const favs = getFavorites();
    const exists = favs.includes(jobId);

    const newFavs = exists ? favs.filter((id) => id !== jobId) : [...favs, jobId];
    setFavorites(newFavs);

    applyFiltersAndRender();
  }

  function createTag(tagText) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tagText;
    return span;
  }

  function renderJobs(list) {
    jobsList.innerHTML = "";

    if (!list || list.length === 0) {
      jobsList.innerHTML = `<div class="empty">Nenhuma vaga encontrada.</div>`;
      return;
    }

    list.forEach((job) => {
      const card = document.createElement("article");
      card.className = "job-card";

      const favActive = isFavorite(job.id);

      card.innerHTML = `
        <div class="job-card-top">
          <div>
            <h2 class="job-title">${job.titulo}</h2>
            <p class="job-company">${job.empresa}</p>
          </div>

          <button class="fav-btn ${favActive ? "active" : ""}" aria-label="Favoritar">
            ${favActive ? "★" : "☆"}
          </button>
        </div>

        <div class="job-meta">
          <span class="pill">${job.local}</span>
          <span class="pill">${job.nivel}</span>
        </div>

        <div class="job-tags"></div>

        <p class="job-desc">${job.descricao}</p>

        <div class="job-actions">
          <a class="btn" href="./vaga.html?id=${job.id}">Ver detalhes</a>
        </div>
      `;

      const tagsWrap = card.querySelector(".job-tags");
      job.tags.forEach((t) => tagsWrap.appendChild(createTag(t)));

      const favBtn = card.querySelector(".fav-btn");
      favBtn.addEventListener("click", () => toggleFavorite(job.id));

      jobsList.appendChild(card);
    });
  }

  function applyFiltersAndRender() {
    const text = (searchInput.value || "").trim().toLowerCase();
    const local = locationFilter.value;

    const filtered = (window.JOBS || []).filter((job) => {
      const matchesText =
        job.titulo.toLowerCase().includes(text) ||
        job.empresa.toLowerCase().includes(text) ||
        (job.tags || []).join(" ").toLowerCase().includes(text);

      const matchesLocal = !local || job.local === local;

      return matchesText && matchesLocal;
    });

    renderJobs(filtered);
  }

  function init() {
    if (!window.JOBS) {
      jobsList.innerHTML = `<div class="empty">Erro: lista de vagas não encontrada (data.js).</div>`;
      return;
    }

    searchInput.addEventListener("input", applyFiltersAndRender);
    locationFilter.addEventListener("change", applyFiltersAndRender);

    applyFiltersAndRender();
  }

  init();
})();
