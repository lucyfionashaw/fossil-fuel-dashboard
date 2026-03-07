// =====================================================================
// CHARTS.JS — Chart rendering and table population
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
    return Object.values(map).sort((a, b) => b.value - a.value);
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
// CHART 3: Coal by country (horizontal bar)
// =====================================================================
const coalAgg = aggregateByCountry(COAL_DATA.filter(d => d.country !== 'Rest of World'), 'value');
const coalTop12 = coalAgg.slice(0, 12);

new Chart(document.getElementById('chartCoalCountries'), {
    type: 'bar',
    data: {
        labels: coalTop12.map(d => d.country),
        datasets: [{
            label: 'Market Value ($M)',
            data: coalTop12.map(d => d.value),
            backgroundColor: coalTop12.map((_, i) => PALETTE[i % PALETTE.length]),
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
                    label: ctx => `$${fmt(ctx.parsed.x)}M ($${(ctx.parsed.x / 1000).toFixed(1)}B)`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: v => `$${(v / 1000).toFixed(0)}B` }
            }
        }
    }
});

// =====================================================================
// CHART 4: Oil by country
// =====================================================================
const oilTop12 = OIL_DATA.slice(0, 12);

new Chart(document.getElementById('chartOilCountries'), {
    type: 'bar',
    data: {
        labels: oilTop12.map(d => d.country),
        datasets: [{
            label: 'Market Value ($B)',
            data: oilTop12.map(d => d.value),
            backgroundColor: oilTop12.map((_, i) => PALETTE[i % PALETTE.length]),
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
                    label: ctx => `$${fmt(ctx.parsed.x, 1)}B`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: v => `$${v}B` }
            }
        }
    }
});

// =====================================================================
// CHART 5: Gas by country
// =====================================================================
const gasTop12 = GAS_DATA.slice(0, 12);

new Chart(document.getElementById('chartGasCountries'), {
    type: 'bar',
    data: {
        labels: gasTop12.map(d => d.country),
        datasets: [{
            label: 'Market Value ($M)',
            data: gasTop12.map(d => d.value),
            backgroundColor: gasTop12.map((_, i) => PALETTE[i % PALETTE.length]),
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
                    label: ctx => `$${fmt(ctx.parsed.x)}M ($${(ctx.parsed.x / 1000).toFixed(1)}B)`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: v => `$${(v / 1000).toFixed(0)}B` }
            }
        }
    }
});

// =====================================================================
// CHART 6: Transport cost as % of value
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
    // Coal seaborne
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

    // Oil tanker
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

    // LNG chain
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
    // Find the button that matches
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
