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

  /* Los 19 embalses de PR que monitorea el USGS. Nombres oficiales
     resueltos vía el servicio de metadata de USGS (nwis/site), no
     inventados ni traducidos. */
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

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  /* Pone en mayúscula solo la primera letra de cada palabra; conserva
     "PR" tal cual (es la abreviatura del estado/territorio, no una
     palabra común). No cambia el nombre en sí, solo su capitalización. */
  function displayName(rawName) {
    return rawName.toLowerCase().replace(/\b\w+\b/g, function (w) {
      return w === 'pr' ? 'PR' : w.charAt(0).toUpperCase() + w.slice(1);
    });
  }

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var select = document.getElementById('embalseSelect');
  var canvas = document.getElementById('embalseChart');
  var statusBox = document.getElementById('embalseStatus');
  var tbody = document.getElementById('embalseChart-tbody');
  var caption = document.getElementById('embalseChart-caption');
  var sourceSiteNo = document.getElementById('embalseSourceSiteNo');
  var sourceName = document.getElementById('embalseSourceName');
  var sourceLink = document.getElementById('embalseSourceLink');
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
    return displayName(a.name).localeCompare(displayName(b.name), 'es');
  }).forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.siteNo;
    opt.textContent = displayName(s.name);
    select.appendChild(opt);
  });
  select.value = DEFAULT_SITE;

  var chart = null;

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

  /* ---- 2. Tabla accesible: promedio mensual (730 filas diarias sería
     demasiado para un lector de pantalla; el promedio mensual da una
     idea fiel de la tendencia). ---- */
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

  /* ---- 3. Gráfica de línea con Chart.js ---- */
  function renderChart(values, stationLabel) {
    var c = themeColors();
    var labels = values.map(function (v) {
      var d = v.dateTime.slice(0, 10).split('-');
      return d[2] + ' ' + MESES[parseInt(d[1], 10) - 1] + ' ' + d[0];
    });
    var data = values.map(function (v) { return parseFloat(v.value); });

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: stationLabel,
          data: data,
          borderColor: '#1f7ae0',
          backgroundColor: 'rgba(31,122,224,.12)',
          fill: true, tension: .15, pointRadius: 0, borderWidth: 2
        }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
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

  /* ---- 4. Cargar un embalse ---- */
  function loadStation(siteNo) {
    setStatus('Cargando el historial…', false);
    canvas.style.visibility = 'hidden';

    var end = new Date();
    var start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    var url = API_BASE + '?sites=' + siteNo + '&startDT=' + isoDate(start) + '&endDT=' + isoDate(end)
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
        var stationInfo = STATIONS.filter(function (s) { return s.siteNo === siteNo; })[0];
        var realName = (series.sourceInfo && series.sourceInfo.siteName) || (stationInfo && stationInfo.name) || siteNo;

        if (chartAvailable) renderChart(values, displayName(realName));
        renderTable(values);
        caption.textContent = 'Datos de la gráfica: elevación promedio mensual del embalse ' + displayName(realName) + ', en pies';

        sourceSiteNo.textContent = siteNo;
        sourceName.textContent = displayName(realName);
        sourceLink.href = 'https://waterdata.usgs.gov/monitoring-location/USGS-' + siteNo + '/';

        canvas.style.visibility = 'visible';
        setStatus('', false);
      })
      .catch(function () {
        setStatus('No se pudo cargar el historial de este embalse en este momento.', true);
      });
  }

  select.addEventListener('change', function () { loadStation(select.value); });

  if (chartAvailable) Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  loadStation(DEFAULT_SITE);

  window.addEventListener('pmarcc-theme-change', function () {
    if (!chartAvailable || !chart) return;
    var c = themeColors();
    chart.options.scales.y.ticks.color = c.text;
    chart.options.scales.y.title.color = c.text;
    chart.options.scales.y.grid.color = c.grid;
    chart.options.scales.x.ticks.color = c.text;
    chart.update();
  });
})();
