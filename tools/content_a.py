# -*- coding: utf-8 -*-
"""Contenido por sector (parte A) — fielmente resumido del P-MARCC:
Tomo 1 Cap. 4 (diagnóstico) y Tomo 2 Cap. 7 (tablas de COA)."""

I_BUILDING = '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>'
I_CAR = '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>'
I_TRASH = '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>'
I_HEART = '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>'
I_SPROUT = '<path d="M7 20h10"/><path d="M12 20v-9"/><path d="M12 11c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5Z"/>'
I_DROP = '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>'

SECTORES = [

# ============================================================ INFRAESTRUCTURA
{
 'slug':'infraestructura','nombre':'Infraestructura','nombreCorto':'Infraestructura',
 'icono':I_BUILDING,'tabla':'7.2',
 'metaDesc':'Diagnóstico y cursos de acción del sector Infraestructuras en el P-MARCC: construcción verde, resiliencia de carreteras, aeropuertos y red eléctrica ante el cambio climático.',
 'heroDesc':'Carreteras, puertos, aeropuertos, edificios y la red eléctrica: la infraestructura de Puerto Rico se construyó cerca de la costa y quedó expuesta. El huracán María evidenció su fragilidad; el aumento del nivel del mar la pondrá a prueba de forma permanente.',
 'heroBadges':['12 guías legales (A–L)','19 cursos de acción (COA)','Cap. 4.2 y 7.2 del P-MARCC'],
 'diagTitulo':'Una infraestructura extensa, costera y difícil de mantener',
 'metaBadges':[
   ('1.3','vueltas al planeta Tierra: el largo total de los conductores de la red de transmisión y distribución eléctrica'),
   ('0.5 t','de cemento per cápita usó PR en 2006 — el promedio mundial es 0.3 t'),
   ('2050','año para el cual la NOAA proyecta que el mar dificultará el acceso a la central de Palo Seco (Cataño)'),
   ('19','cursos de acción para este sector'),
 ],
 'entidades':[
   ('e-jp','JP','Junta de Planificación'),
   ('e-ddec','OG','OGPe — Oficina de Gerencia de Permisos'),
   ('e-doe','DV','Departamento de la Vivienda'),
   ('e-luma','LU','LUMA Energy'),
   ('e-aee','AP','Autoridad de los Puertos'),
   ('e-genera','CT','Compañía de Turismo'),
 ],
 'diagParas':[
   'El cambio climático afectará de forma progresiva a todo el país con tormentas y huracanes más frecuentes e intensos, y golpeará especialmente a las comunidades costeras, sus vías de acceso, la infraestructura eléctrica y sanitaria, y el disfrute de las costas según sube el nivel del mar.',
   'Las centrales termoeléctricas se ubicaron cerca de la costa para intercambiar calor con el agua del mar — y ese mismo mar ahora amenaza sus cimientos. El municipio de Cataño ilustra el escenario: según las proyecciones de la NOAA, para el 2050 será difícil acceder a la central de Palo Seco por la entrada del mar. El Aeropuerto Internacional Luis Muñoz Marín ya registra eventos de inundación prematura, al punto de que expertos plantean la posible mudanza de su actividad aérea al aeropuerto de Aguadilla.',
   'El huracán María evidenció la fragilidad del sistema vial —sobre todo las vías costeras y en zonas inundables— y derribó una red de transmisión y distribución cuyos conductores, puestos en línea, darían 1.3 vueltas al planeta. Gran parte de esa red atraviesa topografía pronunciada, lo que hace su mantenimiento extraordinariamente difícil.',
   'La construcción misma es parte del problema de emisiones: la vulnerabilidad climática obliga a construir y reconstruir tras cada evento, y la industria del cemento es intensiva en carbono. En 2006 Puerto Rico usó 1.9 millones de toneladas de cemento (0.5 toneladas per cápita, frente a 0.3 del promedio mundial), con repuntes tras Irma, María y Fiona.',
 ],
 'riesgo':'infraestructura crítica (centrales, plantas de tratamiento, aeropuertos, carreteras costeras) puede quedar inaccesible o inoperante por la entrada del mar, repitiendo tras cada huracán un ciclo costoso de destrucción y reconstrucción.',
 'accion':'códigos de construcción verde y resiliente (LEED, ASHRAE, Green Code), eficiencia energética en viviendas y edificios públicos, permisos verdes ágiles, infraestructura verde para bajar el calor urbano, y medidas urgentes para el aeropuerto LMM y los aeropuertos regionales.',
 'guias':[
  {'letra':'A','titulo':'Construcción certificada en estándares verdes','coas':[
    'COA A.1 — Impulsar y adoptar sistemas de certificación (LEED, PEER, ASHRAE, Código Internacional de Conservación de Energía) y secciones de códigos de construcción verde como parte del Código de Construcción de Puerto Rico. Incluye requerir certificación LEED Silver a edificios de 30,000 pies cuadrados o más.']},
  {'letra':'B','titulo':'Eficiencia energética y de agua en estructuras nuevas y existentes','coas':[
    'COA B.1 — Programas para viviendas que viabilicen la compra e instalación de equipos de alta eficiencia energética y de agua.',
    'COA B.2 — Programas equivalentes para edificios.',
    'COA B.3 — Programas de mejoras de eficiencia energética desarrollados con y para las agencias del gobierno.']},
  {'letra':'C','titulo':'Evaluar la vulnerabilidad climática de los sistemas principales','coas':[
    'COA C.1 — Estrategias que mejoren la sostenibilidad y resiliencia de los sistemas principales de infraestructura ante eventos ambientales catastróficos.',
    'COA C.2 — Planes que mejoren el acceso a la información sobre esos sistemas para fortalecer su resiliencia.']},
  {'letra':'D','titulo':'Carreteras con tecnologías ecoamigables','coas':[
    'COA D.1 — Implantar en la construcción y conservación de carreteras tecnologías ecoamigables aprobadas por las políticas públicas estatales y federales.']},
  {'letra':'E','titulo':'Permisos Verdes (Ley 161-2009)','coas':[
    'COA E.1 — Transformar el procedimiento del Permiso Verde de Construcción y el Permiso de Uso Verde de la OGPe para facilitar su aprobación.',
    'COA E.2 — Explorar otras opciones para agilizar la certificación de edificios sostenibles.']},
  {'letra':'F','titulo':'Áreas residenciales autosuficientes en energía','coas':[
    'COA F.1 — Promover el diseño urbano a nivel de ciudad y comunidad para reducir el consumo energético, considerando los alcances del aumento del nivel del mar.']},
  {'letra':'G','titulo':'Energía renovable sobre superficies ya construidas','coas':[
    'COA G.1 — Políticas públicas que expandan el acceso a superficies construidas (techos, estacionamientos, espacios urbanizados) para proyectos de energía renovable o alternativa.']},
  {'letra':'H','titulo':'Profesionales del diseño y la construcción','coas':[
    'COA H.1 — Educar a los profesionales de la industria de la construcción en la descarbonización del ambiente construido.',
    'COA H.2 — Establecer una política pública de desarrollo y construcción sostenible, resiliente y descarbonizada.']},
  {'letra':'I','titulo':'Infraestructura verde contra el calor urbano','coas':[
    'COA I.1 — Aumentar la permeabilidad de pavimentos y techos con infraestructura verde para reducir las temperaturas urbanas.']},
  {'letra':'J','titulo':'Instalaciones turísticas sostenibles','coas':[
    'COA J.1 — Usar las guías existentes de la Compañía de Turismo para el diseño de instalaciones ecoturísticas y de turismo sostenible.']},
  {'letra':'K','titulo':'Financiamiento de iniciativas verdes','coas':[
    'COA K.1 — Estrategias y políticas públicas que viabilicen económicamente iniciativas sostenibles y de descarbonización.']},
  {'letra':'L','titulo':'Transporte aéreo resiliente','coas':[
    'COA L.1 — Implantar con urgencia medidas de corto plazo frente al aumento del nivel del mar en el Aeropuerto Internacional Luis Muñoz Marín (LMM).',
    'COA L.2 — Comité interagencial, presidido por la Autoridad de los Puertos, para evaluar alternativas al servicio aéreo del LMM.',
    'COA L.3 — Mejorar y ampliar los aeropuertos regionales para dar redundancia al transporte aéreo.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.2 "Infraestructuras" (diagnóstico), pp. 81–92.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.2, Tabla 7.2 (COA A–L), pp. 349 y ss.',
 ],
},

# ============================================================ TRANSPORTE
{
 'slug':'transporte','nombre':'Transporte y movilidad','nombreCorto':'Transporte',
 'icono':I_CAR,'tabla':'7.3',
 'metaDesc':'Diagnóstico y cursos de acción del sector Transporte y movilidad en el P-MARCC: transporte colectivo, vehículos eléctricos, aeropuertos y puertos resilientes.',
 'heroDesc':'El transporte es el segundo mayor emisor de gases de efecto invernadero de Puerto Rico: 26% del total en 2021, casi todo por la gasolina que quemamos en la carretera. Y como archipiélago, dependemos de puertos y aeropuertos vulnerables al mar que sube.',
 'heroBadges':['26% de las emisiones de GEI (2021)','7 guías legales (A–G)','18 cursos de acción (COA)'],
 'diagTitulo':'El segundo emisor del país — y la puerta de entrada de casi todo lo que consumimos',
 'metaBadges':[
   ('26%','del total de emisiones de GEI de PR en 2021 proviene del transporte'),
   ('2.º','mayor sector emisor, después de la generación eléctrica'),
   ('3','modos que la política federal exige atender de forma integrada: terrestre, aéreo y marítimo'),
   ('18','cursos de acción para este sector'),
 ],
 'entidades':[
   ('e-doe','DT','DTOP — Transportación y Obras Públicas'),
   ('e-aee','AP','Autoridad de los Puertos'),
   ('e-jp','US','USDOT (federal)'),
   ('e-luma','LU','LUMA Energy'),
 ],
 'diagParas':[
   'El inventario de emisiones más reciente (2023) señala al transporte como el segundo emisor principal de Puerto Rico, con el 26% del total de emisiones al 2021, por la combustión de gasolina de los vehículos en las carreteras.',
   'La Ley 33-2019 solo enfatiza la transportación terrestre, pero desde el 2021 la política pública federal (USDOT) exige tratar el transporte como un sistema multimodal integrado: terrestre, aéreo y marítimo. El Plan plantea que Puerto Rico deberá enmendar la Ley 33-2019 para ampliar su alcance a esos otros modos.',
   'Ese enfoque importa porque somos un conjunto de islas: el intercambio comercial y la movilidad de personas dependen de puertos y aeropuertos expuestos a inundaciones costeras y huracanes. El Aeropuerto Internacional Luis Muñoz Marín ya experimenta inundaciones prematuras en algunas instalaciones, y la cadena de suministros del país depende de que estas instalaciones resistan y se recuperen rápido tras cada evento.',
 ],
 'riesgo':'un huracán intenso o el avance del mar puede interrumpir a la vez las carreteras costeras, el aeropuerto principal y los puertos — es decir, la cadena de suministros completa de un país que importa la mayoría de lo que consume.',
 'accion':'expandir y renovar el transporte colectivo con vehículos de bajas emisiones, crédito contributivo para vehículos híbridos y eléctricos, red de infraestructura de recarga, microrredes eléctricas en aeropuertos y puertos, y medidas urgentes contra el aumento del nivel del mar en el LMM.',
 'guias':[
  {'letra':'A','titulo':'Transporte colectivo para reducir emisiones y vulnerabilidad','coas':[
    'COA A.1 — Desarrollar y expandir los sistemas de transportación colectiva.',
    'COA A.2 — Establecer nuevos sistemas de transportación colectiva.',
    'COA A.3 — Renovar la flota colectiva con vehículos de bajas emisiones o eléctricos.']},
  {'letra':'B','titulo':'Menos auto privado, más transporte público','coas':[
    'COA B.1 — Incentivar el uso del transporte colectivo mediante programas de descuentos.',
    'COA B.2 — Cargo adicional en la tarifa de estacionamientos públicos y privados en centros urbanos y corredores comerciales.']},
  {'letra':'C','titulo':'Eficiencia y diversificación energética vehicular','coas':[
    'COA C.1 — Crear un crédito contributivo para la adquisición de medios de transporte híbridos, eléctricos o de cero emisiones.']},
  {'letra':'D','titulo':'Estacionamiento preferencial para vehículos limpios','coas':[
    'COA D.1 — Crear espacios de estacionamiento para vehículos híbridos o eléctricos.']},
  {'letra':'E','titulo':'Red eléctrica lista para el vehículo eléctrico','coas':[
    'COA E.1 — Construir infraestructura de recarga para los vehículos eléctricos.',
    'COA E.2 — Programa de desarrollo y capacitación de la fuerza laboral del sector de vehículos eléctricos.']},
  {'letra':'F','titulo':'Tecnologías alternas para el transporte público','coas':[
    'COA F.1 — Alinear la evaluación de otras tecnologías no dependientes de combustibles fósiles con la política pública federal.']},
  {'letra':'G','titulo':'Aeropuertos y puertos resilientes','coas':[
    'COA G.1 — Medidas urgentes de corto plazo frente al aumento del nivel del mar en el Aeropuerto Internacional Luis Muñoz Marín.',
    'COA G.2 — Comité interagencial, presidido por la Autoridad de los Puertos, para evaluar alternativas al servicio aéreo del LMM.',
    'COA G.3 — Mejoras y más servicios en aeropuertos regionales para lograr redundancia.',
    'COA G.4 — Desarrollar microrredes eléctricas en los aeropuertos.',
    'COA G.5 — Instalaciones e infraestructura para combustible sostenible de aviación.',
    'COA G.6 — Solicitar la aplicación a PR del programa federal de autopista marítima M-2.',
    'COA G.7 — Microrredes eléctricas en los puertos marítimos públicos.',
    'COA G.8 — Mitigar los efectos de eventos naturales y del alza del nivel del mar en los puertos marítimos públicos.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.3 "Transportes y movilidad" (diagnóstico), pp. 93–109.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.3, Tabla 7.3 (COA A–G), pp. 395 y ss.',
 ],
},

# ============================================================ RESIDUOS
{
 'slug':'residuos','nombre':'Residuos sólidos','nombreCorto':'Residuos',
 'icono':I_TRASH,'tabla':'7.4',
 'metaDesc':'Diagnóstico y cursos de acción del sector Residuos sólidos en el P-MARCC: rellenos sanitarios al límite, reciclaje estancado y la estrategia de desperdicio cero.',
 'heroDesc':'Cada día, Puerto Rico deposita más de 9,000 toneladas de residuos en rellenos sanitarios que se acercan al final de su vida útil. La tasa de reciclaje sigue lejos de las metas de ley, y los residuos generan el 8% de las emisiones del país.',
 'heroBadges':['9,078 toneladas diarias a rellenos','8% de las emisiones de GEI (2021)','6 cursos de acción (COA)'],
 'diagTitulo':'Rellenos al límite y una tasa de reciclaje estancada',
 'metaBadges':[
   ('9,078','toneladas de residuos se disponen a diario en los rellenos sanitarios'),
   ('14.58%','fue la tasa de desvío/reciclaje en 2018 — la meta de ley era 35%'),
   ('8%','de las emisiones de GEI de PR (2021) provienen de los residuos'),
   ('3.4%','de las emisiones globales de GEI provienen del ciclo de vida de los plásticos'),
 ],
 'entidades':[
   ('e-drna','DR','DRNA — Recursos Naturales y Ambientales'),
   ('e-jp','EPA','EPA (federal)'),
   ('e-ceacc','MU','Municipios'),
 ],
 'diagParas':[
   'El Plan mira los residuos con lente de ciclo de vida: cada producto genera emisiones desde la extracción de materia prima hasta su disposición final, pasando por manufactura, transporte y uso. Un producto fabricado en Asia puede recorrer más de 25,000 millas en barco y camión —quemando combustibles fósiles— antes de llegar a San Juan. Los plásticos, por sí solos, aportan el 3.4% de las emisiones globales de GEI a lo largo de su ciclo de vida.',
   'En Puerto Rico la disposición diaria total ronda las 9,078 toneladas en rellenos sanitarios, varios de ellos con pocos años de vida útil restante y algunos bajo órdenes de cierre. La tasa de desvío/reciclaje fue de 14.58% en 2018, muy por debajo de la meta de 35% que estableció la ley.',
   'Las estrategias disponibles —reducción, reúso, reciclaje, composta para material orgánico y manejo especial de gomas, aceites y baterías— existen, pero requieren infraestructura, educación y fiscalización consistentes. El Plan prioriza la estrategia de desperdicio cero.',
 ],
 'riesgo':'quedarnos sin capacidad de disposición: los rellenos existentes se agotan, y cada tonelada enterrada genera metano —un gas de efecto invernadero mucho más potente que el CO2— además de lixiviados que amenazan las aguas subterráneas.',
 'accion':'un sistema de manejo sustentable de materiales, cumplimiento ambiental en la disposición final, prevención de contaminación, educación comunitaria multisectorial y el cese definitivo de la quema de aceite usado.',
 'guias':[
  {'letra':'A','titulo':'Desperdicio cero como prioridad','coas':[
    'COA A.1 — Desarrollar e implantar un sistema de manejo sustentable de materiales y residuos.']},
  {'letra':'B','titulo':'Menos residuos a los vertederos','coas':[
    'COA B.1 — Cumplimiento ambiental en el manejo y la disposición final de los residuos sólidos.']},
  {'letra':'C','titulo':'Alternativas a la combustión de residuos','coas':[
    'COA C.1 — Estrategias de prevención de contaminación que promuevan productos alternos no contaminantes.']},
  {'letra':'D','titulo':'Mejores prácticas de manejo','coas':[
    'COA D.1 — Prevenir la contaminación por manejo y disposición inadecuada de los residuos sólidos.']},
  {'letra':'E','titulo':'Educación comunitaria (con el DRNA)','coas':[
    'COA E.1 — Educación comprensiva multisectorial sobre el manejo sostenible de los residuos sólidos.']},
  {'letra':'F','titulo':'Fin de la quema de aceite usado','coas':[
    'COA F.1 — Dar seguimiento al cumplimiento de la Ley 33-2019, Art. 9(d)(6), para asegurar el cese de la quema del aceite usado.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.4 "Residuos sólidos" (diagnóstico), pp. 110–119.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.4, Tabla 7.4 (COA A–F), pp. 413 y ss.',
 ],
},

# ============================================================ SALUD
{
 'slug':'salud','nombre':'Salud y bienestar','nombreCorto':'Salud',
 'icono':I_HEART,'tabla':'7.5',
 'metaDesc':'Diagnóstico y cursos de acción del sector Salud y bienestar en el P-MARCC: calor extremo, enfermedades por vectores, salud mental y protección de poblaciones vulnerables.',
 'heroDesc':'El cambio climático es una amenaza directa a la salud pública: calor extremo, dengue y otras enfermedades por vectores, brotes tras huracanes y un impacto profundo en la salud mental. Y no golpea a todos por igual — las comunidades vulnerables sufren primero y más fuerte.',
 'heroBadges':['4 guías legales (A–D)','7 cursos de acción (COA)','Modelo BRACE de los CDC'],
 'diagTitulo':'Una amenaza a la salud física, mental y comunitaria',
 'metaBadges':[
   ('121','casos de leptospirosis reportados en apenas semanas tras el huracán María (oct. 2017)'),
   ('4','muertes confirmadas por leptospirosis en ese brote'),
   ('5','pasos del modelo BRACE de los CDC para construir resiliencia en salud'),
   ('7','cursos de acción para este sector'),
 ],
 'entidades':[
   ('e-genera','DS','Departamento de Salud'),
   ('e-drna','DR','DRNA'),
   ('e-jp','CDC','CDC (federal)'),
   ('e-ceacc','MU','Municipios'),
 ],
 'diagParas':[
   'El cambio climático afecta la salud física, mental y espiritual: aumenta la frecuencia e intensidad de eventos extremos y se relaciona con más enfermedades infecciosas, alérgenos en el aire y enfermedades transmitidas por vectores como el dengue y el chikunguña, con impacto particular en comunidades costeras tropicales.',
   'Los impulsores del clima (más calor, precipitación extrema, aumento del nivel del mar) producen resultados de salud a través de rutas de exposición: calor extremo, mala calidad de aire y agua, inseguridad alimentaria, cambios en agentes infecciosos y desplazamiento poblacional. Tras el huracán María, los casos de leptospirosis empeoraron: para octubre de 2017 se habían reportado 121 casos y 4 muertes confirmadas.',
   'La ciencia de salud pública ya no solo identifica enfermedades: se enfoca en las desigualdades — el proceso salud-enfermedad se da de manera desigual entre poblaciones, y la pobreza y la falta de acceso a recursos exacerban la vulnerabilidad. El Plan adopta como referencia el modelo BRACE de los CDC (Building Resilience Against Climate Effects), de cinco pasos, con un enfoque de justicia, equidad, diversidad e inclusión.',
 ],
 'riesgo':'más muertes y enfermedad evitables por olas de calor, brotes tras huracanes e inundaciones, y sistemas de salud interrumpidos justo cuando más se necesitan — con las comunidades desatendidas pagando el precio más alto.',
 'accion':'una oficina especializada en cambio climático y salud (Depto. de Salud + DRNA), vigilancia de indicadores ambientales, planes de concienciación ciudadana, protección específica contra temperaturas extremas para poblaciones desatendidas y colaboraciones intersectoriales.',
 'guias':[
  {'letra':'A','titulo':'Identificar y prevenir los efectos del clima sobre la salud','coas':[
    'COA A.1 — Crear una oficina especializada en cambio climático adscrita al Departamento de Salud, en conjunto con el DRNA.',
    'COA A.2 — Plan de concienciación a la ciudadanía sobre los riesgos de salud de los eventos climáticos.',
    'COA A.3 — Monitorear y evaluar indicadores ambientales relacionados con el cambio climático y sus efectos en la salud pública.',
    'COA A.4 — Medidas para proteger a la población desatendida, desfavorecida y desventajada de las temperaturas extremas y olas de calor.']},
  {'letra':'B','titulo':'Concienciar sobre los riesgos a la salud','coas':[
    'COA B.1 — Plan para concienciar a la ciudadanía sobre los riesgos de salud derivados del cambio climático.']},
  {'letra':'C','titulo':'Proteger a los grupos más vulnerables','coas':[
    'COA C.1 — Fortalecer, desde la oficina de cambio climático y salud, la capacidad de adaptación de los grupos identificados como vulnerables.']},
  {'letra':'D','titulo':'Datos demográficos para focalizar la protección','coas':[
    'COA D.1 — Colaboraciones intersectoriales, junto a los municipios, para atender los eventos climáticos y su efecto en la salud pública y el bienestar.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.5 "Salud y bienestar" (diagnóstico), pp. 120–132.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.5, Tabla 7.5 (COA A–D), pp. 433 y ss.',
 ],
},

# ============================================================ AGRICULTURA
{
 'slug':'agricultura','nombre':'Agricultura y ganadería','nombreCorto':'Agricultura',
 'icono':I_SPROUT,'tabla':'7.6',
 'metaDesc':'Diagnóstico y cursos de acción del sector Agricultura y ganadería en el P-MARCC: seguridad alimentaria, prácticas sostenibles, riego eficiente y protección de tierras agrícolas.',
 'heroDesc':'La producción local satisface apenas cerca del 15% del consumo de comida de Puerto Rico. El cambio climático amenaza con reducir aún más los rendimientos — pero la agricultura también puede ser parte de la solución, capturando carbono en los suelos.',
 'heroBadges':['~15% del consumo de comida es local','3 guías legales (A–C)','10 cursos de acción (COA)'],
 'diagTitulo':'Seguridad alimentaria en riesgo — y una oportunidad de mitigación',
 'metaBadges':[
   ('~15%','del consumo de comida se satisface con producción local (18% del consumo calórico)'),
   ('0.6%','del producto interno bruto aporta el sector agrícola'),
   ('2.7%','de las emisiones de GEI del país (0.95 Mt CO2e) provienen de la agricultura'),
   ('10–25%','de reducción potencial de rendimientos por el cambio climático, según cultivo y lugar'),
 ],
 'entidades':[
   ('e-genera','DA','Departamento de Agricultura'),
   ('e-upr','UPR','Universidad de Puerto Rico'),
   ('e-jp','USDA','USDA (federal)'),
   ('e-drna','DR','DRNA'),
 ],
 'diagParas':[
   'Las tendencias sugieren que el sector agrícola de Puerto Rico es muy vulnerable a las perturbaciones del clima y a las políticas institucionales locales; el cambio climático es un agravante. Aunque el sector aporta solo el 2.7% de las emisiones del país (0.95 millones de toneladas de CO2e), puede contribuir a mitigarlas reduciendo emisiones de animales y estiércol, y con prácticas que reduzcan la erosión y devuelvan carbono al suelo.',
   'Los mejores estimados sugieren que la producción local satisface cerca del 15% del consumo de comida y el 18% del consumo calórico; en hortalizas y algunas frutas la dependencia de importaciones supera el 80%. El sector es frágil: aporta aproximadamente 0.6% al producto interno bruto.',
   'La extrapolación de estudios científicos indica que, sin acción para mejorar la adaptación, los rendimientos de cultivos y animales se reducirán — el cambio climático tiene potencial de recortar rendimientos entre 10% y 25% según el cultivo y la localización. Eso pondría en más riesgo la seguridad y soberanía alimentaria del país, que ya depende de puertos vulnerables para casi toda su comida.',
 ],
 'riesgo':'una isla que produce ~15% de su comida y cuyos puertos pueden quedar interrumpidos por huracanes enfrenta un doble filo: menos cosecha local por el clima y una cadena de importación frágil.',
 'accion':'mejores prácticas de manejo de nutrientes, cultivos, animales y estiércol; pesca y acuicultura sostenibles; conservación de suelos, agua y recursos genéticos; riego modernizado; maquinaria eficiente; y protección firme de las tierras de valor agrícola.',
 'guias':[
  {'letra':'A','titulo':'Producción y tecnología: más eficiencia, menos emisiones','coas':[
    'COA A.1 — Buenas prácticas de manejo para mejorar la eficiencia del uso de nutrientes y enmiendas en las cosechas.',
    'COA A.2 — Mejores prácticas agronómicas para el manejo de cultivos.',
    'COA A.3 — Mejores prácticas para el manejo de animales.',
    'COA A.4 — Mejores prácticas agronómicas para el manejo de estiércol.',
    'COA A.5 — Prácticas de pesca comercial y acuicultura sostenible para aumentar la seguridad alimentaria.']},
  {'letra':'B','titulo':'Conservación y manejo de recursos','coas':[
    'COA B.1 — Programa para preservar y mejorar los recursos genéticos de microorganismos, plantas y animales.',
    'COA B.2 — Mejores prácticas para conservar suelos, agua y biodiversidad, y aumentar el secuestro de carbono en los suelos.']},
  {'letra':'C','titulo':'Infraestructura agrícola resiliente','coas':[
    'COA C.1 — Modernizar y reparar los sistemas de riego y drenaje, y crear los necesarios.',
    'COA C.2 — Propiciar e incentivar maquinaria y equipo agrícola moderno y energéticamente eficiente.',
    'COA C.3 — Preservar las tierras designadas para uso agrícola, evitando su transformación a usos incompatibles, y facilitar el acceso a ellas.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.6 "Agricultura y ganadería" (diagnóstico), pp. 133–151.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.6, Tabla 7.6 (COA A–C), pp. 455 y ss.',
 ],
},

# ============================================================ AGUA
{
 'slug':'agua','nombre':'Agua','nombreCorto':'Agua',
 'icono':I_DROP,'tabla':'7.7',
 'metaDesc':'Diagnóstico y cursos de acción del sector Agua en el P-MARCC: sequías, pérdida del 60% en distribución, embalses sedimentados y protección de acuíferos.',
 'heroDesc':'Puerto Rico está entre las jurisdicciones con menos agua dulce disponible por persona en América Latina — y pierde alrededor del 60% del agua potable en su sistema de distribución. Las sequías serán más frecuentes; el mar que sube saliniza los acuíferos.',
 'heroBadges':['60% de pérdida en distribución (AAA)','10 guías legales (A–J)','17 cursos de acción (COA)'],
 'diagTitulo':'Un recurso vital bajo presión por todos los frentes',
 'metaBadges':[
   ('60%','del agua se pierde en el sistema de distribución, según admite la propia AAA'),
   ('135/182','posición de PR en disponibilidad de agua dulce por persona (UNESCO)'),
   ('2.ª','jurisdicción de América Latina con menos agua dulce disponible por persona (Banco Mundial)'),
   ('144M','árboles destruyó el huracán María, agravando la sedimentación de los embalses'),
 ],
 'entidades':[
   ('e-aaa','AAA','Autoridad de Acueductos y Alcantarillados'),
   ('e-drna','DR','DRNA'),
   ('e-jp','JP','Junta de Planificación'),
 ],
 'diagParas':[
   'Puerto Rico ocupa la posición 135 de 182 jurisdicciones en disponibilidad de agua dulce por persona (UNESCO) y es la segunda de América Latina con menos disponibilidad (Banco Mundial). La capacidad de la mayoría de los embalses está seriamente comprometida por la sedimentación — una situación que empeoró cuando el huracán María destruyó 144 millones de árboles.',
   'A los embalses sedimentados se suman la intrusión de agua salada en los acuíferos (que aumentará según suba el nivel del mar), las sequías recurrentes —la más extrema entre 2015 y 2016 obligó a racionamientos—, la contaminación de cuerpos de agua dulce y la pérdida por salideros: la propia AAA admite perder alrededor del 60% del agua en su sistema de distribución.',
   'El Plan conecta el agua con la justicia climática: el cambio climático afecta de manera desproporcionada a las comunidades más pobres, que a menudo tienen acceso limitado a fuentes seguras de agua. Garantizar acceso equitativo es parte de la gestión sostenible del recurso.',
 ],
 'riesgo':'sequías más severas con embalses que almacenan cada vez menos, acuíferos salinizados por el mar y un sistema que pierde más de la mitad del agua que produce — el racionamiento dejaría de ser excepcional.',
 'accion':'proteger cuerpos de agua y acuíferos, conservación en hogares e industrias, captación de agua de lluvia en construcciones nuevas y existentes, maximizar el reúso de aguas tratadas de la AAA, una oficina dedicada a detectar y reparar salideros, y optimizar el riego agrícola.',
 'guias':[
  {'letra':'A','titulo':'Recuperar y conservar aguas superficiales y subterráneas','coas':[
    'COA A.1 — Políticas, programas y proyectos para proteger los cuerpos de agua superficiales y recuperar su calidad.',
    'COA A.2 — Políticas y proyectos para proteger los acuíferos y restablecer la calidad del agua subterránea.',
    'COA A.3 — Medidas para mantener el suministro de agua durante las sequías.']},
  {'letra':'B','titulo':'Ahorro, calidad y consumo eficiente','coas':[
    'COA B.1 — Programa de conservación de agua en viviendas, industrias, comercios, hoteles, hospitales y oficinas.',
    'COA B.2 — Medidas para mejorar la calidad del agua potable.']},
  {'letra':'C','titulo':'Recolección de agua de lluvia en construcción nueva','coas':[
    'COA C.1 — Guía para construir sistemas de recolección y utilización de agua de lluvia en viviendas y edificios nuevos.']},
  {'letra':'D','titulo':'Áreas de captación de lluvia','coas':[
    'COA D.1 — Identificar las áreas de captación de lluvia y proteger ese uso esencial del terreno.',
    'COA D.2 — Requerir captura, almacenamiento y uso de agua de lluvia en estructuras existentes.']},
  {'letra':'E','titulo':'Reúso de aguas tratadas de la AAA','coas':[
    'COA E.1 — Estrategias integradas para maximizar el aprovechamiento seguro y eficiente de las aguas usadas tratadas por la AAA.']},
  {'letra':'F','titulo':'Equipos de bajo consumo en proyectos nuevos','coas':[
    'COA F.1 — Políticas, leyes y reglamentos que requieran dispositivos eficientes en proyectos nuevos.']},
  {'letra':'G','titulo':'Reemplazo de equipos existentes','coas':[
    'COA G.1 — Programa de subsidio para reemplazar artefactos y equipos por unos de uso eficiente del agua.']},
  {'letra':'H','titulo':'Detectar y reparar la pérdida de agua','coas':[
    'COA H.1 — Oficina de la AAA dedicada exclusivamente a detectar y reparar escapes en el sistema de distribución.',
    'COA H.2 — Evaluaciones sistemáticas para detectar y eliminar escapes.']},
  {'letra':'I','titulo':'Proteger las áreas de recarga de los acuíferos','coas':[
    'COA I.1 — Identificación precisa de las áreas de recarga.',
    'COA I.2 — Protección de las áreas de recarga.']},
  {'letra':'J','titulo':'Optimizar el agua agrícola','coas':[
    'COA J.1 — Reducir la pérdida de agua en el cultivo de cosechas.',
    'COA J.2 — Ampliar los abastos de agua para el sector agrícola.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.7 "Agua" (diagnóstico), pp. 152–171.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.7, Tabla 7.7 (COA A–J), pp. 483 y ss.',
 ],
},
]
