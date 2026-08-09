/* ============================================================
   Visor del Plan (PDF.js) - página por página.
   Los números que ve el usuario son la paginación IMPRESA del Plan.
   Conversión a página física del PDF:
     Tomo 1: física = impresa + 1   (impresas 1-301, 302 físicas)
     Tomo 2: física = impresa - 287 (impresas 288-720, 433 físicas)
   Los PDF están linearizados: PDF.js pide solo los bytes de la
   página visible (range requests), no el archivo completo.
   ============================================================ */
(function () {
  var TOMOS = {
    1: { url: 'plan/tomo1.pdf', offset: 1, min: 1, max: 301,
         drna: 'https://www.drna.pr.gov/wp-content/uploads/2024/04/PLAN-MITIGACION-TOMO-1-ARCHIVO-DIGITAL-19-ABR-2024.pdf' },
    2: { url: 'plan/tomo2.pdf', offset: -287, min: 288, max: 720,
         drna: 'https://www.drna.pr.gov/wp-content/uploads/2024/04/PLAN-MITIGACION-TOMO-2-ARCHIVO-DIGITAL-19-ABR-2024.pdf' }
  };

  var canvas = document.getElementById('pdfCanvas');
  var statusBox = document.getElementById('viewerStatus');
  var tomoSel = document.getElementById('tomoSel');
  var pageInput = document.getElementById('pageInput');
  var pageRange = document.getElementById('pageRange');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var dlLink = document.getElementById('dlLink');
  var drnaLink = document.getElementById('drnaLink');
  if (!canvas || typeof pdfjsLib === 'undefined') {
    if (statusBox) statusBox.textContent = 'No se pudo cargar el visor. Usa los enlaces "Abrir PDF completo" o el original del DRNA.';
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var params = new URLSearchParams(window.location.search);
  var tomo = params.get('tomo') === '2' ? 2 : 1;
  var pagina = parseInt(params.get('pagina'), 10);
  var docs = {};          // cache de documentos abiertos por tomo
  var renderToken = 0;    // evita renders fuera de orden

  function clamp(t, p) {
    var c = TOMOS[t];
    if (isNaN(p)) p = c.min;
    return Math.max(c.min, Math.min(c.max, p));
  }
  if (isNaN(pagina)) pagina = TOMOS[tomo].min;
  pagina = clamp(tomo, pagina);

  function setStatus(msg) {
    statusBox.textContent = msg || '';
    statusBox.style.display = msg ? 'block' : 'none';
  }

  function updateUI() {
    var c = TOMOS[tomo];
    tomoSel.value = String(tomo);
    pageInput.value = pagina;
    pageInput.min = c.min; pageInput.max = c.max;
    pageRange.textContent = 'de ' + c.min + '-' + c.max;
    dlLink.href = c.url;
    drnaLink.href = c.drna;
    btnPrev.disabled = pagina <= c.min;
    btnNext.disabled = pagina >= c.max;
    var url = 'visor.html?tomo=' + tomo + '&pagina=' + pagina;
    try { history.replaceState(null, '', url); } catch (e) {}
  }

  function getDoc(t) {
    if (!docs[t]) {
      docs[t] = pdfjsLib.getDocument({ url: TOMOS[t].url }).promise;
    }
    return docs[t];
  }

  function render() {
    var myToken = ++renderToken;
    var c = TOMOS[tomo];
    updateUI();
    setStatus('Cargando la página ' + pagina + '…');
    getDoc(tomo).then(function (pdf) {
      var fisica = pagina + c.offset;
      return pdf.getPage(fisica);
    }).then(function (page) {
      if (myToken !== renderToken) return;
      var stage = document.getElementById('viewerStage');
      var maxW = Math.min(stage.clientWidth - 2, 900);
      var base = page.getViewport({ scale: 1 });
      var scale = maxW / base.width;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var viewport = page.getViewport({ scale: scale * dpr });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = (viewport.width / dpr) + 'px';
      canvas.style.height = (viewport.height / dpr) + 'px';
      var ctx = canvas.getContext('2d');
      return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
        if (myToken === renderToken) setStatus('');
      });
    }).catch(function (err) {
      if (myToken !== renderToken) return;
      setStatus('No se pudo cargar esta página. Verifica tu conexión o abre el PDF completo.');
      if (window.console) console.error(err);
    });
  }

  function go(p) { pagina = clamp(tomo, p); render(); }

  tomoSel.addEventListener('change', function () {
    tomo = tomoSel.value === '2' ? 2 : 1;
    pagina = clamp(tomo, pagina);
    render();
  });
  btnPrev.addEventListener('click', function () { go(pagina - 1); });
  btnNext.addEventListener('click', function () { go(pagina + 1); });
  pageInput.addEventListener('change', function () { go(parseInt(pageInput.value, 10)); });
  document.addEventListener('keydown', function (e) {
    if (e.target === pageInput) return;
    if (e.key === 'ArrowLeft') go(pagina - 1);
    if (e.key === 'ArrowRight') go(pagina + 1);
  });
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 250);
  });

  render();
})();
