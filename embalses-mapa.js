/* ============================================================
   Mapa (Leaflet), tarjetas y mini-gráficas de los 19 embalses de PR.
   Los datos fijos (nombre, municipio, coordenadas, etc.) vienen de
   sectores/embalses-info-data.js. El nivel actual, el historial de 30
   días y los umbrales de la AAA se reusan de sectores/embalses.js vía
   window.PMARCC_SUPABASE (esa página debe cargarse con <script defer>
   antes que este módulo).
   ============================================================ */
import { EMBALSES_INFO, EMBALSES_CON_UMBRALES } from './sectores/embalses-info-data.js';

(function () {
  var COLOR_VERDE = '#2f9e44';
  var COLOR_AMBAR = '#e8a33d';
  var COLOR_ROJO = '#c92a2a';
  var COLOR_NEUTRAL = '#7c8db0';
  var HISTORIAL_DIAS = 30;

  var TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  var TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function tileUrlFor(theme) { return theme === 'dark' ? TILE_DARK : TILE_LIGHT; }

  function radiusFor(status) {
    if (status === 'rojo') return 12;
    if (status === 'ambar') return 10;
    if (status === 'verde') return 8;
    return 7; // sin umbral oficial (gris)
  }

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function fmtFecha(fechaISO) {
    var p = fechaISO.slice(0, 10).split('-');
    return parseInt(p[2], 10) + ' ' + MESES[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* verde si >= Ajustes, ámbar entre Control y Ajustes, rojo si < Control.
     Solo aplica a los 6 embalses de la AAA con ambos umbrales conocidos;
     el resto no tiene un umbral oficial que se pueda citar. */
  function classify(siteNo, valorPies) {
    if (EMBALSES_CON_UMBRALES.indexOf(siteNo) === -1) return null;
    if (typeof valorPies !== 'number' || isNaN(valorPies)) return null;
    var sup = window.PMARCC_SUPABASE;
    if (!sup) return null;
    var ajustes = sup.NIVEL_AJUSTES_PIES[siteNo];
    var control = sup.NIVEL_CONTROL_PIES[siteNo];
    if (typeof ajustes !== 'number' || typeof control !== 'number') return null;
    if (valorPies >= ajustes) return 'verde';
    if (valorPies >= control) return 'ambar';
    return 'rojo';
  }

  function colorFor(status) {
    if (status === 'verde') return COLOR_VERDE;
    if (status === 'ambar') return COLOR_AMBAR;
    if (status === 'rojo') return COLOR_ROJO;
    return COLOR_NEUTRAL;
  }

  function popupHtml(siteNo, info, reading) {
    var nivelHtml = reading
      ? '<strong>' + reading.valor.toFixed(2) + ' pies</strong> sobre el nivel del mar<br>' +
        '<span style="font-size:.8em;opacity:.8;">Lectura del ' + fmtFecha(reading.fecha) + '</span>'
      : '<span style="opacity:.8;">Nivel actual no disponible por el momento</span>';
    var alertaHtml = info.alerta
      ? '<p style="margin:6px 0 0;color:#c92a2a;font-weight:700;font-size:.8em;">⚠ Bajo Plan de Interrupciones Programadas (AAA)</p>'
      : '';
    return '<div class="embalse-popup">' +
      '<strong>' + info.nombre + '</strong><br>' +
      '<span style="font-size:.85em;opacity:.85;">' + info.municipio + '</span>' +
      '<p style="margin:8px 0;">' + nivelHtml + '</p>' +
      alertaHtml +
      '<a href="sectores/agua.html#' + siteNo + '">Ver historial completo →</a>' +
      '</div>';
  }

  /* Un solo fetch de los últimos 30 días por embalse, reusado tanto para
     clasificar el color del marcador del mapa como para la mini-gráfica
     y el indicador de tendencia de la tarjeta (antes eran dos fetches
     separados para datos parecidos). */
  function fetchHistory30(siteNo) {
    if (!window.PMARCC_SUPABASE) return Promise.resolve([]);
    var start = new Date();
    start.setDate(start.getDate() - HISTORIAL_DIAS);
    return window.PMARCC_SUPABASE.fetchNiveles(siteNo, { startDT: isoDate(start), order: 'asc' })
      .then(function (rows) {
        return (rows || []).map(function (r) {
          var v = parseFloat(r.valor_pies);
          return isNaN(v) ? null : { valor: v, fecha: r.fecha };
        }).filter(Boolean);
      })
      .catch(function () { return []; });
  }

  var markers = {};

  function initMap() {
    var mapEl = document.getElementById('embalsesMap');
    var statusEl = document.getElementById('embalsesMapStatus');
    if (!mapEl) return;
    if (typeof L === 'undefined') {
      mapEl.style.display = 'none';
      if (statusEl) statusEl.textContent = 'No se pudo cargar el mapa en este momento.';
      return;
    }
    if (statusEl) statusEl.style.display = 'none';

    var map = L.map('embalsesMap', { scrollWheelZoom: false }).setView([18.2, -66.4], 9);
    var tileLayer = L.tileLayer(tileUrlFor(currentTheme()), {
      attribution: TILE_ATTR,
      subdomains: 'abcd',
      maxZoom: 19,
      detectRetina: true
    }).addTo(map);

    window.addEventListener('pmarcc-theme-change', function (e) {
      var theme = (e.detail && e.detail.theme) || currentTheme();
      tileLayer.setUrl(tileUrlFor(theme));
    });

    Object.keys(EMBALSES_INFO).forEach(function (siteNo) {
      var info = EMBALSES_INFO[siteNo];
      var marker = L.circleMarker([info.lat, info.lng], {
        radius: 9, weight: 2, color: '#fff', fillColor: COLOR_NEUTRAL, fillOpacity: .9
      }).addTo(map);
      marker.bindPopup(popupHtml(siteNo, info, null));
      markers[siteNo] = marker;
    });
  }

  function renderCards() {
    var grid = document.getElementById('embalsesGrid');
    if (!grid) return;

    var entries = Object.keys(EMBALSES_INFO)
      .map(function (siteNo) { return [siteNo, EMBALSES_INFO[siteNo]]; })
      .sort(function (a, b) { return a[1].nombre.localeCompare(b[1].nombre, 'es'); });

    grid.innerHTML = entries.map(function (entry) {
      var siteNo = entry[0], info = entry[1];
      var anio = info.anio ? info.anio : 'N/D';
      var capacidad = info.capacidadOriginal ? info.capacidadOriginal : 'N/D';
      var perdido = (typeof info.porcientoPerdido === 'number') ? info.porcientoPerdido + '%' : 'N/D';
      var nota = info.porcientoPerdidoNota
        ? '<p class="embalse-card-nota">⚠ ' + info.porcientoPerdidoNota + '</p>'
        : '';
      var alerta = info.alerta
        ? '<p class="embalse-card-alerta">⚠ ' + info.alerta.texto + ' <a href="' + info.alerta.url + '" target="_blank" rel="noopener">Fuente: ' + info.alerta.fuente + '</a></p>'
        : '';
      return '<article class="embalse-card">' +
        '<h4>' + info.nombre + '</h4>' +
        '<p class="embalse-card-municipio">' + info.municipio + '</p>' +
        '<div class="embalse-card-nivel">' +
          '<span class="embalse-card-nivel-valor" id="nivel-' + siteNo + '">—</span>' +
          '<span class="reservoir-current-trend" id="tendencia-' + siteNo + '"></span>' +
        '</div>' +
        '<canvas class="embalse-card-sparkline" id="sparkline-' + siteNo + '" width="260" height="56" ' +
          'role="img" aria-label="Tendencia del nivel de ' + info.nombre + ' en el último mes"></canvas>' +
        '<dl class="embalse-card-facts">' +
          '<div><dt>Operador</dt><dd>' + info.operador + '</dd></div>' +
          '<div><dt>Construido</dt><dd>' + anio + '</dd></div>' +
          '<div><dt>Capacidad original</dt><dd>' + capacidad + '</dd></div>' +
          '<div><dt>% de capacidad perdida</dt><dd>' + perdido + '</dd></div>' +
        '</dl>' +
        nota +
        alerta +
        '<a class="embalse-card-link" href="sectores/agua.html#' + siteNo + '">Ver gráfica histórica →</a>' +
      '</article>';
    }).join('');
  }

  // Línea sin ejes ni puntos (sparkline clásico). El color refleja si el
  // nivel subió o bajó entre el primer y el último dato de la ventana de
  // 30 días (mismo umbral TENDENCIA_UMBRAL_M que usa agua.html, para no
  // tener dos criterios de "subiendo/bajando" distintos en el sitio).
  function renderSparkline(siteNo, rows) {
    var canvas = document.getElementById('sparkline-' + siteNo);
    if (!canvas || typeof Chart === 'undefined' || rows.length < 2) return;
    var sup = window.PMARCC_SUPABASE;
    var umbral = (sup && typeof sup.TENDENCIA_UMBRAL_M === 'number') ? sup.TENDENCIA_UMBRAL_M : 0.05;
    var diffM = (rows[rows.length - 1].valor - rows[0].valor) * 0.3048;
    var color = COLOR_NEUTRAL;
    if (diffM > umbral) color = COLOR_VERDE;
    else if (diffM < -umbral) color = COLOR_ROJO;

    var n = rows.length;
    var puntos = rows.map(function (r, i) { return i === n - 1 ? 3 : 0; });

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: rows.map(function (r) { return r.fecha; }),
        datasets: [{
          data: rows.map(function (r) { return r.valor; }),
          borderColor: color,
          backgroundColor: color + '26',
          borderWidth: 2.5,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          pointRadius: puntos,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          tension: .3,
          fill: true
        }]
      },
      options: {
        animation: false, responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  function renderNivelActual(siteNo, rows) {
    var valorEl = document.getElementById('nivel-' + siteNo);
    var tendEl = document.getElementById('tendencia-' + siteNo);
    if (!valorEl) return;
    if (!rows.length) { valorEl.textContent = '—'; return; }
    var last = rows[rows.length - 1];
    valorEl.textContent = (last.valor * 0.3048).toFixed(2) + ' m · ' + last.valor.toFixed(1) + ' pies';
    if (!tendEl) return;
    if (rows.length < 2) { tendEl.textContent = ''; return; }
    var sup = window.PMARCC_SUPABASE;
    var umbral = (sup && typeof sup.TENDENCIA_UMBRAL_M === 'number') ? sup.TENDENCIA_UMBRAL_M : 0.05;
    var diffM = (last.valor - rows[0].valor) * 0.3048;
    if (diffM > umbral) { tendEl.textContent = '↑ Subiendo'; tendEl.className = 'reservoir-current-trend up'; }
    else if (diffM < -umbral) { tendEl.textContent = '↓ Bajando'; tendEl.className = 'reservoir-current-trend down'; }
    else { tendEl.textContent = '→ Estable'; tendEl.className = 'reservoir-current-trend stable'; }
  }

  function loadReservoir(siteNo, info) {
    fetchHistory30(siteNo).then(function (rows) {
      var reading = rows.length ? rows[rows.length - 1] : null;
      var marker = markers[siteNo];
      if (marker) {
        var status = reading ? classify(siteNo, reading.valor) : null;
        marker.setStyle({ fillColor: colorFor(status) });
        marker.setRadius(radiusFor(status));
        if (marker._path) {
          marker._path.classList.toggle('embalse-marker-critico', status === 'rojo');
        }
        if (status === 'rojo' || status === 'ambar') marker.bringToFront();
        marker.setPopupContent(popupHtml(siteNo, info, reading));
      }
      renderSparkline(siteNo, rows);
      renderNivelActual(siteNo, rows);
    });
  }

  renderCards();
  initMap();
  Object.keys(EMBALSES_INFO).forEach(function (siteNo) {
    loadReservoir(siteNo, EMBALSES_INFO[siteNo]);
  });
})();
