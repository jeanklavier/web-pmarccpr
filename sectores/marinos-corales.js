/* ============================================================
   Estrés térmico y blanqueo de corales en las 16 estaciones
   virtuales de NOAA Coral Reef Watch en Puerto Rico.
   Fuente: tabla pmarcc_crw_estaciones en Supabase, alimentada por
   el edge function pmarcc-crw-sync (cron diario, 15:00 UTC). Los
   archivos fuente de NOAA bloquean CORS, por eso pasan por Supabase.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';

  var body = document.getElementById('coralBody');
  var status = document.getElementById('coralStatus');
  var statPeor = document.getElementById('marCoralPeor');
  var statAlerta = document.getElementById('marCoralAlerta');
  if (!body) return;

  var NIVELES = { 0: 'Sin estrés', 1: 'Vigilancia', 2: 'Alerta', 3: 'Alerta de blanqueo 1', 4: 'Alerta de blanqueo 2' };
  function nivelLabel(baa) {
    if (baa >= 5) return 'Alerta de blanqueo ' + (baa - 1);
    return NIVELES[baa] || ('Nivel ' + baa);
  }
  function cToF(c) { return c * 9 / 5 + 32; }

  fetch(SUPABASE_URL + '/rest/v1/pmarcc_crw_estaciones?select=estacion,fecha,sst,dhw,baa&order=baa.desc,dhw.desc', {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (rows) {
    if (!rows || !rows.length) throw new Error('sin datos');

    body.innerHTML = rows.map(function (r) {
      return '<tr><td>' + r.estacion + '</td><td>' + cToF(Number(r.sst)).toFixed(1) + '°F</td><td>' +
        Number(r.dhw).toFixed(1) + '</td><td>' + nivelLabel(r.baa) + '</td></tr>';
    }).join('');

    var peor = rows[0];
    if (statPeor) statPeor.textContent = peor.estacion;
    var enAlerta = rows.filter(function (r) { return r.baa >= 2; }).length;
    if (statAlerta) statAlerta.textContent = enAlerta;
    if (status) status.textContent = 'Dato al ' + peor.fecha + '.';
  }).catch(function () {
    if (status) status.textContent = 'No se pudo cargar el estado de los arrecifes en este momento.';
  });
})();
