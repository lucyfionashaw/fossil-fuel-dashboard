// nav.js — Shared navigation across all dashboard pages
(function() {
    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === '/') path = 'index.html';

    // Narrative arc: Scale → Cost → Political Expedience → Transition
    const pages = [
        { href: 'index.html', label: 'Overview' },
        // Act 1: The Scale of the Problem
        { href: 'context.html', label: 'Energy Context' },
        { href: 'marketvalue.html', label: 'Market Value' },
        // Act 2: Coal Isn't Cheap
        { href: 'electricity.html', label: 'Electricity Costs' },
        { href: 'subsidies.html', label: 'Subsidies' },
        // Act 3: So Why Does It Persist?
        { href: 'revenue.html', label: 'Revenue & Tax' },
        { href: 'jobs.html', label: 'Jobs' },
        { href: 'trade.html', label: 'Trade & Security' },
        { href: 'donations.html', label: 'Political Donations' },
        // Act 4: The Transition
        { href: 'phaseout.html', label: 'Coal Phaseout' },
        { href: 'investment.html', label: 'Foreign Investment' },
        // Meta
        { href: 'graveyard.html', label: 'Graveyard' },
        { href: 'roadmap.html', label: 'Roadmap' },
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
