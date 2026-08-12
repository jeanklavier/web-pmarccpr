/* ============================================================
   Fondos de recuperación desembolsados en PR (COR3 - Central de
   Recuperación, Reconstrucción y Resiliencia). Datos cacheados en
   Supabase (pmarcc_cor3_resumen y pmarcc_cor3_desembolsos_recientes),
   alimentados por el edge function pmarcc-cor3-sync (cron semanal,
   miércoles). Fuente original: recovery.pr.gov (API pública del
   propio portal de transparencia - no requiere scraping).
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';

  var statDesembolsado = document.getElementById('infraCor3Desembolsado');
  var statPorciento = document.getElementById('infraCor3Porciento');
  var tbody = document.getElementById('cor3Body');
  var status = document.getElementById('cor3Status');
  var timestamp = document.getElementById('cor3Timestamp');
  var canvas = document.getElementById('chartCor3Recipientes');
  if (!statDesembolsado) return;

  function fmtUSD(n) {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + ' mil millones';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + ' millones';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  }

  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-PR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function themeColors() {
    var cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim() || '#3d5257',
      grid: cs.getPropertyValue('--border').trim() || 'rgba(8,32,50,.08)'
    };
  }

  function headers() {
    return { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY };
  }

  Promise.all([
    fetch(SUPABASE_URL + '/rest/v1/pmarcc_cor3_resumen?select=*&limit=1', { headers: headers() }).then(function (r) { return r.json(); }),
    fetch(SUPABASE_URL + '/rest/v1/pmarcc_cor3_desembolsos_recientes?select=*&order=paid_date.desc&limit=12', { headers: headers() }).then(function (r) { return r.json(); })
  ]).then(function (results) {
    var resumen = results[0] && results[0][0];
    var recientes = results[1] || [];
    if (!resumen) throw new Error('sin datos de resumen COR3');

    statDesembolsado.textContent = fmtUSD(resumen.disbursed_total);
    if (statPorciento && resumen.obligated_total) {
      var pct = (resumen.disbursed_total / resumen.obligated_total) * 100;
      statPorciento.textContent = pct.toFixed(0) + '%';
    }
    if (timestamp) {
      timestamp.textContent = 'Trimestre ' + (resumen.quarter_label || '—') + '. Actualizado: ' + fmtFecha(resumen.fetched_at) + '.';
    }

    if (tbody) {
      tbody.innerHTML = '';
      recientes.forEach(function (r) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (r.sector || '—') + '</td>' +
          '<td>' + (r.applicant_name || '—') + '</td>' +
          '<td>' + (r.disaster || '—') + '</td>' +
          '<td>' + fmtUSD(r.disbursed_amt) + '</td>' +
          '<td>' + fmtFecha(r.paid_date) + '</td>';
        tbody.appendChild(tr);
      });
    }

    if (canvas && typeof Chart !== 'undefined') {
      var c = themeColors();
      var municipios = (resumen.municipios_pa || 0) + (resumen.municipios_hmgp || 0);
      var agencias = (resumen.agencias_pa || 0) + (resumen.agencias_hmgp || 0);
      var pnp = (resumen.pnp_pa || 0) + (resumen.pnp_hmgp || 0);
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Municipios', 'Agencias', 'Sin fines de lucro'],
          datasets: [{
            label: 'Desembolsado',
            data: [municipios, agencias, pnp],
            backgroundColor: ['#13256C', '#2B4199', '#5C7CFA'],
            borderRadius: 6
          }]
        },
        options: {
          animation: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (ctx) { return fmtUSD(ctx.parsed.y); } } } },
          scales: {
            y: { ticks: { color: c.text, callback: function (v) { return fmtUSD(v); } }, grid: { color: c.grid } },
            x: { ticks: { color: c.text }, grid: { display: false } }
          }
        }
      });
    }

    if (status) status.textContent = '';
  }).catch(function (e) {
    if (status) status.textContent = 'No se pudo cargar el estado de los fondos de recuperación en este momento.';
    console.error('COR3:', e);
  });
})();
