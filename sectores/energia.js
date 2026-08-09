const palette = {
  teal:'#12a594', tealLight:'#2ec4b6', coral:'#ff6f59', sun:'#ffb703',
  blue:'#0f5c78', grey:'#c8d6d4'
};
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.color = '#3d5257';

/* Mezcla de generación: fósiles vs renovable */
new Chart(document.getElementById('chartMezcla'), {
  type: 'doughnut',
  data: {
    labels: ['Combustibles fósiles (~96%)', 'Fuentes renovables (4.12%)'],
    datasets: [{
      data: [95.88, 4.12],
      backgroundColor: [palette.blue, palette.teal],
      borderWidth: 2, borderColor: '#fff'
    }]
  },
  options: {
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 } } } },
    cutout: '58%'
  }
});

/* Ruta hacia el 100% renovable (Ley 17-2019 / metas del P-MARCC) */
new Chart(document.getElementById('chartRuta'), {
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
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { min: 0, max: 100, title: { display: true, text: '% de generación renovable' } }
    }
  }
});
