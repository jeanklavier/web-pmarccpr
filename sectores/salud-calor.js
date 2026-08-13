/* ============================================================
   Índice de calor en Puerto Rico, en vivo.
   Fuente: NWS (National Weather Service), API pública sin llave y
   sin bloqueo CORS - consulta directa desde el navegador, igual que
   USGS/FEMA en Infraestructura. Se consultan las 5 estaciones ASOS
   oficiales de PR; algunas reportan "sin lectura" en ciertos
   momentos por mantenimiento del sensor, así que se muestran solo
   las que tienen dato válido.
   ============================================================ */
(function () {
  'use strict';

  var ESTACIONES = [
    { id: 'TJSJ', nombre: 'San Juan (Luis Muñoz Marín)' },
    { id: 'TJIG', nombre: 'San Juan (Isla Grande)' },
    { id: 'TJBQ', nombre: 'Aguadilla' },
    { id: 'TJPS', nombre: 'Ponce' },
    { id: 'TJNR', nombre: 'Ceiba (Roosevelt Roads)' }
  ];

  var body = document.getElementById('calorBody');
  var status = document.getElementById('calorStatus');
  var statIndice = document.getElementById('saludIndiceMax');
  var statEstacion = document.getElementById('saludEstacionMax');
  var statCategoria = document.getElementById('saludCategoriaMax');
  var statAlertas = document.getElementById('saludAlertasCalor');
  var alertList = document.getElementById('calorAlertasList');
  if (!body) return;

  function categoria(heatIndexF) {
    if (heatIndexF == null) return null;
    if (heatIndexF >= 125) return { label: 'Peligro extremo', color: '#730000' };
    if (heatIndexF >= 103) return { label: 'Peligro', color: '#e60000' };
    if (heatIndexF >= 90) return { label: 'Precaución extrema', color: '#ff8c00' };
    if (heatIndexF >= 80) return { label: 'Precaución', color: '#ffd37f' };
    return { label: 'Sin riesgo de calor', color: '#ced4da' };
  }

  function cToF(c) { return c * 9 / 5 + 32; }

  function fetchEstacion(st) {
    return fetch('https://api.weather.gov/stations/' + st.id + '/observations/latest')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var p = d.properties || {};
        var temp = p.temperature && p.temperature.value;
        var hi = p.heatIndex && p.heatIndex.value;
        var rh = p.relativeHumidity && p.relativeHumidity.value;
        if (temp == null) return null; // sensor sin lectura en este momento
        return {
          nombre: st.nombre, id: st.id,
          temp: temp, heatIndex: hi, rh: rh,
          timestamp: p.timestamp
        };
      }).catch(function () { return null; });
  }

  Promise.all(ESTACIONES.map(fetchEstacion)).then(function (results) {
    var ok = results.filter(function (r) { return r; });
    if (!ok.length) {
      if (status) status.textContent = 'No se pudo cargar el índice de calor en este momento.';
      return;
    }

    body.innerHTML = ok.map(function (r) {
      var hiF = r.heatIndex != null ? cToF(r.heatIndex) : cToF(r.temp);
      var cat = categoria(hiF);
      return '<tr><td>' + r.nombre + '</td><td>' + cToF(r.temp).toFixed(0) + '°F</td><td>' +
        (r.rh != null ? r.rh.toFixed(0) + '%' : '—') + '</td><td>' +
        (r.heatIndex != null ? hiF.toFixed(0) + '°F' : '—') + '</td><td>' +
        '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + cat.color +
        ';margin-right:6px;vertical-align:middle;"></span>' + cat.label + '</td></tr>';
    }).join('');

    var peor = ok.reduce(function (max, r) {
      var hiMax = max.heatIndex != null ? max.heatIndex : max.temp;
      var hiR = r.heatIndex != null ? r.heatIndex : r.temp;
      return hiR > hiMax ? r : max;
    }, ok[0]);
    var peorF = cToF(peor.heatIndex != null ? peor.heatIndex : peor.temp);
    var catPeor = categoria(peorF);

    if (statIndice) statIndice.textContent = peorF.toFixed(0) + '°F';
    if (statEstacion) statEstacion.textContent = peor.nombre;
    if (statCategoria) statCategoria.textContent = catPeor.label;

    if (status) status.textContent = '';
  });

  fetch('https://api.weather.gov/alerts/active?area=PR', { headers: { 'Accept': 'application/geo+json' } })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var todas = data.features || [];
      var calor = todas.filter(function (f) {
        var ev = (f.properties && f.properties.event || '').toLowerCase();
        return ev.indexOf('heat') !== -1;
      });
      if (statAlertas) statAlertas.textContent = calor.length;
      if (!alertList) return;
      if (calor.length === 0) {
        alertList.innerHTML = '<li class="alerta-item alerta-ninguna">No hay avisos de calor activos del Servicio Nacional de Meteorología para Puerto Rico en este momento.</li>';
        return;
      }
      alertList.innerHTML = calor.map(function (f) {
        var p = f.properties || {};
        return '<li class="alerta-item"><strong>' + (p.event || 'Aviso') + '</strong><span>' + (p.headline || '') + '</span></li>';
      }).join('');
    }).catch(function () {
      if (statAlertas) statAlertas.textContent = '—';
      if (alertList) alertList.innerHTML = '<li class="alerta-item">No se pudo cargar el estado de avisos en este momento.</li>';
    });
})();
