/* ============ Sector data (from P-MARCC, Cap. 4 y 7) ============ */
const sectores = [
  {
    icon: '⚡', nombre: 'Energía', slug: 'energia',
    stat: '4.12% renovable hoy · meta 100% para 2050',
    resumen: 'El sistema eléctrico depende casi por completo de combustibles fósiles importados.',
    detalle: 'La generación de electricidad es la mayor fuente de emisiones de GEI en Puerto Rico (52% del total en 2021). El Plan apunta a acelerar la transición a energía renovable y distribuida, especialmente en techos residenciales.'
  },
  {
    icon: '🏗️', nombre: 'Infraestructura y vivienda',
    stat: 'Miles de viviendas en zonas inundables',
    resumen: 'Infraestructura crítica y vivienda pública ubicadas en zonas vulnerables al aumento del nivel del mar.',
    detalle: 'El Plan recomienda no autorizar nueva construcción en terrenos con riesgo de inundación por marejada ciclónica o aumento del nivel del mar, y reubicar de forma planificada la vivienda pública ya expuesta.'
  },
  {
    icon: '🚗', nombre: 'Transporte y movilidad',
    stat: '26% de las emisiones de GEI (2021)',
    resumen: 'Segunda mayor fuente de emisiones, dominada por vehículos de combustión en carretera.',
    detalle: 'El Plan promueve la electrificación del parque vehicular, el transporte colectivo, distritos orientados al transporte (TOD) y el concepto de "calles completas" para reducir el uso del automóvil privado.'
  },
  {
    icon: '🗑️', nombre: 'Residuos sólidos',
    stat: '8% de las emisiones de GEI (2021)',
    resumen: 'El manejo de vertederos y aguas residuales genera una porción significativa de las emisiones.',
    detalle: 'El Plan busca reducir en 60% la cantidad de residuos depositados en vertederos mediante reciclaje, compostaje y estrategias de desperdicio cero.'
  },
  {
    icon: '🏥', nombre: 'Salud y bienestar',
    stat: 'Impactos físicos y de salud mental',
    resumen: 'El calor extremo, los vectores de enfermedad y los desastres afectan la salud física y mental.',
    detalle: 'El Plan reconoce determinantes sociales de la salud vinculados al cambio climático y recomienda incluir al sector salud en el próximo inventario de emisiones de GEI de Puerto Rico.'
  },
  {
    icon: '🌾', nombre: 'Agricultura y ganadería',
    stat: '85% de los alimentos son importados',
    resumen: 'El área agrícola se redujo 17% en años recientes; la seguridad alimentaria está en riesgo.',
    detalle: 'El Plan exige sistemas de riego más eficientes (reducir pérdida de agua de la AEE de 60% a 10%), riego por goteo obligatorio y mayor uso de aguas tratadas para la agricultura.'
  },
  {
    icon: '💧', nombre: 'Agua',
    stat: '60% de pérdida en el sistema de distribución',
    resumen: 'Sequías más frecuentes y pérdida de agua potable amenazan el suministro.',
    detalle: 'El Plan propone reducir la pérdida de agua de la AAA de 60% a 17%, reusar el 100% de las aguas tratadas para el 2050 y exigir captura de agua de lluvia en construcciones nuevas y existentes.'
  },
  {
    icon: '🌊', nombre: 'Sistemas marinos y costeros',
    stat: 'Arrecifes, manglares y playas en deterioro',
    resumen: 'Erosión costera, blanqueamiento de corales y pérdida de humedales avanzan con el calentamiento del océano.',
    detalle: 'El Plan prioriza soluciones basadas en la naturaleza para la restauración costera y el establecimiento de un Plan de Manejo Integrado Nacional de los sistemas marinos y costeros.'
  },
  {
    icon: '🌳', nombre: 'Forestación y ecosistemas terrestres',
    stat: 'La cubierta forestal pasó de 90% a solo 5% (siglo XX) y hoy ronda 50%',
    resumen: 'Los bosques se han recuperado desde mínimos históricos, pero enfrentan huracanes más intensos y presión de urbanización.',
    detalle: 'El Plan propone sembrar 500,000 árboles al año durante 10 años y reforestar de forma prioritaria aguas arriba de los embalses que suplen el 70% del agua potable de Puerto Rico.'
  },
  {
    icon: '🏖️', nombre: 'Turismo',
    stat: 'El sector económico más vulnerable, según el CEACC',
    resumen: 'Playas, arrecifes y atracciones naturales —motor del turismo— están entre los recursos más expuestos.',
    detalle: 'El Plan recomienda proteger la infraestructura turística (hoteles, puertos, aeropuertos) y actualizar el marco legal de turismo para incorporar la adaptación climática.'
  },
  {
    icon: '📚', nombre: 'Educación',
    stat: 'Brecha grande en conocimiento ciudadano',
    resumen: 'Gran parte de la población desconoce cómo el cambio climático ya afecta su vida diaria.',
    detalle: 'El Plan incluye una guía para integrar el cambio climático en el currículo K-12 de escuelas públicas y privadas (Anejo 3), y llama a fortalecer la divulgación científica.'
  },
  {
    icon: '⚖️', nombre: 'Justicia climática',
    stat: '45% de fondos climáticos propuestos para comunidades vulnerables',
    resumen: 'Las comunidades de menos recursos suelen sufrir primero y peor los impactos climáticos.',
    detalle: 'El Plan recomienda enmendar la Ley 33-2019 para incorporar formalmente el concepto de justicia climática y garantizar que los fondos de mitigación y adaptación prioricen a las comunidades más desfavorecidas.'
  }
];

// Páginas de sector ya construidas (las demás muestran el resumen expandible por ahora)
const paginasListas = ['energia'];

const grid = document.getElementById('sectorGrid');
sectores.forEach(s => {
  const tienePagina = paginasListas.includes(s.slug);
  const card = document.createElement(tienePagina ? 'a' : 'div');
  card.className = 'sector-card';
  if (tienePagina) {
    card.href = `sectores/${s.slug}.html`;
  } else {
    // Tarjetas sin página propia todavía: accesibles por teclado como "botón" que expande el resumen.
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');
  }
  card.innerHTML = `
    <div class="sector-icon" aria-hidden="true">${s.icon}</div>
    <h4>${s.nombre}</h4>
    <p>${s.resumen}</p>
    <span class="sector-stat">${s.stat}</span>
    ${tienePagina
      ? `<div class="sector-detail" style="display:block; border-top:1px dashed var(--border-strong); margin-top:10px; padding-top:10px;">Ver diagnóstico y cursos de acción completos →</div>`
      : `<div class="sector-detail">${s.detalle}</div>`}
  `;
  if (!tienePagina) {
    const toggle = () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', String(open));
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }
  grid.appendChild(card);
});

/* ============ Charts (theme-aware) ============ */
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

Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";

const chartsToRestyle = [];

function applyThemeToChart(chart, opts) {
  const c = themeColors();
  Chart.defaults.color = c.text;
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

  /* Emisiones por fuente 2021 */
  const chartEmisiones = new Chart(document.getElementById('chartEmisiones'), {
    type: 'doughnut',
    data: {
      labels: ['Generación eléctrica (52%)', 'Transporte (26%)', 'Residuos sólidos (8%)', 'Otros sectores (14%)'],
      datasets: [{
        data: [52, 26, 8, 14],
        backgroundColor: [palette.blue, palette.teal, palette.coral, palette.grey],
        borderWidth: 2, borderColor: c.surface
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 }, color: c.text } } },
      cutout: '58%'
    }
  });
  chartsToRestyle.push({ chart: chartEmisiones, isDoughnut: true });

  /* Nivel del mar */
  const chartMar = new Chart(document.getElementById('chartMar'), {
    type: 'bar',
    data: {
      labels: ['2030', '2050', '2100'],
      datasets: [
        { label: 'Escenario bajo', data: [0.59, 1.02, 1.97], backgroundColor: palette.tealLight },
        { label: 'Escenario intermedio', data: [0.69, 1.31, 3.94], backgroundColor: palette.teal },
        { label: 'Escenario alto', data: [0.72, 1.71, 7.22], backgroundColor: palette.coral }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 }, color: c.text } } },
      scales: {
        y: { title: { display: true, text: 'Pies de aumento', color: c.text }, beginAtZero: true, ticks: { color: c.text }, grid: { color: c.grid } },
        x: { ticks: { color: c.text }, grid: { color: c.grid } }
      }
    }
  });
  chartsToRestyle.push({ chart: chartMar });

  /* Meta de emisiones */
  const chartMeta = new Chart(document.getElementById('chartMeta'), {
    type: 'line',
    data: {
      labels: ['2005 (base)', '2019', '2021', '2025 (meta legal)'],
      datasets: [{
        label: 'Millones de toneladas de CO2e',
        data: [53.6, 33.4, 34.3, 26.7],
        borderColor: palette.coral,
        backgroundColor: 'rgba(255,111,89,.15)',
        fill: true, tension: .3, pointRadius: 5, pointBackgroundColor: palette.coral
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'MTM de CO2e', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
        x: { ticks: { color: c.text }, grid: { color: c.grid } }
      }
    }
  });
  chartsToRestyle.push({ chart: chartMeta });

  /* Marejada ciclónica María */
  const chartMarejada = new Chart(document.getElementById('chartMarejada'), {
    type: 'bar',
    data: {
      labels: ['Costa este\n(entrada)', 'Resto costa\neste', 'Costa\nnorte', 'Costa\nsur', 'Costa oeste /\nsuroeste'],
      datasets: [{
        label: 'Marejada ciclónica (pies)',
        data: [9.5, 7, 3, 4, 2.5],
        backgroundColor: palette.blue,
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Pies sobre el nivel del suelo', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
        x: { ticks: { color: c.text }, grid: { color: c.grid } }
      }
    }
  });
  chartsToRestyle.push({ chart: chartMarejada });
}

initCharts();

// Vuelve a colorear las gráficas cuando se cambia de tema (ver theme.js).
window.addEventListener('pmarcc-theme-change', () => {
  chartsToRestyle.forEach(({ chart, isDoughnut }) => applyThemeToChart(chart, { isDoughnut }));
});
