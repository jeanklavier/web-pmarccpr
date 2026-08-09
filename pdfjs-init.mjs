/* pdf.js 4.0+ ships only as ES modules (no more classic pdf.min.js UMD
   build), so it can't be loaded with a plain <script src> the way
   Chart.js is. This local module (served from 'self', so it needs no
   CSP change) imports the library and re-exposes it as window.pdfjsLib,
   which is what visor.js expects. The actual library bytes are
   integrity-checked via the <link rel="modulepreload" integrity="..."> tag
   in visor.html - this import resolves from that already-verified
   entry in the module map instead of fetching again. */
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.min.mjs';
window.pdfjsLib = pdfjsLib;
