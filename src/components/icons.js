const iconMap = {
  user: '<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
  settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05a2.1 2.1 0 0 1-2.97 2.97l-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21a2.1 2.1 0 0 1-4.2 0v-.08a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.05.05a2.1 2.1 0 0 1-2.97-2.97l.05-.05a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.65-1.1H3a2.1 2.1 0 0 1 0-4.2h.08a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-2l-.05-.05a2.1 2.1 0 0 1 2.97-2.97l.05.05a1.8 1.8 0 0 0 2 .36 1.8 1.8 0 0 0 1.1-1.65V3a2.1 2.1 0 0 1 4.2 0v.08a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.05-.05a2.1 2.1 0 0 1 2.97 2.97l-.05.05a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.65 1.1H21a2.1 2.1 0 0 1 0 4.2h-.08A1.8 1.8 0 0 0 19.4 15Z"/>',
  logout: '<path d="M4 17h6l2.5-3"/><path d="M5 10 8 17"/><path d="M9 9 11 16"/><path d="M3.5 17.5c1.8.9 5.5.9 7.5.1"/><circle cx="14" cy="13" r="2.1"/><path d="M17 6h5v12h-5"/><path d="M18.5 12H22"/><path d="m20 9 3 3-3 3"/>',
  trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M5 6H3a4 4 0 0 0 4 4"/><path d="M19 6h2a4 4 0 0 1-4 4"/>',
  field: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2"/><path d="M3 9h4v6H3"/><path d="M21 9h-4v6h4"/>',
  newspaper: '<path d="M4 5h14a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5Z"/><path d="M8 9h7"/><path d="M8 13h8"/><path d="M8 17h5"/><path d="M20 8h1v9a2 2 0 0 1-2 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M2 21v-2a4 4 0 0 1 3-3.87"/><path d="M8 3.13a4 4 0 0 0 0 7.75"/>',
  football: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 5h-5L8 10l4-3Z"/><path d="M12 7V3"/><path d="m16 10 4-1"/><path d="m14.5 15 2.5 4"/><path d="m9.5 15-2.5 4"/><path d="m8 10-4-1"/>',
  handshake: '<path d="m11 17 2 2a2.8 2.8 0 0 0 4-4l-3-3"/><path d="m7 11 4-4 3 3"/><path d="M2 12 7 7l4 4"/><path d="m22 12-5-5-3 3"/><path d="m8 16 2 2"/><path d="m6 14 2 2"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-7h6v7"/>',
  shirt: '<path d="M16 3 14 6h-4L8 3 3 6l3 5 2-1v11h8V10l2 1 3-5-5-3Z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="m21 15-5-5L5 19"/>',
  arrow: '<path d="M9 18 15 12 9 6"/>'
};

export function icon(name, className = "") {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconMap[name] || iconMap.shield}</svg>`;
}
