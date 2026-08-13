/* ============================================================
   Nivel del mar en las costas de Puerto Rico.
   Fuente: NOAA CO-OPS (Centro de Operaciones Oceánicas y Costeras),
   API pública sin llave y sin bloqueo CORS - se consulta directo
   desde el navegador, igual que USGS/NWS en Infraestructura.
   ============================================================ */
(function () {
  var STATIONS = [
    { id: '9752235', nombre: 'Culebra' },
    { id: '9752621', nombre: 'Isabel Segunda, Vieques' },
    { id: '9752695', nombre: 'Esperanza, Vieques' },
    { id: '9753216', nombre: 'Fajardo' },
    { id: '9754229', nombre: 'Yabucoa' },
    { id: '9755371', nombre: 'San Juan' },
    { id: '9755968', nombre: 'Salinas' },
    { id: '9757811', nombre: 'Arecibo' },
    { id: '9758066', nombre: 'Guayanilla' },
    { id: '9759110', nombre: 'Magueyes (La Parguera)' },
    { id: '9759394', nombre: 'Mayagüez' },
    { id: '9759413', nombre: 'Aguadilla' },
    { id: '9759938', nombre: 'Isla de Mona' }
  ];

  var body = document.getElementById('mareaBody');
  var status = document.getElementById('mareaStatus');
  var statSJ = document.getElementById('marNivelSanJuan');
  var statCount = document.getElementById('marEstacionesMarea');
  if (!body) return;

  function utcToAst(t) {
    // t viene como "YYYY-MM-DD HH:MM" en UTC. AST = UTC-4, sin horario de verano.
    var d = new Date(t.replace(' ', 'T') + 'Z');
    d.setHours(d.getHours() - 4);
    var hh = d.getHours(), mm = d.getMinutes();
    var ampm = hh >= 12 ? 'pm' : 'am';
    var h12 = hh % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ampm + ' AST';
  }

  function fetchStation(st) {
    var url = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=' + st.id +
      '&product=water_level&date=latest&datum=MLLW&units=metric&time_zone=gmt&format=json';
    return fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.data || !d.data[0]) return null;
      var row = d.data[0];
      return { nombre: st.nombre, id: st.id, nivel: parseFloat(row.v), hora: row.t };
    }).catch(function () { return null; });
  }

  Promise.all(STATIONS.map(fetchStation)).then(function (results) {
    var ok = results.filter(function (r) { return r; });
    if (!ok.length) {
      if (status) status.textContent = 'No se pudo cargar el nivel del mar en este momento.';
      return;
    }

    body.innerHTML = ok.map(function (r) {
      return '<tr><td>' + r.nombre + '</td><td>' + r.nivel.toFixed(2) + ' m</td><td>' + utcToAst(r.hora) + '</td></tr>';
    }).join('');

    var sj = ok.filter(function (r) { return r.id === '9755371'; })[0];
    if (statSJ && sj) statSJ.textContent = sj.nivel.toFixed(2);
    if (statCount) statCount.textContent = ok.length;
    if (status) status.textContent = '';
  });
})();
