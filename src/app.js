import { AppShell } from "./components/layout.js";
import { icon } from "./components/icons.js";
import {
  assets,
  fixtureMatches,
  initialGalleryPhotos,
  localUser,
  notificationMessages,
  seedUsers,
  standingsByCategory,
  tacticalFormations,
  tacticalMatch,
  tacticalPlayers
} from "./data/appData.js";

const app = document.querySelector("#app");
app.innerHTML = AppShell();

const STORAGE = {
  session: "vm_session",
  users: "vm_users",
  profiles: "vm_profiles",
  tacticalAttendance: "vm_tactical_attendance",
  tacticalFormation: "vm_tactical_formation",
  tacticalLineup: "vm_tactical_lineup",
  landingStatsView: "vm_landing_stats_view",
  blogPosts: "vm_blog_posts",
  readNotifications: "vm_read_notifications",
  galleryPhotos: "vm_gallery_photos",
  standingsCategory: "vm_standings_category",
  adminCategories: "vm_admin_categories",
  adminFixture: "vm_admin_fixture",
  adminStats: "vm_admin_stats",
  dataVersion: "vm_data_version"
};

const DATA_VERSION = "tejedor-clean-2026-06-18";

function enforceDemoDataVersion() {
  if (localStorage.getItem(STORAGE.dataVersion) === DATA_VERSION) return;
  [
    STORAGE.blogPosts,
    STORAGE.readNotifications,
    STORAGE.galleryPhotos,
    STORAGE.tacticalAttendance,
    STORAGE.tacticalLineup,
    STORAGE.tacticalFormation,
    STORAGE.adminFixture,
    STORAGE.adminStats,
    STORAGE.standingsCategory
  ].forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(STORAGE.dataVersion, DATA_VERSION);
}

enforceDemoDataVersion();

const MAR_DEL_PLATA = {
  latitude: -38.0055,
  longitude: -57.5426
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getUsers() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.users) || "[]");
  const seeded = [localUser, ...seedUsers];
  const merged = [...seeded];
  saved.forEach((user) => {
    if (!merged.some((item) => item.username.toLowerCase() === user.username.toLowerCase())) {
      merged.push({ role: "user", team: "Villa Maristas", category: "2012", ...user });
    }
  });
  return merged;
}

function isLoggedIn() {
  const saved = localStorage.getItem(STORAGE.session);
  if (!saved) {
    localStorage.setItem(STORAGE.session, JSON.stringify({ loggedIn: true, username: localUser.username }));
    return true;
  }

  return JSON.parse(saved).loggedIn;
}

function getCurrentUserName() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.session) || "{}");
  return saved.username || localUser.username;
}

function getProfiles() {
  return JSON.parse(localStorage.getItem(STORAGE.profiles) || "{}");
}

function getUserRecord(username = getCurrentUserName()) {
  return getUsers().find((user) => user.username.toLowerCase() === username.toLowerCase()) || localUser;
}

function getCurrentUserRole() {
  return getUserRecord().role || "user";
}

function canModerate() {
  return ["admin", "organizer"].includes(getCurrentUserRole());
}

function isAdmin() {
  return getCurrentUserRole() === "admin";
}

function getAdminCategories() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.adminCategories) || "null");
  if (Array.isArray(saved) && saved.length) return saved;
  return standingsByCategory.map((category) => ({ id: category.id, label: category.label }));
}

function setAdminCategories(categories) {
  localStorage.setItem(STORAGE.adminCategories, JSON.stringify(categories));
}

function getEditableFixture() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.adminFixture) || "null");
  return Array.isArray(saved) && saved.length ? saved : fixtureMatches;
}

function getUserCategoryId() {
  return getUserRecord().category || "2012";
}

function getFixtureForUserCategory() {
  const category = getUserCategoryId();
  return getEditableFixture().filter((match) => match.category === category);
}

function setEditableFixture(matches) {
  localStorage.setItem(STORAGE.adminFixture, JSON.stringify(matches));
}

function getStatsOverrides() {
  return JSON.parse(localStorage.getItem(STORAGE.adminStats) || "{}");
}

function setStatsOverrides(stats) {
  localStorage.setItem(STORAGE.adminStats, JSON.stringify(stats));
}

function playerWithStats(player) {
  return { category: "2012", ...player, ...(getStatsOverrides()[player.id] || {}) };
}

function allPlayersWithStats() {
  return tacticalPlayers.map(playerWithStats);
}

function playersForUserCategory() {
  return allPlayersWithStats().filter((player) => {
    const category = player.category || playerCategory(player).replace("Categoria ", "");
    return category === getUserCategoryId();
  });
}

function getProfile(username = getCurrentUserName()) {
  const profiles = getProfiles();
  const user = getUserRecord(username);
  return {
    fullName: user.fullName || user.username,
    nickname: "",
    jersey: "",
    photo: "",
    ...(profiles[username.toLowerCase()] || {})
  };
}

function saveProfile(profile, username = getCurrentUserName()) {
  const profiles = getProfiles();
  profiles[username.toLowerCase()] = {
    ...getProfile(username),
    ...profile
  };
  localStorage.setItem(STORAGE.profiles, JSON.stringify(profiles));
  updateAccountState();
}

function getDisplayName() {
  if (!isLoggedIn()) return "Mi cuenta";

  const username = getCurrentUserName();
  const profile = getProfile(username);
  const source = profile.nickname || profile.fullName || username;
  return source.split(" ")[0] || "Mi cuenta";
}

function setSession(loggedIn, username = localUser.username) {
  localStorage.setItem(STORAGE.session, JSON.stringify({ loggedIn, username }));
  updateAccountState();
}

function getReadNotificationIds() {
  return JSON.parse(localStorage.getItem(STORAGE.readNotifications) || "[]");
}

function setReadNotificationIds(ids) {
  localStorage.setItem(STORAGE.readNotifications, JSON.stringify(ids));
  updateNotificationBadge();
}

function defaultBlogPosts() {
  return { news: [], community: [] };

  return {
    news: [
      { id: "news-1", author: "Organización", text: "Se viene el nacional, atentos a las novedades de esta semana.", createdAt: "Hoy" },
      { id: "news-2", author: "Organización", text: "Esperemos que no llueva para poder jugar la fecha completa.", createdAt: "Hoy" },
      { id: "news-3", author: "Organización", text: "Ya están confirmados los horarios de inferiores para el sábado.", createdAt: "Ayer" },
      { id: "news-4", author: "Organización", text: "La cantina estará abierta desde las 14:30 con colaboración de familias.", createdAt: "Ayer" },
      { id: "news-5", author: "Organización", text: "Recordamos presentar DNI antes del inicio de cada partido.", createdAt: "Hace 2 días" },
      { id: "news-6", author: "Organización", text: "Se reprogramó la fecha pendiente para el próximo domingo.", createdAt: "Hace 3 días" },
      { id: "news-7", author: "Organización", text: "Los entrenamientos mantienen los mismos turnos durante la semana.", createdAt: "Hace 4 días" }
    ],
    community: [
      { id: "community-1", author: "Pablo", text: "Buen trabajo del equipo, a seguir así.", createdAt: "Hoy" },
      { id: "community-2", author: "Papás Alto A", text: "Gracias a todos por la colaboración en la cantina.", createdAt: "Hoy" },
      { id: "community-3", author: "Juan Cruz", text: "Qué partidazo, vamos Villa.", createdAt: "Ayer" },
      { id: "community-4", author: "Martín López", text: "Se notó el esfuerzo en cada pelota.", createdAt: "Ayer" },
      { id: "community-5", author: "Familias 2012", text: "El sábado nos encontramos temprano para preparar la entrada.", createdAt: "Hace 2 días" },
      { id: "community-6", author: "Entrenador", text: "Muy buena actitud, cuidemos el fair play.", createdAt: "Hace 2 días" },
      { id: "community-7", author: "Comunidad", text: "Gracias por compartir las fotos de la jornada.", createdAt: "Hace 3 días" }
    ]
  };
}

function getBlogPosts() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.blogPosts) || "null");
  const defaults = defaultBlogPosts();
  return {
    news: saved?.news
      ? [...saved.news, ...defaults.news.filter((post) => !saved.news.some((item) => item.id === post.id))]
      : defaults.news,
    community: saved?.community
      ? [...saved.community, ...defaults.community.filter((post) => !saved.community.some((item) => item.id === post.id))]
      : defaults.community
  };
}

function setBlogPosts(posts) {
  localStorage.setItem(STORAGE.blogPosts, JSON.stringify(posts));
}

function blogAuthorName() {
  const profile = getProfile();
  return profile.nickname || getDisplayName();
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "VM";
}

function newsThumb(index) {
  return [icon("football"), icon("shirt"), icon("home")][index % 3];
}

function renderBlogPanels() {
  const posts = getBlogPosts();
  const logged = isLoggedIn();

  document.querySelectorAll("[data-blog-panel]").forEach((panel) => {
    const type = panel.dataset.blogPanel;
    const form = panel.querySelector("[data-blog-form]");
    const input = form?.querySelector("input");
    const submit = form?.querySelector("button");
    const list = panel.querySelector("[data-blog-list]");

    panel.classList.toggle("is-locked", !logged);
    if (input) {
      input.disabled = !logged;
      input.placeholder = logged
        ? (type === "news" ? "Escribir noticia..." : "Escribir mensaje...")
        : "Iniciá sesión para publicar";
    }
    if (submit) submit.disabled = !logged;
    if (!list) return;

    list.innerHTML = (posts[type] || []).map((post) => `
      <article class="blog-post">
        <p>${escapeHtml(post.text)}</p>
        <span>${escapeHtml(post.author)} · ${escapeHtml(post.createdAt)}</span>
      </article>
    `).join("") + `
      <button type="button" class="feed-more" data-noop="${type === "news" ? "Ver todas las noticias" : "Ver todos los mensajes"}">
        ${type === "news" ? "Ver todas las noticias" : "Ver todos los mensajes"} ${icon("arrow")}
      </button>
    `;
  });
}

function renderFeedPanels() {
  const posts = getBlogPosts();
  const logged = isLoggedIn();
  const moderate = canModerate();

  document.querySelectorAll("[data-blog-panel]").forEach((panel) => {
    const type = panel.dataset.blogPanel;
    const form = panel.querySelector("[data-blog-form]");
    const input = form?.querySelector("input");
    const submit = form?.querySelector("button");
    const list = panel.querySelector("[data-blog-list]");

    const canPublish = type === "news" ? isAdmin() : logged;
    panel.classList.toggle("is-locked", !canPublish);
    if (form) form.hidden = type === "news" && !isAdmin();
    if (input) {
      input.disabled = !canPublish;
      input.placeholder = canPublish
        ? (type === "news" ? "Nueva noticia..." : "Escribir mensaje...")
        : "Inicia sesion para publicar";
    }
    if (submit) submit.disabled = !canPublish;
    if (!list) return;

    if (!(posts[type] || []).length) {
      list.innerHTML = `<p class="feed-empty">${type === "news" ? "Todavia no hay noticias." : "Todavia no hay mensajes."}</p>` + (type === "community"
        ? `<button type="button" class="feed-more" data-action="community-chat">Abrir comunidad ${icon("arrow")}</button>`
        : "");
      return;
    }

    if (type === "news") {
      list.innerHTML = (posts.news || []).map((post) => `
        <article class="news-text-row">
          <time>${escapeHtml(post.createdAt)}</time>
          <p>${escapeHtml(post.text)}</p>
        </article>
      `).join("");
      return;
    }

    list.innerHTML = (posts[type] || []).slice(0, 7).map((post, index) => `
      <article class="feed-row ${type === "news" ? "news-row" : "community-row"}">
        <span class="feed-avatar">${type === "news" ? newsThumb(index) : escapeHtml(initials(post.author))}</span>
        <span class="feed-copy">
          <strong>${escapeHtml(post.author)}</strong>
          <p>${escapeHtml(post.text)}</p>
        </span>
        <span class="feed-meta">${escapeHtml(post.createdAt)}</span>
        ${type === "community" ? `<span class="feed-social">24 ${icon("user")} 6</span>` : ""}
        ${type === "community" && moderate ? `<button type="button" class="mini-delete" data-delete-community="${post.id}" aria-label="Eliminar">×</button>` : ""}
      </article>
    `).join("") + (type === "community"
      ? `<button type="button" class="feed-more" data-action="community-chat">Abrir comunidad ${icon("arrow")}</button>`
      : "");
  });

  document.querySelectorAll("[data-delete-community]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteCommunityPost(button.dataset.deleteCommunity);
    });
  });
}

function setupBlogForms() {
  document.querySelectorAll("[data-blog-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isLoggedIn()) return;

      const type = form.dataset.blogForm;
      if (type === "news" && !isAdmin()) return;
      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;

      savePost(type, text);
      input.value = "";
      renderFeedPanels();
      const openChat = document.querySelector("[data-community-thread]");
      if (type === "community" && openChat) renderCommunityThread(openChat);
    });
  });
}

function savePost(type, text, replyTo = "") {
  const now = new Date();
  const posts = getBlogPosts();
  posts[type] = [
    {
      id: `${type}-${Date.now()}`,
      author: blogAuthorName(),
      role: getCurrentUserRole(),
      text,
      replyTo,
      reactions: { like: 0, ball: 0, heart: 0 },
      createdAt: type === "news"
        ? now.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
        : now.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
    },
    ...(posts[type] || [])
  ].slice(0, 40);
  setBlogPosts(posts);
}

function deleteCommunityPost(postId) {
  if (!canModerate()) return;
  const posts = getBlogPosts();
  posts.community = (posts.community || []).filter((post) => post.id !== postId && post.replyTo !== postId);
  setBlogPosts(posts);
  renderFeedPanels();
  const openChat = document.querySelector("[data-community-thread]");
  if (openChat) renderCommunityThread(openChat);
}

const landingStatsView = { id: "goals", label: "Goleadores", field: "goals", suffix: "goles" };

function getLandingStatsView() {
  return landingStatsView;
}

function playerCategory(player) {
  if (player.role === "DEL") return "Categoria 2012";
  if (player.role === "VOL") return "Categoria 2013";
  return "Categoria 2011";
}

function renderLandingStats() {
  const title = document.querySelector("[data-stats-title]");
  const list = document.querySelector("[data-stats-list]");
  if (!title || !list) return;

  const view = getLandingStatsView();
  const rows = [...playersForUserCategory()]
    .sort((a, b) => (b[view.field] - a[view.field]) || a.name.localeCompare(b.name))
    .slice(0, 3);

  title.textContent = view.label;
  list.innerHTML = rows.map((player, index) => `
    <div class="stats-row">
      <span class="stats-rank">${index + 1}</span>
      <span class="stats-avatar">${escapeHtml(initials(player.name))}</span>
      <strong>${escapeHtml(player.name)}</strong>
      <small>${playerCategory(player)}</small>
      <b>${player[view.field]} ${view.suffix}</b>
    </div>
  `).join("");
}

function setupLandingStatsControls() {
  localStorage.removeItem(STORAGE.landingStatsView);
}

function nextSaturday(fromDate = new Date()) {
  const date = new Date(fromDate);
  const day = date.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  return date;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shortDate(date) {
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

async function updateWeatherChip() {
  const chip = document.querySelector("[data-weather-chip]");
  if (!chip) return;

  const rainText = chip.querySelector(".weather-rain");
  const saturday = nextSaturday();
  const targetDate = isoDate(saturday);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: MAR_DEL_PLATA.latitude,
    longitude: MAR_DEL_PLATA.longitude,
    daily: "precipitation_probability_max",
    timezone: "America/Argentina/Buenos_Aires",
    forecast_days: "16"
  }).toString();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("weather_request_failed");

    const weather = await response.json();
    const index = weather.daily?.time?.indexOf(targetDate) ?? -1;
    const probability = index >= 0 ? weather.daily.precipitation_probability_max[index] : null;

    rainText.textContent = probability === null || probability === undefined
      ? `Lluvia sábado ${shortDate(saturday)}: s/d`
      : `Lluvia sábado ${shortDate(saturday)}: ${Math.round(probability)}%`;
  } catch {
    rainText.textContent = `Lluvia sábado ${shortDate(saturday)}: sin conexión`;
  }
}

function getAttendanceState() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.tacticalAttendance) || "{}");
  return tacticalPlayers.reduce((state, player) => {
    const rawValue = saved[player.id] ?? player.attendance;
    const value = rawValue && rawValue !== "none" ? rawValue : "yes";
    state[player.id] = value === "pending" || value === "none" ? "doubt" : value;
    return state;
  }, {});
}

function setAttendanceState(state) {
  localStorage.setItem(STORAGE.tacticalAttendance, JSON.stringify(state));
}

function getActiveFormationId() {
  return localStorage.getItem(STORAGE.tacticalFormation) || tacticalFormations[0].id;
}

function getActiveFormation() {
  return tacticalFormations.find((formation) => formation.id === getActiveFormationId()) || tacticalFormations[0];
}

function setActiveFormation(formationId) {
  localStorage.setItem(STORAGE.tacticalFormation, formationId);
}

function confirmedPlayers() {
  const attendance = getAttendanceState();
  return tacticalPlayers.filter((player) => attendance[player.id] === "yes");
}

function getLineup() {
  const saved = JSON.parse(localStorage.getItem(STORAGE.tacticalLineup) || "null");
  if (Array.isArray(saved)) return saved;

  return autoLineup();
}

function setLineup(lineup) {
  localStorage.setItem(STORAGE.tacticalLineup, JSON.stringify(lineup));
}

function autoLineup() {
  const formation = getActiveFormation();
  const players = confirmedPlayers();
  const used = new Set();

  return formation.slots.map((slot) => {
    const byRole = players.find((player) => !used.has(player.id) && player.role === slot.role);
    const fallback = players.find((player) => !used.has(player.id));
    const player = byRole || fallback;

    if (!player) return null;
    used.add(player.id);
    return { playerId: player.id, x: slot.x, y: slot.y, role: slot.role };
  }).filter(Boolean);
}

function findNextSlot(player) {
  const lineup = getLineup();
  const occupied = new Set(lineup.map((item) => `${Math.round(item.x)}:${Math.round(item.y)}`));
  const formation = getActiveFormation();
  return formation.slots.find((slot) => slot.role === player.role && !occupied.has(`${slot.x}:${slot.y}`))
    || formation.slots.find((slot) => !occupied.has(`${slot.x}:${slot.y}`))
    || { role: player.role, x: 50, y: 50 };
}

function placePlayer(playerId, position = null) {
  const attendance = getAttendanceState();
  if (attendance[playerId] !== "yes") return;

  const player = tacticalPlayers.find((item) => item.id === playerId);
  if (!player) return;

  const slot = position || findNextSlot(player);
  const lineup = getLineup().filter((item) => item.playerId !== playerId);
  lineup.push({ playerId, x: slot.x, y: slot.y, role: player.role });
  setLineup(lineup);
}

function moveBoardPlayer(playerId, x, y) {
  const lineup = getLineup().map((item) => (
    item.playerId === playerId ? { ...item, x, y } : item
  ));
  setLineup(lineup);
}

function cycleAttendance(playerId) {
  const state = getAttendanceState();
  const next = { yes: "no", no: "doubt", doubt: "yes" };
  state[playerId] = next[state[playerId]] || "yes";
  setAttendanceState(state);

  if (state[playerId] !== "yes") {
    setLineup(getLineup().filter((item) => item.playerId !== playerId));
  }
}

function resetTacticalDate() {
  localStorage.removeItem(STORAGE.tacticalAttendance);
  localStorage.removeItem(STORAGE.tacticalLineup);
}

function updateAccountState() {
  document.body.dataset.logged = isLoggedIn() ? "true" : "false";
  document.body.dataset.role = getCurrentUserRole();
  updateHeaderAccount();
  renderFeedPanels();
}

function updateHeaderAccount() {
  const accountButton = document.querySelector('[data-action="account"]');
  const adminButton = document.querySelector('[data-action="admin-panel"]');
  if (adminButton) adminButton.hidden = !isAdmin();
  if (!accountButton) return;

  const label = accountButton.querySelector(".action-label");
  const iconSlot = accountButton.querySelector(".action-icon");
  const profile = getProfile();

  if (label) label.textContent = getDisplayName();
  if (!iconSlot) return;

  iconSlot.innerHTML = profile.photo
    ? `<img class="account-avatar" src="${profile.photo}" alt="" />`
    : icon("user");
}

function updateNotificationBadge() {
  const badge = document.querySelector('[data-action="notifications"] .badge');
  if (!badge) return;

  const read = new Set(getReadNotificationIds());
  const unreadCount = notificationMessages.filter((message) => !read.has(message.id)).length;
  badge.textContent = unreadCount;
  badge.hidden = unreadCount === 0;
}

function closeModal() {
  document.querySelector(".modal-layer")?.remove();
}

function modalShell(content, className = "") {
  closeModal();
  const layer = document.createElement("div");
  layer.className = `modal-layer ${className}`;
  layer.innerHTML = content;
  document.body.appendChild(layer);
  layer.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  return layer;
}

function contractCard(content, mode = "login") {
  return `
    <div class="modal-scrim"></div>
    <section class="contract-modal ${mode}">
      <img class="contract-bg" src="${assets.auth.contractCard}" alt="" />
      <button type="button" class="modal-close" data-close-modal aria-label="Cerrar">×</button>
      <button type="button" class="floating-home-button" data-close-modal>Inicio</button>
      <div class="contract-content">${content}</div>
    </section>
  `;
}

function showAccountModal() {
  if (isLoggedIn()) {
    const username = getCurrentUserName();
    const profile = getProfile(username);
    const layer = modalShell(contractCard(`
      <h2>Mi cuenta</h2>
      <p class="contract-copy">Perfil local de jugador</p>
      <div class="account-profile">
        <label class="photo-picker">
          <span class="photo-preview">
            ${profile.photo ? `<img src="${profile.photo}" alt="" />` : icon("user")}
          </span>
          <input name="photo" type="file" accept="image/*" />
          <span>Subir foto</span>
        </label>
        <label class="contract-field">
          <span>Apodo</span>
          <input name="nickname" value="${escapeHtml(profile.nickname)}" placeholder="Pablo" />
        </label>
        <label class="contract-field">
          <span>Dorsal</span>
          <input name="jersey" value="${escapeHtml(profile.jersey)}" inputmode="numeric" placeholder="10" />
        </label>
      </div>
      <button type="button" class="contract-primary" data-save-profile>Guardar</button>
    `, "account"));

    let selectedPhoto = profile.photo;
    const photoInput = layer.querySelector('[name="photo"]');
    const preview = layer.querySelector(".photo-preview");

    photoInput.addEventListener("change", () => {
      const file = photoInput.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        selectedPhoto = reader.result;
        preview.innerHTML = `<img src="${selectedPhoto}" alt="" />`;
      });
      reader.readAsDataURL(file);
    });

    layer.querySelector("[data-save-profile]").addEventListener("click", () => {
      saveProfile({
        nickname: layer.querySelector('[name="nickname"]').value.trim(),
        jersey: layer.querySelector('[name="jersey"]').value.trim(),
        photo: selectedPhoto
      }, username);
      closeModal();
    });
    return;
  }

  showLoginModal();
}

function showLoginModal(message = "") {
  const layer = modalShell(contractCard(`
    <p class="contract-copy">Ingresá con tu usuario y contraseña local.</p>
    ${message ? `<p class="modal-message">${message}</p>` : ""}
    <label class="contract-field">
      <span>Nombre de usuario</span>
      <input name="username" autocomplete="username" placeholder="Nombre de usuario" />
    </label>
    <label class="contract-field">
      <span>Contraseña</span>
      <input name="password" type="password" autocomplete="current-password" placeholder="Contraseña" />
    </label>
    <button type="button" class="contract-primary" data-login-submit>Log in</button>
    <div class="contract-separator"><span></span><b>o</b><span></span></div>
    <button type="button" class="contract-link" data-register-start>Registrarse por primera vez</button>
  `, "login"));

  layer.querySelector("[data-login-submit]").addEventListener("click", () => {
    const username = layer.querySelector('[name="username"]').value.trim().toLowerCase();
    const password = layer.querySelector('[name="password"]').value;
    const found = getUsers().find((user) => user.username.toLowerCase() === username && user.password === password);

    if (!found) {
      showLoginModal("Usuario o contraseña incorrectos.");
      return;
    }

    setSession(true, found.username);
    closeModal();
  });

  layer.querySelector("[data-register-start]").addEventListener("click", () => showPlayerContractModal());
}

function showPlayerContractModal(message = "") {
  const layer = modalShell(`
    <div class="modal-scrim contract-scrim"></div>
    <section class="player-contract-modal">
      <img class="player-contract-bg" src="${assets.auth.playerContract}" alt="Contrato de jugador" />
      <button type="button" class="player-contract-close" data-close-modal aria-label="Cerrar"></button>
      <button type="button" class="floating-home-button contract-home" data-close-modal>Inicio</button>
      <div class="player-contract-fields">
        ${message ? `<p class="player-contract-message">${message}</p>` : ""}
        <label class="player-contract-field">
          <span>Nombre y apellido</span>
          <input name="fullName" autocomplete="name" />
        </label>
        <label class="player-contract-field">
          <span>DNI</span>
          <input name="dni" inputmode="numeric" />
        </label>
        <label class="player-contract-field">
          <span>Móvil</span>
          <input name="mobile" inputmode="tel" />
        </label>
        <label class="player-contract-field">
          <span>Mail / usuario</span>
          <input name="email" type="email" autocomplete="email" />
        </label>
        <label class="player-contract-field">
          <span>Contraseña</span>
          <input name="password" type="password" autocomplete="new-password" />
        </label>
        <label class="player-contract-field">
          <span>Repetir contraseña</span>
          <input name="confirmPassword" type="password" autocomplete="new-password" />
        </label>
        <button type="button" class="player-contract-submit" data-finish-contract>Enviar</button>
      </div>
    </section>
  `, "player-contract-layer");

  layer.querySelector("[data-finish-contract]").addEventListener("click", () => {
    const fullName = layer.querySelector('[name="fullName"]').value.trim();
    const dni = layer.querySelector('[name="dni"]').value.trim();
    const email = layer.querySelector('[name="email"]').value.trim();
    const mobile = layer.querySelector('[name="mobile"]').value.trim();
    const password = layer.querySelector('[name="password"]').value;
    const confirmPassword = layer.querySelector('[name="confirmPassword"]').value;

    if (!fullName || !dni || !email.includes("@") || !mobile || password.length < 8 || password !== confirmPassword) {
      showPlayerContractModal("Completá todos los campos. La contraseña debe tener al menos 8 caracteres y coincidir.");
      return;
    }

    const users = JSON.parse(localStorage.getItem(STORAGE.users) || "[]");
    const username = email.toLowerCase();
    users.push({ username, password, fullName, dni, email, mobile, role: "user", team: "Villa Maristas", category: "2012" });
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    setSession(true, username);
    closeModal();
  });
}

function attendanceLabel(value) {
  if (value === "yes") return "Asiste";
  if (value === "no") return "No puede";
  if (value === "doubt") return "En duda";
  return "";
}

function playerRow(player, attendance, lineupIds) {
  player = playerWithStats(player);
  const status = attendance[player.id];
  const canDrag = status === "yes";
  const isStarter = lineupIds.has(player.id);
  return `
    <tr class="tactical-player-row status-${status} ${canDrag ? "is-confirmed" : ""} ${isStarter ? "is-starter" : ""}" data-player-id="${player.id}" draggable="${canDrag}">
      <td><span class="row-number">${player.number}</span></td>
      <td>
        <button type="button" class="player-name-button" data-place-player="${player.id}" ${canDrag ? "" : "disabled"}>
          <span class="tiny-shirt role-${player.role.toLowerCase()}">${player.shirt}</span>
          <strong>${player.name}</strong>
          <span class="player-stat-mini" aria-label="Estadisticas del jugador">
            <small class="stat-ball"><i class="stat-icon ball"></i>${player.goals}</small>
            <small class="stat-yellow"><i class="stat-icon yellow-card"></i>${player.yellow}</small>
            <small class="stat-red"><i class="stat-icon red-card"></i>${player.red}</small>
          </span>
        </button>
      </td>
      <td>${player.pj}</td>
      <td>${player.yellow}</td>
      <td>${player.red}</td>
      <td>${player.goals}</td>
      <td>${player.passes}</td>
      <td>
        <button type="button" class="attendance-pill ${status}" data-attendance="${player.id}">
          ${status === "yes" ? "✓ " : status === "no" ? "× " : status === "doubt" ? "? " : ""}${attendanceLabel(status)}
        </button>
      </td>
    </tr>
  `;
}

function boardToken(item) {
  const player = allPlayersWithStats().find((candidate) => candidate.id === item.playerId);
  if (!player) return "";

  return `
    <button type="button" class="board-player role-${player.role.toLowerCase()}" style="left:${item.x}%;top:${item.y}%"
      data-board-player="${player.id}" draggable="true" aria-label="${player.name}">
      <span class="board-shirt">${player.shirt}</span>
      <span class="board-name">${player.shortName}</span>
    </button>
  `;
}

function roleColor(role) {
  return {
    ARQ: "#7c36bd",
    DEF: "#087433",
    VOL: "#0d7836",
    DEL: "#d8a300"
  }[role] || "#087433";
}

function drawShirt(ctx, x, y, size, color, number) {
  const w = size;
  const h = size * 1.1;
  ctx.save();
  ctx.translate(x - w / 2, y - h / 2);
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h * 0.1);
  ctx.lineTo(w * 0.33, 0);
  ctx.lineTo(w * 0.67, 0);
  ctx.lineTo(w * 0.82, h * 0.1);
  ctx.lineTo(w, h * 0.3);
  ctx.lineTo(w * 0.82, h * 0.43);
  ctx.lineTo(w * 0.82, h);
  ctx.lineTo(w * 0.18, h);
  ctx.lineTo(w * 0.18, h * 0.43);
  ctx.lineTo(0, h * 0.3);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${Math.round(size * 0.42)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, w / 2, h * 0.54);
  ctx.restore();
}

function exportLineupImage() {
  const lineup = getLineup();
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 920;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#063f1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 42px Arial";
  ctx.fillText("Pizarra táctica", 42, 64);
  ctx.font = "600 24px Arial";
  ctx.fillText(`${tacticalMatch.date} · ${tacticalMatch.fixture} · ${tacticalMatch.venue}`, 42, 104);

  const fx = 70;
  const fy = 145;
  const fw = 1260;
  const fh = 700;
  for (let i = 0; i < 12; i += 1) {
    ctx.fillStyle = i % 2 ? "#27851f" : "#309425";
    ctx.fillRect(fx, fy + (fh / 12) * i, fw, fh / 12);
  }

  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = 5;
  ctx.strokeRect(fx, fy, fw, fh);
  ctx.beginPath();
  ctx.moveTo(fx, fy + fh / 2);
  ctx.lineTo(fx + fw, fy + fh / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx + fw / 2, fy + fh / 2, 95, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(fx + fw * 0.18, fy, fw * 0.64, fh * 0.18);
  ctx.strokeRect(fx + fw * 0.18, fy + fh * 0.82, fw * 0.64, fh * 0.18);

  lineup.forEach((item) => {
    const player = allPlayersWithStats().find((candidate) => candidate.id === item.playerId);
    if (!player) return;
    const x = fx + (fw * item.x) / 100;
    const y = fy + (fh * item.y) / 100;
    drawShirt(ctx, x, y, 62, roleColor(player.role), player.shirt);
    ctx.fillStyle = "rgba(0,58,24,.92)";
    ctx.fillRect(x - 62, y + 38, 124, 28);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.shortName.toUpperCase(), x, y + 58);
  });

  const link = document.createElement("a");
  link.download = `pizarra-${tacticalMatch.date.toLowerCase().replaceAll(" ", "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function showTacticalBoardModal() {
  const attendance = getAttendanceState();
  const lineup = getLineup().filter((item) => attendance[item.playerId] === "yes");
  setLineup(lineup);
  const lineupIds = new Set(lineup.map((item) => item.playerId));

  const activeFormation = getActiveFormation();
  const confirmed = Object.values(attendance).filter((value) => value === "yes").length;
  const absent = Object.values(attendance).filter((value) => value === "no").length;
  const doubt = Object.values(attendance).filter((value) => value === "doubt").length;
  const unconfirmed = Object.values(attendance).filter((value) => value === "none").length;

  const layer = modalShell(`
    <div class="modal-scrim tactical-scrim"></div>
    <section class="tactical-modal">
      <button type="button" class="modal-close tactical-close" data-close-modal aria-label="Cerrar">×</button>

      <article class="tactical-panel roster-panel">
        <div class="tactical-heading">
          <span class="panel-icon">${icon("calendar")}</span>
          <div>
            <h2>${tacticalMatch.title}</h2>
            <p>${tacticalMatch.date} · ${tacticalMatch.fixture} · ${tacticalMatch.venue}</p>
            <div class="match-rank-row">
              <span>${tacticalMatch.ownTeam}: ${tacticalMatch.ownPosition}°</span>
              <span>${tacticalMatch.opponent}: ${tacticalMatch.opponentPosition}°</span>
            </div>
          </div>
          <span class="opponent-badge">Tejedor<br>FC</span>
        </div>

        <div class="roster-table-wrap">
          <table class="roster-table">
            <thead>
              <tr>
                <th>#</th><th>Jugador</th><th>PJ</th>
                <th><span class="table-stat-head yellow-card" aria-label="Amarillas"></span></th>
                <th><span class="table-stat-head red-card" aria-label="Rojas"></span></th>
                <th><span class="table-stat-head ball" aria-label="Goles"></span></th>
                <th>P</th><th>Asistencia</th>
              </tr>
            </thead>
            <tbody>${allPlayersWithStats().map((player) => playerRow(player, attendance, lineupIds)).join("")}</tbody>
          </table>
        </div>

        <div class="attendance-summary">
          <strong>Asisten: ${confirmed}</strong>
          <strong>No pueden: ${absent}</strong>
          <strong>En duda: ${doubt}</strong>
          <strong>Sin confirmar: ${unconfirmed}</strong>
        </div>
      </article>

      <article class="tactical-panel board-panel">
        <div class="tactical-heading board-heading">
          <span class="panel-icon">${icon("field")}</span>
          <h2>Pizarra táctica</h2>
        </div>

        <div class="formation-tabs">
          <span>Formación</span>
          ${tacticalFormations.map((formation) => `
            <button type="button" class="${formation.id === activeFormation.id ? "active" : ""}" data-formation="${formation.id}">
              ${formation.label}
            </button>
          `).join("")}
        </div>

        <div class="tactical-field" data-field-drop>
          <div class="field-marking penalty top"></div>
          <div class="field-marking penalty bottom"></div>
          <div class="field-marking center-line"></div>
          <div class="field-marking center-circle"></div>
          ${lineup.map(boardToken).join("")}
        </div>

        <div class="board-toolbar">
          <span>Arrastrá camisetas para moverlas</span>
          <button type="button" data-auto-lineup>Auto</button>
          <button type="button" data-clear-lineup>Limpiar</button>
          <button type="button" data-reset-date>Reset fecha</button>
          <button type="button" data-export-lineup ${lineup.length ? "" : "disabled"}>Exportar PNG</button>
          <span class="role-chip arq">ARQ</span>
          <span class="role-chip def">DEF</span>
          <span class="role-chip vol">VOL</span>
          <span class="role-chip del">DEL</span>
        </div>
        <div class="board-footer-actions">
          <button type="button" class="floating-home-button tactical-home" data-close-modal>Inicio</button>
        </div>
      </article>
    </section>
  `, "tactical-layer");

  layer.querySelectorAll("[data-attendance]").forEach((button) => {
    button.addEventListener("click", () => {
      cycleAttendance(button.dataset.attendance);
      showTacticalBoardModal();
    });
  });

  layer.querySelectorAll("[data-place-player]").forEach((button) => {
    button.addEventListener("click", () => {
      placePlayer(button.dataset.placePlayer);
      showTacticalBoardModal();
    });
  });

  layer.querySelectorAll("[data-formation]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveFormation(button.dataset.formation);
      setLineup(autoLineup());
      showTacticalBoardModal();
    });
  });

  layer.querySelector("[data-auto-lineup]").addEventListener("click", () => {
    setLineup(autoLineup());
    showTacticalBoardModal();
  });

  layer.querySelector("[data-clear-lineup]").addEventListener("click", () => {
    setLineup([]);
    showTacticalBoardModal();
  });

  layer.querySelector("[data-reset-date]").addEventListener("click", () => {
    resetTacticalDate();
    showTacticalBoardModal();
  });

  layer.querySelector("[data-export-lineup]").addEventListener("click", () => {
    exportLineupImage();
  });

  layer.querySelectorAll("[draggable='true'][data-player-id]").forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/player-id", row.dataset.playerId);
      const shirt = row.querySelector(".tiny-shirt");
      if (shirt) event.dataTransfer.setDragImage(shirt, 14, 15);
    });
  });

  layer.querySelectorAll("[data-board-player]").forEach((token) => {
    token.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/board-player-id", token.dataset.boardPlayer);
      const shirt = token.querySelector(".board-shirt");
      if (shirt) event.dataTransfer.setDragImage(shirt, 28, 31);
    });
  });

  const field = layer.querySelector("[data-field-drop]");
  field.addEventListener("dragover", (event) => event.preventDefault());
  field.addEventListener("drop", (event) => {
    event.preventDefault();
    const rect = field.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(94, Math.max(6, ((event.clientY - rect.top) / rect.height) * 100));
    const boardPlayerId = event.dataTransfer.getData("text/board-player-id");
    const playerId = event.dataTransfer.getData("text/player-id");

    if (boardPlayerId) moveBoardPlayer(boardPlayerId, x, y);
    if (playerId) placePlayer(playerId, { x, y });
    showTacticalBoardModal();
  });
}

function renderCommunityThread(container) {
  const posts = getBlogPosts().community || [];
  const moderate = canModerate();
  if (!posts.length) {
    container.innerHTML = `<p class="empty-state chat-empty">Todavia no hay mensajes. Escribi el primero para abrir la comunidad.</p>`;
    return;
  }
  container.innerHTML = posts.map((post) => {
    const replies = posts.filter((reply) => reply.replyTo === post.id);
    if (post.replyTo) return "";
    return `
      <article class="chat-message">
        <div class="chat-avatar">${escapeHtml(initials(post.author))}</div>
        <div class="chat-bubble">
          <header>
            <strong>${escapeHtml(post.author)}</strong>
            <span>${escapeHtml(post.createdAt)}</span>
            ${moderate ? `<button type="button" data-delete-community="${post.id}" aria-label="Eliminar">×</button>` : ""}
          </header>
          <p>${escapeHtml(post.text)}</p>
          <div class="chat-tools">
            <button type="button" data-reply-to="${post.id}">Responder</button>
            <button type="button" data-react="${post.id}" data-emoji="like">👍 ${post.reactions?.like || 0}</button>
            <button type="button" data-react="${post.id}" data-emoji="ball">⚽ ${post.reactions?.ball || 0}</button>
            <button type="button" data-react="${post.id}" data-emoji="heart">💙 ${post.reactions?.heart || 0}</button>
          </div>
          ${replies.length ? `<div class="chat-replies">${replies.map((reply) => `
            <div class="chat-reply">
              <strong>${escapeHtml(reply.author)}</strong>
              <span>${escapeHtml(reply.text)}</span>
              ${moderate ? `<button type="button" data-delete-community="${reply.id}" aria-label="Eliminar">×</button>` : ""}
            </div>
          `).join("")}</div>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function showCommunityChatModal() {
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="app-modal chat-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">×</button>
      <h2>Comunidad</h2>
      <div class="chat-thread" data-community-thread></div>
      <form class="chat-compose" data-community-compose>
        <input name="message" maxlength="180" placeholder="Escribir mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </section>
  `, "community-layer");

  const thread = layer.querySelector("[data-community-thread]");
  const form = layer.querySelector("[data-community-compose]");
  let replyTo = "";

  const refresh = () => {
    renderCommunityThread(thread);
    thread.querySelectorAll("[data-delete-community]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteCommunityPost(button.dataset.deleteCommunity);
        refresh();
      });
    });
    thread.querySelectorAll("[data-reply-to]").forEach((button) => {
      button.addEventListener("click", () => {
        replyTo = button.dataset.replyTo;
        form.querySelector("input").placeholder = "Responder comentario...";
        form.querySelector("input").focus();
      });
    });
    thread.querySelectorAll("[data-react]").forEach((button) => {
      button.addEventListener("click", () => {
        const posts = getBlogPosts();
        const post = posts.community.find((item) => item.id === button.dataset.react);
        if (!post) return;
        post.reactions = post.reactions || { like: 0, ball: 0, heart: 0 };
        post.reactions[button.dataset.emoji] = (post.reactions[button.dataset.emoji] || 0) + 1;
        setBlogPosts(posts);
        refresh();
        renderFeedPanels();
      });
    });
  };

  refresh();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isLoggedIn()) return;
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    savePost("community", text, replyTo);
    replyTo = "";
    input.value = "";
    input.placeholder = "Escribir mensaje...";
    refresh();
    renderFeedPanels();
  });
}

function getGalleryPhotos() {
  return JSON.parse(localStorage.getItem(STORAGE.galleryPhotos) || "null") || initialGalleryPhotos;
}

function setGalleryPhotos(photos) {
  localStorage.setItem(STORAGE.galleryPhotos, JSON.stringify(photos));
}

function renderGalleryGrid(container) {
  const photos = getGalleryPhotos();
  container.innerHTML = photos.length ? photos.map((photo) => `
    <article class="gallery-tile">
      <img src="${photo.src}" alt="" />
      <strong>${escapeHtml(photo.team)}</strong>
      <span>${escapeHtml(photo.author)}</span>
    </article>
  `).join("") : `<p class="empty-state">Todavia no hay fotos cargadas.</p>`;
}

function showGalleryModal() {
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="app-modal gallery-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">×</button>
      <h2>Galeria de fotos</h2>
      <form class="gallery-upload" data-gallery-upload>
        <input type="file" name="photo" accept="image/*" />
        <input name="team" maxlength="40" placeholder="Equipo" value="${escapeHtml(getUserRecord().team || "Villa Maristas")}" />
        <button type="submit">Subir foto</button>
      </form>
      <div class="gallery-grid" data-gallery-grid></div>
    </section>
  `, "gallery-layer");

  const grid = layer.querySelector("[data-gallery-grid]");
  renderGalleryGrid(grid);

  layer.querySelector("[data-gallery-upload]").addEventListener("submit", (event) => {
    event.preventDefault();
    const file = layer.querySelector('[name="photo"]').files?.[0];
    const team = layer.querySelector('[name="team"]').value.trim() || "Villa Maristas";
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const photos = getGalleryPhotos();
      photos.unshift({
        id: `photo-${Date.now()}`,
        src: reader.result,
        team,
        author: blogAuthorName(),
        createdAt: new Date().toLocaleDateString("es-AR")
      });
      setGalleryPhotos(photos.slice(0, 60));
      renderGalleryGrid(grid);
    });
    reader.readAsDataURL(file);
  });
}

function printNextFixtureSheet() {
  const match = getFixtureForUserCategory()[0] || getEditableFixture()[0] || fixtureMatches[0];
  const rows = allPlayersWithStats().map((player) => `
    <tr><td>${player.number}</td><td>${escapeHtml(player.name)}</td><td>${player.shirt}</td><td></td></tr>
  `).join("");
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><head><title>Planilla ${match.date}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;margin:28px;color:#08245a;background:#f4f7fc}
      .sheet{max-width:980px;margin:0 auto;padding:24px;background:white;border:3px solid #08245a;border-radius:18px}
      header{display:grid;grid-template-columns:92px 1fr 180px;gap:18px;align-items:center;padding:0 0 18px;border-bottom:4px solid #08245a}
      img{width:86px;height:86px;object-fit:contain}
      h1{margin:0;text-transform:uppercase;font-size:30px;letter-spacing:.5px}
      .subtitle{margin:5px 0 0;font-size:14px;text-transform:uppercase;color:#d71920;font-weight:700}
      .stamp{padding:12px;border:2px solid #d71920;border-radius:12px;text-align:center;text-transform:uppercase;font-weight:800;color:#d71920}
      .match-box{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0;padding:12px;border-radius:12px;background:#eef4ff}
      .match-box span{display:block;font-size:11px;text-transform:uppercase;color:#58709f}
      .match-box strong{display:block;margin-top:4px;font-size:15px;color:#08245a}
      table{width:100%;border-collapse:collapse;margin-top:18px}
      th,td{border:1px solid #8ca6d8;padding:9px;text-align:left;font-size:13px}
      th{background:#08245a;color:white;text-transform:uppercase}
      td:first-child,td:nth-child(3){text-align:center;width:70px}.sign{height:32px}
      .footer-sign{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:34px}
      .footer-sign div{padding-top:28px;border-top:2px solid #08245a;text-align:center;font-size:12px;text-transform:uppercase}
      @media print{body{margin:0;background:white}.sheet{border-radius:0;border:0;max-width:none}}
    </style></head><body>
      <main class="sheet">
        <header>
          <img src="${assets.logos.villa}">
          <div>
            <h1>Planilla de jugadores</h1>
            <p class="subtitle">Villa Maristas · Control de proxima fecha</p>
          </div>
          <div class="stamp">Temporada<br>2026</div>
        </header>
        <section class="match-box">
          <div><span>Equipo</span><strong>Tejedor FC</strong></div>
          <div><span>Rival</span><strong>${escapeHtml(match.rival)}</strong></div>
          <div><span>Fecha y hora</span><strong>${match.day} ${match.date} · ${match.time}</strong></div>
          <div><span>Cancha</span><strong>${escapeHtml(match.venue)}</strong></div>
        </section>
        <table><thead><tr><th>#</th><th>Jugador</th><th>Dorsal</th><th>Firma</th></tr></thead><tbody>${rows}</tbody></table>
        <section class="footer-sign">
          <div>Delegado</div>
          <div>Organizacion</div>
          <div>Arbitro / Control</div>
        </section>
      </main>
      <script>window.print()</script>
    </body></html>
  `);
  win.document.close();
}

function showFixtureModal() {
  const canPrint = ["admin", "organizer"].includes(getCurrentUserRole());
  const matches = getFixtureForUserCategory();
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="app-modal fixture-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">×</button>
      <h2>Fixture</h2>
      <div class="fixture-full-list">
        ${matches.map((match) => `
          <article>
            <strong>${match.day} ${match.date}</strong>
            <span>${match.time}</span>
            <b>vs. ${escapeHtml(match.rival)}</b>
            <small>${escapeHtml(match.category)} - ${escapeHtml(match.venue)}</small>
          </article>
        `).join("")}
      </div>
      ${canPrint ? `<button type="button" class="modal-primary" data-print-next-fixture>Imprimir planilla proxima fecha</button>` : ""}
    </section>
  `, "fixture-layer");

  layer.querySelector("[data-print-next-fixture]")?.addEventListener("click", printNextFixtureSheet);
}

function statsRows(metric) {
  return [...playersForUserCategory()].sort((a, b) => (b[metric] || 0) - (a[metric] || 0) || a.name.localeCompare(b.name));
}

function metricLabel(metric) {
  return { goals: "goles", yellow: "amarillas", red: "rojas" }[metric] || "goles";
}

function renderScorersModalList(layer, metric = "goals") {
  const list = layer.querySelector("[data-scorers-modal-list]");
  const title = layer.querySelector("[data-scorers-modal-title]");
  if (title) title.textContent = metric === "goals" ? "Goleadores" : metric === "yellow" ? "Tarjetas amarillas" : "Tarjetas rojas";
  layer.querySelectorAll("[data-scorers-metric]").forEach((button) => {
    button.classList.toggle("active", button.dataset.scorersMetric === metric);
  });
  if (!list) return;
  list.innerHTML = statsRows(metric).map((player, index) => `
    <article>
      <span>${index + 1}</span>
      <strong>${escapeHtml(player.name)}</strong>
      <small>${playerCategory(player)}</small>
      <b>${player[metric] || 0} ${metricLabel(metric)}</b>
    </article>
  `).join("");
}

function showScorersModal() {
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="app-modal scorers-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">×</button>
      <h2 data-scorers-modal-title>Goleadores</h2>
      <div class="modal-tabs">
        <button type="button" data-scorers-metric="goals">Goles</button>
        <button type="button" data-scorers-metric="yellow">Amarillas</button>
        <button type="button" data-scorers-metric="red">Rojas</button>
      </div>
      <div class="scorers-full-list" data-scorers-modal-list></div>
    </section>
  `, "scorers-layer");

  layer.querySelectorAll("[data-scorers-metric]").forEach((button) => {
    button.addEventListener("click", () => renderScorersModalList(layer, button.dataset.scorersMetric));
  });
  renderScorersModalList(layer, "goals");
}

function getActiveStandingsCategoryId() {
  const userCategory = getUserRecord().category || "2012";
  return localStorage.getItem(STORAGE.standingsCategory) || userCategory;
}

function getAllStandingsCategories() {
  const savedCategories = getAdminCategories();
  return savedCategories.map((category) => {
    const source = standingsByCategory.find((item) => item.id === category.id) || standingsByCategory[0];
    return {
      id: category.id,
      label: category.label,
      rows: source.rows
    };
  });
}

function getActiveStandingsCategory() {
  const categories = getAllStandingsCategories();
  return categories.find((category) => category.id === getActiveStandingsCategoryId()) || categories[0];
}

function renderStandingsPanel() {
  const title = document.querySelector("[data-standings-title]");
  const table = document.querySelector("[data-standings-table]");
  const label = document.querySelector("[data-standings-label]");
  if (!title || !table) return;
  const category = getActiveStandingsCategory();
  title.textContent = `Tabla de posiciones - ${category.label}`;
  table.innerHTML = `
    <div class="table-head">
      <span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span>
    </div>
    ${category.rows.map((row) => `
      <div class="table-row">
        <span>${row.position}</span>
        <span class="team-cell"><img src="${row.logo}" alt="" />${escapeHtml(row.team)}</span>
        <span>${row.played}</span>
        <span>${row.goalDifference}</span>
        <strong>${row.points}</strong>
      </div>
    `).join("")}
  `;
  if (label) label.textContent = category.label;
}

function shiftStandings(delta) {
  const active = getActiveStandingsCategory();
  const categories = getAllStandingsCategories();
  const index = categories.findIndex((category) => category.id === active.id);
  const next = categories[(index + delta + categories.length) % categories.length];
  localStorage.setItem(STORAGE.standingsCategory, next.id);
  renderStandingsPanel();
}

function shareActiveTable() {
  const category = getActiveStandingsCategory();
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1150;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7faff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#062b73";
  ctx.fillRect(0, 0, canvas.width, 130);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px Arial";
  ctx.fillText("Villa Maristas", 40, 52);
  ctx.font = "600 24px Arial";
  ctx.fillText(`Tabla de posiciones - ${category.label}`, 40, 92);
  ctx.font = "18px Arial";
  ctx.fillText(new Date().toLocaleDateString("es-AR"), 700, 92);
  ctx.fillStyle = "#0b2e78";
  ctx.font = "700 20px Arial";
  ctx.fillText("#", 45, 170);
  ctx.fillText("Equipo", 110, 170);
  ctx.fillText("PJ", 640, 170);
  ctx.fillText("DG", 720, 170);
  ctx.fillText("PTS", 805, 170);
  category.rows.slice(0, 20).forEach((row, index) => {
    const y = 210 + index * 42;
    ctx.fillStyle = index % 2 ? "#ffffff" : "#edf3ff";
    ctx.fillRect(30, y - 28, 840, 38);
    ctx.fillStyle = "#062b73";
    ctx.font = "18px Arial";
    ctx.fillText(row.position, 48, y);
    ctx.fillText(row.team, 110, y);
    ctx.fillText(row.played, 646, y);
    ctx.fillText(row.goalDifference, 720, y);
    ctx.font = "700 18px Arial";
    ctx.fillText(row.points, 812, y);
  });
  const link = document.createElement("a");
  link.download = `tabla-${category.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  window.open(`https://wa.me/?text=${encodeURIComponent(`Tabla de posiciones Villa Maristas - ${category.label}`)}`, "_blank");
}

async function setupHeroCarousel() {
  const image = document.querySelector("[data-hero-image]");
  if (!image) return;
  let ads = Array.isArray(assets.ads) ? assets.ads.filter(Boolean) : [];
  try {
    const response = await fetch("./api/ads.php", { cache: "no-store" });
    if (response.ok) ads = await response.json();
  } catch {
    ads = Array.isArray(assets.ads) ? assets.ads.filter(Boolean) : [];
  }
  if (!ads.length) return;
  const pool = [...ads].sort(() => Math.random() - 0.5);
  let index = -1;
  window.setInterval(() => {
    index = (index + 1) % (pool.length + 1);
    image.classList.add("is-fading");
    window.setTimeout(() => {
      image.src = index === 0 ? assets.backgrounds.hero : pool[index - 1];
      image.classList.remove("is-fading");
    }, 260);
  }, 3000);
}

function adminPanelTabButton(id, label, active = false) {
  return `<button type="button" class="${active ? "active" : ""}" data-admin-tab="${id}">${label}</button>`;
}

function renderAdminCategories() {
  return `
    <form class="admin-card admin-categories-form" data-admin-categories-form>
      <h3>Categorias</h3>
      <p>Estas categorias alimentan fixture, tablas, equipos y estadisticas.</p>
      <div class="admin-category-list" data-admin-category-list>
        ${getAdminCategories().map((category) => `
          <label>
            <span>ID</span>
            <input name="id" value="${escapeHtml(category.id)}" />
            <span>Nombre visible</span>
            <input name="label" value="${escapeHtml(category.label)}" />
          </label>
        `).join("")}
      </div>
      <div class="admin-actions-row">
        <button type="button" class="modal-secondary" data-add-category>Agregar categoria</button>
        <button type="submit" class="modal-primary">Guardar categorias</button>
      </div>
    </form>
  `;
}

function renderAdminFixture() {
  const categories = getAdminCategories();
  return `
    <form class="admin-card admin-fixture-form" data-admin-fixture-form>
      <h3>Fixture y horarios</h3>
      <p>El primer partido de esta lista es el que usa la planilla de proxima fecha.</p>
      <div class="admin-fixture-list">
        ${getEditableFixture().map((match, index) => `
          <fieldset data-fixture-row>
            <legend>Partido ${index + 1}</legend>
            <input name="day" value="${escapeHtml(match.day)}" placeholder="DIA" />
            <input name="date" value="${escapeHtml(match.date)}" placeholder="24/05" />
            <input name="time" value="${escapeHtml(match.time)}" placeholder="15:30 hs" />
            <input name="rival" value="${escapeHtml(match.rival)}" placeholder="Rival" />
            <select name="category">
              ${categories.map((category) => `<option value="${escapeHtml(category.id)}" ${category.id === match.category ? "selected" : ""}>${escapeHtml(category.label)}</option>`).join("")}
            </select>
            <input name="venue" value="${escapeHtml(match.venue)}" placeholder="Cancha" />
          </fieldset>
        `).join("")}
      </div>
      <div class="admin-actions-row">
        <button type="button" class="modal-secondary" data-add-fixture>Agregar partido</button>
        <button type="submit" class="modal-primary">Guardar fixture</button>
      </div>
    </form>
  `;
}

function renderAdminNews() {
  return `
    <form class="admin-card admin-news-panel" data-admin-news-panel>
      <h3>Noticias rapidas</h3>
      <p>Solo admin publica. Maximo 120 caracteres.</p>
      <textarea name="news" maxlength="120" placeholder="Ej: Se confirma la fecha del sabado..."></textarea>
      <div class="admin-counter"><span data-admin-news-count>0</span>/120</div>
      <button type="submit" class="modal-primary">Publicar noticia</button>
    </form>
  `;
}

function renderAdminStats() {
  return `
    <form class="admin-card admin-stats-form" data-admin-stats-form>
      <h3>Goleadores, amarillas y rojas</h3>
      <div class="admin-stats-list">
        ${allPlayersWithStats().map((player) => `
          <fieldset data-player-stat="${player.id}">
            <legend>${escapeHtml(player.name)}</legend>
            <label>Goles <input name="goals" type="number" min="0" value="${player.goals || 0}" /></label>
            <label>Amarillas <input name="yellow" type="number" min="0" value="${player.yellow || 0}" /></label>
            <label>Rojas <input name="red" type="number" min="0" value="${player.red || 0}" /></label>
          </fieldset>
        `).join("")}
      </div>
      <button type="submit" class="modal-primary">Guardar estadisticas</button>
    </form>
  `;
}

function renderAdminPlaceholder(title, text) {
  return `
    <article class="admin-card">
      <h3>${title}</h3>
      <p>${text}</p>
      <button type="button" class="modal-secondary" disabled>Preparado para conectar</button>
    </article>
  `;
}

function renderAdminPanelContent(layer, tab = "dashboard") {
  const body = layer.querySelector("[data-admin-panel-body]");
  if (!body) return;
  layer.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === tab);
  });

  const panels = {
    dashboard: `
      <div class="admin-dashboard-grid">
        ${renderAdminPlaceholder("Categorias", "Base de categorias del torneo para filtrar tablas, fixture y equipos.")}
        ${renderAdminPlaceholder("Equipos y plantillas", "Logos, nombres, colores, jugadores, dorsales y plantillas.")}
        ${renderAdminPlaceholder("Publicidades", "Carpeta de banners para rotar en el panel principal.")}
        ${renderAdminPlaceholder("Exportaciones", "Diseno de PNG de pizarra y planillas con encabezado.")}
      </div>
    `,
    categories: renderAdminCategories(),
    fixture: renderAdminFixture(),
    news: renderAdminNews(),
    stats: renderAdminStats(),
    community: renderAdminPlaceholder("Moderacion comunidad", "La moderacion ya esta activa: admin y organizador pueden borrar mensajes desde el chat de comunidad."),
    media: renderAdminPlaceholder("Fotos y publicidades", "Siguiente paso: conectar subida a carpeta local/Drive y administrar altas/bajas desde aqui.")
  };

  body.innerHTML = panels[tab] || panels.dashboard;
  bindAdminPanelContent(layer, tab);
}

function bindAdminPanelContent(layer, tab) {
  if (tab === "categories") {
    layer.querySelector("[data-add-category]")?.addEventListener("click", () => {
      const categories = getAdminCategories();
      categories.push({ id: `categoria-${categories.length + 1}`, label: `Categoria ${categories.length + 1}` });
      setAdminCategories(categories);
      renderAdminPanelContent(layer, "categories");
      renderStandingsPanel();
    });

    layer.querySelector("[data-admin-categories-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const categories = [...layer.querySelectorAll("[data-admin-category-list] label")]
        .map((row) => ({
          id: row.querySelector('[name="id"]').value.trim(),
          label: row.querySelector('[name="label"]').value.trim()
        }))
        .filter((category) => category.id && category.label);
      setAdminCategories(categories);
      renderAdminPanelContent(layer, "categories");
      renderStandingsPanel();
    });
  }

  if (tab === "fixture") {
    layer.querySelector("[data-add-fixture]")?.addEventListener("click", () => {
      const matches = getEditableFixture();
      matches.push({ id: `fixture-${Date.now()}`, day: "SAB", date: "", time: "", rival: "", category: getAdminCategories()[0]?.id || "2012", venue: "Villa Maristas" });
      setEditableFixture(matches);
      renderAdminPanelContent(layer, "fixture");
    });

    layer.querySelector("[data-admin-fixture-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const matches = [...layer.querySelectorAll("[data-fixture-row]")].map((row, index) => ({
        id: getEditableFixture()[index]?.id || `fixture-${Date.now()}-${index}`,
        day: row.querySelector('[name="day"]').value.trim(),
        date: row.querySelector('[name="date"]').value.trim(),
        time: row.querySelector('[name="time"]').value.trim(),
        rival: row.querySelector('[name="rival"]').value.trim(),
        category: row.querySelector('[name="category"]').value,
        venue: row.querySelector('[name="venue"]').value.trim()
      }));
      setEditableFixture(matches);
      renderAdminPanelContent(layer, "fixture");
    });
  }

  if (tab === "news") {
    const textarea = layer.querySelector('[name="news"]');
    const counter = layer.querySelector("[data-admin-news-count]");
    textarea?.addEventListener("input", () => {
      if (counter) counter.textContent = textarea.value.length;
    });
    layer.querySelector("[data-admin-news-panel]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = textarea.value.trim();
      if (!text) return;
      savePost("news", text);
      renderFeedPanels();
      renderAdminPanelContent(layer, "news");
    });
  }

  if (tab === "stats") {
    layer.querySelector("[data-admin-stats-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const stats = getStatsOverrides();
      layer.querySelectorAll("[data-player-stat]").forEach((row) => {
        stats[row.dataset.playerStat] = {
          goals: Number(row.querySelector('[name="goals"]').value || 0),
          yellow: Number(row.querySelector('[name="yellow"]').value || 0),
          red: Number(row.querySelector('[name="red"]').value || 0)
        };
      });
      setStatsOverrides(stats);
      renderLandingStats();
      renderAdminPanelContent(layer, "stats");
    });
  }
}

function showAdminPanel() {
  if (!isAdmin()) return;
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="app-modal admin-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">Ã—</button>
      <h2>Carga de datos</h2>
      <div class="admin-tabs">
        ${adminPanelTabButton("dashboard", "Panel", true)}
        ${adminPanelTabButton("categories", "Categorias")}
        ${adminPanelTabButton("fixture", "Fixture")}
        ${adminPanelTabButton("news", "Noticias")}
        ${adminPanelTabButton("stats", "Estadisticas")}
        ${adminPanelTabButton("community", "Comunidad")}
        ${adminPanelTabButton("media", "Fotos / Ads")}
      </div>
      <div class="admin-panel-body" data-admin-panel-body></div>
    </section>
  `, "admin-layer");

  layer.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => renderAdminPanelContent(layer, button.dataset.adminTab));
  });
  renderAdminPanelContent(layer, "dashboard");
}

function showNotificationsModal() {
  const read = new Set(getReadNotificationIds());
  const layer = modalShell(`
    <div class="modal-scrim glass-scrim"></div>
    <section class="notifications-modal">
      <button type="button" class="modal-close glass-close" data-close-modal aria-label="Cerrar">×</button>
      <button type="button" class="floating-home-button notifications-home" data-close-modal>Inicio</button>
      <h2>Notificaciones</h2>
      <div class="notification-list">
        ${notificationMessages.map((message) => `
          <button type="button" class="notification-card ${read.has(message.id) ? "read" : "unread"}" data-notification-id="${message.id}">
            <span class="unread-dot"></span>
            <strong>${message.title}</strong>
            <p>${message.body}</p>
          </button>
        `).join("")}
      </div>
    </section>
  `, "notifications-layer");

  layer.querySelectorAll("[data-notification-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const current = new Set(getReadNotificationIds());
      current.add(card.dataset.notificationId);
      setReadNotificationIds([...current]);
      card.classList.remove("unread");
      card.classList.add("read");
    });
  });
}

function handleLogout() {
  setSession(false, getCurrentUserName());
  showLoginModal("Saliste de la cancha. Volvé a ingresar cuando quieras.");
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (action) {
    action.classList.remove("just-clicked");
    window.requestAnimationFrame(() => action.classList.add("just-clicked"));

    if (action.dataset.action === "account") showAccountModal();
    if (action.dataset.action === "admin-panel") showAdminPanel();
    if (action.dataset.action === "notifications") showNotificationsModal();
    if (action.dataset.action === "logout") handleLogout();
    if (action.dataset.action === "tactical-board") showTacticalBoardModal();
    if (action.dataset.action === "community-chat") showCommunityChatModal();
    if (action.dataset.action === "gallery") showGalleryModal();
    if (action.dataset.action === "fixture") showFixtureModal();
    if (action.dataset.action === "scorers") showScorersModal();
    if (action.dataset.action === "share-table") shareActiveTable();
    if (action.dataset.action === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (event.target.closest("[data-standings-prev]")) {
    shiftStandings(-1);
    return;
  }

  if (event.target.closest("[data-standings-next]")) {
    shiftStandings(1);
    return;
  }

  const button = event.target.closest("[data-noop]");
  if (!button) return;

  button.classList.remove("just-clicked");
  window.requestAnimationFrame(() => button.classList.add("just-clicked"));
});

updateAccountState();
updateNotificationBadge();
updateWeatherChip();
setupBlogForms();
renderFeedPanels();
setupLandingStatsControls();
renderLandingStats();
renderStandingsPanel();
setupHeroCarousel();
window.setInterval(updateWeatherChip, 1000 * 60 * 60 * 6);
