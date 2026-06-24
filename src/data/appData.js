export const assets = {
  logos: {
    villa: "./assets/logos/villa-maristas.png",
    sanIgnacio: "./assets/logos/san-ignacio.svg",
    outcomy: "./assets/logos/outcomy.png"
  },
  backgrounds: {
    hero: "./assets/backgrounds/hero-main.png",
    home: "./assets/backgrounds/fondo.png"
  },
  ads: [
    "./assets/ads/publi-01.png",
    "./assets/ads/publi-02.png",
    "./assets/ads/publi-03.png",
    "./assets/ads/publi-04.png",
    "./assets/ads/publi-05.png",
    "./assets/ads/publi-06.png",
    "./assets/ads/publi-07.png",
    "./assets/ads/publi-08.png",
    "./assets/ads/publi-09.png",
    "./assets/ads/publi-10.png"
  ],
  auth: {
    loginReference: "./assets/auth/login-reference.png",
    contractCard: "./assets/auth/contract-card.png",
    logoutIcon: "./assets/auth/logout-icon.png",
    playerContract: "./assets/auth/player-contract.png"
  },
  header: {
    mascot: "./assets/header/mascot.png",
    season: "./assets/header/season-2026.png"
  }
};

export const tournament = {
  name: "Villa Maristas",
  season: "Temporada 2026",
  location: "Mar del Plata",
  values: "Pasión · Respeto · Comunidad"
};

export const headerActions = [
  { id: "account", label: "Mi cuenta", icon: "user" },
  { id: "logout", label: "Cerrar sesión", icon: "logout", image: assets.auth.logoutIcon }
];

export const localUser = {
  username: "pablo pellizzoni",
  password: "vale292408",
  fullName: "Pablo Pellizzoni",
  role: "user",
  team: "Tejedor FC",
  category: "2012"
};

export const seedUsers = [
  {
    username: "administrador",
    password: "admin2026",
    fullName: "Administrador Villa Maristas",
    role: "admin",
    team: "Tejedor FC",
    category: "2012"
  },
  {
    username: "organizador",
    password: "villa2026",
    fullName: "Organizador Villa Maristas",
    role: "organizer",
    team: "Tejedor FC",
    category: "2012"
  }
];

export const notificationMessages = [
  {
    id: "match-reminder",
    title: "Próximo partido",
    body: "Recordá que este sábado se juega a las 16:00 hs en Cancha Principal Villa Maristas."
  },
  {
    id: "discipline",
    title: "Fair Play",
    body: "Revisá la lista de jugadores expulsados antes de confirmar el equipo para la fecha."
  },
  {
    id: "encouragement",
    title: "Mensaje del torneo",
    body: "El partido anterior dejó buenas sensaciones: sigamos jugando en equipo y cuidando la comunidad."
  }
];

export const menuCards = [
  {
    id: "fixture",
    number: 1,
    title: "Fixture",
    subtitle: "Fechas, horarios y resultados",
    icon: "field"
  },
  {
    id: "goleadores",
    number: 4,
    title: "Goleadores",
    subtitle: "Tabla de goleadores y estadísticas",
    icon: "football"
  }
];

export const nextMatch = {
  title: "Próximo partido",
  countdown: ["2D", "14H", "35M"],
  teamA: {
    name: "Villa Maristas",
    logo: assets.logos.villa
  },
  teamB: {
    name: "San Ignacio",
    logo: assets.logos.sanIgnacio
  },
  details: [
    { icon: "calendar", label: "Sábado 24 de Mayo" },
    { icon: "clock", label: "16:00 hs" },
    { icon: "pin", label: "Cancha Principal Villa Maristas" }
  ]
};

export const standings = [
  { position: 1, team: "Villa Maristas", logo: assets.logos.villa, played: 8, goalDifference: "+12", points: 21 },
  { position: 2, team: "San Ignacio", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "+7", points: 16 },
  { position: 3, team: "Los Andes", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "+4", points: 13 },
  { position: 4, team: "San José", logo: assets.logos.villa, played: 8, goalDifference: "-1", points: 11 },
  { position: 5, team: "Unión del Sur", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "+1", points: 10 },
  { position: 6, team: "Banco Provincia", logo: assets.logos.villa, played: 8, goalDifference: "0", points: 10 },
  { position: 7, team: "Tejedor FC", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-2", points: 9 },
  { position: 8, team: "Suecia", logo: assets.logos.villa, played: 8, goalDifference: "+2", points: 9 },
  { position: 9, team: "C.A. Norte", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-3", points: 8 },
  { position: 10, team: "Libertad", logo: assets.logos.villa, played: 8, goalDifference: "-4", points: 8 },
  { position: 11, team: "Mar del Plata FC", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-5", points: 7 },
  { position: 12, team: "Quilmes", logo: assets.logos.villa, played: 8, goalDifference: "-6", points: 7 },
  { position: 13, team: "Chapadmalal", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-7", points: 6 },
  { position: 14, team: "Alvarado", logo: assets.logos.villa, played: 8, goalDifference: "-8", points: 6 },
  { position: 15, team: "Kimberley", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-9", points: 5 },
  { position: 16, team: "Once Unidos", logo: assets.logos.villa, played: 8, goalDifference: "-10", points: 5 },
  { position: 17, team: "San Lorenzo", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-11", points: 4 },
  { position: 18, team: "Nación", logo: assets.logos.villa, played: 8, goalDifference: "-12", points: 4 },
  { position: 19, team: "General Urquiza", logo: assets.logos.sanIgnacio, played: 8, goalDifference: "-13", points: 3 },
  { position: 20, team: "Atlético Sur", logo: assets.logos.villa, played: 8, goalDifference: "-14", points: 2 }
];

export const standingsByCategory = [
  { id: "2012", label: "Categoria 2012", rows: standings },
  {
    id: "2013",
    label: "Categoria 2013",
    rows: standings.map((row, index) => ({
      ...row,
      position: index + 1,
      played: 7,
      goalDifference: index === 0 ? "+9" : index < 6 ? `+${6 - index}` : `-${index - 5}`,
      points: Math.max(3, 19 - index)
    }))
  },
  {
    id: "2011",
    label: "Categoria 2011",
    rows: standings.map((row, index) => ({
      ...row,
      position: index + 1,
      played: 9,
      goalDifference: index === 0 ? "+15" : index < 5 ? `+${8 - index}` : `-${index - 4}`,
      points: Math.max(2, 24 - index)
    }))
  }
];

export const fixtureMatches = [
  { id: "fixture-1", day: "SAB", date: "24/05", time: "15:30 hs", rival: "Suecia", category: "2012", venue: "Villa Marista" },
  { id: "fixture-2", day: "DOM", date: "01/06", time: "11:00 hs", rival: "Banco Provincia", category: "2012", venue: "Villa Marista" }
];

export const initialGalleryPhotos = [];

export const tacticalMatch = {
  title: "Próximo partido",
  date: "Fecha 7",
  fixture: "Tejedor FC vs Suecia",
  venue: "Villa Marista",
  opponent: "Suecia",
  ownTeam: "Tejedor FC",
  ownPosition: 5,
  opponentPosition: 2
};

export const tacticalFormations = [
  {
    id: "3-4-1",
    label: "3-4-1 + Arquero",
    slots: [
      { role: "ARQ", x: 50, y: 89 },
      { role: "DEF", x: 25, y: 73 },
      { role: "DEF", x: 50, y: 73 },
      { role: "DEF", x: 75, y: 73 },
      { role: "VOL", x: 28, y: 52 },
      { role: "VOL", x: 45, y: 57 },
      { role: "VOL", x: 63, y: 57 },
      { role: "VOL", x: 82, y: 52 },
      { role: "DEL", x: 50, y: 38 },
      { role: "DEL", x: 50, y: 17 }
    ]
  },
  {
    id: "3-3-2",
    label: "3-3-2 + Arquero",
    slots: [
      { role: "ARQ", x: 50, y: 89 },
      { role: "DEF", x: 24, y: 73 },
      { role: "DEF", x: 50, y: 73 },
      { role: "DEF", x: 76, y: 73 },
      { role: "VOL", x: 30, y: 53 },
      { role: "VOL", x: 50, y: 56 },
      { role: "VOL", x: 70, y: 53 },
      { role: "DEL", x: 38, y: 28 },
      { role: "DEL", x: 62, y: 28 }
    ]
  },
  {
    id: "4-3-1",
    label: "4-3-1 + Arquero",
    slots: [
      { role: "ARQ", x: 50, y: 89 },
      { role: "DEF", x: 18, y: 72 },
      { role: "DEF", x: 39, y: 75 },
      { role: "DEF", x: 61, y: 75 },
      { role: "DEF", x: 82, y: 72 },
      { role: "VOL", x: 30, y: 53 },
      { role: "VOL", x: 50, y: 57 },
      { role: "VOL", x: 70, y: 53 },
      { role: "DEL", x: 50, y: 25 }
    ]
  }
];

export const tacticalPlayers = [
  { id: "martin-rojas", number: 1, shirt: 1, name: "Martín Rojas", shortName: "M. Rojas", role: "ARQ", pj: 6, yellow: 1, red: 0, goals: 3, passes: 0, attendance: "none" },
  { id: "lucas-mendez", number: 2, shirt: 4, name: "Lucas Méndez", shortName: "L. Méndez", role: "DEF", pj: 6, yellow: 2, red: 0, goals: 1, passes: 0, attendance: "none" },
  { id: "nicolas-alvarez", number: 3, shirt: 3, name: "Nicolás Alvarez", shortName: "N. Alvarez", role: "DEF", pj: 6, yellow: 0, red: 0, goals: 0, passes: 0, attendance: "none" },
  { id: "bruno-delgado", number: 4, shirt: 5, name: "Bruno Delgado", shortName: "B. Delgado", role: "DEF", pj: 6, yellow: 1, red: 0, goals: 0, passes: 0, attendance: "none" },
  { id: "santiago-villar", number: 5, shirt: 6, name: "Santiago Villar", shortName: "S. Villar", role: "VOL", pj: 6, yellow: 1, red: 0, goals: 2, passes: 0, attendance: "none" },
  { id: "tomas-fernandez", number: 6, shirt: 8, name: "Tomás Fernández", shortName: "T. Fernández", role: "VOL", pj: 6, yellow: 2, red: 0, goals: 1, passes: 0, attendance: "none" },
  { id: "ignacio-castro", number: 7, shirt: 10, name: "Ignacio Castro", shortName: "I. Castro", role: "VOL", pj: 6, yellow: 0, red: 0, goals: 4, passes: 1, attendance: "none" },
  { id: "mateo-gomez", number: 8, shirt: 7, name: "Mateo Gómez", shortName: "M. Gómez", role: "DEL", pj: 6, yellow: 1, red: 0, goals: 2, passes: 0, attendance: "none" },
  { id: "facundo-morales", number: 9, shirt: 9, name: "Facundo Morales", shortName: "F. Morales", role: "DEL", pj: 6, yellow: 0, red: 0, goals: 3, passes: 0, attendance: "none" },
  { id: "julian-peralta", number: 10, shirt: 11, name: "Julián Peralta", shortName: "J. Peralta", role: "DEL", pj: 6, yellow: 1, red: 0, goals: 1, passes: 0, attendance: "none" },
  { id: "emiliano-lopez", number: 11, shirt: 2, name: "Emiliano López", shortName: "E. López", role: "DEF", pj: 6, yellow: 0, red: 0, goals: 0, passes: 0, attendance: "none" },
  { id: "benjamin-acosta", number: 12, shirt: 12, name: "Benjamín Acosta", shortName: "B. Acosta", role: "VOL", pj: 4, yellow: 1, red: 0, goals: 0, passes: 0, attendance: "none" }
];

export const bottomNav = [
  { id: "home", label: "Inicio", icon: "home", active: true },
  { id: "tactical-board", label: "Mi equipo", icon: "shirt", active: false },
  { id: "gallery", label: "Galería de fotos", icon: "image", active: false }
];
