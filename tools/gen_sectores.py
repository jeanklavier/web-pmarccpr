# -*- coding: utf-8 -*-
"""Generador de páginas de sector P-MARCC.
Renderiza sectores/<slug>.html desde content_a.py + content_b.py
usando la misma estructura/estilos que sectores/energia.html.
"""
import os, html
from content_a import SECTORES as SEC_A
from content_b import SECTORES as SEC_B

SECTORES = SEC_A + SEC_B
BASE = "https://planclimaticopr.com"
FECHA = "8 de agosto de 2026"
FECHA_ISO = "2026-08-08"

BRAND_SVG = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>'

AI_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>'

def head(s):
    title = f"{s['nombre']} | P-MARCC Puerto Rico"
    desc = s['metaDesc']
    url = f"{BASE}/sectores/{s['slug']}.html"
    return f'''<!DOCTYPE html>
<html lang="es-PR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/og-image.jpg">
<meta property="og:locale" content="es_PR">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="../styles.css">
<script>
  (function () {{
    try {{
      var stored = localStorage.getItem('pmarcc-theme');
      var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }} catch (e) {{}}
  }})();
</script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{s['nombre']} - P-MARCC explicado",
  "inLanguage": "es-PR",
  "description": "{desc}",
  "dateModified": "{FECHA_ISO}",
  "isBasedOn": "Borrador del Plan de Mitigación, Adaptación y Resiliencia al Cambio Climático en Puerto Rico (CEACC, 2024)"
}}
</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-65HEXGSRK0"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-65HEXGSRK0');
</script>
</head>'''

def nav():
    return f'''<body>

<a href="#main-content" class="skip-link">Saltar al contenido principal</a>

<header class="site-header" id="top">
  <nav class="navbar" aria-label="Principal">
    <a href="../index.html" class="brand">
      <span class="brand-icon" aria-hidden="true">{BRAND_SVG}</span>
      <span class="brand-text">P-MARCC <small>Puerto Rico</small></span>
    </a>
    <div class="nav-right">
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html#que-es">¿Qué es?</a></li>
        <li><a href="../index.html#datos">Los datos</a></li>
        <li><a href="../index.html#sectores">Sectores</a></li>
        <li><a href="../index.html#acciones">Plan de acción</a></li>
        <li><a href="../visor.html">El Plan (PDF)</a></li>
        <li><a href="../glosario.html">Glosario</a></li>
      </ul>
      <button id="themeToggle" aria-label="Cambiar a modo oscuro"><span class="tt-thumb"></span></button>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</header>
'''

def hero(s):
    badges = "\n      ".join(f'<span class="sector-badge">{b}</span>' for b in s['heroBadges'])
    return f'''
<main id="main-content">
<section class="sector-hero">
  <div class="container">
    <p class="breadcrumb" style="color:#bcdcd8; margin-top:0;">
      <a href="../index.html" style="color:#fff;">Inicio</a> ›
      <a href="../index.html#sectores" style="color:#fff;">Sectores</a> ›
      <span>{s['nombreCorto']}</span>
    </p>
    <div class="sector-hero-icon" aria-hidden="true"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--sun-400)">{s['icono']}</svg></div>
    <h1>{s['nombre']}</h1>
    <p>{s['heroDesc']}</p>
    <div class="sector-badges">
      {badges}
    </div>
  </div>
</section>

<nav class="sector-nav">
  <div class="container">
    <a href="#diagnostico">Diagnóstico</a>
    <a href="#acciones">Cursos de acción</a>
    <a href="#fuentes">Fuentes</a>
  </div>
</nav>
'''

def diagnostico(s):
    metas = "\n      ".join(
        f'<div class="meta-badge"><strong>{m[0]}</strong><span>{m[1]}</span></div>'
        for m in s['metaBadges'])
    paras = "\n        ".join(f"<p>{p}</p>" for p in s['diagParas'])
    ent = "\n      ".join(
        f'<span class="entity-chip {e[0]}" role="listitem"><span class="entity-mono" aria-hidden="true">{e[1]}</span>{e[2]}</span>'
        for e in s['entidades'])
    return f'''
<section class="section" id="diagnostico">
  <div class="container">
    <span class="tag">El diagnóstico</span>
    <h2>{s['diagTitulo']}</h2>

    <div class="meta-badges">
      {metas}
    </div>

    <div class="entity-badges" role="list" aria-label="Entidades clave de este sector">
      {ent}
    </div>

    <div class="diag-prose">
        {paras}
    </div>

    <div class="callout callout-risk">
      <p><strong>El riesgo si no se actúa:</strong> {s['riesgo']}</p>
    </div>
    <div class="callout callout-action">
      <p><strong>Lo que el Plan pone en marcha:</strong> {s['accion']}</p>
    </div>
  </div>
</section>
'''

def acciones(s):
    blocks = []
    for g in s['guias']:
        coas = "\n            ".join(f"<li>{c}</li>" for c in g['coas'])
        blocks.append(f'''
    <div class="coa-block">
      <div class="coa-block-head">
        <h3><span class="coa-letter">{g['letra']}</span>{g['titulo']}</h3>
      </div>
      <div class="coa-body">
        <div class="coa-objective">
          <h4>Cursos de acción bajo esta guía</h4>
          <ul class="coa-strategies">
            {coas}
          </ul>
        </div>
      </div>
    </div>''')
    ncoa = sum(len(g['coas']) for g in s['guias'])
    # Página impresa donde comienza cada tabla del Capítulo 7 (Tomo 2)
    TABLA_PAGS = {'7.1':333,'7.2':349,'7.3':395,'7.4':413,'7.5':433,'7.6':455,
                  '7.7':483,'7.8':517,'7.9':567,'7.10':587,'7.11':617,'7.12':651}
    pag_tabla = TABLA_PAGS.get(s['tabla'])
    tabla_link = (f'<a class="ver-plan" href="../visor.html?tomo=2&amp;pagina={pag_tabla}">Tabla {s["tabla"]}</a>'
                  if pag_tabla else f'Tabla {s["tabla"]}')
    return f'''
<section class="section section-alt" id="acciones">
  <div class="container">
    <span class="tag">El plan de acción</span>
    <h2>Los cursos de acción del sector</h2>
    <p class="coa-intro">La {tabla_link} del P-MARCC organiza este sector en {len(s['guias'])} guías legales (dictadas por el Artículo 9 de la Ley 33-2019) que se traducen en {ncoa} cursos de acción (COA). Aquí se resumen sus objetivos; cada COA incluye en el Plan sus estrategias, entidad responsable, costo estimado, fuente de financiamiento, plazo y métricas.</p>
{''.join(blocks)}
  </div>
</section>
'''

def _link_fuente(f):
    """Añade a cada cita un enlace al visor en la página impresa exacta."""
    import re
    m = re.search(r'Tomo (\d).*?pp?\. (\d+)', f)
    if not m:
        return f
    t, p = m.group(1), m.group(2)
    return (f + f' <a class="ver-plan" href="../visor.html?tomo={t}&amp;pagina={p}">'
                f'Ver esa página →</a>')

def fuentes(s):
    fts = "\n        ".join(f"<li>{_link_fuente(f)}</li>" for f in s['fuentes'])
    return f'''
<section class="section" id="fuentes">
  <div class="container">
    <div class="source-box" style="margin-top:0;">
      <h4>Fuentes de esta página</h4>
      <ul>
        {fts}
        <li>Ley 33-2019, Ley de Mitigación, Adaptación y Resiliencia al Cambio Climático de Puerto Rico.</li>
      </ul>
    </div>

    <div class="sector-pager">
      <a class="pager-link" href="{s['prevHref']}"><span>Sector anterior</span><strong>← {s['prevNombre']}</strong></a>
      <a class="pager-link next" href="{s['nextHref']}"><span>Siguiente sector</span><strong>{s['nextNombre']} →</strong></a>
    </div>
  </div>
</section>
</main>
'''

def footer():
    return f'''
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h4>Sobre esta guía</h4>
        <p>Este sitio resume, de forma visual y en lenguaje sencillo, el <em>Borrador del Plan de Mitigación, Adaptación y Resiliencia al Cambio Climático en Puerto Rico</em> (P-MARCC), versión revisada de abril de 2024, elaborado por el Comité de Expertos y Asesores sobre Cambio Climático (CEACC), Gobierno de Puerto Rico. No sustituye el documento oficial.</p>
      </div>
      <div>
        <h4>Fuente citada como</h4>
        <p>CEACC (2024). <em>Borrador del Plan de Mitigación, Adaptación y Resiliencia al Cambio Climático en Puerto Rico.</em> Gobierno de Puerto Rico. Tomos 1 y 2.</p>
        <p>Documento oficial (DRNA): <a href="https://www.drna.pr.gov/wp-content/uploads/2024/04/PLAN-MITIGACION-TOMO-1-ARCHIVO-DIGITAL-19-ABR-2024.pdf" target="_blank" rel="noopener" style="color:var(--teal-400);">Tomo 1 (PDF)</a> · <a href="https://www.drna.pr.gov/wp-content/uploads/2024/04/PLAN-MITIGACION-TOMO-2-ARCHIVO-DIGITAL-19-ABR-2024.pdf" target="_blank" rel="noopener" style="color:var(--teal-400);">Tomo 2 (PDF)</a></p>
        <p><a href="../glosario.html" style="color:var(--teal-400);">Glosario de términos y siglas →</a></p>
      </div>
    </div>
    <div class="ai-disclosure">
      {AI_SVG}
      <p><strong>Sobre el contenido de este sitio:</strong> los textos, resúmenes y organización visual de esta página fueron elaborados con la ayuda de inteligencia artificial a partir del borrador oficial del P-MARCC. Aunque revisamos la exactitud de los datos, pueden existir errores de interpretación o resumen. Si encuentras algo incorrecto, <button type="button" class="footer-report-link" onclick="document.getElementById('reportFab').click()">repórtalo aquí</button>; toma menos de un minuto.</p>
    </div>
    <p class="footer-note">Hecho para ayudar al ciudadano común a entender el Plan. No es un sitio oficial ni está afiliado al CEACC ni al Gobierno de Puerto Rico. Última actualización: <time datetime="{FECHA_ISO}">{FECHA}</time>.</p>
  </div>
</footer>

<script src="../nav.js" defer></script>
<script src="../theme.js" defer></script>
<script src="../correction.js" defer></script>
</body>
</html>
'''

ORDER = ['energia','infraestructura','transporte','residuos','salud','agricultura',
         'agua','marinos','forestacion','turismo','educacion','justicia']
NOMBRES = {
 'energia':'Energía','infraestructura':'Infraestructura','transporte':'Transporte y movilidad',
 'residuos':'Residuos sólidos','salud':'Salud y bienestar','agricultura':'Agricultura y ganadería',
 'agua':'Agua','marinos':'Sistemas marinos y costeros','forestacion':'Forestación y ecosistemas terrestres',
 'turismo':'Turismo','educacion':'Educación','justicia':'Justicia climática'}

def wire_pager(s):
    i = ORDER.index(s['slug'])
    prev_slug = ORDER[i-1] if i > 0 else None
    next_slug = ORDER[i+1] if i < len(ORDER)-1 else None
    if prev_slug:
        s['prevHref'] = f"{prev_slug}.html"; s['prevNombre'] = NOMBRES[prev_slug]
    else:
        s['prevHref'] = "../index.html#sectores"; s['prevNombre'] = "Todos los sectores"
    if next_slug:
        s['nextHref'] = f"{next_slug}.html"; s['nextNombre'] = NOMBRES[next_slug]
    else:
        s['nextHref'] = "../index.html#sectores"; s['nextNombre'] = "Volver a todos los sectores"

def render(s):
    wire_pager(s)
    return (head(s) + nav() + hero(s) + diagnostico(s) + acciones(s)
            + fuentes(s) + footer())

if __name__ == '__main__':
    outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sectores')
    os.makedirs(outdir, exist_ok=True)
    for s in SECTORES:
        path = os.path.join(outdir, s['slug'] + '.html')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(render(s))
        print('OK', path)
