/* ============ Sector data (from P-MARCC, Cap. 4 y 7) ============ */
const SVG_ICONS = {
  energia: '<path d="m13 2-9.5 12H11l-1 8 9.5-12H12l1-8Z"/>',
  infraestructura: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  transporte: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  residuos: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  salud: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  agricultura: '<path d="M7 20h10"/><path d="M12 20v-9"/><path d="M12 11c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5Z"/>',
  agua: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  marinos: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  forestacion: '<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>',
  turismo: '<path d="M22 12a10 10 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
  educacion: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  justicia: '<path d="m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="m2 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>'
};
const SECTOR_COLORS = {
  energia:'#ffb703', infraestructura:'#0f5c78', transporte:'#ff6f59', residuos:'#3d5257',
  salud:'#c2185b', agricultura:'#2e7d32', agua:'#1f7ae0', marinos:'#12a594',
  forestacion:'#558b2f', turismo:'#e65100', educacion:'#283593', justicia:'#6a4fb8'
};
function sectorSvg(slug) {
  return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="${SECTOR_COLORS[slug] || 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG_ICONS[slug] || ''}</svg>`;
}

const sectores = [
  {
    icon: '⚡', nombre: 'Energía', slug: 'energia',
    stat: '4.12% renovable hoy · meta 100% para 2050',
    resumen: 'El sistema eléctrico depende casi por completo de combustibles fósiles importados.',
    detalle: 'La generación de electricidad es la mayor fuente de emisiones de GEI en Puerto Rico (52% del total en 2021). El Plan apunta a acelerar la transición a energía renovable y distribuida, especialmente en techos residenciales.'
  },
  {
    icon: '🏗️', nombre: 'Infraestructura y vivienda', slug: 'infraestructura',
    stat: 'Miles de viviendas en zonas inundables',
    resumen: 'Infraestructura crítica y vivienda pública ubicadas en zonas vulnerables al aumento del nivel del mar.',
    detalle: 'El Plan recomienda no autorizar nueva construcción en terrenos con riesgo de inundación por marejada ciclónica o aumento del nivel del mar, y reubicar de forma planificada la vivienda pública ya expuesta.'
  },
  {
    icon: '🚗', nombre: 'Transporte y movilidad', slug: 'transporte',
    stat: '26% de las emisiones de GEI (2021)',
    resumen: 'Segunda mayor fuente de emisiones, dominada por vehículos de combustión en carretera.',
    detalle: 'El Plan promueve la electrificación del parque vehicular, el transporte colectivo, distritos orientados al transporte (TOD) y el concepto de "calles completas" para reducir el uso del automóvil privado.'
  },
  {
    icon: '🗑️', nombre: 'Residuos sólidos', slug: 'residuos',
    stat: '8% de las emisiones de GEI (2021)',
    resumen: 'El manejo de vertederos y aguas residuales genera una porción significativa de las emisiones.',
    detalle: 'El Plan busca reducir en 60% la cantidad de residuos depositados en vertederos mediante reciclaje, compostaje y estrategias de desperdicio cero.'
  },
  {
    icon: '🏥', nombre: 'Salud y bienestar', slug: 'salud',
    stat: 'Impactos físicos y de salud mental',
    resumen: 'El calor extremo, los vectores de enfermedad y los desastres afectan la salud física y mental.',
    detalle: 'El Plan reconoce determinantes sociales de la salud vinculados al cambio climático y recomienda incluir al sector salud en el próximo inventario de emisiones de GEI de Puerto Rico.'
  },
  {
    icon: '🌾', nombre: 'Agricultura y ganadería', slug: 'agricultura',
    stat: '85% de los alimentos son importados',
    resumen: 'El área agrícola se redujo 17% en años recientes; la seguridad alimentaria está en riesgo.',
    detalle: 'El Plan exige sistemas de riego más eficientes (reducir pérdida de agua de la AEE de 60% a 10%), riego por goteo obligatorio y mayor uso de aguas tratadas para la agricultura.'
  },
  {
    icon: '💧', nombre: 'Agua', slug: 'agua',
    stat: '60% de pérdida en el sistema de distribución',
    resumen: 'Sequías más frecuentes y pérdida de agua potable amenazan el suministro.',
    detalle: 'El Plan propone reducir la pérdida de agua de la AAA de 60% a 17%, reusar el 100% de las aguas tratadas para el 2050 y exigir captura de agua de lluvia en construcciones nuevas y existentes.'
  },
  {
    icon: '🌊', nombre: 'Sistemas marinos y costeros', slug: 'marinos',
    stat: 'Arrecifes, manglares y playas en deterioro',
    resumen: 'Erosión costera, blanqueamiento de corales y pérdida de humedales avanzan con el calentamiento del océano.',
    detalle: 'El Plan prioriza soluciones basadas en la naturaleza para la restauración costera y el establecimiento de un Plan de Manejo Integrado Nacional de los sistemas marinos y costeros.'
  },
  {
    icon: '🌳', nombre: 'Forestación y ecosistemas terrestres', slug: 'forestacion',
    stat: 'La cubierta forestal pasó de 90% a solo 5% (siglo XX) y hoy ronda 50%',
    resumen: 'Los bosques se han recuperado desde mínimos históricos, pero enfrentan huracanes más intensos y presión de urbanización.',
    detalle: 'El Plan propone sembrar 500,000 árboles al año durante 10 años y reforestar de forma prioritaria aguas arriba de los embalses que suplen el 70% del agua potable de Puerto Rico.'
  },
  {
    icon: '🏖️', nombre: 'Turismo', slug: 'turismo',
    stat: 'El sector económico más vulnerable, según el CEACC',
    resumen: 'Playas, arrecifes y atracciones naturales (motor del turismo) están entre los recursos más expuestos.',
    detalle: 'El Plan recomienda proteger la infraestructura turística (hoteles, puertos, aeropuertos) y actualizar el marco legal de turismo para incorporar la adaptación climática.'
  },
  {
    icon: '📚', nombre: 'Educación', slug: 'educacion',
    stat: 'Brecha grande en conocimiento ciudadano',
    resumen: 'Gran parte de la población desconoce cómo el cambio climático ya afecta su vida diaria.',
    detalle: 'El Plan incluye una guía para integrar el cambio climático en el currículo K-12 de escuelas públicas y privadas (Anejo 3), y llama a fortalecer la divulgación científica.'
  },
  {
    icon: '⚖️', nombre: 'Justicia climática', slug: 'justicia',
    stat: '45% de fondos climáticos propuestos para comunidades vulnerables',
    resumen: 'Las comunidades de menos recursos suelen sufrir primero y peor los impactos climáticos.',
    detalle: 'El Plan recomienda enmendar la Ley 33-2019 para incorporar formalmente el concepto de justicia climática y garantizar que los fondos de mitigación y adaptación prioricen a las comunidades más desfavorecidas.'
  }
];

// Las 12 páginas de sector están construidas: todas las tarjetas son enlaces.
const grid = document.getElementById('sectorGrid');
sectores.forEach(s => {
  const card = document.createElement('a');
  card.className = 'sector-card';
  card.href = `sectores/${s.slug}.html`;
  card.innerHTML = `
    <div class="sector-icon" aria-hidden="true">${sectorSvg(s.slug)}</div>
    <h4>${s.nombre}</h4>
    <p>${s.resumen}</p>
    <span class="sector-stat">${s.stat}</span>
    <div class="sector-detail" style="display:block; border-top:1px dashed var(--border-strong); margin-top:10px; padding-top:10px;">Ver diagnóstico y cursos de acción →</div>
  `;
  grid.appendChild(card);
});

/* ============ Charts (theme-aware, lazy init) ============ */
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

/* Si Chart.js no cargó (CDN caído o bloqueado), muestra las tablas de datos
   que normalmente son solo para lectores de pantalla. */
function chartsFallback() {
  document.querySelectorAll('canvas[role="img"]').forEach(cv => {
    cv.style.display = 'none';
    const table = document.getElementById(cv.getAttribute('aria-describedby'));
    if (table) {
      table.classList.remove('visually-hidden');
      table.classList.add('chart-fallback-table');
    }
  });
}

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

/* Inicialización perezosa: las gráficas se crean cuando la sección de datos
   se acerca al viewport, para no bloquear la carga inicial en móvil. */
(function () {
  if (typeof Chart === 'undefined') { chartsFallback(); return; }
  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  const target = document.getElementById('chartEmisiones');
  if (!target) return;
  let initialized = false;
  const boot = () => { if (!initialized) { initialized = true; initCharts(); } };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { boot(); io.disconnect(); }
    }, { rootMargin: '400px 0px' });
    io.observe(target);
  } else {
    boot();
  }
})();

// Vuelve a colorear las gráficas cuando se cambia de tema (ver theme.js).
window.addEventListener('pmarcc-theme-change', () => {
  chartsToRestyle.forEach(({ chart, isDoughnut }) => applyThemeToChart(chart, { isDoughnut }));
});
