/* ============================================================
   Incendios y puntos de calor activos en Puerto Rico.
   Fuente: tabla pmarcc_incendios_activos en Supabase, alimentada por
   el edge function pmarcc-incendios-sync (cron cada 4 horas). NASA
   FIRMS bloquea CORS, por eso pasa por Supabase. Combina 3 satélites
   VIIRS (Suomi-NPP, NOAA-20, NOAA-21), últimos 2 días, deduplicado.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';

  var body = document.getElementById('incendiosBody');
  var status = document.getElementById('incendiosStatus');
  var statDetecciones = document.getElementById('foresDetecciones');
  var statFecha = document.getElementById('foresUltimaFecha');
  var statFrp = document.getElementById('foresFrpMax');
  var statConfianza = document.getElementById('foresConfianzaAlta');
  if (!body) return;

  var CONFIANZA = { h: 'Alta', n: 'Nominal', l: 'Baja' };
  var SATELITE = { N: 'Suomi-NPP', N20: 'NOAA-20', N21: 'NOAA-21' };

  fetch(SUPABASE_URL + '/rest/v1/pmarcc_incendios_activos?select=latitude,longitude,acq_date,acq_time,satellite,confidence,frp&order=acq_date.desc,acq_time.desc', {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (rows) {
    if (statDetecciones) statDetecciones.textContent = rows.length;

    if (!rows.length) {
      if (status) status.textContent = 'Sin detecciones activas en las últimas 48 horas.';
      if (statFecha) statFecha.textContent = '—';
      if (statFrp) statFrp.textContent = '—';
      if (statConfianza) statConfianza.textContent = '0';
      return;
    }

    var mostRecent = rows[0];
    if (statFecha) {
      var f = new Date(mostRecent.acq_date + 'T00:00:00');
      statFecha.textContent = f.toLocaleDateString('es-PR', { day: 'numeric', month: 'short' });
    }

    var frpMax = rows.reduce(function (max, r) { return (r.frp && r.frp > max) ? r.frp : max; }, 0);
    if (statFrp) statFrp.textContent = frpMax.toFixed(1);

    var altaConfianza = rows.filter(function (r) { return r.confidence === 'h'; }).length;
    if (statConfianza) statConfianza.textContent = altaConfianza;

    body.innerHTML = rows.map(function (r) {
      var hora = r.acq_time ? r.acq_time.padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2') + ' UTC' : '—';
      var f = new Date(r.acq_date + 'T00:00:00');
      var fecha = f.toLocaleDateString('es-PR', { day: 'numeric', month: 'short' });
      return '<tr><td>' + fecha + '</td><td>' + hora + '</td><td>' + r.latitude.toFixed(3) + ', ' + r.longitude.toFixed(3) + '</td><td>' +
        (SATELITE[r.satellite] || r.satellite) + '</td><td>' + (CONFIANZA[r.confidence] || r.confidence) + '</td><td>' +
        (r.frp != null ? r.frp.toFixed(1) + ' MW' : '—') + '</td></tr>';
    }).join('');

    if (status) status.textContent = 'Detecciones de las últimas 48 horas. No todas son incendios forestales - pueden incluir quemas agrícolas o fuentes de calor industrial.';
  }).catch(function () {
    if (status) status.textContent = 'No se pudo cargar las detecciones activas en este momento.';
  });
})();
