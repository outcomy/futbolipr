import { assets, bottomNav, headerActions, menuCards, nextMatch, standings, tournament } from "../data/appData.js";
import { icon } from "./icons.js";

function noopAttributes(label) {
  return `type="button" data-noop="${label}" aria-label="${label}"`;
}

function actionAttributes(action) {
  return `type="button" data-action="${action.id}" aria-label="${action.label}"`;
}

function FixturePanel(card) {
  return `
    <article class="landing-panel fixture-card">
      <div class="landing-panel-body">
        <div class="landing-panel-title">
          <span class="landing-panel-media">${icon(card.icon)}</span>
          <h3>${card.title}</h3>
          <i></i>
        </div>
        <div class="fixture-list">
          <button ${noopAttributes("San Ignacio")} class="fixture-row">
            <span>SAB<br>24/05</span>
            <strong>15:30 hs</strong>
            <b>vs. San Ignacio</b>
            ${icon("arrow")}
          </button>
          <button ${noopAttributes("Union del Sur")} class="fixture-row">
            <span>DOM<br>01/06</span>
            <strong>11:00 hs</strong>
            <b>vs. Union del Sur</b>
            ${icon("arrow")}
          </button>
        </div>
        <button type="button" data-action="fixture" class="panel-more">Ver todo el fixture ${icon("arrow")}</button>
      </div>
    </article>
  `;
}

function ScorersPanel(card) {
  return `
    <article class="landing-panel scorers-card">
      <div class="landing-panel-body">
        <div class="landing-panel-title stats-title-row">
          <span class="landing-panel-media">${icon(card.icon)}</span>
          <h3 data-stats-title>${card.title}</h3>
          <i></i>
        </div>
        <div class="stats-list" data-stats-list></div>
        <button type="button" data-action="scorers" class="panel-more">Ver tabla completa ${icon("arrow")}</button>
      </div>
    </article>
  `;
}

export function Header() {
  return `
    <header class="top-header">
      <div class="brand-side">
        <img class="header-mascot" src="${assets.header.mascot}" alt="Mascota Villa Maristas" />
      </div>
      <div class="season-side">
        <img class="season-banner" src="${assets.header.season}" alt="${tournament.season} - ${tournament.values}" />
        <div class="weather-chip" data-weather-chip>
          <span class="weather-place">Mar del Plata</span>
          <span class="weather-rain">Lluvia sábado: buscando...</span>
        </div>
      </div>
      <nav class="header-actions" aria-label="Acciones visuales">
        <button type="button" data-action="admin-panel" class="admin-load-button" aria-label="Carga de datos">
          Carga de datos
        </button>
        ${headerActions.map((action) => `
          <button ${actionAttributes(action)} class="header-action">
            <span class="action-icon">
              ${action.image ? `<img class="action-icon-img" src="${action.image}" alt="" />` : icon(action.icon)}
              ${action.badge ? `<span class="badge">${action.badge}</span>` : ""}
            </span>
            <span class="action-label">${action.label}</span>
          </button>
        `).join("")}
      </nav>
    </header>
  `;
}

export function HeroSection() {
  return `
    <section class="hero-card">
      <img class="hero-image" data-hero-image src="${assets.backgrounds.hero}" alt="Villa Maristas" />
    </section>
  `;
}

function TacticalMiniField() {
  const dots = [
    [50, 50], [28, 38], [28, 62], [44, 30], [44, 70], [62, 37], [62, 63], [76, 50]
  ];

  return `
    <div class="mini-field" aria-hidden="true">
      <span class="field-line center"></span>
      <span class="field-circle"></span>
      ${dots.map(([left, top]) => `<i style="left:${left}%;top:${top}%"></i>`).join("")}
    </div>
  `;
}

export function NextMatchCard() {
  return `
    <section class="panel-card match-card">
      <div class="panel-title-row">
        <h3>${nextMatch.title}</h3>
        <div class="countdown">${nextMatch.countdown.map((part) => `<strong>${part}</strong>`).join("")}</div>
      </div>
      <div class="versus-row">
        <div class="team-side">
          <img src="${nextMatch.teamA.logo}" alt="" />
          <span>${nextMatch.teamA.name}</span>
        </div>
        <strong class="vs">VS</strong>
        <div class="team-side">
          <img src="${nextMatch.teamB.logo}" alt="" />
          <span>${nextMatch.teamB.name}</span>
        </div>
      </div>
      <div class="match-details">
        ${nextMatch.details.map((item) => `
          <div>${icon(item.icon)}<span>${item.label}</span></div>
        `).join("")}
      </div>
      <button type="button" data-action="tactical-board" class="primary-button board-button match-board-button">
        ${icon("field")}
        <span>Abrir pizarra tactica</span>
      </button>
    </section>
  `;
}

export function MenuGrid() {
  const fixtureCard = menuCards.find((card) => card.id === "fixture");
  const scorersCard = menuCards.find((card) => card.id === "goleadores");

  return `
    <section class="menu-grid" aria-label="Menu principal">
      ${FixturePanel(fixtureCard)}
      <article class="blog-panel news-panel" data-blog-panel="news">
        <div class="blog-panel-head">
          ${icon("newspaper")}
          <h3>Noticias</h3>
        </div>
        <form class="blog-form admin-news-form" data-blog-form="news">
          <input name="message" maxlength="120" placeholder="Nueva noticia..." />
          <button type="submit">Publicar</button>
        </form>
        <div class="blog-list" data-blog-list="news"></div>
      </article>
      <article class="blog-panel community-panel" data-blog-panel="community">
        <div class="blog-panel-head">
          ${icon("users")}
          <h3>Comunidad</h3>
        </div>
        <form class="blog-form community-form" data-blog-form="community">
          <input name="message" maxlength="180" placeholder="Escribir mensaje..." />
          <button type="submit">Publicar</button>
        </form>
        <div class="blog-list" data-blog-list="community"></div>
      </article>
      ${ScorersPanel(scorersCard)}
    </section>
  `;
}

export function StandingsPreview() {
  return `
    <section class="panel-card standings-card">
      <div class="panel-title-row">
        <button type="button" class="table-shift" data-standings-prev aria-label="Categoria anterior">${icon("arrow")}</button>
        <h3 data-standings-title>Tabla de posiciones</h3>
        <button type="button" class="table-shift next" data-standings-next aria-label="Categoria siguiente">${icon("arrow")}</button>
        <button type="button" class="text-link share-table" data-action="share-table">Compartir tabla</button>
      </div>
      <div class="standings-table" data-standings-table>
      </div>
      <div class="pager standings-category-label" data-standings-label></div>
    </section>
  `;
}

export function BottomNavigation() {
  return `
    <footer class="bottom-nav">
      ${bottomNav.map((item) => `
        <button type="button" data-action="${item.id}" aria-label="${item.label}" class="nav-item ${item.active ? "active" : ""}">
          ${icon(item.icon)}
          <span>${item.label}</span>
        </button>
      `).join("")}
      <a class="sponsor-slot" href="https://www.outcomy.com" aria-label="Ir a Outcomy">
        <img src="${assets.logos.outcomy}" alt="Outcomy" />
      </a>
    </footer>
  `;
}

export function AppShell() {
  return `
    ${Header()}
    <main class="app-main">
      <div class="left-column">
        ${HeroSection()}
        ${MenuGrid()}
      </div>
      <aside class="right-column">
        ${NextMatchCard()}
        ${StandingsPreview()}
      </aside>
    </main>
    ${BottomNavigation()}
  `;
}
