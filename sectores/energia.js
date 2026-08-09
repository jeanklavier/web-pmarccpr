const palette = {
  teal:'#12a594', tealLight:'#2ec4b6', coral:'#ff6f59', sun:'#ffb703',
  blue:'#0f5c78', grey:'#8a97a8'
};

function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
    grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)',
    surface: cs.getPropertyValue('--surface').trim() || '#ffffff'
  };
}

const chartsToRestyle = [];

function applyThemeToChart(chart, opts) {
  const c = themeColors();
  if (chart.options.plugins && chart.options.plugins.legend) {
    chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
    chart.options.plugins.legend.labels.color = c.text;
  }
  if (chart.options.scales) {
    Object.values(chart.options.scales).forEach(scale => {
      scale.ticks = scale.ticks || {}; scale.ticks.color = c.text;
      scale.grid = scale.grid || {}; scale.grid.color = c.grid;
      if (scale.title) scale.title.color = c.text;
    });
  }
  if (opts && opts.isDoughnut) {
    chart.data.datasets[0].borderColor = c.surface;
  }
  chart.update();
}

function initCharts() {
  const c = themeColors();
  Chart.defaults.color = c.text;

  /* Mezcla de generación: fósiles vs renovable */
  const chartMezcla = new Chart(document.getElementById('chartMezcla'), {
    type: 'doughnut',
    data: {
      labels: ['Combustibles fósiles (~96%)', 'Fuentes renovables (4.12%)'],
      datasets: [{
        data: [95.88, 4.12],
        backgroundColor: [palette.blue, palette.teal],
        borderWidth: 2, borderColor: c.surface
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 }, color: c.text } } },
      cutout: '58%'
    }
  });
  chartsToRestyle.push({ chart: chartMezcla, isDoughnut: true });

  /* Ruta hacia el 100% renovable (Ley 17-2019 / metas del P-MARCC) */
  const chartRuta = new Chart(document.getElementById('chartRuta'), {
    type: 'line',
    data: {
      labels: ['2023 (actual)', '2025', '2030', '2040', '2050'],
      datasets: [
        {
          label: 'Meta legal de % renovable',
          data: [4.12, 40, 40, 60, 100],
          borderColor: palette.coral,
          backgroundColor: 'rgba(255,111,89,.15)',
          fill: true, tension: .25, pointRadius: 5, pointBackgroundColor: palette.coral
        }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { color: c.text } } },
      scales: {
        y: { min: 0, max: 100, title: { display: true, text: '% de generación renovable', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
        x: { ticks: { color: c.text }, grid: { color: c.grid } }
      }
    }
  });
  chartsToRestyle.push({ chart: chartRuta });
}

(function () {
  if (typeof Chart === 'undefined') {
    // CDN caído/bloqueado: muestra las tablas de datos como respaldo.
    document.querySelectorAll('canvas[role="img"]').forEach(cv => {
      cv.style.display = 'none';
      const table = document.getElementById(cv.getAttribute('aria-describedby'));
      if (table) {
        table.classList.remove('visually-hidden');
        table.classList.add('chart-fallback-table');
      }
    });
    return;
  }
  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  initCharts();
})();

window.addEventListener('pmarcc-theme-change', () => {
  chartsToRestyle.forEach(({ chart, isDoughnut }) => applyThemeToChart(chart, { isDoughnut }));
});
