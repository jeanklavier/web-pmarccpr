/* ============================================================
   Datos estáticos de los 19 embalses de Puerto Rico monitoreados por
   el USGS (mismo site_no que usa sectores/embalses.js).

   Fuentes:
   - Coordenadas (lat/lng): USGS Water Services (waterservices.usgs.gov),
     servicio de metadata nwis/site, por cada site_no.
   - Nombre, municipio, operador, umbrales de Ajustes/Control: gráfica
     oficial de monitoreo diario de la AAA (acueductos.pr.gov).
   - Año de construcción, capacidad original y % de capacidad perdida
     por sedimentación: Primera Hora, "Conoce los principales embalses
     de Puerto Rico" (2022), contrastado con las páginas oficiales de la
     AAA y el DRNA.

   Estos valores son datos investigados y verificados - no modificar sin
   volver a confirmar contra las fuentes citadas.
   ============================================================ */

const EMBALSES_INFO = {
  "50059000": { nombre: "Carraízo", municipio: "Trujillo Alto", operador: "AAA", anio: 1954, capacidadOriginal: "7,600 millones de galones", porcientoPerdido: 53.7, lat: 18.32791197, lng: -66.01627919,
    alerta: {
      texto: "Actualmente bajo el Plan de Interrupciones Programadas de la AAA: interrupciones de 48 horas alternas para cerca de 183,000 abonados en San Juan, Trujillo Alto, Carolina, Canóvanas, Loíza, Gurabo y Juncos, en vigor desde el 7 de agosto de 2026 por los bajos niveles del embalse. Podría pasar a interrupciones de 72 horas si el nivel sigue bajando y no llueve.",
      fuente: "El Nuevo Día",
      url: "https://www.elnuevodia.com/noticias/gobierno/notas/a-partir-del-viernes-gobernadora-anuncia-plan-de-racionamiento-de-agua-por-bajos-niveles-en-carraizo/"
    }
  },
  "50045000": { nombre: "La Plata", municipio: "Comerío / Toa Alta", operador: "AAA", anio: 1974, capacidadOriginal: "10,700 millones de galones", porcientoPerdido: 28.5, lat: 18.34300093, lng: -66.23607079 },
  "50047550": { nombre: "Cidra", municipio: "Cidra", operador: "AAA", anio: null, capacidadOriginal: "1,700 millones de galones", porcientoPerdido: 31.9, lat: 18.19690159, lng: -66.14072219 },
  "50111210": { nombre: "Toa Vaca", municipio: "Villalba", operador: "AAA", anio: 1972, capacidadOriginal: "18,180 millones de galones", porcientoPerdido: 61, lat: 18.103642, lng: -66.489408 },
  "50076800": { nombre: "Río Blanco", municipio: "Naguabo", operador: "AAA", anio: 2010, capacidadOriginal: "1,450 millones de galones", porcientoPerdido: null, lat: 18.22389059, lng: -65.78142367 },
  "50071225": { nombre: "Fajardo", municipio: "Fajardo", operador: "AAA", anio: 2006, capacidadOriginal: "1,450 millones de galones", porcientoPerdido: null, lat: 18.2968966, lng: -65.6585783 },
  "50039995": { nombre: "Carite", municipio: "Guayama", operador: "AEE", anio: 1913, capacidadOriginal: "3,600 millones de galones", porcientoPerdido: 28.1, lat: 18.07524014, lng: -66.10683237 },
  "50093045": { nombre: "Patillas", municipio: "Patillas", operador: "AEE", anio: 1914, capacidadOriginal: "4,600 millones de galones", porcientoPerdido: 26.3, lat: 18.01774284, lng: -66.0184973 },
  "50032290": { nombre: "Guineo", municipio: "Villalba / Orocovis", operador: "AEE", anio: 1931, capacidadOriginal: "~608 millones de galones", porcientoPerdido: 23.3, lat: 18.15923943, lng: -66.526025 },
  "50032590": { nombre: "Matrullas", municipio: "Orocovis", operador: "AEE", anio: 1934, capacidadOriginal: "~980 millones de galones", porcientoPerdido: 23.3, lat: 18.21051212, lng: -66.48017167 },
  "50111300": { nombre: "Guayabal", municipio: "Juana Díaz", operador: "AEE", anio: 1913, capacidadOriginal: "~3,117 millones de galones", porcientoPerdido: 58.8, lat: 18.08581166, lng: -66.5016777 },
  "50020100": { nombre: "Garzas", municipio: "Adjuntas", operador: "AEE", anio: 1943, capacidadOriginal: "~1,532 millones de galones", porcientoPerdido: 17.9, lat: 18.133633, lng: -66.742961 },
  "50141500": { nombre: "Guayo", municipio: "Lares / Castañer", operador: "AEE", anio: 1956, capacidadOriginal: "~3,302 millones de galones", porcientoPerdido: 19.1, lat: 18.21065319, lng: -66.8351816 },
  "50125780": { nombre: "Luchetti", municipio: "Yauco", operador: "AEE", anio: null, capacidadOriginal: null, porcientoPerdido: 54.6, lat: 18.093928, lng: -66.865053 },
  "50128900": { nombre: "Loco", municipio: "Yauco", operador: "AEE", anio: 1951, capacidadOriginal: "~5,283 millones de galones", porcientoPerdido: 100, porcientoPerdidoNota: "Dato de un reportaje de Primera Hora de 2022; no verificado con una fuente más reciente.", lat: 18.04252458, lng: -66.88794028 },
  "50027100": { nombre: "Dos Bocas", municipio: "Utuado / Arecibo (límite)", operador: "AEE", anio: 1942, capacidadOriginal: "~9,906 millones de galones", porcientoPerdido: 65.3, lat: 18.33543948, lng: -66.6665906 },
  "50026140": { nombre: "Caonillas", municipio: "Utuado", operador: "AEE", anio: 1948, capacidadOriginal: "14,900 millones de galones", porcientoPerdido: 33.6, lat: 18.27654235, lng: -66.656418 },
  "50010800": { nombre: "Guajataca", municipio: "San Sebastián / Quebradillas / Isabela", operador: "AEE", anio: 1928, capacidadOriginal: "11,140 millones de galones", porcientoPerdido: 16.3, lat: 18.3983643, lng: -66.9226998 },
  "50113950": { nombre: "Cerrillos", municipio: "Ponce", operador: "DRNA", anio: 1992, capacidadOriginal: "15,600 millones de galones", porcientoPerdido: null, lat: 18.07703459, lng: -66.5754698 }
};

const EMBALSES_CON_UMBRALES = ["50059000","50045000","50047550","50111210","50076800","50071225"]; // solo estos 6 (operados por AAA) tienen NIVEL_AJUSTES_PIES/NIVEL_CONTROL_PIES definidos en sectores/embalses.js — reusar esas constantes, no redefinirlas

export { EMBALSES_INFO, EMBALSES_CON_UMBRALES };
