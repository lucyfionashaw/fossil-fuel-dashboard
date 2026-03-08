// =====================================================================
// CHARTS.JS — Chart rendering, toggles, and table population
// =====================================================================

// Utility: format numbers with commas
function fmt(n, decimals = 0) {
    if (n == null) return '—';
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Utility: aggregate coal data by country (sum types)
function aggregateByCountry(data, valueKey) {
    const map = {};
    data.forEach(d => {
        if (!map[d.country]) map[d.country] = { country: d.country, value: 0, production: 0 };
        map[d.country].value += (d[valueKey] || 0);
        map[d.country].production += (d.production || 0);
    });
    return Object.values(map);
}

// Colors
const COLORS = {
    coal: '#3d3d3d',
    coalLight: '#6b6b6b',
    oil: '#c0392b',
    oilLight: '#e74c3c',
    gas: '#2980b9',
    gasLight: '#3498db',
    accent: '#16a085',
};

const PALETTE = [
    '#2c3e50', '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
    '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#d35400',
    '#27ae60', '#8e44ad', '#c0392b', '#16a085', '#f1c40f',
    '#7f8c8d', '#2980b9', '#e74c3c', '#1abc9c', '#e67e22',
    '#9b59b6', '#3498db'
];

// =====================================================================
// CHART 1: Market Value Comparison (bar chart)
// =====================================================================
new Chart(document.getElementById('chartComparison'), {
    type: 'bar',
    data: {
        labels: ['Coal', 'Oil (crude)', 'Natural Gas'],
        datasets: [{
            label: 'Market Value ($B)',
            data: [750, 2270, 680],
            backgroundColor: [COLORS.coal, COLORS.oil, COLORS.gas],
            borderRadius: 6,
            barPercentage: 0.6,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => `$${fmt(ctx.parsed.y)}B`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: v => `$${v}B` },
                title: { display: true, text: 'Market Value ($ Billion)' }
            }
        }
    }
});

// =====================================================================
// CHART 2: Share (doughnut)
// =====================================================================
new Chart(document.getElementById('chartShare'), {
    type: 'doughnut',
    data: {
        labels: ['Coal (~$750B)', 'Oil (~$2,270B)', 'Gas (~$680B)'],
        datasets: [{
            data: [750, 2270, 680],
            backgroundColor: [COLORS.coal, COLORS.oil, COLORS.gas],
            borderWidth: 2,
            borderColor: '#fff',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '55%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 15, usePointStyle: true }
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct = ((ctx.parsed / total) * 100).toFixed(1);
                        return `$${fmt(ctx.parsed)}B (${pct}%)`;
                    }
                }
            }
        }
    }
});

// =====================================================================
// COMMODITY COMPARISON (horizontal bar)
// =====================================================================
const commoditySorted = [...COMMODITY_COMPARISON].sort((a, b) => b.value_b - a.value_b);

new Chart(document.getElementById('chartCommodity'), {
    type: 'bar',
    data: {
        labels: commoditySorted.map(d => d.commodity),
        datasets: [{
            label: 'Market Value / Investment ($B)',
            data: commoditySorted.map(d => d.value_b),
            backgroundColor: commoditySorted.map(d => d.color),
            borderRadius: 4,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const d = commoditySorted[ctx.dataIndex];
                        return [
                            `$${fmt(d.value_b)}B`,
                            `Category: ${d.category}`,
                            `Volume: ${d.volume}`,
                            `Unit price: ${d.unit_price}`,
                            `Source: ${d.source}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: v => `$${fmt(v)}B` },
                title: { display: true, text: 'Annual Market Value / Investment ($ Billion)' }
            },
            y: {
                ticks: { font: { size: 11 } }
            }
        }
    }
});

// =====================================================================
// TOGGLEABLE COUNTRY CHARTS — Coal / Oil / Gas
// Each supports value ($) and volume toggle
// =====================================================================

// --- COAL ---
const coalAll = aggregateByCountry(COAL_DATA.filter(d => d.country !== 'Rest of World'), 'value');
let coalMode = 'value';

function getCoalChartData(mode) {
    const sorted = [...coalAll].sort((a, b) =>
        mode === 'value' ? b.value - a.value : b.production - a.production
    );
    const top12 = sorted.slice(0, 12);
    return {
        labels: top12.map(d => d.country),
        data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production),
        colors: top12.map((_, i) => PALETTE[i % PALETTE.length])
    };
}

const coalInitData = getCoalChartData('value');
const coalChart = new Chart(document.getElementById('chartCoalCountries'), {
    type: 'bar',
    data: {
        labels: coalInitData.labels,
        datasets: [{
            label: 'Market Value ($M)',
            data: coalInitData.data,
            backgroundColor: coalInitData.colors,
            borderRadius: 4,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        return coalMode === 'value'
                            ? `$${fmt(ctx.parsed.x)}M ($${(ctx.parsed.x / 1000).toFixed(1)}B)`
                            : `${fmt(ctx.parsed.x)} Mt`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function(v) {
                        return coalMode === 'value'
                            ? `$${(v / 1000).toFixed(0)}B`
                            : `${fmt(v)} Mt`;
                    }
                }
            }
        }
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
    document.querySelectorAll('#coalToggle .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.getElementById('coalChartTitle').textContent =
        mode === 'value' ? 'Coal: Top Producers by Market Value' : 'Coal: Top Producers by Volume';
}

// --- OIL (sorted by value descending) ---
let oilMode = 'value';

function getOilChartData(mode) {
    const sorted = [...OIL_DATA].sort((a, b) =>
        mode === 'value' ? b.value - a.value : b.production - a.production
    );
    const top12 = sorted.slice(0, 12);
    return {
        labels: top12.map(d => d.country),
        data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production),
        colors: top12.map((_, i) => PALETTE[i % PALETTE.length])
    };
}

const oilInitData = getOilChartData('value');
const oilChart = new Chart(document.getElementById('chartOilCountries'), {
    type: 'bar',
    data: {
        labels: oilInitData.labels,
        datasets: [{
            label: 'Market Value ($B)',
            data: oilInitData.data,
            backgroundColor: oilInitData.colors,
            borderRadius: 4,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        return oilMode === 'value'
                            ? `$${fmt(ctx.parsed.x, 1)}B`
                            : `${fmt(ctx.parsed.x)} kb/d`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function(v) {
                        return oilMode === 'value'
                            ? `$${fmt(v)}B`
                            : `${fmt(v)}`;
                    }
                }
            }
        }
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
    document.querySelectorAll('#oilToggle .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.getElementById('oilChartTitle').textContent =
        mode === 'value' ? 'Oil: Top Producers by Market Value' : 'Oil: Top Producers by Volume';
}

// --- GAS (sorted by value descending) ---
let gasMode = 'value';

function getGasChartData(mode) {
    const sorted = [...GAS_DATA].sort((a, b) =>
        mode === 'value' ? b.value - a.value : b.production - a.production
    );
    const top12 = sorted.slice(0, 12);
    return {
        labels: top12.map(d => d.country),
        data: mode === 'value' ? top12.map(d => d.value) : top12.map(d => d.production),
        colors: top12.map((_, i) => PALETTE[i % PALETTE.length])
    };
}

const gasInitData = getGasChartData('value');
const gasChart = new Chart(document.getElementById('chartGasCountries'), {
    type: 'bar',
    data: {
        labels: gasInitData.labels,
        datasets: [{
            label: 'Market Value ($M)',
            data: gasInitData.data,
            backgroundColor: gasInitData.colors,
            borderRadius: 4,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        return gasMode === 'value'
                            ? `$${fmt(ctx.parsed.x)}M ($${(ctx.parsed.x / 1000).toFixed(1)}B)`
                            : `${fmt(ctx.parsed.x)} bcm`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function(v) {
                        return gasMode === 'value'
                            ? `$${(v / 1000).toFixed(0)}B`
                            : `${fmt(v)}`;
                    }
                }
            }
        }
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
    document.querySelectorAll('#gasToggle .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.getElementById('gasChartTitle').textContent =
        mode === 'value' ? 'Gas: Top Producers by Market Value' : 'Gas: Top Producers by Volume';
}

// =====================================================================
// INDIA COAL MIX CHARTS
// =====================================================================

// Doughnut: CIL sales by channel
new Chart(document.getElementById('chartIndiaMixVolume'), {
    type: 'doughnut',
    data: {
        labels: INDIA_COAL_MIX.channels.map(d => `${d.channel} (${d.pct}%)`),
        datasets: [{
            data: INDIA_COAL_MIX.channels.map(d => d.volume_mt),
            backgroundColor: ['#2c3e50', '#e74c3c', '#f39c12', '#95a5a6'],
            borderWidth: 2,
            borderColor: '#fff',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '50%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 10, usePointStyle: true, font: { size: 11 } }
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const ch = INDIA_COAL_MIX.channels[ctx.dataIndex];
                        return [
                            `${ch.volume_mt} Mt (${ch.pct}% of CIL)`,
                            `All-in price: $${ch.allin_usd}/t (Rs ${fmt(ch.allin_price_rs)})`,
                        ];
                    }
                }
            }
        }
    }
});

// Bar: base vs all-in price per channel
new Chart(document.getElementById('chartIndiaMixPrice'), {
    type: 'bar',
    data: {
        labels: INDIA_COAL_MIX.channels.map(d => d.channel.split(' (')[0]),
        datasets: [
            {
                label: 'Base Notified Price',
                data: INDIA_COAL_MIX.channels.map(d => d.base_price_rs),
                backgroundColor: 'rgba(44, 62, 80, 0.55)',
                borderRadius: 4,
            },
            {
                label: 'All-in (incl. levies)',
                data: INDIA_COAL_MIX.channels.map(d => d.allin_price_rs),
                backgroundColor: 'rgba(231, 76, 60, 0.55)',
                borderRadius: 4,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 11 } } },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const ch = INDIA_COAL_MIX.channels[ctx.dataIndex];
                        const usd = ctx.datasetIndex === 0
                            ? Math.round(ch.base_price_rs / 84)
                            : ch.allin_usd;
                        return `${ctx.dataset.label}: Rs ${fmt(ctx.parsed.y)} (~$${usd}/t)`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: v => `Rs ${fmt(v)}` },
                title: { display: true, text: 'Price (Rs per tonne)' }
            }
        }
    }
});

// Populate India levy table
function populateIndiaLevyTable() {
    const tbody = document.querySelector('#indiaLevyTable tbody');
    if (!tbody) return;
    INDIA_COAL_MIX.levies.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.levy}</td>
            <td>${d.rate}</td>
            <td class="num">Rs ${fmt(d.amount_rs)}</td>
            <td class="num">$${(d.amount_rs / 84).toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
    });
    // Total row
    const total_rs = INDIA_COAL_MIX.levies.reduce((s, d) => s + d.amount_rs, 0);
    const tr = document.createElement('tr');
    tr.style.fontWeight = '600';
    tr.innerHTML = `
        <td>Total Levies</td>
        <td></td>
        <td class="num">Rs ${fmt(total_rs)}</td>
        <td class="num">$${(total_rs / 84).toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
}

// Populate non-CIL producers table
function populateNonCILTable() {
    const tbody = document.querySelector('#nonCILTable tbody');
    if (!tbody) return;
    INDIA_COAL_MIX.non_cil.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.producer}</td>
            <td class="num">${fmt(d.volume_mt)}</td>
            <td class="num">$${d.price_usd}</td>
            <td>${d.notes}</td>
        `;
        tbody.appendChild(tr);
    });
}

// =====================================================================
// CHART: Transport cost as % of value
// =====================================================================
new Chart(document.getElementById('chartTransport'), {
    type: 'bar',
    data: {
        labels: ['Oil\n(seaborne)', 'Coal\n(seaborne)', 'Coal\n(Russia rail)', 'LNG\n(full chain)', 'Pipeline Gas'],
        datasets: [
            {
                label: 'Low %',
                data: [2, 5, 50, 10, 10],
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderRadius: 4,
            },
            {
                label: 'High %',
                data: [5, 20, 40, 20, 30],
                backgroundColor: 'rgba(231, 76, 60, 0.6)',
                borderRadius: 4,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`
                }
            }
        },
        scales: {
            x: { stacked: true },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: { callback: v => `${v}%` },
                title: { display: true, text: 'Transport Cost as % of Value' }
            }
        }
    }
});

// =====================================================================
// TABLE POPULATION
// =====================================================================

function populateCoalTable() {
    const tbody = document.querySelector('#coalTable tbody');
    COAL_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.rank || '—'}</td>
            <td><span class="commodity-dot coal"></span>${d.country}</td>
            <td>${d.type}</td>
            <td class="num">${fmt(d.production)}</td>
            <td class="num">$${fmt(d.price)}</td>
            <td>${d.benchmark}</td>
            <td class="num">$${fmt(d.value)}</td>
            <td>${d.notes}</td>
        `;
        tbody.appendChild(tr);
    });
}

function populateOilTable() {
    const tbody = document.querySelector('#oilTable tbody');
    OIL_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.rank}</td>
            <td><span class="commodity-dot oil"></span>${d.country}</td>
            <td class="num">${fmt(d.production)}</td>
            <td>${d.grade}</td>
            <td>${d.quality}</td>
            <td class="num">$${fmt(d.price, 2)}</td>
            <td class="num">${d.diff >= 0 ? '+' : ''}${d.diff.toFixed(2)}</td>
            <td class="num">$${fmt(d.value, 1)}B</td>
        `;
        tbody.appendChild(tr);
    });
}

function populateGasTable() {
    const tbody = document.querySelector('#gasTable tbody');
    GAS_DATA.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.rank}</td>
            <td><span class="commodity-dot gas"></span>${d.country}</td>
            <td class="num">${fmt(d.production)}</td>
            <td>${d.region}</td>
            <td class="num">$${fmt(d.benchmark, 2)}</td>
            <td class="num">$${fmt(d.domestic, 2)}</td>
            <td>${d.regime}</td>
            <td class="num">$${fmt(d.value)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function populateTransportTables() {
    const tbody1 = document.querySelector('#transportCoalTable tbody');
    TRANSPORT_COAL_SEABORNE.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.route}</td>
            <td>${d.origin}</td>
            <td>${d.dest}</td>
            <td>${d.vessel}</td>
            <td class="num">$${fmt(d.cost, 2)}</td>
            <td>${d.range}</td>
        `;
        tbody1.appendChild(tr);
    });

    const tbody2 = document.querySelector('#transportOilTable tbody');
    TRANSPORT_OIL.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.route}</td>
            <td>${d.origin}</td>
            <td>${d.dest}</td>
            <td>${d.vessel}</td>
            <td class="num">$${fmt(d.cost, 2)}</td>
            <td>${d.range}</td>
        `;
        tbody2.appendChild(tr);
    });

    const tbody3 = document.querySelector('#transportLNGTable tbody');
    TRANSPORT_LNG.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.corridor}</td>
            <td class="num">$${fmt(d.wellhead, 2)}</td>
            <td class="num">$${fmt(d.liquefaction, 2)}</td>
            <td class="num">$${fmt(d.shipping, 2)}</td>
            <td class="num">$${fmt(d.regas, 2)}</td>
            <td class="num"><strong>$${fmt(d.total, 2)}</strong></td>
        `;
        tbody3.appendChild(tr);
    });
}

// =====================================================================
// TAB SWITCHING
// =====================================================================

function showTab(name) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    document.querySelector(`#tab-${name}`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent.toLowerCase() === name || btn.textContent.toLowerCase().startsWith(name)) {
            btn.classList.add('active');
        }
    });
}

// =====================================================================
// INIT
// =====================================================================
populateCoalTable();
populateOilTable();
populateGasTable();
populateTransportTables();
populateIndiaLevyTable();
populateNonCILTable();
