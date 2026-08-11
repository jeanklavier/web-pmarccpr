/* ============================================================
   Puente entre el módulo ES de datos estáticos (embalses-info-data.js,
   ya usado por embalses.html vía embalses-mapa.js) y embalses.js, que
   es un script clásico (IIFE con defer, no módulo). Expone
   EMBALSES_INFO en window para que embalses.js pueda leer lat/lng sin
   duplicar esos datos ni convertirse él mismo en módulo.
   ============================================================ */
import { EMBALSES_INFO } from './embalses-info-data.js';
window.EMBALSES_INFO = EMBALSES_INFO;
