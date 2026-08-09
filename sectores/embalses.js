/* ============================================================
   Historial de niveles de embalses (sector Agua) - datos en vivo
   del USGS Water Services (WaterML/JSON), parámetro 72375
   (elevación del embalse sobre el nivel medio del mar, en pies).
   No hay backend: el endpoint de USGS envía
   Access-Control-Allow-Origin: * y permite fetch() directo desde
   el navegador (verificado antes de escribir este archivo).
   ============================================================ */
(function () {
  var API_BASE = 'https://waterservices.usgs.gov/nwis/dv/';
  var PARAM_CD = '72375';
  var DEFAULT_SITE = '50027100'; // Lago Dos Bocas, Utuado
  var ALL_HISTORY_START = '1960-01-01'; // anterior al inicio real de cualquier estación de PR

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

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var TENDENCIA_UMBRAL_M = 0.05; // mismo umbral que usa la AAA/embalsespr.com

  function labelFor(siteNo) {
    return NOMBRE_AAA[siteNo] || siteNo;
  }

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function startDateFor(range) {
    if (range === 'all') return ALL_HISTORY_START;
    var d = new Date();
    d.setFullYear(d.getFullYear() - (range === '3y' ? 3 : 1));
    return isoDate(d);
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
  select.value = DEFAULT_SITE;

  var chart = null;
  var currentRange = '1y';

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
    currentValue.textContent = lastM.toFixed(2) + ' m';

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
      borderColor: '#1f7ae0',
      backgroundColor: 'rgba(31,122,224,.12)',
      fill: true, tension: .15, pointRadius: 0, borderWidth: 2
    }];
    if (typeof ajustes === 'number') {
      datasets.push({
        label: 'Nivel de ajustes',
        data: labels.map(function () { return ajustes; }),
        borderColor: '#c9782f',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      });
    }
    if (typeof control === 'number') {
      datasets.push({
        label: 'Nivel de control',
        data: labels.map(function () { return control; }),
        borderColor: '#c92a2a',
        borderDash: [3, 3],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      });
    }

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      options: {
        animation: false,
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

  /* ---- 5. Cargar un embalse ---- */
  function loadStation(siteNo) {
    setStatus('Cargando el historial…', false);
    canvas.style.visibility = 'hidden';

    var start = startDateFor(currentRange);
    var end = isoDate(new Date());
    var url = API_BASE + '?sites=' + siteNo + '&startDT=' + start + '&endDT=' + end
      + '&format=json&parameterCd=' + PARAM_CD;

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var ts = data && data.value && data.value.timeSeries;
        if (!ts || !ts.length) throw new Error('sin datos');
        var series = ts[0];
        var values = series.values[0].value;
        if (!values || !values.length) throw new Error('sin valores');
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

  if (chartAvailable) Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  loadStation(DEFAULT_SITE);

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
