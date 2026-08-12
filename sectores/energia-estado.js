/* ============================================================
   Estado del sistema eléctrico en vivo (sector Energía). Fuente:
   operationdata.prepa.pr.gov/dataSourceGenera.js — archivo público de
   la AEE/Genera PR que define variables globales (dataMetrics,
   dataByFuel, dataCapacity, dataLoadPerSite, dataFechaAcualizado) sin
   necesidad de API key. Debe cargarse ANTES que este script (mismo
   patrón que embalses-coords-loader.js con embalses.js).

   Nota sobre codificación: el archivo fuente tiene problemas de
   acentos en el campo Desc de dataMetrics (ej. "GeneraciÃ³n" en vez de
   "Generación"), así que NO se debe leer por texto - se lee por el
   campo Index, que es estable:
   0=Total Generación, 1=% PREPA, 2=% PPOA, 3=% Fósil, 4=% Renovable,
   5=Reserva en Rotación, 6=Reserva Operacional, 7=Capacidad Disponible,
   8=Próxima Hora, 9=Máxima Hoy, 10=Máxima Mensual, 11=Máxima Anual.
   ============================================================ */
(function () {
  var statTimestamp = document.getElementById('estadoTimestamp');
  var statTotal = document.getElementById('estadoGeneracionTotal');
  var statDisponible = document.getElementById('estadoCapacidadDisponible');
  var statRotacion = document.getElementById('estadoReservaRotacion');
  var statOperacional = document.getElementById('estadoReservaOperacional');
  var statRenovable = document.getElementById('estadoPorcientoRenovable');
  var statPrivados = document.getElementById('estadoPorcientoPrivados');
  var fuelCanvas = document.getElementById('chartCombustibleActual');
  var capCanvas = document.getElementById('chartCapacidadHistorica');
  var capRangeButtons = document.querySelectorAll('.capacidad-range-btn');
  var hidroBody = document.getElementById('hidroelectricasBody');
  var estadoStatus = document.getElementById('estadoSistemaStatus');
  if (!statTotal) return;

  if (typeof dataMetrics === 'undefined' || typeof dataByFuel === 'undefined' || typeof dataCapacity === 'undefined') {
    if (estadoStatus) estadoStatus.textContent = 'No se pudo cargar el estado del sistema eléctrico en este momento.';
    return;
  }

  function metric(index) {
    var row = dataMetrics.filter(function (m) { return m.Index === String(index); })[0];
    return row ? row.value : null;
  }
  function fmtMW(v) {
    return (typeof v === 'number') ? v.toLocaleString('es-PR') + ' MW' : '—';
  }

  if (statTimestamp) statTimestamp.textContent = 'Actualizado: ' + (typeof dataFechaAcualizado !== 'undefined' ? dataFechaAcualizado : '—');
  if (statTotal) statTotal.textContent = fmtMW(metric(0));
  if (statDisponible) statDisponible.textContent = fmtMW(metric(7));
  if (statRotacion) statRotacion.textContent = fmtMW(metric(5));
  if (statOperacional) statOperacional.textContent = fmtMW(metric(6));
  if (statRenovable) statRenovable.textContent = (metric(4) != null ? metric(4) + '%' : '—');
  if (statPrivados) statPrivados.textContent = (metric(2) != null ? metric(2) + '%' : '—');

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
      grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)'
    };
  }

  var fuelChart = null;
  function renderFuelChart() {
    if (!fuelCanvas || typeof Chart === 'undefined' || !dataByFuel.length) return;
    var c = themeColors();
    var colores = { Bunker: '#6b7280', Diesel: '#c9782f', LNG: '#2f8fff', Coal: '#3d3d3d', Renew: '#2f9e44' };
    fuelChart = new Chart(fuelCanvas, {
      type: 'doughnut',
      data: {
        labels: dataByFuel.map(function (f) { return f.fuel; }),
        datasets: [{
          data: dataByFuel.map(function (f) { return f.value; }),
          backgroundColor: dataByFuel.map(function (f) { return colores[f.fuel] || '#999'; }),
          borderWidth: 2, borderColor: 'transparent'
        }]
      },
      options: {
        animation: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 11 }, color: c.text } } }
      }
    });
  }

  var capChart = null;
  var capRange = 'daily';
  function renderCapChart() {
    if (!capCanvas || typeof Chart === 'undefined') return;
    var c = themeColors();
    var d = dataCapacity[capRange];
    if (!d) return;
    if (capChart) capChart.destroy();
    capChart = new Chart(capCanvas, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Capacidad (MW)', data: d.capacity,
          borderColor: '#2f8fff', backgroundColor: 'rgba(47,143,255,.16)',
          fill: true, tension: .2, pointRadius: 2, borderWidth: 2.5
        }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { title: { display: true, text: 'MW', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
          x: { ticks: { color: c.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false } }
        }
      }
    });
  }

  capRangeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-active')) return;
      capRangeButtons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      capRange = btn.getAttribute('data-cap-range');
      renderCapChart();
    });
  });

  // Solo se enlazan a embalses.html las hidroeléctricas cuyo nombre
  // coincide sin ambigüedad con un embalse ya mapeado en
  // sectores/embalses-info-data.js. "Toro Negro" y "Yauco" se muestran
  // igual, pero SIN link, porque no se pudo verificar a cuál site_no
  // del USGS corresponden exactamente - mejor no enlazar que enlazar mal.
  var HIDRO_A_EMBALSE = {
    'Dos Bocas': '50027100',
    'Caonillas': '50026140',
    'Garzas': '50020100',
    'Rio Blanco': '50076800'
  };

  function renderHidro() {
    if (!hidroBody || typeof dataLoadPerSite === 'undefined') return;
    var hidro = dataLoadPerSite.filter(function (s) { return s.Type === 'Hidroelectricas'; });
    hidroBody.innerHTML = hidro.map(function (s) {
      var siteNo = HIDRO_A_EMBALSE[s.Desc];
      var nombre = siteNo
        ? '<a href="../embalses.html#' + siteNo + '">' + s.Desc + '</a>'
        : s.Desc;
      var mw = (typeof s.SiteTotal === 'number') ? s.SiteTotal.toFixed(1) : '—';
      var nota = (s.SiteTotal === 0) ? ' <span class="hidro-cero">— sin generar ahora mismo</span>' : '';
      return '<tr><td>' + nombre + '</td><td>' + mw + ' MW' + nota + '</td></tr>';
    }).join('');
  }

  renderFuelChart();
  renderCapChart();
  renderHidro();

  window.addEventListener('pmarcc-theme-change', function () {
    var c = themeColors();
    if (fuelChart) {
      fuelChart.options.plugins.legend.labels.color = c.text;
      fuelChart.update();
    }
    if (capChart) {
      capChart.options.scales.y.ticks.color = c.text;
      capChart.options.scales.y.title.color = c.text;
      capChart.options.scales.y.grid.color = c.grid;
      capChart.options.scales.x.ticks.color = c.text;
      capChart.update();
    }
  });
})();
