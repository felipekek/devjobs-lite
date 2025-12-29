(function () {
  const container = document.getElementById("jobDetails");

  function getJobIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
  }

  function renderJob(job) {
    if (!job) {
      container.innerHTML = `
        <div class="empty">
          Vaga não encontrada.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <article class="job-card">
        <h2 class="job-title">${job.titulo}</h2>
        <p class="job-company">${job.empresa}</p>

        <div class="job-meta">
          <span class="pill">${job.local}</span>
          <span class="pill">${job.nivel}</span>
        </div>

        <div class="job-tags">
          ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>

        <p class="job-desc">${job.descricao}</p>
      </article>
    `;
  }

  function init() {
    if (!window.JOBS) {
      container.innerHTML = `<div class="empty">Erro ao carregar vaga.</div>`;
      return;
    }

    const jobId = getJobIdFromURL();
    const job = window.JOBS.find(j => j.id === jobId);

    renderJob(job);
  }

  init();
})();
