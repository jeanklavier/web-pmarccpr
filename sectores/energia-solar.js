/* ============================================================
   Adopción de energía solar residencial (net metering) en PR.
   Fuente: tabla pmarcc_solar_net_metering en Supabase (mismo proyecto
   que embalses/estado del sistema), alimentada por EIA Form 861-M.
   Historial 2014-presente cargado una vez y actualizado por un cron
   mensual (día 28) vía el edge function pmarcc-solar-sync.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';
  var canvas = document.getElementById('chartSolarHistorico');
  var statTotal = document.getElementById('solarClientesTotal');
  var statRes = document.getElementById('solarClientesResidencial');
  var statCap = document.getElementById('solarCapacidadTotal');
  var statTimestamp = document.getElementById('solarTimestamp');
  var status = document.getElementById('solarStatus');
  if (!statTotal) return;

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
      grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)'
    };
  }

  if (status) status.textContent = 'Cargando…';

  fetch(SUPABASE_URL + '/rest/v1/pmarcc_solar_net_metering?select=anio,mes,clientes_total,clientes_residencial,capacidad_mw_total,data_status&order=anio.asc,mes.asc', {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (rows) {
    if (!rows || !rows.length) throw new Error('sin datos');
    var last = rows[rows.length - 1];

    statTotal.textContent = last.clientes_total.toLocaleString('es-PR');
    if (statRes) statRes.textContent = (last.clientes_residencial != null ? last.clientes_residencial.toLocaleString('es-PR') : '—');
    if (statCap) statCap.textContent = (last.capacidad_mw_total != null ? Math.round(last.capacidad_mw_total).toLocaleString('es-PR') + ' MW' : '—');
    if (statTimestamp) {
      var estado = last.data_status ? ' — dato ' + last.data_status.toLowerCase() : '';
      statTimestamp.textContent = 'Dato al 1 de ' + MESES[last.mes - 1] + ' de ' + last.anio + estado + '.';
    }

    if (canvas && typeof Chart !== 'undefined') {
      var c = themeColors();
      var labels = rows.map(function (r) { return MESES[r.mes - 1] + ' ' + r.anio; });
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Clientes con net metering',
            data: rows.map(function (r) { return r.clientes_total; }),
            borderColor: '#2f9e44', backgroundColor: 'rgba(47,158,68,.16)',
            fill: true, tension: .2, pointRadius: 0, borderWidth: 2.5
          }]
        },
        options: {
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { title: { display: true, text: 'Clientes', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } },
            x: { ticks: { color: c.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false } }
          }
        }
      });
    }
    if (status) status.textContent = '';
  }).catch(function () {
    if (status) status.textContent = 'No se pudo cargar el historial de energía solar en este momento.';
  });
})();
