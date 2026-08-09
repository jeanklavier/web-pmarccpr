/* ============================================================
   Reportar un error o dejar una sugerencia - botón flotante +
   modal accesible con selector de tipo. Envía el mensaje a la
   misma base de datos (Supabase) que recoge los formularios de
   los sitios de JCTech, vía la función "form-submit". Se inyecta
   en cada página para no duplicar HTML.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://eexzkkypfkpscewufgrg.supabase.co/functions/v1/form-submit';

  var COPY = {
    error: {
      seccionLabel: 'Sección o dato a corregir',
      mensajeLabel: '¿Cuál es el error?',
      mensajePlaceholder: 'Ej: El dato de 4.12% debería ser...',
      sub: 'Este sitio resume el P-MARCC con ayuda de inteligencia artificial. Si algo no coincide con el documento oficial, dínoslo: indica dónde está el error y lo revisamos.',
      submitLabel: 'Enviar corrección',
      successMsg: '¡Gracias! Recibimos tu corrección y la vamos a revisar.',
      tipoNegocio: 'Corrección P-MARCC'
    },
    sugerencia: {
      seccionLabel: 'Página o sección relacionada',
      mensajeLabel: 'Tu sugerencia o comentario',
      mensajePlaceholder: 'Ej: Sería útil un mapa interactivo por municipio...',
      sub: '¿Hay algo que te gustaría ver en este sitio, o una forma de mejorarlo? Cuéntanos tu idea, la leemos con gusto.',
      submitLabel: 'Enviar sugerencia',
      successMsg: '¡Gracias! Recibimos tu sugerencia.',
      tipoNegocio: 'Sugerencia P-MARCC'
    }
  };

  /* ---- 1. Scroll-spy: qué sección está viendo la persona ahora ---- */
  var sectionLabels = {};
  document.querySelectorAll('main [id]').forEach(function (el) {
    var h = el.querySelector('h1, h2, h3');
    sectionLabels[el.id] = h ? h.textContent.trim() : el.id;
  });
  var currentSectionId = '';
  var currentSectionLabel = document.title;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentSectionId = entry.target.id;
          currentSectionLabel = sectionLabels[entry.target.id] || entry.target.id;
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main [id]').forEach(function (el) { io.observe(el); });
  }

  /* ---- 2. Inyectar botón flotante + modal ---- */
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'report-fab';
  fab.id = 'reportFab';
  fab.setAttribute('aria-haspopup', 'dialog');
  fab.setAttribute('aria-label', 'Reportar un error o dejar una sugerencia');
  fab.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>' +
    '</svg><span class="fab-label">Comentarios</span>';
  document.body.appendChild(fab);

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'reportModal';
  overlay.innerHTML =
    '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="reportModalTitle">' +
      '<div class="modal-head">' +
        '<h3 id="reportModalTitle">Ayúdanos a mejorar este sitio</h3>' +
        '<button type="button" class="modal-close" id="reportClose" aria-label="Cerrar">✕</button>' +
      '</div>' +
      '<div class="type-toggle" role="group" aria-label="Tipo de mensaje">' +
        '<button type="button" class="type-btn" id="typeError" aria-pressed="true">Reportar un error</button>' +
        '<button type="button" class="type-btn" id="typeSugerencia" aria-pressed="false">Sugerencia o idea</button>' +
      '</div>' +
      '<p class="modal-sub" id="reportSub"></p>' +
      '<form id="reportForm" novalidate>' +
        '<div class="form-field">' +
          '<label for="rf-seccion" id="reportSeccionLabel">Sección o dato a corregir</label>' +
          '<input type="text" id="rf-seccion" name="producto" required>' +
          '<p class="form-hint">Se llena solo según la sección donde estabas. Puedes editarlo.</p>' +
        '</div>' +
        '<div class="form-field">' +
          '<label for="rf-mensaje" id="reportMensajeLabel">¿Cuál es el error?</label>' +
          '<textarea id="rf-mensaje" name="mensaje" required placeholder="Ej: El dato de 4.12% debería ser..."></textarea>' +
        '</div>' +
        '<div class="form-field">' +
          '<label for="rf-nombre">Nombre (opcional)</label>' +
          '<input type="text" id="rf-nombre" name="nombre" autocomplete="name">' +
        '</div>' +
        '<div class="form-field">' +
          '<label for="rf-correo">Correo electrónico (opcional)</label>' +
          '<input type="email" id="rf-correo" name="correo" autocomplete="email">' +
          '<p class="form-hint">Solo por si necesitamos aclarar algo. Puedes reportar de forma anónima.</p>' +
        '</div>' +
        '<div class="honeypot" aria-hidden="true">' +
          '<label for="rf-gotcha">No llenar este campo</label>' +
          '<input type="text" id="rf-gotcha" name="_gotcha" tabindex="-1" autocomplete="off">' +
        '</div>' +
        '<input type="hidden" name="_source" value="pmarcc">' +
        '<input type="hidden" id="rf-tipo" name="tipo_negocio" value="Corrección P-MARCC">' +
        '<button type="submit" class="modal-submit" id="reportSubmit">Enviar corrección</button>' +
        '<div class="modal-status" id="reportStatus" role="status" aria-live="polite"></div>' +
      '</form>' +
    '</div>';
  document.body.appendChild(overlay);

  var closeBtn = document.getElementById('reportClose');
  var form = document.getElementById('reportForm');
  var statusBox = document.getElementById('reportStatus');
  var submitBtn = document.getElementById('reportSubmit');
  var seccionInput = document.getElementById('rf-seccion');
  var subText = document.getElementById('reportSub');
  var seccionLabel = document.getElementById('reportSeccionLabel');
  var mensajeLabel = document.getElementById('reportMensajeLabel');
  var mensajeInput = document.getElementById('rf-mensaje');
  var tipoInput = document.getElementById('rf-tipo');
  var typeErrorBtn = document.getElementById('typeError');
  var typeSugerenciaBtn = document.getElementById('typeSugerencia');
  var lastFocused = null;
  var currentType = 'error';

  function applyType(type) {
    currentType = type;
    var c = COPY[type];
    subText.textContent = c.sub;
    seccionLabel.textContent = c.seccionLabel;
    mensajeLabel.textContent = c.mensajeLabel;
    mensajeInput.placeholder = c.mensajePlaceholder;
    tipoInput.value = c.tipoNegocio;
    submitBtn.textContent = c.submitLabel;
    typeErrorBtn.setAttribute('aria-pressed', String(type === 'error'));
    typeSugerenciaBtn.setAttribute('aria-pressed', String(type === 'sugerencia'));
    typeErrorBtn.classList.toggle('active', type === 'error');
    typeSugerenciaBtn.classList.toggle('active', type === 'sugerencia');
  }

  function openModal() {
    lastFocused = document.activeElement;
    applyType('error');
    var ref = (window.location.pathname.split('/').pop() || 'index.html') + (currentSectionId ? '#' + currentSectionId : '');
    seccionInput.value = (document.title.split('|')[0].trim()) + (currentSectionLabel ? ' - ' + currentSectionLabel : '') + ' (' + ref + ')';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    seccionInput.focus();
    document.addEventListener('keydown', onKeydown);
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      var focusables = overlay.querySelectorAll('button, input, textarea');
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  typeErrorBtn.addEventListener('click', function () { applyType('error'); });
  typeSugerenciaBtn.addEventListener('click', function () { applyType('sugerencia'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (document.getElementById('rf-gotcha').value) return; // bot
    statusBox.className = 'modal-status';
    statusBox.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    var fd = new FormData(form);
    // El backend requiere correo o teléfono; si la persona reporta de forma
    // anónima, se envía un correo centinela para no bloquear el reporte.
    if (!fd.get('correo')) fd.set('correo', 'anonimo@pmarcc-reporte.info');
    fetch(SUPABASE_URL, { method: 'POST', body: fd })
      .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
      .then(function (res) {
        if (res.ok && res.data && res.data.success) {
          statusBox.textContent = COPY[currentType].successMsg;
          statusBox.className = 'modal-status show ok';
          form.reset();
          setTimeout(closeModal, 2600);
        } else {
          throw new Error((res.data && res.data.error) || 'No se pudo enviar');
        }
      })
      .catch(function () {
        statusBox.textContent = 'No pudimos enviar el mensaje. Intenta de nuevo en unos minutos.';
        statusBox.className = 'modal-status show err';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = COPY[currentType].submitLabel;
      });
  });
})();
