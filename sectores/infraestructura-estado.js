/* ============================================================
   Estado de la infraestructura, en vivo: sismicidad reciente (USGS),
   alertas activas del NWS, y proyectos federales de recuperación
   obligados en PR (OpenFEMA). Fuentes públicas oficiales, sin llave,
   consumidas directo desde el navegador (CORS habilitado en las tres).
   ============================================================ */
(function () {
  'use strict';

  function fmtUSD(n) {
    if (n == null || isNaN(n)) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  }

  function fmtFecha(value) {
    if (!value) return '—';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-PR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function startDateISO(daysAgo) {
    var d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  }

  /* ---------------- Sismicidad reciente (USGS) ---------------- */
  function fetchSismos() {
    var statCount = document.getElementById('infraSismos30d');
    var tbody = document.getElementById('sismosBody');
    var status = document.getElementById('sismosStatus');
    var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' +
      '&starttime=' + startDateISO(30) +
      '&minmagnitude=2.5&minlatitude=17.3&maxlatitude=18.7&minlongitude=-67.5&maxlongitude=-65.0' +
      '&orderby=time';

    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('USGS HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      var features = data.features || [];
      if (statCount) statCount.textContent = features.length.toLocaleString('es-PR');
      if (tbody) {
        tbody.innerHTML = '';
        features.slice(0, 8).forEach(function (f) {
          var p = f.properties || {};
          var lugar = (p.place || '—').replace(/^\d+\s*km\s*/i, '');
          var tr = document.createElement('tr');
          tr.innerHTML = '<td>' + (typeof p.mag === 'number' ? p.mag.toFixed(1) : '—') + '</td>' +
            '<td>' + lugar + '</td>' +
            '<td>' + fmtFecha(p.time) + '</td>';
          tbody.appendChild(tr);
        });
      }
      if (status) status.textContent = '';
    }).catch(function (e) {
      if (status) status.textContent = 'No se pudo cargar la actividad sísmica en este momento.';
      console.error('USGS:', e);
    });
  }

  /* ---------------- Alertas activas (NWS) ---------------- */
  function fetchAlertas() {
    var statCount = document.getElementById('infraAlertasActivas');
    var list = document.getElementById('alertasList');
    fetch('https://api.weather.gov/alerts/active?area=PR', {
      headers: { 'Accept': 'application/geo+json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('NWS HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      var features = data.features || [];
      if (statCount) statCount.textContent = features.length.toLocaleString('es-PR');
      if (!list) return;
      list.innerHTML = '';
      if (features.length === 0) {
        var li = document.createElement('li');
        li.className = 'alerta-item alerta-ninguna';
        li.textContent = 'No hay alertas activas del Servicio Nacional de Meteorología para Puerto Rico en este momento.';
        list.appendChild(li);
        return;
      }
      features.forEach(function (f) {
        var p = f.properties || {};
        var li = document.createElement('li');
        li.className = 'alerta-item';
        li.innerHTML = '<strong>' + (p.event || 'Alerta') + '</strong><span>' + (p.headline || '') + '</span>';
        list.appendChild(li);
      });
    }).catch(function (e) {
      if (statCount) statCount.textContent = '—';
      if (list) list.innerHTML = '<li class="alerta-item">No se pudo cargar el estado de alertas en este momento.</li>';
      console.error('NWS:', e);
    });
  }

  /* ---------------- Proyectos obligados por FEMA (OpenFEMA) ---------------- */
  function fetchFema() {
    var tbody = document.getElementById('femaBody');
    var status = document.getElementById('femaStatus');
    var filter = encodeURIComponent("stateAbbreviation eq 'PR'");
    var orderby = encodeURIComponent('lastObligationDate desc');
    var select = encodeURIComponent('incidentType,damageCategoryDescrip,county,totalObligated,lastObligationDate');
    var url = 'https://www.fema.gov/api/open/v2/PublicAssistanceFundedProjectsDetails' +
      '?$filter=' + filter + '&$top=8&$orderby=' + orderby + '&$select=' + select;

    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('OpenFEMA HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      var rows = data.PublicAssistanceFundedProjectsDetails || [];
      if (tbody) {
        tbody.innerHTML = '';
        rows.forEach(function (r) {
          var tr = document.createElement('tr');
          tr.innerHTML = '<td>' + (r.damageCategoryDescrip || '—') + '</td>' +
            '<td>' + (r.county || '—') + '</td>' +
            '<td>' + (r.incidentType || '—') + '</td>' +
            '<td>' + fmtUSD(r.totalObligated) + '</td>' +
            '<td>' + fmtFecha(r.lastObligationDate) + '</td>';
          tbody.appendChild(tr);
        });
      }
      if (status) status.textContent = '';
    }).catch(function (e) {
      if (status) status.textContent = 'No se pudo cargar el detalle de OpenFEMA en este momento.';
      console.error('OpenFEMA:', e);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('infraSismos30d')) return;
    fetchSismos();
    fetchAlertas();
    fetchFema();
  });
})();
