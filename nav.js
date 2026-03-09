// nav.js — Shared navigation across all dashboard pages
(function() {
    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === '/') path = 'index.html';

    const pages = [
        { href: 'index.html', label: 'Overview' },
        { href: 'marketvalue.html', label: 'Market Value' },
        { href: 'context.html', label: 'Energy Context' },
        { href: 'phaseout.html', label: 'Coal Phaseout' },
        { href: 'jobs.html', label: 'Jobs' },
        { href: 'donations.html', label: 'Political Donations' },
        { href: 'fx.html', label: 'FX Revenue' },
        { href: 'revenue.html', label: 'Govt Revenue' },
        { href: 'subsidies.html', label: 'Subsidies' },
        { href: 'imports.html', label: 'Import Exposure' },
        { href: 'electricity.html', label: 'Electricity Costs' },
        { href: 'coaltax.html', label: 'Coal Tax' },
        { href: 'investment.html', label: 'Foreign Investment' },
    ];

    const nav = document.createElement('nav');
    nav.className = 'nav-bar';
    nav.innerHTML = '<div class="nav-inner">' + pages.map(function(p) {
        const active = p.href === path ? ' active' : '';
        return '<a href="' + p.href + '" class="nav-link' + active + '">' + p.label + '</a>';
    }).join('') + '</div>';

    const header = document.querySelector('.header');
    if (header) header.after(nav);
})();
