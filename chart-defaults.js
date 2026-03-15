// chart-defaults.js — Global Chart.js configuration for consistent styling
// Include AFTER chart.js CDN and BEFORE any page-specific chart scripts

(function() {
    if (typeof Chart === 'undefined') return;

    // Global font and color defaults
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    Chart.defaults.color = '#2c3e50';
    Chart.defaults.font.size = 12;

    // Grid defaults
    Chart.defaults.scale.grid = Chart.defaults.scale.grid || {};

    // Responsive defaults
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = true;

    // Tooltip defaults
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(44, 62, 80, 0.95)';
    Chart.defaults.plugins.tooltip.titleFont = { family: "'Inter', sans-serif", size: 13, weight: '600' };
    Chart.defaults.plugins.tooltip.bodyFont = { family: "'Inter', sans-serif", size: 12 };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.boxPadding = 4;

    // Legend defaults
    Chart.defaults.plugins.legend.labels.font = { family: "'Inter', sans-serif", size: 11 };
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.boxHeight = 12;
    Chart.defaults.plugins.legend.labels.padding = 12;

    // Animation — snappy, not sluggish
    Chart.defaults.animation.duration = 400;

    // Bar chart defaults
    Chart.defaults.datasets.bar.borderRadius = 4;

    // Doughnut defaults
    Chart.defaults.datasets.doughnut.borderWidth = 2;
})();
