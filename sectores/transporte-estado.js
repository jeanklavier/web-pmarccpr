/* ============================================================
   Estado del transporte, en vivo: retrasos/cierres en los aeropuertos
   de PR (FAA) y estaciones de carga para vehículos eléctricos
   (developer.nlr.gov, antes NREL/AFDC). Ambas fuentes se cachean en
   Supabase porque sus APIs no permiten fetch directo desde el
   navegador (CORS). Actualizadas por pmarcc-faa-sync (cada 20 min) y
   pmarcc-ev-sync (cron diario).
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_JyU7cRLmTLbjaMEHjbexHA_4FXmtv64';

  var statEstaciones = document.getElementById('transEvEstaciones');
  var statPuertos = document.getElementById('transEvPuertos');
  var statEventos = document.getElementById('transFaaEventos');
  var statEstadoGeneral = document.getElementById('transFaaEstadoGeneral');
  if (!statEstaciones) return;

  function headers() {
    return { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY };
  }

  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-PR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  var ESTADO_LABELS = { E: 'Disponible', T: 'Temporalmente fuera de servicio', P: 'Planificada' };
  var TIPO_LABELS = { ground_delay: 'Retraso en tierra', arrival_departure_delay: 'Retraso de llegadas/salidas', cierre: 'Cierre' };

  /* ---------------- Aeropuertos (FAA) ---------------- */
  fetch(SUPABASE_URL + '/rest/v1/pmarcc_faa_estado?select=*&limit=1', { headers: headers() })
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      var estado = rows && rows[0];
      var list = document.getElementById('faaEventosList');
      var timestamp = document.getElementById('faaTimestamp');
      if (!estado) throw new Error('sin datos FAA');

      var eventos = estado.eventos || [];
      if (statEventos) statEventos.textContent = eventos.length;
      if (statEstadoGeneral) statEstadoGeneral.textContent = eventos.length === 0 ? 'Sin interrupciones' : (eventos.length + ' aviso(s) activo(s)');
      if (timestamp) timestamp.textContent = 'Última actualización del FAA: ' + (estado.update_time_faa || '—') + '.';

      if (list) {
        list.innerHTML = '';
        if (eventos.length === 0) {
          var li = document.createElement('li');
          li.className = 'alerta-item alerta-ninguna';
          li.textContent = 'No hay retrasos ni cierres activos en los aeropuertos de Puerto Rico (SJU, BQN, PSE) en este momento.';
          list.appendChild(li);
        } else {
          eventos.forEach(function (ev) {
            var li = document.createElement('li');
            li.className = 'alerta-item';
            var detalle = ev.reason || '';
            if (ev.avg) detalle += ' — promedio ' + ev.avg;
            li.innerHTML = '<strong>' + ev.arpt + ' · ' + (TIPO_LABELS[ev.tipo] || ev.tipo) + '</strong><span>' + detalle + '</span>';
            list.appendChild(li);
          });
        }
      }
    }).catch(function (e) {
      if (statEventos) statEventos.textContent = '—';
      if (statEstadoGeneral) statEstadoGeneral.textContent = '—';
      var list = document.getElementById('faaEventosList');
      if (list) list.innerHTML = '<li class="alerta-item">No se pudo cargar el estado de los aeropuertos en este momento.</li>';
      console.error('FAA:', e);
    });

  /* ---------------- Estaciones de carga EV ---------------- */
  fetch(SUPABASE_URL + '/rest/v1/pmarcc_ev_estaciones?select=*&order=municipio.asc', { headers: headers() })
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      rows = rows || [];
      var tbody = document.getElementById('evBody');
      var status = document.getElementById('evStatus');

      if (statEstaciones) statEstaciones.textContent = rows.length.toLocaleString('es-PR');
      var totalPuertos = rows.reduce(function (sum, r) { return sum + (r.puertos || 0); }, 0);
      if (statPuertos) statPuertos.textContent = totalPuertos.toLocaleString('es-PR');

      if (tbody) {
        tbody.innerHTML = '';
        rows.forEach(function (r) {
          var tr = document.createElement('tr');
          var conectores = (r.conectores || []).join(', ') || '—';
          var precio = r.gratis === true ? 'Gratis' : (r.gratis === false ? 'De pago' : '—');
          tr.innerHTML = '<td>' + (r.nombre || '—') + '</td>' +
            '<td>' + (r.municipio || '—') + '</td>' +
            '<td>' + (r.red || '—') + '</td>' +
            '<td>' + (r.puertos != null ? r.puertos : '—') + ' (' + conectores + ')</td>' +
            '<td>' + (ESTADO_LABELS[r.estado_codigo] || r.estado_codigo || '—') + '</td>' +
            '<td>' + precio + '</td>';
          tbody.appendChild(tr);
        });
      }
      if (status) status.textContent = '';
    }).catch(function (e) {
      var status = document.getElementById('evStatus');
      if (status) status.textContent = 'No se pudo cargar el listado de estaciones de carga en este momento.';
      console.error('EV:', e);
    });
})();
