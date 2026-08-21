/* ============================================================
   Historial de niveles de embalses (sector Agua). Fuente principal:
   tabla pmarcc_embalses_niveles en Supabase (proyecto eexzkkypfkpscewufgrg),
   que se actualiza sola a diario vía cron y guarda site_no, fecha y
   valor_pies (mismo parámetro 72375 del USGS: elevación del embalse
   sobre el nivel medio del mar, en pies). Respaldo: si Supabase falla
   o no devuelve datos, se hace fetch directo al USGS Water Services
   (WaterML/JSON) como antes.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';
  var API_BASE = 'https://waterservices.usgs.gov/nwis/dv/';
  var PARAM_CD = '72375';
  var DEFAULT_SITE = '50027100'; // Lago Dos Bocas, Utuado
  var USGS_FALLBACK_START = '2000-01-01'; // solo para el respaldo a USGS cuando el rango es "todo el historial"

  /* Los 19 embalses de PR que monitorea el USGS. Nombres técnicos
     resueltos vía el servicio de metadata de USGS (nwis/site), no
     inventados ni traducidos - se guardan aquí solo como referencia /
     rastro de auditoría de qué site_no es cuál embalse. El nombre que
     de verdad se muestra en la interfaz sale de NOMBRE_AAA, más abajo. */
  var STATIONS = [
    { siteNo: '50010800', name: 'LAGO GUAJATACA AT DAMSITE NR QUEBRADILLAS, PR' },
    { siteNo: '50020100', name: 'LAGO GARZAS NR ADJUNTAS, PR' },
    { siteNo: '50026140', name: 'LAGO CAONILLAS AT DAMSITE NEAR UTUADO, PR' },
    { siteNo: '50027100', name: 'LAGO DOS BOCAS AT DAMSITE NR UTUADO, PR' },
    { siteNo: '50032290', name: 'LAGO EL GUINEO AT DAMSITE NR VILLALBA, PR' },
    { siteNo: '50032590', name: 'LAGO DE MATRULLAS AT DAMSITE NEAR OROCOVIS, PR' },
    { siteNo: '50039995', name: 'LAGO CARITE AT SPILLWAY, PR' },
    { siteNo: '50045000', name: 'LAGO LA PLATA AT DAMSITE NR TOA ALTA, PR' },
    { siteNo: '50047550', name: 'LAGO CIDRA AT DAMSITE NEAR CIDRA, PR' },
    { siteNo: '50059000', name: 'LAGO LOIZA AT DAMSITE NEAR TRUJILLO ALTO, PR' },
    { siteNo: '50071225', name: 'LAGO FAJARDO NEAR VAPOR, PR' },
    { siteNo: '50076800', name: 'LAGO BLANCO NEAR NAGUABO, PR' },
    { siteNo: '50093045', name: 'LAGO PATILLAS AT DAMSITE NEAR PATILLAS, PR' },
    { siteNo: '50111210', name: 'LAGO TOA VACA AT DAMSITE NEAR VILLALBA, PR' },
    { siteNo: '50111300', name: 'LAGO GUAYABAL AT DAMSITE NEAR JUANA DIAZ, PR' },
    { siteNo: '50113950', name: 'LAGO CERRILLOS AT DAMSITE NR PONCE, PR' },
    { siteNo: '50125780', name: 'LAGO LUCCHETTI AT DAMSITE NEAR YAUCO, PR' },
    { siteNo: '50128900', name: 'LAGO LOCO AT DAMSITE NR YAUCO, PR' },
    { siteNo: '50141500', name: 'LAGO GUAYO AT DAMSITE NEAR CASTANER, PR' }
  ];

  /* Nombres cortos tal como aparecen en la gráfica oficial de monitoreo
     diario de la AAA (acueductos.pr.gov) - lo que ve la persona usuaria
     en el <select>, la leyenda de la gráfica y la nota de fuente. Cada
     site_no se emparejó contra el nombre técnico real de STATIONS (no
     se asumió el orden de ninguna lista externa). "Luchetti" con una
     sola "c", corrigiendo el error de las instrucciones anteriores. */
  var NOMBRE_AAA = {
    '50010800': 'Guajataca',
    '50020100': 'Garzas',
    '50026140': 'Caonillas',
    '50027100': 'Dos Bocas',
    '50032290': 'Guineo',
    '50032590': 'Matrullas',
    '50039995': 'Carite',
    '50045000': 'La Plata',
    '50047550': 'Cidra',
    '50059000': 'Carraízo',
    '50071225': 'Fajardo',
    '50076800': 'Río Blanco',
    '50093045': 'Patillas',
    '50111210': 'Toa Vaca',
    '50111300': 'Guayabal',
    '50113950': 'Cerrillos',
    '50125780': 'Luchetti',
    '50128900': 'Loco',
    '50141500': 'Guayo'
  };

  /* Umbral de "ajustes operacionales" de la AAA, en pies (fuente: gráfica
     oficial de la AAA, acueductos.pr.gov). Cada site_no fue re-emparejado
     contra el nombre real del USGS (nwis/site) antes de usarse aquí, no
     se asumió que el orden de la lista original coincidiera.
     50125780 (Luchetti) se omite a propósito: el valor de la foto
     quedó ambiguo por superposición de texto y no se pudo confirmar.
     Nota: La Plata y Fajardo comparten el mismo valor (40.50 m / 132.9
     pies) en la transcripción original de la foto de la AAA. Podría
     ser correcto (coincidencia real) o un error de transcripción de
     una fila duplicada; no se pudo verificar de forma independiente,
     así que se dejan ambos tal como se recibieron. */
  var NIVEL_AJUSTES_PIES = {
    '50059000': 121.4,  // Carraízo — 37.00 m
    '50045000': 132.9,  // La Plata — 40.50 m (ver nota: igual a Fajardo)
    '50047550': 1307.0, // Cidra — 398.37 m
    '50111210': 435.0,  // Toa Vaca — 132.6 m
    '50076800': 73.8,   // Río Blanco — 22.50 m
    '50071225': 132.9,  // Fajardo — 40.50 m (ver nota: igual a La Plata)
    '50039995': 1765.9, // Carite — 538.16 m
    '50093045': 193.0,  // Patillas — 58.82 m
    '50032290': 2943.4, // El Guineo — 897.33 m
    '50032590': 2393.0, // Matrullas — 729.39 m
    '50111300': 328.0,  // Guayabal — 99.97 m
    '50020100': 2399.6, // Garzas — 731.22 m
    '50141500': 1444.4, // Guayo — 440.13 m
    '50128900': 226.0,  // Loco — 68.88 m
    '50027100': 283.0,  // Dos Bocas — 86.26 m
    '50026140': 800.5,  // Caonillas — 244 m
    '50010800': 623.4,  // Guajataca — 190 m
    '50113950': 500.0   // Cerrillos — 152.4 m
  };

  /* Umbral de "Control" de la AAA, en pies - el siguiente nivel de
     alerta, más grave que "Ajustes" (mismo origen: gráfica oficial de
     la AAA, acueductos.pr.gov). Mismo mapeo site_no -> embalse que
     NIVEL_AJUSTES_PIES, ya verificado contra el nombre real del USGS.
     50125780 (Luchetti) se omite por la misma razón que en Ajustes: el
     valor de la foto quedó ambiguo por superposición de texto y no se
     pudo confirmar de forma independiente.
     Sanity check: para los 18 embalses con ambos valores, Control es
     siempre menor que Ajustes (más pies = más lleno el embalse, y
     Control es la alerta más grave = nivel más bajo), lo cual es
     consistente con que el mapeo site_no -> embalse sea correcto. */
  var NIVEL_CONTROL_PIES = {
    '50059000': 98.43,   // Carraízo — 30 m
    '50045000': 98.43,   // La Plata — 30 m
    '50047550': 1297.57, // Cidra — 395.5 m
    '50111210': 403.54,  // Toa Vaca — 123 m
    '50076800': 65.62,   // Río Blanco — 20 m
    '50071225': 118.11,  // Fajardo — 36 m
    '50039995': 1759.06, // Carite — 536.16 m
    '50093045': 187.01,  // Patillas — 57 m
    '50032290': 2937.99, // Guineo — 895.5 m
    '50032590': 2387.99, // Matrullas — 727.86 m
    '50111300': 323.00,  // Guayabal — 98.45 m
    '50020100': 2393.01, // Garzas — 729.39 m
    '50141500': 1437.99, // Guayo — 438.3 m
    '50128900': 225.00,  // Loco — 68.58 m
    '50027100': 277.00,  // Dos Bocas — 84.43 m
    '50026140': 793.96,  // Caonillas — 242 m
    '50010800': 610.24,  // Guajataca — 186 m
    '50113950': 475.07   // Cerrillos — 144.8 m
  };

  /* Expuesto en window para que otras páginas (embalses.html) puedan
     reusar la misma conexión a Supabase y los mismos umbrales de la AAA
     sin duplicar la URL/llave ni volver a transcribir los valores. */
  window.PMARCC_SUPABASE = {
    fetchNiveles: fetchNivelesSupabase,
    NIVEL_AJUSTES_PIES: NIVEL_AJUSTES_PIES,
    NIVEL_CONTROL_PIES: NIVEL_CONTROL_PIES
  };

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var TENDENCIA_UMBRAL_M = 0.05; // mismo umbral que usa la AAA/embalsespr.com
  window.PMARCC_SUPABASE.TENDENCIA_UMBRAL_M = TENDENCIA_UMBRAL_M;

  function labelFor(siteNo) {
    return NOMBRE_AAA[siteNo] || siteNo;
  }

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // "all" no manda filtro de fecha: cada embalse tiene su propio inicio
  // real de datos en la tabla (varía entre 2006 y 2016 según la estación).
  function startDateFor(range) {
    if (range === 'all') return null;
    if (range === '30d') {
      var d = new Date();
      d.setDate(d.getDate() - 30);
      return isoDate(d);
    }
    var d = new Date();
    d.setFullYear(d.getFullYear() - (range === '3y' ? 3 : 1));
    return isoDate(d);
  }

  /* ---- Proyección de tendencia: regresión lineal simple sobre los
     últimos ~30 puntos reales, extrapolada 30 días hacia adelante. Es
     una señal distinta a la tendencia día-a-día de renderCurrentReading
     (que compara solo la última lectura contra la anterior); esta usa
     una ventana más larga para suavizar el ruido diario. ---- */
  var PROYECCION_DIAS = 30;
  var PROYECCION_VENTANA_MAX = 30; // usa como máximo los últimos 30 puntos reales
  var PROYECCION_MIN_PUNTOS = 10;  // si hay menos que esto, no se calcula proyección

  function calcularTendencia(values) {
    var ordered = values.slice().sort(function (a, b) {
      return a.dateTime < b.dateTime ? -1 : (a.dateTime > b.dateTime ? 1 : 0);
    });
    var ventana = ordered.slice(Math.max(0, ordered.length - PROYECCION_VENTANA_MAX));
    var pts = ventana.map(function (v, i) {
      return { x: i, y: parseFloat(v.value) };
    }).filter(function (p) { return !isNaN(p.y); });
    if (pts.length < PROYECCION_MIN_PUNTOS) return null;

    var n = pts.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    pts.forEach(function (p) {
      sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x;
    });
    var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;

    var lastDate = new Date(ordered[ordered.length - 1].dateTime + 'T00:00:00');
    var proyeccion = [];
    for (var k = 1; k <= PROYECCION_DIAS; k++) {
      var x = (n - 1) + k;
      var d = new Date(lastDate);
      d.setDate(d.getDate() + k);
      proyeccion.push({ fecha: isoDate(d), valor: intercept + slope * x });
    }
    return { slopePorDia: slope, proyeccion: proyeccion };
  }

  var select = document.getElementById('embalseSelect');
  var canvas = document.getElementById('embalseChart');
  var statusBox = document.getElementById('embalseStatus');
  var tbody = document.getElementById('embalseChart-tbody');
  var caption = document.getElementById('embalseChart-caption');
  var sourceSiteNo = document.getElementById('embalseSourceSiteNo');
  var sourceName = document.getElementById('embalseSourceName');
  var sourceLink = document.getElementById('embalseSourceLink');
  var rangeButtons = document.querySelectorAll('.range-btn');
  var currentValue = document.getElementById('reservoirCurrentValue');
  var currentTrend = document.getElementById('reservoirCurrentTrend');
  var currentDate = document.getElementById('reservoirCurrentDate');
  var lluviaCanvas = document.getElementById('lluviaChart');
  var lluviaStatus = document.getElementById('lluviaStatus');
  if (!select || !canvas) return;

  /* Si Chart.js no cargó (CDN caído o bloqueado), la tabla de datos
     sigue funcionando: solo se omite dibujar la gráfica y se muestra
     la tabla en su lugar, igual que el resto del sitio. */
  var chartAvailable = typeof Chart !== 'undefined';
  var dataTable = document.getElementById('embalseChart-data');
  if (!chartAvailable) {
    canvas.style.display = 'none';
    dataTable.classList.remove('visually-hidden');
    dataTable.classList.add('chart-fallback-table');
  }

  /* ---- 1. Poblar el <select>, ordenado alfabéticamente por nombre ---- */
  STATIONS.slice().sort(function (a, b) {
    return labelFor(a.siteNo).localeCompare(labelFor(b.siteNo), 'es');
  }).forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.siteNo;
    opt.textContent = labelFor(s.siteNo);
    select.appendChild(opt);
  });

  // Deep link desde otras páginas (p.ej. embalses.html#50027100): si el
  // hash coincide con un site_no conocido, abre esa estación en vez de
  // la de por defecto y lleva la vista hasta la gráfica.
  var hashSiteNo = (location.hash || '').slice(1);
  var initialSiteNo = STATIONS.some(function (s) { return s.siteNo === hashSiteNo; }) ? hashSiteNo : DEFAULT_SITE;
  select.value = initialSiteNo;

  var chart = null;
  var currentRange = '30d';

  function setStatus(msg, isError) {
    statusBox.textContent = msg || '';
    statusBox.style.display = msg ? 'block' : 'none';
    statusBox.className = 'embalse-status' + (isError ? ' err' : '');
  }

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
      grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)'
    };
  }

  function renderAlerta(siteNo) {
    var box = document.getElementById('embalseAlerta');
    if (!box) return;
    var info = window.EMBALSES_INFO && window.EMBALSES_INFO[siteNo];
    if (info && info.alerta) {
      box.innerHTML = '⚠ <strong>' + info.alerta.texto + '</strong> <a href="' + info.alerta.url +
        '" target="_blank" rel="noopener">Fuente: ' + info.alerta.fuente + '</a>';
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  }

  /* ---- 2. Última lectura + tendencia (independiente del rango elegido:
     el fetch siempre termina en "hoy", así que el último punto del
     array ya fetched es el dato más reciente disponible sin importar
     si el usuario está viendo 1 año, 3 años o todo el historial). ---- */
  function renderCurrentReading(values) {
    // Defensivo: nos aseguramos de que venga ordenado ascendente por
    // fecha antes de tomar el último punto (USGS ya lo entrega así,
    // pero no lo asumimos).
    var sorted = values.slice().sort(function (a, b) {
      return a.dateTime < b.dateTime ? -1 : (a.dateTime > b.dateTime ? 1 : 0);
    });
    var last = sorted[sorted.length - 1];
    var prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
    var lastFt = parseFloat(last.value);
    if (isNaN(lastFt)) {
      currentValue.textContent = '—';
      currentTrend.textContent = '';
      currentTrend.className = 'reservoir-current-trend';
      currentDate.textContent = '';
      return;
    }
    var lastM = lastFt * 0.3048;
    currentValue.textContent = lastM.toFixed(2) + ' m (' + lastFt.toFixed(2) + ' pies)';

    var d = last.dateTime.slice(0, 10).split('-');
    currentDate.textContent = parseInt(d[2], 10) + ' de ' + MESES_LARGO[parseInt(d[1], 10) - 1] + ' de ' + d[0];

    if (prev) {
      var prevFt = parseFloat(prev.value);
      if (!isNaN(prevFt)) {
        var diffM = lastM - prevFt * 0.3048;
        if (diffM > TENDENCIA_UMBRAL_M) {
          currentTrend.textContent = '↑ Subiendo';
          currentTrend.className = 'reservoir-current-trend up';
        } else if (diffM < -TENDENCIA_UMBRAL_M) {
          currentTrend.textContent = '↓ Bajando';
          currentTrend.className = 'reservoir-current-trend down';
        } else {
          currentTrend.textContent = '→ Estable';
          currentTrend.className = 'reservoir-current-trend stable';
        }
        return;
      }
    }
    currentTrend.textContent = '';
    currentTrend.className = 'reservoir-current-trend';
  }

  /* ---- 3. Tabla accesible: promedio mensual (con "todo el historial"
     podrían ser cientos de filas diarias, demasiado para un lector de
     pantalla; el promedio mensual da una idea fiel de la tendencia en
     cualquier rango). ---- */
  function renderTable(values) {
    var byMonth = {};
    values.forEach(function (v) {
      var key = v.dateTime.slice(0, 7); // YYYY-MM
      var n = parseFloat(v.value);
      if (isNaN(n)) return;
      if (!byMonth[key]) byMonth[key] = { sum: 0, count: 0 };
      byMonth[key].sum += n;
      byMonth[key].count += 1;
    });
    var rows = Object.keys(byMonth).sort().map(function (key) {
      var parts = key.split('-');
      var label = MESES[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
      var avg = (byMonth[key].sum / byMonth[key].count).toFixed(2);
      return '<tr><td>' + label + '</td><td>' + avg + ' pies</td></tr>';
    });
    tbody.innerHTML = rows.join('');
  }

  /* ---- 4. Gráfica de línea con Chart.js ---- */
  /* Dibuja el valor numérico sobre la línea principal cada ~1/8 del total
     de puntos (se adapta solo sin importar el rango: último año, 3 años o
     todo el historial), más siempre el último punto real. Solo aplica al
     dataset 0 (la línea del embalse), no a Ajustes/Control/Proyección. */
  function drawValueLabels(chartInstance) {
    var meta = chartInstance.getDatasetMeta(0);
    var ds = chartInstance.data.datasets[0];
    var area = chartInstance.chartArea;
    if (!meta || !ds || !area) return;
    var total = ds.data.length;
    if (!total) return;
    // Limita las etiquetas según el ancho disponible para que, en móvil,
    // los números no terminen ocultando la línea del nivel del embalse.
    var maxLabels = Math.max(3, Math.floor(area.width / 72));
    var interval = Math.max(1, Math.ceil(total / maxLabels));
    var ctx = chartInstance.ctx;
    var cc = themeColors();
    ctx.save();
    ctx.font = '700 11px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = cc.text;
    ctx.textAlign = 'center';
    function drawAt(i) {
      var point = meta.data[i];
      var val = ds.data[i];
      if (!point || val == null || isNaN(val)) return;
      var y = point.y - 12;
      if (y < area.top + 12) y = point.y + 16;
      var x = Math.min(Math.max(point.x, area.left + 18), area.right - 18);
      ctx.fillText(val.toFixed(1), x, y);
    }
    for (var i = 0; i < total; i += interval) drawAt(i);
    if ((total - 1) % interval !== 0) drawAt(total - 1);
    ctx.restore();
  }

  function renderChart(values, stationLabel, siteNo) {
    var c = themeColors();
    var labels = values.map(function (v) {
      var d = v.dateTime.slice(0, 10).split('-');
      return d[2] + ' ' + MESES[parseInt(d[1], 10) - 1] + ' ' + d[0];
    });
    var data = values.map(function (v) { return parseFloat(v.value); });
    var ajustes = NIVEL_AJUSTES_PIES[siteNo];
    var control = NIVEL_CONTROL_PIES[siteNo];

    var datasets = [{
      label: stationLabel,
      data: data,
      borderColor: '#2f8fff',
      backgroundColor: 'rgba(47,143,255,.16)',
      fill: true, tension: .15, pointRadius: 0, borderWidth: 3.5,
      order: 1
    }];
    if (typeof ajustes === 'number') {
      datasets.push({
        label: 'Nivel de ajustes',
        data: labels.map(function () { return ajustes; }),
        borderColor: '#f2a93c',
        borderDash: [8, 5],
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        order: 2
      });
    }
    if (typeof control === 'number') {
      datasets.push({
        label: 'Nivel de control',
        data: labels.map(function () { return control; }),
        borderColor: '#ff4d4d',
        borderDash: [5, 4],
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        order: 2
      });
    }

    var tendencia = calcularTendencia(values);
    var proyeccionNota = document.getElementById('proyeccionNota');
    if (tendencia) {
      var nuevasLabels = tendencia.proyeccion.map(function (p) {
        var d = p.fecha.split('-');
        return d[2] + ' ' + MESES[parseInt(d[1], 10) - 1] + ' ' + d[0];
      });
      labels = labels.concat(nuevasLabels);
      data = data.concat(new Array(tendencia.proyeccion.length).fill(null));
      // Extiende Ajustes/Control (si existen) hacia los días proyectados también,
      // para que las líneas de referencia sigan visibles en esa franja.
      datasets.forEach(function (ds) {
        if (ds.label === 'Nivel de ajustes' || ds.label === 'Nivel de control') {
          var v = ds.data[0];
          ds.data = ds.data.concat(new Array(tendencia.proyeccion.length).fill(v));
        }
      });

      // null hasta el último punto real, valor real en ese punto para que la
      // línea conecte con la proyección, luego los valores proyectados.
      var idxUltimoReal = values.length - 1;
      var proyeccionData = new Array(labels.length).fill(null);
      proyeccionData[idxUltimoReal] = parseFloat(values[values.length - 1].value);
      tendencia.proyeccion.forEach(function (p, i) {
        proyeccionData[idxUltimoReal + 1 + i] = p.valor;
      });

      datasets.push({
        label: 'Proyección (tendencia 30 días)',
        data: proyeccionData,
        borderColor: '#a668ff',
        borderDash: [10, 5],
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        spanGaps: false,
        order: 0
      });

      if (proyeccionNota) {
        var totalPies = tendencia.slopePorDia * PROYECCION_DIAS;
        var totalM = totalPies * 0.3048;
        var etiqueta = totalM > 0.15 ? 'subiendo' : (totalM < -0.15 ? 'bajando' : 'relativamente estable');
        proyeccionNota.textContent = 'Si continúa la tendencia de los últimos 30 días, el nivel estaría ' +
          etiqueta + ' en los próximos 30 días (cambio proyectado: ' + (totalM >= 0 ? '+' : '') +
          totalM.toFixed(2) + ' m). Esto es una proyección estadística, no un pronóstico oficial: asume ' +
          'que las condiciones actuales continúan y no toma en cuenta lluvia futura.';
        proyeccionNota.style.display = 'block';
      }
    } else if (proyeccionNota) {
      proyeccionNota.style.display = 'none';
    }

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      plugins: [{ id: 'valueLabelsPlugin', afterDatasetsDraw: drawValueLabels }],
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'bottom',
            labels: { boxWidth: 12, padding: 12, font: { size: 11 }, color: c.text }
          }
        },
        scales: {
          y: {
            title: { display: true, text: 'Pies sobre el nivel del mar', color: c.text },
            ticks: { color: c.text }, grid: { color: c.grid }
          },
          x: {
            ticks: { color: c.text, maxTicksLimit: 8, autoSkip: true, maxRotation: 0 },
            grid: { display: false }
          }
        }
      }
    });
  }

  /* ---- 4b. Pronóstico de lluvia (Open-Meteo) para la ubicación del
     embalse seleccionado. Requiere las coordenadas de
     sectores/embalses-info-data.js, expuestas en window.EMBALSES_INFO
     por embalses-coords-loader.js (debe cargarse antes que este script
     en la página que lo use; en agua.html va antes de embalses.js). ---- */
  var lluviaChart = null;

  function fetchLluvia(siteNo) {
    if (!lluviaCanvas) return;
    var info = window.EMBALSES_INFO && window.EMBALSES_INFO[siteNo];
    if (!info || typeof info.lat !== 'number') {
      if (lluviaStatus) lluviaStatus.textContent = 'No hay coordenadas para este embalse.';
      return;
    }
    if (lluviaStatus) lluviaStatus.textContent = 'Cargando pronóstico…';
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + info.lat +
      '&longitude=' + info.lng + '&daily=precipitation_sum&forecast_days=14&timezone=America%2FPuerto_Rico';

    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      var fechas = json.daily.time;
      var precip = json.daily.precipitation_sum;
      var labels = fechas.map(function (f) {
        var d = f.split('-');
        return d[2] + ' ' + MESES[parseInt(d[1], 10) - 1];
      });
      var colores = precip.map(function (v, i) {
        return i < 7 ? 'rgba(31,122,224,.85)' : 'rgba(31,122,224,.35)';
      });
      if (lluviaChart) lluviaChart.destroy();
      var c = themeColors();
      lluviaChart = new Chart(lluviaCanvas, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Lluvia pronosticada (mm)', data: precip, backgroundColor: colores }] },
        options: {
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { title: { display: true, text: 'mm de lluvia', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
            x: { ticks: { color: c.text, maxRotation: 0 }, grid: { display: false } }
          }
        }
      });
      if (lluviaStatus) lluviaStatus.textContent = 'Días 1-7: pronóstico de mayor confiabilidad. Días 8-14 (barras más claras): tendencia general, menor precisión — es una limitación conocida de los modelos meteorológicos a ese plazo, no del sitio.';
    }).catch(function () {
      if (lluviaStatus) lluviaStatus.textContent = 'No se pudo cargar el pronóstico de lluvia en este momento.';
    });
  }

  /* ---- 5. Fuentes de datos: Supabase (principal) y USGS (respaldo).
     Ambas resuelven al mismo formato [{dateTime, value}] que ya usan
     renderChart/renderTable/renderCurrentReading, para no tocar esa
     lógica. ---- */
  // Conexión genérica a la tabla pmarcc_embalses_niveles, reusable por
  // cualquier página (esta y embalses.html). opts: { startDT, endDT,
  // order: 'asc'|'desc' (default 'asc'), limit, offset }.
  function fetchNivelesSupabase(siteNo, opts) {
    opts = opts || {};
    var url = SUPABASE_URL + '/rest/v1/pmarcc_embalses_niveles?site_no=eq.' + encodeURIComponent(siteNo);
    if (opts.startDT) url += '&fecha=gte.' + opts.startDT;
    if (opts.endDT) url += '&fecha=lte.' + opts.endDT;
    url += '&order=fecha.' + (opts.order || 'asc') + '&select=fecha,valor_pies';
    if (opts.limit) url += '&limit=' + opts.limit;
    if (opts.offset) url += '&offset=' + opts.offset;

    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // PostgREST limita cada respuesta a 1000 filas por defecto (confirmado:
  // Content-Range: 0-999/*). 3 años de lecturas diarias ya superan eso, y
  // "todo el historial" lo supera por mucho, así que hay que paginar con
  // limit/offset hasta que una página vuelva con menos de PAGE_SIZE filas.
  var SUPABASE_PAGE_SIZE = 1000;

  function fetchStationFromSupabase(siteNo, startDT, endDT) {
    function loadPages(offset, acc) {
      return fetchNivelesSupabase(siteNo, {
        startDT: startDT, endDT: endDT, order: 'asc',
        limit: SUPABASE_PAGE_SIZE, offset: offset
      }).then(function (rows) {
        acc = acc.concat(rows);
        if (!rows.length || rows.length < SUPABASE_PAGE_SIZE) return acc;
        return loadPages(offset + SUPABASE_PAGE_SIZE, acc);
      });
    }
    return loadPages(0, []).then(function (rows) {
      if (!rows || !rows.length) throw new Error('Supabase: sin datos');
      return rows.map(function (row) {
        return { dateTime: row.fecha, value: row.valor_pies };
      });
    });
  }

  function fetchStationFromUSGS(siteNo, startDT, endDT) {
    var url = API_BASE + '?sites=' + siteNo + '&startDT=' + startDT + '&endDT=' + endDT
      + '&format=json&parameterCd=' + PARAM_CD;

    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var ts = data && data.value && data.value.timeSeries;
        if (!ts || !ts.length) throw new Error('USGS: sin datos');
        var values = ts[0].values[0].value;
        if (!values || !values.length) throw new Error('USGS: sin valores');
        return values;
      });
  }

  /* ---- 6. Cargar un embalse ---- */
  function loadStation(siteNo) {
    renderAlerta(siteNo);
    fetchLluvia(siteNo);
    setStatus('Cargando el historial…', false);
    canvas.style.visibility = 'hidden';

    var start = startDateFor(currentRange);
    var end = isoDate(new Date());

    fetchStationFromSupabase(siteNo, start, end)
      .catch(function () {
        return fetchStationFromUSGS(siteNo, start || USGS_FALLBACK_START, end);
      })
      .then(function (values) {
        var label = labelFor(siteNo);

        if (chartAvailable) renderChart(values, label, siteNo);
        renderTable(values);
        renderCurrentReading(values);
        caption.textContent = 'Datos de la gráfica: elevación promedio mensual del embalse ' + label + ', en pies';

        sourceSiteNo.textContent = siteNo;
        sourceName.textContent = label;
        sourceLink.href = 'https://waterdata.usgs.gov/monitoring-location/USGS-' + siteNo + '/';

        canvas.style.visibility = 'visible';
        setStatus('', false);
      })
      .catch(function () {
        setStatus('No se pudo cargar el historial de este embalse en este momento.', true);
      });
  }

  select.addEventListener('change', function () { loadStation(select.value); });

  rangeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-active')) return;
      rangeButtons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      currentRange = btn.getAttribute('data-range');
      loadStation(select.value);
    });
  });

  var chartWrapper = document.getElementById('embalseChartWrapper');
  var expandBtn = document.getElementById('chartExpandBtn');
  var closeBtn = document.getElementById('chartCloseBtn');

  function requestFs(el) {
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!fn) return Promise.reject(new Error('no soportado'));
    try { return fn.call(el) || Promise.resolve(); } catch (e) { return Promise.reject(e); }
  }
  function exitFs() {
    var fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (fn) { try { fn.call(document); } catch (e) {} }
  }
  function isFsActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function enterFullscreenMode() {
    if (!chartWrapper) return;
    chartWrapper.classList.add('is-fullscreen');
    document.body.classList.add('no-scroll');
    // Mejora progresiva: si el navegador soporta fullscreen nativo en un div
    // (no todos - en iPhone/Safari es poco confiable), lo activa además del
    // overlay CSS. Si falla, no pasa nada: el overlay CSS ya hace el trabajo.
    requestFs(chartWrapper).catch(function () {});
    if (chart) {
      chart.options.maintainAspectRatio = false;
      setTimeout(function () { chart.resize(); }, 60);
    }
  }

  function exitFullscreenMode() {
    if (!chartWrapper) return;
    chartWrapper.classList.remove('is-fullscreen');
    document.body.classList.remove('no-scroll');
    if (isFsActive()) exitFs();
    if (chart) {
      chart.options.maintainAspectRatio = false;
      setTimeout(function () { chart.resize(); }, 60);
    }
  }

  if (expandBtn) expandBtn.addEventListener('click', enterFullscreenMode);
  if (closeBtn) closeBtn.addEventListener('click', exitFullscreenMode);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chartWrapper && chartWrapper.classList.contains('is-fullscreen')) {
      exitFullscreenMode();
    }
  });

  // Si la persona sale del fullscreen nativo con el gesto del sistema (no
  // con nuestro botón), hay que sincronizar el overlay CSS igual.
  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function (evt) {
    document.addEventListener(evt, function () {
      if (!isFsActive() && chartWrapper && chartWrapper.classList.contains('is-fullscreen')) {
        exitFullscreenMode();
      }
    });
  });

  window.addEventListener('resize', function () {
    if (chartWrapper && chartWrapper.classList.contains('is-fullscreen') && chart) chart.resize();
  });
  window.addEventListener('orientationchange', function () {
    if (chartWrapper && chartWrapper.classList.contains('is-fullscreen') && chart) {
      setTimeout(function () { chart.resize(); }, 150);
    }
  });

  if (chartAvailable) Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  loadStation(initialSiteNo);
  if (initialSiteNo !== DEFAULT_SITE) {
    var section = document.getElementById('embalses');
    if (section) section.scrollIntoView();
  }

  window.addEventListener('pmarcc-theme-change', function () {
    if (!chartAvailable || !chart) return;
    var c = themeColors();
    chart.options.scales.y.ticks.color = c.text;
    chart.options.scales.y.title.color = c.text;
    chart.options.scales.y.grid.color = c.grid;
    chart.options.scales.x.ticks.color = c.text;
    if (chart.options.plugins.legend.labels) chart.options.plugins.legend.labels.color = c.text;
    chart.update();
  });
})();
