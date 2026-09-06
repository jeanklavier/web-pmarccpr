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
  // Contorno cartográfico 1:500,000 del U.S. Census Bureau (2025),
  // simplificado para mantener el SVG liviano sin convertir la costa
  // en unos pocos segmentos rectos.
  var PUERTO_RICO_OUTLINE = [
    [-67.271223, 18.362513], [-67.236441, 18.301441], [-67.195560, 18.289707],
    [-67.173218, 18.226733], [-67.153315, 18.206046], [-67.185266, 18.164908],
    [-67.176783, 18.150411], [-67.186528, 18.136633], [-67.182250, 18.109979],
    [-67.199394, 18.091108], [-67.196016, 18.072781], [-67.184063, 18.069995],
    [-67.196721, 18.066011], [-67.209816, 18.036242], [-67.171792, 18.021401],
    [-67.174407, 18.011004], [-67.205448, 17.999269], [-67.215079, 17.982932],
    [-67.212744, 17.952635], [-67.199363, 17.952678], [-67.194406, 17.932813],
    [-67.186055, 17.931152], [-67.191889, 17.953616], [-67.180586, 17.964435],
    [-67.102911, 17.946296], [-67.090565, 17.951640], [-67.087970, 17.965584],
    [-67.077220, 17.958521], [-67.075849, 17.972495], [-67.065203, 17.975573],
    [-67.044486, 17.967829], [-67.013873, 17.974525], [-67.002988, 17.960680],
    [-67.004341, 17.970983], [-66.986802, 17.970567], [-66.957240, 17.931422],
    [-66.924130, 17.926674], [-66.919886, 17.933279], [-66.932531, 17.939934],
    [-66.909274, 17.952403], [-66.931217, 17.961612], [-66.925211, 17.973153],
    [-66.905550, 17.964300], [-66.902501, 17.949060], [-66.863643, 17.945684],
    [-66.854940, 17.956591], [-66.836074, 17.950598], [-66.787271, 17.972727],
    [-66.783661, 17.985460], [-66.805745, 17.975070], [-66.805936, 17.985078],
    [-66.798474, 17.982011], [-66.797552, 17.995208], [-66.767464, 18.006869],
    [-66.755295, 18.001025], [-66.763235, 17.983183], [-66.756566, 17.975739],
    [-66.746367, 17.990264], [-66.725262, 17.992130], [-66.673782, 17.967079],
    [-66.627506, 17.982748], [-66.613313, 17.963252], [-66.595797, 17.970480],
    [-66.579019, 17.961722], [-66.505053, 17.987127], [-66.464695, 17.990886],
    [-66.386202, 17.938208], [-66.376170, 17.955747], [-66.361383, 17.958388],
    [-66.363810, 17.967356], [-66.320661, 17.978452], [-66.290320, 17.960596],
    [-66.288297, 17.942640], [-66.278116, 17.948156], [-66.246252, 17.938894],
    [-66.206667, 17.963151], [-66.175308, 17.948715], [-66.183594, 17.938740],
    [-66.212987, 17.943450], [-66.208133, 17.932383], [-66.157993, 17.938086],
    [-66.155765, 17.929201], [-66.080844, 17.966716], [-66.047483, 17.953194],
    [-66.016431, 17.980035], [-65.977452, 17.967600], [-65.916368, 17.976192],
    [-65.884956, 17.988712], [-65.869251, 18.006896], [-65.835938, 18.013217],
    [-65.830430, 18.030519], [-65.838250, 18.054005], [-65.818651, 18.062925],
    [-65.801733, 18.058716], [-65.766867, 18.149282], [-65.733354, 18.181802],
    [-65.718021, 18.190012], [-65.692434, 18.178929], [-65.690818, 18.196056],
    [-65.665148, 18.206895], [-65.632758, 18.200569], [-65.639154, 18.228204],
    [-65.627891, 18.235531], [-65.610990, 18.211576], [-65.603283, 18.230186],
    [-65.590348, 18.228147], [-65.609432, 18.251193], [-65.606409, 18.261756],
    [-65.625176, 18.256545], [-65.625605, 18.280850], [-65.636246, 18.288436],
    [-65.625289, 18.303673], [-65.635960, 18.347956], [-65.620048, 18.366156],
    [-65.618436, 18.387502], [-65.633208, 18.369681], [-65.643457, 18.378469],
    [-65.653918, 18.365253], [-65.674962, 18.362605], [-65.708640, 18.371801],
    [-65.723524, 18.389362], [-65.743097, 18.380365], [-65.772670, 18.401409],
    [-65.770432, 18.413106], [-65.796105, 18.404438], [-65.789576, 18.421274],
    [-65.814779, 18.409387], [-65.836983, 18.432048], [-65.877504, 18.437598],
    [-65.897114, 18.451071], [-65.925878, 18.444987], [-65.990608, 18.460362],
    [-66.001113, 18.447005], [-66.023155, 18.443889], [-66.124030, 18.471557],
    [-66.081664, 18.443825], [-66.107757, 18.427517], [-66.110845, 18.443301],
    [-66.128755, 18.442556], [-66.140537, 18.464329], [-66.173021, 18.450952],
    [-66.183702, 18.459465], [-66.184263, 18.475641], [-66.193968, 18.465797],
    [-66.220123, 18.466093], [-66.269560, 18.480069], [-66.289607, 18.471968],
    [-66.335459, 18.484545], [-66.381522, 18.482895], [-66.398270, 18.492584],
    [-66.438313, 18.485930], [-66.449483, 18.471052], [-66.466359, 18.469023],
    [-66.561229, 18.489952], [-66.578544, 18.484352], [-66.621441, 18.493081],
    [-66.672902, 18.489417], [-66.709911, 18.471951], [-66.789603, 18.492918],
    [-66.901649, 18.483267], [-66.975670, 18.491108], [-67.019411, 18.510971],
    [-67.098647, 18.515356], [-67.137804, 18.507569], [-67.166205, 18.484642],
    [-67.157294, 18.417841], [-67.193957, 18.393068], [-67.271223, 18.362513]
  ];

  function radiusFor(status) {
    if (status === 'rojo') return 18;
    if (status === 'ambar') return 16;
    if (status === 'verde') return 14;
    return 12; // sin umbral oficial (gris)
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
      circle.setAttribute('r', '12');
      circle.setAttribute('fill', COLOR_NEUTRAL);
      circle.setAttribute('stroke', COLOR_NEUTRAL);
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
        var markerColor = colorFor(status);
        marker.circle.setAttribute('fill', markerColor);
        marker.circle.setAttribute('stroke', markerColor);
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
