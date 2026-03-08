// =====================================================================
// CHARTS.JS — Chart rendering, toggles, popups, and table population
// =====================================================================

function fmt(n, decimals = 0) {
    if (n == null) return '—';
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function aggregateByCountry(data, valueKey) {
    const map = {};
    data.forEach(d => {
        if (!map[d.country]) map[d.country] = { country: d.country, value: 0, production: 0 };
        map[d.country].value += (d[valueKey] || 0);
        map[d.country].production += (d.production || 0);
    });
    return Object.values(map);
}

// =====================================================================
// CONSISTENT COUNTRY COLORS — same color for each country everywhere
// =====================================================================
const COUNTRY_COLORS = {
    "China": "#e63946",
    "United States": "#457b9d",
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
    "Rest of World": "#adb5bd",
};

function getCountryColor(country) {
    return COUNTRY_COLORS[country] || '#adb5bd';
}

const COLORS = {
    coal: '#3d3d3d', coalLight: '#6b6b6b',
    oil: '#c0392b', oilLight: '#e74c3c',
    gas: '#2980b9', gasLight: '#3498db',
    accent: '#16a085',
};

// =====================================================================
// CHART 1: Market Value Comparison
// =====================================================================
new Chart(document.getElementById('chartComparison'), {
    type: 'bar',
    data: {
        labels: ['Coal', 'Oil (crude)', 'Natural Gas'],
        datasets: [{
            label: 'Market Value ($B)',
            data: [750, 2270, 680],
            backgroundColor: [COLORS.coal, COLORS.oil, COLORS.gas],
            borderRadius: 6, barPercentage: 0.6,
        }]
    },
    options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `$${fmt(ctx.parsed.y)}B` } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => `$${v}B` }, title: { display: true, text: 'Market Value ($ Billion)' } } }
    }
});

// =====================================================================
// CHART 2: Share (doughnut)
// =====================================================================
new Chart(document.getElementById('chartShare'), {
    type: 'doughnut',
    data: {
        labels: ['Coal (~$750B)', 'Oil (~$2,270B)', 'Gas (~$680B)'],
        datasets: [{ data: [750, 2270, 680], backgroundColor: [COLORS.coal, COLORS.oil, COLORS.gas], borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
        responsive: true, maintainAspectRatio: true, cutout: '55%',
        plugins: {
            legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } },
            tooltip: { callbacks: { label: ctx => { const t = ctx.dataset.data.reduce((a,b)=>a+b,0); return `$${fmt(ctx.parsed)}B (${((ctx.parsed/t)*100).toFixed(1)}%)`; } } }
        }
    }
});

// =====================================================================
// COMMODITY COMPARISON
// =====================================================================
const commoditySorted = [...COMMODITY_COMPARISON].sort((a, b) => b.value_b - a.value_b);
new Chart(document.getElementById('chartCommodity'), {
    type: 'bar',
    data: {
        labels: commoditySorted.map(d => d.commodity),
        datasets: [{ label: 'Market Value ($B)', data: commoditySorted.map(d => d.value_b), backgroundColor: commoditySorted.map(d => d.color), borderRadius: 4 }]
    },
    options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => { const d = commoditySorted[ctx.dataIndex]; return [`$${fmt(d.value_b)}B`, `Category: ${d.category}`, `Volume: ${d.volume}`, `Unit: ${d.unit_price}`, `Source: ${d.source}`]; } } }
        },
        scales: { x: { beginAtZero: true, ticks: { callback: v => `$${fmt(v)}B` }, title: { display: true, text: 'Annual Market Value / Investment ($ Billion)' } }, y: { ticks: { font: { size: 11 } } } }
    }
});

// =====================================================================
// COUNTRY POPUP — click a bar to see full data
// =====================================================================
function showCountryPopup(commodity, country, chartEvent) {
    let popup = document.getElementById('countryPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'countryPopup';
        popup.className = 'country-popup';
        document.body.appendChild(popup);
    }

    const color = getCountryColor(country);
    let html = '<div class="popup-header" style="border-left:4px solid ' + color + '">' +
        '<span>' + country + '</span>' +
        '<span class="popup-close" onclick="closePopup()">&times;</span></div><div class="popup-body">';

    if (commodity === 'coal') {
        const rows = COAL_DATA.filter(d => d.country === country);
        if (!rows.length) { closePopup(); return; }
        const tp = rows.reduce((s,d) => s + d.production, 0);
        const tv = rows.reduce((s,d) => s + d.value, 0);
        html += '<table><thead><tr><th>Type</th><th class="num">Mt</th><th class="num">$/t</th><th>Benchmark</th><th class="num">Value ($M)</th></tr></thead><tbody>';
        rows.forEach(d => {
            html += '<tr><td>' + d.type + '</td><td class="num">' + fmt(d.production) + '</td><td class="num">$' + fmt(d.price) + '</td><td>' + d.benchmark + '</td><td class="num">$' + fmt(d.value) + '</td></tr>';
        });
        html += '<tr class="popup-total"><td>Total</td><td class="num">' + fmt(tp) + '</td><td></td><td></td><td class="num">$' + fmt(tv) + '</td></tr></tbody></table>';
        const notes = rows.filter(d => d.notes).map(d => d.type + ': ' + d.notes);
        if (notes.length) html += '<div class="popup-notes">' + notes.map(n => '<div>' + n + '</div>').join('') + '</div>';
    } else if (commodity === 'oil') {
        const d = OIL_DATA.find(r => r.country === country);
        if (!d) { closePopup(); return; }
        html += '<table><tbody>' +
            '<tr><td>Production</td><td class="num">' + fmt(d.production) + ' kb/d</td></tr>' +
            '<tr><td>Grade</td><td>' + d.grade + '</td></tr>' +
            '<tr><td>Quality</td><td>' + d.quality + '</td></tr>' +
            '<tr><td>Price</td><td class="num">$' + fmt(d.price, 2) + '/bbl</td></tr>' +
            '<tr><td>Diff to Brent</td><td class="num">' + (d.diff >= 0 ? '+' : '') + d.diff.toFixed(2) + '</td></tr>' +
            '<tr class="popup-total"><td>Market Value</td><td class="num">$' + fmt(d.value, 1) + 'B</td></tr>' +
            '</tbody></table>';
    } else if (commodity === 'gas') {
        const d = GAS_DATA.find(r => r.country === country);
        if (!d) { closePopup(); return; }
        html += '<table><tbody>' +
            '<tr><td>Production</td><td class="num">' + fmt(d.production) + ' bcm</td></tr>' +
            '<tr><td>Pricing Region</td><td>' + d.region + '</td></tr>' +
            '<tr><td>Benchmark</td><td class="num">$' + fmt(d.benchmark, 2) + '/MMBtu</td></tr>' +
            '<tr><td>Domestic Price</td><td class="num">$' + fmt(d.domestic, 2) + '/MMBtu</td></tr>' +
            '<tr><td>Price Regime</td><td>' + d.regime + '</td></tr>' +
            '<tr class="popup-total"><td>Market Value</td><td class="num">$' + fmt(d.value) + 'M ($' + (d.value / 1000).toFixed(1) + 'B)</td></tr>' +
            '</tbody></table>';
    }

    html += '</div>';
    popup.innerHTML = html;
    popup.style.display = 'block';

    const x = chartEvent.native.clientX;
    const y = chartEvent.native.clientY;
    popup.style.left = Math.min(x + 15, window.innerWidth - 440) + 'px';
    popup.style.top = Math.max(10, Math.min(y - 20, window.innerHeight - 350)) + 'px';
}

function closePopup() {
    const p = document.getElementById('countryPopup');
    if (p) p.style.display = 'none';
}

document.addEventListener('click', function(e) {
    const p = document.getElementById('countryPopup');
    if (p && p.style.display === 'block' && !p.contains(e.target) && !e.target.closest('canvas')) {
        p.style.display = 'none';
    }
});
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closePopup(); });

// =====================================================================
// TOGGLEABLE COUNTRY CHARTS — Coal / Oil / Gas
// =====================================================================

// --- COAL ---
const coalAll = aggregateByCountry(COAL_DATA.filter(d => d.country !== 'Rest of World'), 'value');
let coalMode = 'value';

function getCoalChartData(mode) {
    const sorted = [...coalAll].sort((a, b) => mode === 'value' ? b.value - a.value : b.production - a.production);
    const top12 = sorted.slice(0, 12);
    return { labels: top12.map(d => d.country), data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production), colors: top12.map(d => getCountryColor(d.country)) };
}

const coalInit = getCoalChartData('value');
const coalChart = new Chart(document.getElementById('chartCoalCountries'), {
    type: 'bar',
    data: { labels: coalInit.labels, datasets: [{ label: 'Market Value ($M)', data: coalInit.data, backgroundColor: coalInit.colors, borderRadius: 4 }] },
    options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: true,
        onClick: function(event, elements) { if (elements.length) showCountryPopup('coal', this.data.labels[elements[0].index], event); },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return coalMode === 'value' ? '$' + fmt(ctx.parsed.x) + 'M ($' + (ctx.parsed.x/1000).toFixed(1) + 'B)' : fmt(ctx.parsed.x) + ' Mt'; } } } },
        scales: { x: { beginAtZero: true, ticks: { callback: function(v) { return coalMode === 'value' ? '$' + (v/1000).toFixed(0) + 'B' : fmt(v) + ' Mt'; } } } }
    }
});

function toggleCoal(mode) {
    coalMode = mode;
    const d = getCoalChartData(mode);
    coalChart.data.labels = d.labels;
    coalChart.data.datasets[0].data = d.data;
    coalChart.data.datasets[0].backgroundColor = d.colors;
    coalChart.data.datasets[0].label = mode === 'value' ? 'Market Value ($M)' : 'Production (Mt)';
    coalChart.update();
    document.querySelectorAll('#coalToggle .toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.getElementById('coalChartTitle').textContent = mode === 'value' ? 'Coal: Top Producers by Market Value' : 'Coal: Top Producers by Volume';
}

// --- OIL (sorted by value) ---
let oilMode = 'value';

function getOilChartData(mode) {
    const sorted = [...OIL_DATA].sort((a, b) => mode === 'value' ? b.value - a.value : b.production - a.production);
    const top12 = sorted.slice(0, 12);
    return { labels: top12.map(d => d.country), data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production), colors: top12.map(d => getCountryColor(d.country)) };
}

const oilInit = getOilChartData('value');
const oilChart = new Chart(document.getElementById('chartOilCountries'), {
    type: 'bar',
    data: { labels: oilInit.labels, datasets: [{ label: 'Market Value ($B)', data: oilInit.data, backgroundColor: oilInit.colors, borderRadius: 4 }] },
    options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: true,
        onClick: function(event, elements) { if (elements.length) showCountryPopup('oil', this.data.labels[elements[0].index], event); },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return oilMode === 'value' ? '$' + fmt(ctx.parsed.x, 1) + 'B' : fmt(ctx.parsed.x) + ' kb/d'; } } } },
        scales: { x: { beginAtZero: true, ticks: { callback: function(v) { return oilMode === 'value' ? '$' + fmt(v) + 'B' : fmt(v); } } } }
    }
});

function toggleOil(mode) {
    oilMode = mode;
    const d = getOilChartData(mode);
    oilChart.data.labels = d.labels;
    oilChart.data.datasets[0].data = d.data;
    oilChart.data.datasets[0].backgroundColor = d.colors;
    oilChart.data.datasets[0].label = mode === 'value' ? 'Market Value ($B)' : 'Production (kb/d)';
    oilChart.update();
    document.querySelectorAll('#oilToggle .toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.getElementById('oilChartTitle').textContent = mode === 'value' ? 'Oil: Top Producers by Market Value' : 'Oil: Top Producers by Volume';
}

// --- GAS (sorted by value) ---
let gasMode = 'value';

function getGasChartData(mode) {
    const sorted = [...GAS_DATA].sort((a, b) => mode === 'value' ? b.value - a.value : b.production - a.production);
    const top12 = sorted.slice(0, 12);
    return { labels: top12.map(d => d.country), data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production), colors: top12.map(d => getCountryColor(d.country)) };
}

const gasInit = getGasChartData('value');
const gasChart = new Chart(document.getElementById('chartGasCountries'), {
    type: 'bar',
    data: { labels: gasInit.labels, datasets: [{ label: 'Market Value ($M)', data: gasInit.data, backgroundColor: gasInit.colors, borderRadius: 4 }] },
    options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: true,
        onClick: function(event, elements) { if (elements.length) showCountryPopup('gas', this.data.labels[elements[0].index], event); },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return gasMode === 'value' ? '$' + fmt(ctx.parsed.x) + 'M ($' + (ctx.parsed.x/1000).toFixed(1) + 'B)' : fmt(ctx.parsed.x) + ' bcm'; } } } },
        scales: { x: { beginAtZero: true, ticks: { callback: function(v) { return gasMode === 'value' ? '$' + (v/1000).toFixed(0) + 'B' : fmt(v); } } } }
    }
});

function toggleGas(mode) {
    gasMode = mode;
    const d = getGasChartData(mode);
    gasChart.data.labels = d.labels;
    gasChart.data.datasets[0].data = d.data;
    gasChart.data.datasets[0].backgroundColor = d.colors;
    gasChart.data.datasets[0].label = mode === 'value' ? 'Market Value ($M)' : 'Production (bcm)';
    gasChart.update();
    document.querySelectorAll('#gasToggle .toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.getElementById('gasChartTitle').textContent = mode === 'value' ? 'Gas: Top Producers by Market Value' : 'Gas: Top Producers by Volume';
}

// =====================================================================
// INDIA COAL MIX CHARTS
// =====================================================================
new Chart(document.getElementById('chartIndiaMixVolume'), {
    type: 'doughnut',
    data: {
        labels: INDIA_COAL_MIX.channels.map(d => d.channel + ' (' + d.pct + '%)'),
        datasets: [{ data: INDIA_COAL_MIX.channels.map(d => d.volume_mt), backgroundColor: ['#2c3e50', '#e74c3c', '#f39c12', '#95a5a6'], borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
        responsive: true, maintainAspectRatio: true, cutout: '50%',
        plugins: {
            legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, font: { size: 11 } } },
            tooltip: { callbacks: { label: ctx => { const ch = INDIA_COAL_MIX.channels[ctx.dataIndex]; return [ch.volume_mt + ' Mt (' + ch.pct + '% of CIL)', 'All-in: $' + ch.allin_usd + '/t (Rs ' + fmt(ch.allin_price_rs) + ')']; } } }
        }
    }
});

new Chart(document.getElementById('chartIndiaMixPrice'), {
    type: 'bar',
    data: {
        labels: INDIA_COAL_MIX.channels.map(d => d.channel.split(' (')[0]),
        datasets: [
            { label: 'Base Price (excl. levies)', data: INDIA_COAL_MIX.channels.map(d => d.base_price_rs), backgroundColor: 'rgba(44, 62, 80, 0.55)', borderRadius: 4 },
            { label: 'All-in (incl. levies)', data: INDIA_COAL_MIX.channels.map(d => d.allin_price_rs), backgroundColor: 'rgba(231, 76, 60, 0.55)', borderRadius: 4 }
        ]
    },
    options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 11 } } },
            tooltip: { callbacks: { label: ctx => { const ch = INDIA_COAL_MIX.channels[ctx.dataIndex]; const u = ctx.datasetIndex === 0 ? Math.round(ch.base_price_rs / 84) : ch.allin_usd; return ctx.dataset.label + ': Rs ' + fmt(ctx.parsed.y) + ' (~$' + u + '/t)'; } } }
        },
        scales: { y: { beginAtZero: true, ticks: { callback: v => 'Rs ' + fmt(v) }, title: { display: true, text: 'Price (Rs per tonne)' } } }
    }
});

function populateIndiaLevyTable() {
    const tbody = document.querySelector('#indiaLevyTable tbody');
    if (!tbody) return;
    INDIA_COAL_MIX.levies.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + d.levy + '</td><td>' + d.rate + '</td><td class="num">Rs ' + fmt(d.amount_rs) + '</td><td class="num">$' + (d.amount_rs / 84).toFixed(1) + '</td>';
        tbody.appendChild(tr);
    });
    const total = INDIA_COAL_MIX.levies.reduce((s, d) => s + d.amount_rs, 0);
    const tr = document.createElement('tr');
    tr.style.fontWeight = '600';
    tr.innerHTML = '<td>Total Levies</td><td>' + INDIA_COAL_MIX.levy_pct_of_total + ' of all-in price</td><td class="num">Rs ' + fmt(total) + '</td><td class="num">$' + (total / 84).toFixed(1) + '</td>';
    tbody.appendChild(tr);
}

function populateNonCILTable() {
    const tbody = document.querySelector('#nonCILTable tbody');
    if (!tbody) return;
    INDIA_COAL_MIX.non_cil.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + d.producer + '</td><td class="num">' + fmt(d.volume_mt) + '</td><td class="num">$' + d.price_usd + '</td><td>' + d.notes + '</td>';
        tbody.appendChild(tr);
    });
}

// =====================================================================
// TRANSPORT CHART
// =====================================================================
new Chart(document.getElementById('chartTransport'), {
    type: 'bar',
    data: {
        labels: ['Oil\n(seaborne)', 'Coal\n(seaborne)', 'Coal\n(Russia rail)', 'LNG\n(full chain)', 'Pipeline Gas'],
        datasets: [
            { label: 'Low %', data: [2, 5, 50, 10, 10], backgroundColor: 'rgba(46, 204, 113, 0.6)', borderRadius: 4 },
            { label: 'High %', data: [5, 20, 40, 20, 30], backgroundColor: 'rgba(231, 76, 60, 0.6)', borderRadius: 4 }
        ]
    },
    options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '%' } } },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, title: { display: true, text: 'Transport Cost as % of Value' } } }
    }
});

// =====================================================================
// TABLE POPULATION
// =====================================================================
function populateCoalTable() {
    const tbody = document.querySelector('#coalTable tbody');
    COAL_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (d.rank||'—') + '</td><td><span class="commodity-dot coal"></span>' + d.country + '</td><td>' + d.type + '</td><td class="num">' + fmt(d.production) + '</td><td class="num">$' + fmt(d.price) + '</td><td>' + d.benchmark + '</td><td class="num">$' + fmt(d.value) + '</td><td>' + d.notes + '</td>';
        tbody.appendChild(tr);
    });
}

function populateOilTable() {
    const tbody = document.querySelector('#oilTable tbody');
    OIL_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + d.rank + '</td><td><span class="commodity-dot oil"></span>' + d.country + '</td><td class="num">' + fmt(d.production) + '</td><td>' + d.grade + '</td><td>' + d.quality + '</td><td class="num">$' + fmt(d.price,2) + '</td><td class="num">' + (d.diff>=0?'+':'') + d.diff.toFixed(2) + '</td><td class="num">$' + fmt(d.value,1) + 'B</td>';
        tbody.appendChild(tr);
    });
}

function populateGasTable() {
    const tbody = document.querySelector('#gasTable tbody');
    GAS_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + d.rank + '</td><td><span class="commodity-dot gas"></span>' + d.country + '</td><td class="num">' + fmt(d.production) + '</td><td>' + d.region + '</td><td class="num">$' + fmt(d.benchmark,2) + '</td><td class="num">$' + fmt(d.domestic,2) + '</td><td>' + d.regime + '</td><td class="num">$' + fmt(d.value) + '</td>';
        tbody.appendChild(tr);
    });
}

function populateTransportTables() {
    const t1 = document.querySelector('#transportCoalTable tbody');
    TRANSPORT_COAL_SEABORNE.forEach(d => { const tr = document.createElement('tr'); tr.innerHTML = '<td>'+d.route+'</td><td>'+d.origin+'</td><td>'+d.dest+'</td><td>'+d.vessel+'</td><td class="num">$'+fmt(d.cost,2)+'</td><td>'+d.range+'</td>'; t1.appendChild(tr); });
    const t2 = document.querySelector('#transportOilTable tbody');
    TRANSPORT_OIL.forEach(d => { const tr = document.createElement('tr'); tr.innerHTML = '<td>'+d.route+'</td><td>'+d.origin+'</td><td>'+d.dest+'</td><td>'+d.vessel+'</td><td class="num">$'+fmt(d.cost,2)+'</td><td>'+d.range+'</td>'; t2.appendChild(tr); });
    const t3 = document.querySelector('#transportLNGTable tbody');
    TRANSPORT_LNG.forEach(d => { const tr = document.createElement('tr'); tr.innerHTML = '<td>'+d.corridor+'</td><td class="num">$'+fmt(d.wellhead,2)+'</td><td class="num">$'+fmt(d.liquefaction,2)+'</td><td class="num">$'+fmt(d.shipping,2)+'</td><td class="num">$'+fmt(d.regas,2)+'</td><td class="num"><strong>$'+fmt(d.total,2)+'</strong></td>'; t3.appendChild(tr); });
}

// =====================================================================
// TAB SWITCHING & INIT
// =====================================================================
function showTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector('#tab-' + name).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => { if (b.textContent.toLowerCase() === name || b.textContent.toLowerCase().startsWith(name)) b.classList.add('active'); });
}

populateCoalTable();
populateOilTable();
populateGasTable();
populateTransportTables();
populateIndiaLevyTable();
populateNonCILTable();
