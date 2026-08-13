/* ============================================================
   Estado de la sequía en Puerto Rico.
   Fuente: tabla pmarcc_sequia_historico en Supabase, alimentada por
   el edge function pmarcc-sequia-sync (cron semanal, viernes). El
   US Drought Monitor bloquea CORS y publica los jueves, por eso
   pasa por Supabase en vez de consultarse directo del navegador.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';

  var canvas = document.getElementById('chartSequiaHistorico');
  var body = document.getElementById('sequiaBody');
  var status = document.getElementById('sequiaStatus');
  var statModerada = document.getElementById('sequiaModeradaOPeor');
  var statSevera = document.getElementById('sequiaSeveraOPeor');
  var statCategoria = document.getElementById('sequiaCategoriaPrincipal');
  var statFecha = document.getElementById('sequiaFecha');
  if (!body) return;

  var CATS = [
    { key: 'none', label: 'Sin sequía', color: '#ced4da' },
    { key: 'd0', label: 'Anormalmente seco (D0)', color: '#ffff66' },
    { key: 'd1', label: 'Sequía moderada (D1)', color: '#ffd37f' },
    { key: 'd2', label: 'Sequía severa (D2)', color: '#ffaa00' },
    { key: 'd3', label: 'Sequía extrema (D3)', color: '#e60000' },
    { key: 'd4', label: 'Sequía excepcional (D4)', color: '#730000' }
  ];

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
      grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)'
    };
  }

  if (status) status.textContent = 'Cargando…';

  fetch(SUPABASE_URL + '/rest/v1/pmarcc_sequia_historico?select=fecha,none,d0,d1,d2,d3,d4&order=fecha.asc', {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (rows) {
    if (!rows || !rows.length) throw new Error('sin datos');
    var last = rows[rows.length - 1];

    var moderadaOPeor = Number(last.d1) + Number(last.d2) + Number(last.d3) + Number(last.d4);
    var severaOPeor = Number(last.d2) + Number(last.d3) + Number(last.d4);
    if (statModerada) statModerada.textContent = moderadaOPeor.toFixed(0) + '%';
    if (statSevera) statSevera.textContent = severaOPeor.toFixed(0) + '%';

    var principal = CATS.reduce(function (max, c) {
      return Number(last[c.key]) > Number(last[max.key]) ? c : max;
    }, CATS[0]);
    if (statCategoria) statCategoria.textContent = principal.label.replace(/ \(D\d\)/, '');

    if (statFecha) {
      var f = new Date(last.fecha + 'T00:00:00');
      statFecha.textContent = f.toLocaleDateString('es-PR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    body.innerHTML = CATS.map(function (c) {
      return '<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + c.color +
        ';margin-right:6px;vertical-align:middle;"></span>' + c.label + '</td><td>' + Number(last[c.key]).toFixed(1) + '%</td></tr>';
    }).join('');

    if (canvas && typeof Chart !== 'undefined') {
      var c = themeColors();
      var recientes = rows.slice(-52); // últimas ~52 semanas (1 año)
      var labels = recientes.map(function (r) {
        var f = new Date(r.fecha + 'T00:00:00');
        return f.toLocaleDateString('es-PR', { day: 'numeric', month: 'short' });
      });
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: CATS.map(function (cat) {
            return {
              label: cat.label,
              data: recientes.map(function (r) { return Number(r[cat.key]); }),
              backgroundColor: cat.color,
              borderWidth: 0
            };
          })
        },
        options: {
          animation: false,
          plugins: { legend: { position: 'bottom', labels: { color: c.text, boxWidth: 12, font: { size: 11 } } } },
          scales: {
            x: { stacked: true, ticks: { color: c.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }, grid: { display: false } },
            y: { stacked: true, min: 0, max: 100, title: { display: true, text: '% del área de PR', color: c.text }, ticks: { color: c.text }, grid: { color: c.grid } }
          }
        }
      });
    }
    if (status) status.textContent = '';
  }).catch(function () {
    if (status) status.textContent = 'No se pudo cargar el estado de la sequía en este momento.';
  });
})();
