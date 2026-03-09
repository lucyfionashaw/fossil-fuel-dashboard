// colors.js — Shared color palette across all dashboard pages
// Include this file BEFORE page-specific scripts

const PALETTE = {
    // === COMMODITY COLORS (when comparing coal vs oil vs gas) ===
    coal: '#2d2d2d',        // near-black
    coalLight: '#5a5a5a',
    oil: '#c0392b',         // red
    oilLight: '#e74c3c',
    gas: '#95a5a6',         // grey
    gasLight: '#bdc3c7',

    // === TECHNOLOGY / GENERATION COLORS (electricity mix charts) ===
    // Fossil fuels as grey gradient (coal darkest, gas lightest)
    techCoal: '#3d3d3d',
    techOil: '#777777',
    techGas: '#b0b0b0',
    // Clean energy with distinctive colors
    solar: '#f1c40f',       // yellow
    wind: '#3498db',        // blue
    hydro: '#2980b9',       // deeper blue
    nuclear: '#e84393',     // pink
    biomass: '#27ae60',     // green
    otherRenew: '#1abc9c',  // teal
    geothermal: '#d35400',  // burnt orange

    // === POLITICAL COLORS ===
    democrat: '#2166ac',    // blue
    republican: '#d6604d',  // red
    independent: '#7f8c8d',
    otherParty: '#95a5a6',

    // === UI COLORS ===
    accent: '#16a085',
    bg: '#f8f9fa',
    cardBg: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#e0e0e0',
};

// === CONSISTENT COUNTRY COLORS (same color per country across all pages) ===
const COUNTRY_COLORS = {
    "China": "#e63946",
    "United States": "#457b9d",
    "USA": "#457b9d",
    "Russia": "#2a9d8f",
    "Saudi Arabia": "#264653",
    "India": "#f4a261",
    "Indonesia": "#2d6a4f",
    "Australia": "#7209b7",
    "Canada": "#1d3557",
    "Iran": "#606c38",
    "Brazil": "#06d6a0",
    "Iraq": "#bc6c25",
    "UAE": "#8338ec",
    "Qatar": "#ff006e",
    "Norway": "#3a86ff",
    "Kuwait": "#fb5607",
    "South Africa": "#e9c46a",
    "Kazakhstan": "#8ac926",
    "Mongolia": "#6a040f",
    "Germany": "#495057",
    "Turkey": "#d62828",
    "Poland": "#9d4edd",
    "Colombia": "#007f5f",
    "Mexico": "#d00000",
    "Algeria": "#023e8a",
    "Nigeria": "#005f73",
    "Angola": "#bb3e03",
    "Libya": "#0a9396",
    "Venezuela": "#ca6702",
    "Oman": "#ee9b00",
    "Vietnam": "#9b2226",
    "Turkmenistan": "#ae2012",
    "Malaysia": "#48cae4",
    "Egypt": "#00b4d8",
    "Uzbekistan": "#118ab2",
    "Argentina": "#073b4c",
    "Thailand": "#ef476f",
    "United Kingdom": "#ffc300",
    "UK": "#ffc300",
    "Pakistan": "#3d5a80",
    "Azerbaijan": "#7b2cbf",
    "Ecuador": "#c77dff",
    "Guyana": "#80b918",
    "Mozambique": "#5390d9",
    "Philippines": "#b5179e",
    "Ukraine": "#560bad",
    "Czech Republic": "#480ca8",
    "Botswana": "#e0aaff",
    "Trinidad & Tobago": "#4cc9f0",
    "Bangladesh": "#4895ef",
    "Israel": "#4361ee",
    "Japan": "#ff7b00",
    "South Korea": "#1e6091",
    "Taiwan": "#b08968",
    "Netherlands": "#ff6700",
    "Italy": "#2dc653",
    "France": "#003049",
    "Spain": "#d90429",
    "Sweden": "#006d77",
    "Chile": "#7400b8",
    "Peru": "#e63946",
    "Myanmar": "#588157",
    "Laos": "#a7c957",
    "Cambodia": "#6b705c",
    "Tanzania": "#bc4749",
    "Zimbabwe": "#a68a64",
    "Zambia": "#656d4a",
    "Congo (DRC)": "#414833",
    "Madagascar": "#718355",
    "Bangladesh": "#4895ef",
    "Sri Lanka": "#540b0e",
    "Nepal": "#9b2335",
    "Rest of World": "#adb5bd",
};

function getCountryColor(country) {
    return COUNTRY_COLORS[country] || '#adb5bd';
}

// Utility: format numbers
function fmt(n, decimals = 0) {
    if (n == null) return '—';
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
