/* ============================================================
   Mapa vectorial local, tarjetas y mini-gráficas de los 19 embalses de PR.
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

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MAP_WIDTH = 1000;
  var MAP_HEIGHT = 420;
  var MAP_BOUNDS = { west: -67.3, east: -65.55, north: 18.56, south: 17.88 };
  var PUERTO_RICO_OUTLINE = [
    [-67.269879, 18.362235], [-67.154863, 18.192450], [-67.209633, 17.956941],
    [-66.985078, 17.973372], [-66.924832, 17.929556], [-66.771478, 18.006234],
    [-66.448338, 17.984326], [-66.234737, 17.929556], [-65.834921, 18.017187],
    [-65.730859, 18.186973], [-65.626797, 18.203403], [-65.632274, 18.367712],
    [-65.840398, 18.433435], [-66.409999, 18.488204], [-66.957694, 18.488204],
    [-67.094617, 18.515589], [-67.269879, 18.362235]
  ];

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
  var readings = {};

  function project(lat, lng) {
    var x = 42 + ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 916;
    var y = 40 + ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 340;
    return { x: x, y: y };
  }

  function outlinePath() {
    return PUERTO_RICO_OUTLINE.map(function (coord, i) {
      var point = project(coord[1], coord[0]);
      return (i ? 'L' : 'M') + point.x.toFixed(1) + ',' + point.y.toFixed(1);
    }).join(' ') + ' Z';
  }

  function showMapDetail(siteNo) {
    var detail = document.getElementById('embalsesMapDetail');
    var info = EMBALSES_INFO[siteNo];
    if (!detail || !info) return;
    Object.keys(markers).forEach(function (key) {
      markers[key].group.classList.toggle('is-active', key === siteNo);
    });
    detail.innerHTML = '<div class="embalse-map-detail-inner">' +
      '<span class="embalse-map-detail-kicker">Embalse seleccionado</span>' +
      popupHtml(siteNo, info, readings[siteNo] || null) +
      '</div>';
  }

  function initMap() {
    var mapEl = document.getElementById('embalsesMap');
    var statusEl = document.getElementById('embalsesMapStatus');
    if (!mapEl) return;
    mapEl.innerHTML = '<div class="embalses-map-figure">' +
      '<svg class="embalses-map-svg" viewBox="0 0 ' + MAP_WIDTH + ' ' + MAP_HEIGHT + '" role="img" aria-labelledby="embalsesMapTitle embalsesMapDesc">' +
        '<title id="embalsesMapTitle">Ubicación de los 19 embalses monitoreados</title>' +
        '<desc id="embalsesMapDesc">Mapa esquemático de Puerto Rico. Los puntos se pueden seleccionar para consultar el nivel más reciente de cada embalse.</desc>' +
        '<path class="embalses-island" d="' + outlinePath() + '"></path>' +
        '<text class="embalses-map-label" x="500" y="225" text-anchor="middle">Puerto Rico</text>' +
        '<g id="embalsesMapMarkers"></g>' +
      '</svg>' +
      '</div>' +
      '<aside class="embalse-map-detail" id="embalsesMapDetail" aria-live="polite">' +
        '<div class="embalse-map-detail-inner"><span class="embalse-map-detail-kicker">Mapa interactivo</span>' +
        '<p class="chart-note">Selecciona un punto para ver el nombre, municipio y nivel más reciente del embalse.</p></div>' +
      '</aside>';

    var markerLayer = document.getElementById('embalsesMapMarkers');

    Object.keys(EMBALSES_INFO).forEach(function (siteNo) {
      var info = EMBALSES_INFO[siteNo];
      var point = project(info.lat, info.lng);
      var group = document.createElementNS(SVG_NS, 'g');
      var circle = document.createElementNS(SVG_NS, 'circle');
      var title = document.createElementNS(SVG_NS, 'title');
      group.setAttribute('class', 'embalse-map-marker');
      group.setAttribute('role', 'button');
      group.setAttribute('tabindex', '0');
      group.setAttribute('aria-label', info.nombre + ', ' + info.municipio + '. Seleccionar para ver detalles.');
      circle.setAttribute('cx', point.x.toFixed(1));
      circle.setAttribute('cy', point.y.toFixed(1));
      circle.setAttribute('r', '9');
      circle.setAttribute('fill', COLOR_NEUTRAL);
      title.textContent = info.nombre + ' — ' + info.municipio;
      group.appendChild(title);
      group.appendChild(circle);
      group.addEventListener('mouseenter', function () { showMapDetail(siteNo); });
      group.addEventListener('focus', function () { showMapDetail(siteNo); });
      group.addEventListener('click', function () { showMapDetail(siteNo); });
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showMapDetail(siteNo);
        }
      });
      markerLayer.appendChild(group);
      markers[siteNo] = { group: group, circle: circle, title: title };
    });
    if (statusEl) statusEl.style.display = 'none';
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
        '<div class="embalse-card-sparkline-wrap">' +
          '<canvas class="embalse-card-sparkline" id="sparkline-' + siteNo + '" ' +
            'role="img" aria-label="Tendencia del nivel de ' + info.nombre + ' en el último mes"></canvas>' +
        '</div>' +
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
        animation: false, responsive: true, maintainAspectRatio: false,
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
      readings[siteNo] = reading;
      var marker = markers[siteNo];
      if (marker) {
        var status = reading ? classify(siteNo, reading.valor) : null;
        marker.circle.setAttribute('fill', colorFor(status));
        marker.circle.setAttribute('r', String(radiusFor(status)));
        marker.circle.classList.toggle('embalse-marker-critico', status === 'rojo');
        marker.group.setAttribute('aria-label', info.nombre + ', ' + info.municipio + '. ' +
          (reading ? 'Nivel más reciente: ' + reading.valor.toFixed(2) + ' pies. ' : 'Nivel actual no disponible. ') +
          'Seleccionar para ver detalles.');
        marker.title.textContent = info.nombre + ' — ' + info.municipio +
          (reading ? ': ' + reading.valor.toFixed(2) + ' pies' : ': nivel no disponible');
        if (marker.group.classList.contains('is-active')) showMapDetail(siteNo);
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
