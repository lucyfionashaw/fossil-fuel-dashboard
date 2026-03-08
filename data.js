// =====================================================================
// DATA.JS — All dashboard data embedded for static GitHub Pages hosting
// Global Fossil Fuel Market Value Dashboard (Task 1)
// Data year: 2024 (coal, gas) / 2023 (oil)
// =====================================================================

const COAL_DATA = [
    { rank: 1, country: "China", type: "Thermal", production: 3710, price: 107, benchmark: "Qinhuangdao 5500 kcal", value: 396970, notes: "QHD avg ~RMB 750-863/t" },
    { rank: 1, country: "China", type: "Metallurgical", production: 465, price: 242, benchmark: "PLV HCC FOB Aus proxy", value: 112530, notes: "Coking coal" },
    { rank: 1, country: "China", type: "Other/Lignite", production: 491, price: 50, benchmark: "Estimated", value: 24550, notes: "Anthracite, PCI, other" },
    { rank: 2, country: "India", type: "Thermal", production: 1020, price: 30, benchmark: "CIL blended all-in (incl. levies)", value: 30600, notes: "CIL FSA+levies ~Rs2270/t ($27); e-auction ~$42; blended ~$30/t" },
    { rank: 2, country: "India", type: "Metallurgical", production: 28, price: 280, benchmark: "PLV HCC import + duties", value: 7840, notes: "Import parity + customs/GST" },
    { rank: 3, country: "Indonesia", type: "Thermal", production: 833, price: 122, benchmark: "HBA 6322 kcal GAR", value: 101626, notes: "Record 831-836 Mt" },
    { rank: 4, country: "USA", type: "Thermal", production: 400, price: 42, benchmark: "EIA avg thermal mine", value: 16800, notes: "$37.85/short ton" },
    { rank: 4, country: "USA", type: "Metallurgical", production: 65, price: 198, benchmark: "EIA avg met mine", value: 12870, notes: "$180/short ton" },
    { rank: 5, country: "Australia", type: "Thermal", production: 250, price: 134, benchmark: "Newcastle FOB 6000 kcal", value: 33500, notes: "~55% thermal" },
    { rank: 5, country: "Australia", type: "Metallurgical", production: 213, price: 242, benchmark: "PLV HCC FOB", value: 51546, notes: "World's largest met exporter" },
    { rank: 6, country: "Russia", type: "Thermal", production: 360, price: 80, benchmark: "Estimated blended", value: 28800, notes: "Sanctions impact" },
    { rank: 6, country: "Russia", type: "Metallurgical", production: 67, price: 200, benchmark: "Estimated", value: 13400, notes: "Pacific port exports" },
    { rank: 7, country: "South Africa", type: "Thermal", production: 237, price: 88, benchmark: "Richards Bay 5500 kcal", value: 20856, notes: "RBCT 52.1 Mt" },
    { rank: 8, country: "Kazakhstan", type: "Mixed", production: 109, price: 60, benchmark: "Estimated", value: 6540, notes: "108.5 Mt" },
    { rank: 9, country: "Mongolia", type: "Metallurgical", production: 75, price: 200, benchmark: "China import proxy", value: 15000, notes: "Mostly met for China" },
    { rank: 9, country: "Mongolia", type: "Thermal", production: 23, price: 80, benchmark: "Estimated", value: 1840, notes: "Some thermal" },
    { rank: 10, country: "Germany", type: "Lignite", production: 86, price: 25, benchmark: "Est. pit-mouth", value: 2150, notes: "100% lignite" },
    { rank: 11, country: "Turkey", type: "Lignite", production: 87, price: 30, benchmark: "Estimated", value: 2610, notes: ">90% lignite" },
    { rank: 12, country: "Poland", type: "Hard coal", production: 44, price: 85, benchmark: "Estimated", value: 3740, notes: "Declining" },
    { rank: 12, country: "Poland", type: "Lignite", production: 40, price: 25, benchmark: "Est. pit-mouth", value: 1000, notes: "Belchatow + Turow" },
    { rank: 13, country: "Colombia", type: "Thermal", production: 63, price: 88, benchmark: "Richards Bay proxy", value: 5544, notes: "Export-oriented" },
    { rank: 14, country: "Vietnam", type: "Thermal", production: 44, price: 80, benchmark: "Estimated", value: 3520, notes: "Anthracite" },
    { rank: 15, country: "Canada", type: "Metallurgical", production: 29, price: 242, benchmark: "PLV HCC FOB", value: 7018, notes: "67% met" },
    { rank: 15, country: "Canada", type: "Thermal", production: 14, price: 60, benchmark: "Estimated", value: 840, notes: "Declining" },
    { rank: 16, country: "Czech Republic", type: "Lignite", production: 24, price: 25, benchmark: "Estimated", value: 600, notes: "~25 Mt total" },
    { rank: 16, country: "Czech Republic", type: "Hard coal", production: 1, price: 80, benchmark: "Estimated", value: 80, notes: "Minimal" },
    { rank: 17, country: "Ukraine", type: "Mixed", production: 17, price: 70, benchmark: "Estimated", value: 1190, notes: "War-impacted" },
    { rank: 18, country: "Pakistan", type: "Thermal/Lignite", production: 17, price: 30, benchmark: "Estimated", value: 510, notes: "Thar lignite" },
    { rank: 19, country: "Mozambique", type: "Mixed", production: 16, price: 130, benchmark: "FOB estimate", value: 2080, notes: "Moatize mine" },
    { rank: 20, country: "Philippines", type: "Thermal", production: 17, price: 60, benchmark: "Estimated", value: 1020, notes: "Semirara Island" },
    { rank: 21, country: "Botswana", type: "Thermal", production: 3, price: 50, benchmark: "Estimated", value: 150, notes: "Morupule Coal Mine" },
    { rank: null, country: "Rest of World", type: "Mixed", production: 252, price: 60, benchmark: "Estimated", value: 15120, notes: "~60+ countries" },
];

const OIL_DATA = [
    { rank: 1, country: "United States", production: 13200, grade: "WTI (Cushing)", quality: "Light Sweet", price: 76.55, diff: -3.95, value: 368.8 },
    { rank: 2, country: "Russia", production: 9200, grade: "Urals", quality: "Medium Sour", price: 70.00, diff: -10.50, value: 235.1 },
    { rank: 3, country: "Saudi Arabia", production: 9000, grade: "Arab Light", quality: "Medium Sour", price: 80.50, diff: 0.00, value: 264.4 },
    { rank: 4, country: "Canada", production: 4600, grade: "WCS/Syncrude/Conv", quality: "Heavy Sour", price: 61.00, diff: -19.50, value: 102.4 },
    { rank: 5, country: "Iraq", production: 4300, grade: "Basra Medium", quality: "Medium Sour", price: 79.00, diff: -1.50, value: 124.0 },
    { rank: 6, country: "China", production: 4200, grade: "Daqing/Shengli", quality: "Medium Sweet", price: 80.00, diff: -0.50, value: 122.6 },
    { rank: 7, country: "UAE", production: 3500, grade: "Murban", quality: "Light Sour", price: 79.50, diff: -1.00, value: 101.6 },
    { rank: 8, country: "Iran", production: 3400, grade: "Iran Heavy", quality: "Medium Sour", price: 68.00, diff: -12.50, value: 84.4 },
    { rank: 9, country: "Brazil", production: 3500, grade: "Tupi/Lula", quality: "Medium Sweet", price: 80.00, diff: -0.50, value: 102.2 },
    { rank: 10, country: "Kuwait", production: 2500, grade: "Kuwait Export", quality: "Medium Sour", price: 79.00, diff: -1.50, value: 72.1 },
    { rank: 11, country: "Norway", production: 1800, grade: "Johan Sverdrup", quality: "Medium Sweet", price: 80.50, diff: 0.00, value: 52.9 },
    { rank: 12, country: "Mexico", production: 1600, grade: "Maya", quality: "Heavy Sour", price: 70.00, diff: -10.50, value: 40.9 },
    { rank: 13, country: "Kazakhstan", production: 1600, grade: "CPC Blend", quality: "Light Sweet", price: 79.00, diff: -1.50, value: 46.1 },
    { rank: 14, country: "Qatar", production: 600, grade: "Qatar Marine", quality: "Medium Sour", price: 79.00, diff: -1.50, value: 17.3 },
    { rank: 15, country: "Algeria", production: 1000, grade: "Saharan Blend", quality: "Light Sweet", price: 82.00, diff: 1.50, value: 29.9 },
    { rank: 16, country: "Nigeria", production: 1300, grade: "Bonny Light", quality: "Light Sweet", price: 81.00, diff: 0.50, value: 38.4 },
    { rank: 17, country: "Angola", production: 1100, grade: "Girassol", quality: "Medium Sweet", price: 80.00, diff: -0.50, value: 32.1 },
    { rank: 18, country: "Libya", production: 1100, grade: "Es Sider", quality: "Light Sweet", price: 81.00, diff: 0.50, value: 32.5 },
    { rank: 19, country: "Oman", production: 800, grade: "Oman Crude", quality: "Medium Sour", price: 79.00, diff: -1.50, value: 23.1 },
    { rank: 20, country: "UK", production: 600, grade: "Brent Blend", quality: "Light Sweet", price: 80.50, diff: 0.00, value: 17.6 },
    { rank: 21, country: "Guyana", production: 620, grade: "Liza/Payara", quality: "Medium Sweet", price: 79.50, diff: -1.00, value: 18.0 },
    { rank: 22, country: "Colombia", production: 700, grade: "Vasconia", quality: "Medium Sour", price: 77.00, diff: -3.50, value: 19.7 },
    { rank: 23, country: "Azerbaijan", production: 600, grade: "Azeri Light", quality: "Light Sweet", price: 81.00, diff: 0.50, value: 17.7 },
    { rank: 24, country: "Argentina", production: 700, grade: "Medanito/Escalante", quality: "Medium Sweet", price: 76.00, diff: -4.50, value: 19.4 },
    { rank: 25, country: "Venezuela", production: 800, grade: "Merey 16", quality: "Heavy Sour", price: 62.00, diff: -18.50, value: 18.1 },
    { rank: 26, country: "India", production: 600, grade: "Mumbai High/Ravva", quality: "Light Sweet", price: 78.00, diff: -2.50, value: 17.1 },
    { rank: 27, country: "Indonesia", production: 600, grade: "Minas/Duri", quality: "Heavy Sweet", price: 76.00, diff: -4.50, value: 16.6 },
    { rank: 28, country: "Ecuador", production: 475, grade: "Oriente", quality: "Heavy Sour", price: 72.00, diff: -8.50, value: 12.5 },
    { rank: 29, country: "Egypt", production: 550, grade: "Belayim", quality: "Medium Sour", price: 77.00, diff: -3.50, value: 15.5 },
];

const GAS_DATA = [
    { rank: 1, country: "United States", production: 1035, region: "North America", benchmark: 2.57, domestic: 2.57, regime: "Henry Hub", value: 90790 },
    { rank: 2, country: "Russia", production: 586, region: "Regulated", benchmark: 1.80, domestic: 1.80, regime: "Regulated", value: 35997 },
    { rank: 3, country: "Iran", production: 259, region: "Subsidized", benchmark: 0.50, domestic: 0.50, regime: "Multi-tier", value: 4419 },
    { rank: 4, country: "China", production: 234, region: "Mixed", benchmark: 8.50, domestic: 8.50, regime: "Mixed", value: 67881 },
    { rank: 5, country: "Canada", production: 190, region: "North America", benchmark: 2.14, domestic: 2.14, regime: "AECO-C", value: 13873 },
    { rank: 6, country: "Qatar", production: 178, region: "Subsidized/LNG", benchmark: 1.25, domestic: 1.25, regime: "Administered", value: 7589 },
    { rank: 7, country: "Australia", production: 152, region: "Export netback", benchmark: 9.00, domestic: 9.00, regime: "LNG netback", value: 46694 },
    { rank: 8, country: "Saudi Arabia", production: 121, region: "Administered", benchmark: 1.25, domestic: 1.25, regime: "Govt-set", value: 5160 },
    { rank: 9, country: "Norway", production: 116, region: "Europe", benchmark: 13.00, domestic: 13.00, regime: "TTF", value: 51464 },
    { rank: 10, country: "Algeria", production: 102, region: "Subsidized/export", benchmark: 1.00, domestic: 1.00, regime: "Subsidized", value: 3479 },
    { rank: 11, country: "Turkmenistan", production: 87, region: "Regulated", benchmark: 1.00, domestic: 1.00, regime: "Regulated", value: 2968 },
    { rank: 12, country: "Malaysia", production: 76, region: "Mixed/LNG", benchmark: 6.00, domestic: 6.00, regime: "Mixed", value: 15556 },
    { rank: 13, country: "Egypt", production: 65, region: "Subsidized", benchmark: 2.50, domestic: 2.50, regime: "Deregulating", value: 5544 },
    { rank: 14, country: "Indonesia", production: 57, region: "Regulated/LNG", benchmark: 5.00, domestic: 5.00, regime: "Regulated", value: 9724 },
    { rank: 15, country: "UAE", production: 57, region: "Administered", benchmark: 1.50, domestic: 1.50, regime: "Old contracts", value: 2916 },
    { rank: 16, country: "Uzbekistan", production: 48, region: "Regulated", benchmark: 1.00, domestic: 1.00, regime: "Regulated", value: 1638 },
    { rank: 17, country: "Argentina", production: 43, region: "Regulated", benchmark: 4.50, domestic: 4.50, regime: "Regulated", value: 6604 },
    { rank: 18, country: "Oman", production: 41, region: "Administered", benchmark: 3.39, domestic: 3.39, regime: "Reformed", value: 4744 },
    { rank: 19, country: "Nigeria", production: 40, region: "Subsidized/LNG", benchmark: 2.00, domestic: 2.00, regime: "Dual pricing", value: 2730 },
    { rank: 20, country: "United Kingdom", production: 38, region: "Europe", benchmark: 12.50, domestic: 12.50, regime: "NBP", value: 16210 },
    { rank: 21, country: "Pakistan", production: 37, region: "Regulated", benchmark: 3.50, domestic: 3.50, regime: "Regulated", value: 4418 },
    { rank: 22, country: "Azerbaijan", production: 34, region: "Mixed", benchmark: 3.00, domestic: 3.00, regime: "Mixed", value: 3480 },
    { rank: 23, country: "India", production: 33, region: "Regulated", benchmark: 6.50, domestic: 6.50, regime: "APM + import", value: 7321 },
    { rank: 24, country: "Mexico", production: 31, region: "HH-linked", benchmark: 3.50, domestic: 3.50, regime: "HH-linked", value: 3702 },
    { rank: 25, country: "Thailand", production: 31, region: "Regulated", benchmark: 7.00, domestic: 7.00, regime: "Regulated", value: 7405 },
    { rank: 26, country: "Trinidad & Tobago", production: 28, region: "LNG export", benchmark: 5.00, domestic: 5.00, regime: "LNG export", value: 4775 },
    { rank: 27, country: "Kazakhstan", production: 27, region: "Regulated", benchmark: 1.50, domestic: 1.50, regime: "Regulated", value: 1382 },
    { rank: 28, country: "Bangladesh", production: 25, region: "Regulated", benchmark: 2.00, domestic: 2.00, regime: "Regulated", value: 1706 },
    { rank: 29, country: "Israel", production: 23, region: "Mixed", benchmark: 5.50, domestic: 5.50, regime: "Contracts", value: 4317 },
    { rank: 30, country: "Brazil", production: 23, region: "Regulated", benchmark: 6.00, domestic: 6.00, regime: "Regulated", value: 4710 },
];

const TRANSPORT_COAL_SEABORNE = [
    { route: "Australia-Japan", origin: "Newcastle", dest: "Japan", vessel: "Panamax", cost: 14.50, range: "$10-20" },
    { route: "South Africa-Rotterdam", origin: "Richards Bay", dest: "Rotterdam", vessel: "Capesize", cost: 9.80, range: "$7-14" },
    { route: "Indonesia-S.China", origin: "Kalimantan", dest: "South China", vessel: "Panamax", cost: 8.10, range: "$6-12" },
    { route: "Indonesia-India West", origin: "Kalimantan", dest: "West India", vessel: "Supramax", cost: 14.00, range: "$10-18" },
    { route: "Indonesia-India East", origin: "Kalimantan", dest: "East India", vessel: "Panamax", cost: 7.00, range: "$5-10" },
    { route: "Russia-N.China", origin: "Vostochny", dest: "North China", vessel: "Panamax", cost: 7.00, range: "$5-10" },
    { route: "Colombia-Europe", origin: "Puerto Bolivar", dest: "ARA", vessel: "Capesize", cost: 12.00, range: "$8-16" },
    { route: "USA-Europe", origin: "Hampton Roads", dest: "ARA", vessel: "Capesize", cost: 15.00, range: "$10-20" },
    { route: "Mozambique-India", origin: "Nacala", dest: "India", vessel: "Panamax", cost: 18.00, range: "$14-22" },
];

const TRANSPORT_OIL = [
    { route: "ME-Asia", origin: "AG", dest: "China/Japan", vessel: "VLCC", cost: 2.25, range: "$1.50-3.00" },
    { route: "USG-China", origin: "US Gulf", dest: "China", vessel: "VLCC", cost: 4.50, range: "$4.00-5.00" },
    { route: "USG-Europe", origin: "US Gulf", dest: "NW Europe", vessel: "VLCC/Suez", cost: 2.50, range: "$2.00-3.00" },
    { route: "WAF-Europe", origin: "W Africa", dest: "NW Europe", vessel: "Suezmax", cost: 3.50, range: "$2.50-4.50" },
    { route: "WAF-Asia", origin: "W Africa", dest: "China", vessel: "VLCC", cost: 3.00, range: "$2.50-4.00" },
    { route: "Russia-India", origin: "Baltic/BS", dest: "India", vessel: "Aframax", cost: 5.00, range: "$4.00-7.00" },
];

const TRANSPORT_LNG = [
    { corridor: "US \u2192 Europe", wellhead: 2.57, liquefaction: 3.00, shipping: 0.51, regas: 0.40, total: 6.50 },
    { corridor: "US \u2192 Asia", wellhead: 2.57, liquefaction: 3.00, shipping: 1.08, regas: 0.40, total: 7.05 },
    { corridor: "Qatar \u2192 Asia", wellhead: 1.25, liquefaction: 1.75, shipping: 0.70, regas: 0.40, total: 4.10 },
    { corridor: "Australia \u2192 Asia", wellhead: 3.50, liquefaction: 2.50, shipping: 0.45, regas: 0.40, total: 6.85 },
];

// =====================================================================
// INDIA COAL SALES CHANNEL MIX (FY2024-25)
// Sources: CIL Annual Report FY25, Ministry of Coal Annual Report 2024-25,
//   PIB (pib.gov.in/PressReleasePage.aspx?PRID=2169438) — 39.81% uniform tax incidence
//   CIL Q3 FY25 results (Axis Securities): FSA Rs1,547/t, E-auction Rs2,615/t
//   Ministry of Coal Year End Review 2025 (pib.gov.in/PressReleasePage.aspx?PRID=2213723)
// =====================================================================
const INDIA_COAL_MIX = {
    cil_offtake_mt: 763,
    cil_revenue_cr: 143369,  // FY25 revenue Rs crore
    cil_avg_realization_rs: 1879,  // Derived: revenue / offtake
    channels: [
        { channel: "FSA (regulated)", pct: 85, volume_mt: 648, base_price_rs: 1547, allin_price_rs: 2163, allin_usd: 26, notes: "Q3 FY25 realization Rs1,547/t (Axis Securities)" },
        { channel: "E-Auction (spot)", pct: 14, volume_mt: 107, base_price_rs: 2615, allin_price_rs: 3656, allin_usd: 44, notes: "Q3 FY25 realization Rs2,615/t; 55-70% premium over FSA" },
        { channel: "Washed Coal", pct: 0.3, volume_mt: 2.4, base_price_rs: 3402, allin_price_rs: 4756, allin_usd: 57, notes: "2.42 Mt clean output from 13 washeries (39 MTPA capacity)" },
        { channel: "Other/Spot", pct: 0.7, volume_mt: 5.6, base_price_rs: 2000, allin_price_rs: 2796, allin_usd: 33, notes: "Special allocations, spot sales" },
    ],
    non_cil: [
        { producer: "SCCL (Singareni)", volume_mt: 69, price_usd: 30, notes: "Telangana state company; ~69 Mt FY25" },
        { producer: "Captive/Private mines", volume_mt: 198, price_usd: 38, notes: "19% of India total FY25; auction premiums" },
    ],
    // Post-Sep 2025 reform: GST Compensation Cess (Rs 400/t flat) ABOLISHED,
    // GST raised from 5% to 18%. Government uniform tax incidence: 39.81% of base.
    // As % of all-in price: 39.81/139.81 = 28.5%
    // Source: PIB pib.gov.in/PressReleasePage.aspx?PRID=2169438
    levy_regime: "post-Sep 2025 (GST 18%, no cess)",
    levy_pct_on_base: "39.81%",
    levy_pct_of_total: "~28.5%",
    levies: [
        { levy: "Royalty", rate: "14% ad-valorem", amount_rs: 217 },
        { levy: "DMF", rate: "30% of royalty", amount_rs: 65 },
        { levy: "NMET", rate: "2% of royalty", amount_rs: 4 },
        { levy: "GST", rate: "18% (post Sep 2025)", amount_rs: 330 },
    ],
    // Old regime (FY25, pre-Sep 2025) for reference:
    // GST 5% + Rs 400 flat cess = Rs 770 levies (~51% on base, ~34% of total)
    // The Rs 400 cess was highly regressive — on low-grade G-11 coal it was 65.85% of base
};

// =====================================================================
// COMMODITY COMPARISON DATA (2023-2024)
// For context: how fossil fuels compare to other global commodities
// =====================================================================
const COMMODITY_COMPARISON = [
    // Fossil fuels
    { commodity: "Oil (all liquids)", category: "Fossil Fuel", value_b: 2670, volume: "103 mb/d", unit_price: "$80.50/bbl Brent avg", source: "EIA STEO 2025", color: "#c0392b" },
    { commodity: "Coal", category: "Fossil Fuel", value_b: 750, volume: "9,100 Mt", unit_price: "$30-134/t", source: "IEA Coal 2025", color: "#3d3d3d" },
    { commodity: "Natural Gas", category: "Fossil Fuel", value_b: 680, volume: "4,124 bcm", unit_price: "$4.88/MMBtu avg", source: "IGU WGPS 2025", color: "#2980b9" },
    // Renewables investment
    { commodity: "Global Renewable Energy Investment", category: "Energy Investment", value_b: 623, volume: "~560 GW added", unit_price: "N/A", source: "BNEF/IEA 2024", color: "#27ae60" },
    { commodity: "Global Clean Energy Investment (total)", category: "Energy Investment", value_b: 2000, volume: "Includes grid, storage, EVs", unit_price: "N/A", source: "IEA WEI 2024", color: "#2ecc71" },
    // Major mined commodities
    { commodity: "Iron Ore", category: "Metals & Mining", value_b: 280, volume: "2,500 Mt", unit_price: "$110/t avg", source: "World Steel/Platts", color: "#e67e22" },
    { commodity: "Copper", category: "Metals & Mining", value_b: 195, volume: "22 Mt", unit_price: "$8,800/t avg", source: "ICSG 2024", color: "#d35400" },
    { commodity: "Gold", category: "Metals & Mining", value_b: 280, volume: "3,600 t mined", unit_price: "$1,940/oz avg 2023", source: "World Gold Council", color: "#f1c40f" },
    { commodity: "Aluminum", category: "Metals & Mining", value_b: 160, volume: "70 Mt", unit_price: "$2,300/t avg", source: "IAI/LME", color: "#95a5a6" },
    { commodity: "Nickel", category: "Metals & Mining", value_b: 55, volume: "3.4 Mt", unit_price: "$16,000/t avg", source: "INSG", color: "#1abc9c" },
    { commodity: "Zinc", category: "Metals & Mining", value_b: 35, volume: "13.5 Mt", unit_price: "$2,600/t avg", source: "ILZSG", color: "#7f8c8d" },
    { commodity: "Lithium", category: "Critical Minerals", value_b: 25, volume: "180 kt LCE", unit_price: "$14,000/t avg (down 75% from 2022)", source: "Benchmark/S&P", color: "#8e44ad" },
    { commodity: "Cobalt", category: "Critical Minerals", value_b: 5, volume: "210 kt", unit_price: "$24,000/t avg", source: "Cobalt Institute", color: "#2c3e50" },
    { commodity: "Rare Earths (REO)", category: "Critical Minerals", value_b: 12, volume: "350 kt REO", unit_price: "~$35,000/t avg mix", source: "USGS/Adamas", color: "#9b59b6" },
    { commodity: "Uranium", category: "Energy", value_b: 10, volume: "59 kt U", unit_price: "$59/lb U3O8 avg", source: "WNA/UxC", color: "#f39c12" },
];

// =====================================================================
// OIL: TOTAL LIQUIDS BREAKDOWN
// The 81,800 kb/d figure is crude oil + condensate only.
// Total petroleum & other liquids: ~102 mb/d (EIA, IEA).
// =====================================================================
const OIL_TOTAL_LIQUIDS = {
    crude_condensate: { volume_kbd: 82500, value_b: 2340, price_note: "Country-specific benchmarks (2024)" },
    ngpl: { volume_kbd: 14000, value_b: 185, price_note: "~$36/bbl composite (Global Market Insights)" },
    biofuels: { volume_kbd: 2200, value_b: 88, price_note: "~$100-120/bbl (mandate-supported)" },
    processing_gains: { volume_kbd: 2300, value_b: 0, price_note: "Volumetric artifact, not revenue" },
    other_liquids: { volume_kbd: 2000, value_b: 55, price_note: "CTL, GTL, synthetic crude" },
    total: { volume_kbd: 103000, value_b: 2668 },
    year: 2024,
    sources: ["EIA STEO 2025", "EIA FAQ #709", "IEA Oil Market Report Dec 2024", "Global Market Insights (NGL)"],
};
