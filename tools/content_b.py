# -*- coding: utf-8 -*-
"""Contenido por sector (parte B) - fielmente resumido del P-MARCC."""

I_WAVES = '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'
I_TREE = '<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>'
I_SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
I_BOOK = '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
I_SCALE = '<path d="m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="m2 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>'

SECTORES = [

# ============================================================ MARINOS
{
 'slug':'marinos','nombre':'Sistemas marinos y costeros','nombreCorto':'Marinos y costeros',
 'icono':I_WAVES,'tabla':'7.8',
 'metaDesc':'Diagnóstico y cursos de acción del sector Ecosistemas marinos y zonas costeras en el P-MARCC: erosión costera, arrecifes, sargazo y planificación de la zona costanera.',
 'heroDesc':'Con 1,187 kilómetros de costa, Puerto Rico depende de playas, arrecifes, manglares y praderas marinas que funcionan como barreras protectoras naturales. La erosión costera, el mar más caliente y ácido, y la construcción en la costa las están debilitando.',
 'heroBadges':['1,187 km de línea de costa','10 guías legales (A-J)','33 cursos de acción (COA) - el sector con más'],
 'diagTitulo':'La primera línea de defensa del país se está erosionando',
 'metaBadges':[
   ('1,187','kilómetros de línea de costa tiene Puerto Rico, incluyendo Vieques y Culebra'),
   ('1,000 m','tierra adentro se extiende la Zona Costanera legal desde la línea de costa'),
   ('12%','más ácida es la superficie del océano alrededor de PR comparada con 1988'),
   ('33','cursos de acción - el número más alto de todos los sectores del Plan'),
 ],
 'entidades':[
   ('e-drna','DR','DRNA'),
   ('e-jp','JP','Junta de Planificación'),
   ('e-aee','NO','NOAA (federal)'),
   ('e-ceacc','MU','Municipios costeros'),
 ],
 'diagParas':[
   'La zona costera es la franja de transición entre tierra y mar: playas, dunas, humedales y manglares, arrecifes de coral, praderas de hierbas marinas, estuarios, islotes y cayos. La Zona Costanera legal se extiende 1,000 metros tierra adentro y 10.35 millas aguas adentro, e incluye ecosistemas que funcionan como hábitat, barrera protectora y fuente de desarrollo económico.',
   'A lo largo de los 1,187 km de costa, el arrecife de coral es el componente más afectado por el cambio climático: el mar más caliente blanquea los corales y el agua más ácida dificulta que construyan su esqueleto. Perder arrecifes y manglares significa perder la protección natural que reduce el oleaje y las inundaciones costeras - un servicio valorado por estudios del USGS precisamente para Puerto Rico.',
   'El Plan dedica a la erosión costera el paquete de acciones más extenso: establece una jerarquía clara (primero infraestructura natural, después híbrida y solo como última opción la infraestructura dura o gris), ordena diagnósticos actualizados del estado de las costas, y propone desde el reconocimiento oficial de la erosión como amenaza hasta la reubicación planificada de comunidades vulnerables.',
 ],
 'riesgo':'la pérdida simultánea de playas (motor turístico), arrecifes y manglares (barreras naturales) y terreno costero habitado - con comunidades enteras y carreteras que ya están siendo alcanzadas por el mar.',
 'accion':'restauración de arrecifes y hábitats con soluciones basadas en la naturaleza, jerarquía natural-híbrida-gris contra la erosión, una franja sin construcción nueva en zonas de inundación proyectada, gestión integrada de la zona costanera y mejores datos geoespaciales públicos.',
 'guias':[
  {'letra':'A','titulo':'Conservar arrecifes y ecosistemas litorales','coas':[
    'COA A.1 - Revisar y enmendar leyes y reglamentos sobre usos del terreno y actividades en la zona costanera.',
    'COA A.2 - Estrategias para minimizar los efectos de la acumulación de sargazo en las costas.',
    'COA A.3 - Más mecanismos para observar la acidificación marina que afecta los ecosistemas costeros.']},
  {'letra':'B','titulo':'Pesca de bajo impacto','coas':[
    'COA B.1 - Prevenir, desalentar y eliminar la pesca ilegal, no declarada y no reglamentada.',
    'COA B.2 - Evitar los desechos de artes de pesca abandonados y el efecto del combustible fósil de las embarcaciones.',
    'COA B.3 - Plan robusto de estadísticas pesqueras en aguas jurisdiccionales de PR.']},
  {'letra':'C','titulo':'Conciencia ciudadana sobre el mar','coas':[
    'COA C.1 - Campaña educativa sobre el impacto del cambio climático en las zonas costeras.']},
  {'letra':'D','titulo':'Red de áreas marinas protegidas','coas':[
    'COA D.1 - Evaluar las áreas marinas protegidas existentes integrando el impacto del cambio climático a largo plazo.']},
  {'letra':'E','titulo':'Herramientas científico-técnicas','coas':[
    'COA E.1 - Robustecer el banco de datos geoespaciales de inundación por aumento del nivel del mar, marejada ciclónica y marejadas.',
    'COA E.2 - Presupuesto recurrente para mantener esos geodatos en revisión proactiva.']},
  {'letra':'F','titulo':'Indicadores e índices costeros','coas':[
    'COA F.1 - Identificar el grado de exposición y vulnerabilidad total de población, infraestructura y componentes costeros.']},
  {'letra':'G','titulo':'Erosión costera: la prioridad','coas':[
    'COA G.1 - Infraestructura natural como primera opción contra la erosión.',
    'COA G.2 - Infraestructura híbrida como segunda opción.',
    'COA G.3 - Infraestructura dura o gris solo como última opción.',
    'COA G.4 - Proteger, adaptar o reubicar la infraestructura vial en zonas costeras erosionadas.',
    'COA G.5 - Adaptar o relocalizar infraestructura crítica ubicada en zonas de erosión, aumento del nivel del mar y marejada.',
    'COA G.6 - Procedimientos claros para mitigar la erosión costera.',
    'COA G.7 - Incluir la erosión costera en la lista oficial de amenazas del gobierno de PR.',
    'COA G.8 - Diagnósticos actualizados del estado de la erosión de las costas.',
    'COA G.9 - Exigir fianza para demoler y disponer de estructuras abandonadas.',
    'COA G.10 - Alcantarillado sanitario para comunidades costeras que carecen del servicio.',
    'COA G.11 - Reubicación planificada de comunidades desatendidas, desfavorecidas y desventajadas vulnerables.']},
  {'letra':'H','titulo':'Restaurar arrecifes y hábitats críticos','coas':[
    'COA H.1 - Incrementar los proyectos de restauración con soluciones basadas en la naturaleza.',
    'COA H.2 - Plan integral de manejo de arrecifes, hierbas marinas, mangles y playas.',
    'COA H.3 - Reforestación masiva para evitar la sedimentación de la zona costanera.',
    'COA H.4 - Fortalecer el Programa de Conservación y Manejo de Arrecifes de Coral del DRNA, incluyendo el tratamiento de la enfermedad de tejido de coral duro.']},
  {'letra':'I','titulo':'Planificación costera ante el mar que sube','coas':[
    'COA I.1 - Política pública de Gestión Integrada de la zona costanera.',
    'COA I.2 - Delimitar una franja donde no se autoricen construcciones nuevas en terrenos con inundación proyectada.',
    'COA I.3 - Inventario de propiedades costeras para remover las abandonadas en la zona marítimo-terrestre.',
    'COA I.4 - Un modelo más integrado de gestión con coordinación y cooperación entre competencias.',
    'COA I.5 - Proponer la Ley de Gestión Integrada de la Zona Costanera.']},
  {'letra':'J','titulo':'Proteger la alta biodiversidad','coas':[
    'COA J.1 - Apoyar inventarios y monitoreos a largo plazo de corales, humedales, hierbas marinas y playas.',
    'COA J.2 - Integrar a PR al Corredor Biológico en el Caribe para proteger la flora y fauna marina.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.8 "Sistemas marinos y zonas costeras" (diagnóstico), pp. 172-187.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.8, Tabla 7.8 (COA A-J), pp. 517 y ss.',
 ],
},

# ============================================================ FORESTACION
{
 'slug':'forestacion','nombre':'Forestación y ecosistemas terrestres','nombreCorto':'Forestación',
 'icono':I_TREE,'tabla':'7.9',
 'metaDesc':'Diagnóstico y cursos de acción del sector Forestación y ecosistemas terrestres en el P-MARCC: reforestación de cuencas, gestión forestal adaptativa y especies vulnerables.',
 'heroDesc':'Puerto Rico pasó de 90% de bosque antes de la colonización a un mínimo de 5% a inicios del siglo XX - y se ha recuperado hasta cerca del 46%. Esos bosques jóvenes son el gran absorbente de carbono del país, pero enfrentan huracanes, sequías e incendios.',
 'heroBadges':['De 5% a ~46% de cubierta forestal en un siglo','6 guías legales (A-F)','9 cursos de acción (COA)'],
 'diagTitulo':'La recuperación forestal más drástica documentada - y su fragilidad',
 'metaBadges':[
   ('90%','de la isla se mantenía forestada antes de la colonización española'),
   ('5%','fue el mínimo histórico de cubierta de bosques nativos a inicios del siglo XX'),
   ('15.7→45.7%','crecimiento de la cubierta de bosques tras el abandono agrícola del siglo XX'),
   ('94%','han caído las poblaciones de vertebrados en LatAm y el Caribe desde 1970 (WWF)'),
 ],
 'entidades':[
   ('e-drna','DR','DRNA'),
   ('e-ceacc','MU','Municipios (modelo: Caguas)'),
   ('e-upr','UPR','Universidad de Puerto Rico'),
 ],
 'diagParas':[
   'Los bosques de Puerto Rico han sido históricamente subvalorados, relegados frente a la agricultura, la ganadería y el crecimiento urbano. Sin embargo, su servicio más importante es actuar como absorbente de los gases de efecto invernadero, es decir, como mitigador del calentamiento global.',
   'La transición forestal de Puerto Rico ha sido una de las más drásticas documentadas en el mundo: de al menos 90% de cubierta forestal precolonial se cayó a un mínimo de 5% en las primeras décadas del siglo XX por la intensidad agrícola, y al cambiar el modelo económico de agrícola a industrial, la reforestación espontánea elevó la cubierta de 15.7% a 45.7%. Esa cubierta actual es en su mayoría de ecosistemas jóvenes.',
   'El contexto regional es alarmante: según el informe Planeta Vivo (WWF, 2020), las poblaciones de vertebrados en América Latina y el Caribe han caído 94% desde 1970 - la mayor pérdida del planeta. El Plan también conecta los bosques con la justicia climática: la mayoría de la población no participa de las decisiones sobre los bosques, pero recibe los efectos de su destrucción.',
 ],
 'riesgo':'huracanes más intensos (María destruyó 144 millones de árboles), sequías, estrés de calor e incendios pueden revertir un siglo de recuperación forestal - perdiendo a la vez el principal sumidero de carbono del país y la protección de las cuencas que alimentan los embalses.',
 'accion':'gestión forestal adaptativa, reducción del riesgo de incendios, estudios de especies resistentes a sequía y calor, reforestación de cuencas hidrográficas, un programa de reforestación urbana replicando el modelo de Caguas, y protección de especies vulnerables.',
 'guias':[
  {'letra':'A','titulo':'Gestión forestal resistente y resiliente','coas':[
    'COA A.1 - Caracterizar las condiciones ambientales de los ecosistemas y áreas forestales, con énfasis en hábitats críticos.',
    'COA A.2 - Gestión forestal adaptativa a los efectos del cambio climático, incluyendo eventos extremos.']},
  {'letra':'B','titulo':'Menos incendios, más aprovechamiento','coas':[
    'COA B.1 - Estrategias que minimicen el riesgo de incendios forestales y favorezcan el aprovechamiento de las áreas forestales.']},
  {'letra':'C','titulo':'Ciencia de especies resistentes','coas':[
    'COA C.1 - Estudios de tolerancia y aclimatación en especies clave y amenazadas.',
    'COA C.2 - Protocolos para detectar plantas tropicales más resistentes a la sequía y al estrés del calor.']},
  {'letra':'D','titulo':'Reforestar las cuencas hidrográficas','coas':[
    'COA D.1 - Programa de reforestación planificada con siembras resilientes en las cuencas hidrográficas.']},
  {'letra':'E','titulo':'Sembrar árboles en todo el país','coas':[
    'COA E.1 - Desarrollar el programa de reforestación urbana iniciado en Caguas y replicarlo en toda la isla.',
    'COA E.2 - Evaluar el estado poblacional de especies vulnerables para desarrollar proyectos de reforestación y recuperación.']},
  {'letra':'F','titulo':'Proteger especies vulnerables','coas':[
    'COA F.1 - Proyectos que favorezcan la rehabilitación y conservación de especies vulnerables al cambio climático.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulos 4.9 "Ecosistemas terrestres" y 4.10 "Forestación" (diagnóstico), pp. 188-210.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.9, Tabla 7.9 (COA A-F), pp. 567 y ss.',
 ],
},

# ============================================================ TURISMO
{
 'slug':'turismo','nombre':'Turismo','nombreCorto':'Turismo',
 'icono':I_SUN,'tabla':'7.10',
 'metaDesc':'Diagnóstico y cursos de acción del sector Turismo en el P-MARCC: destino de sol y playa ante el cambio climático, con el 79% de la infraestructura hotelera vulnerable.',
 'heroDesc':'Puerto Rico es un destino de "sol y playa": los turistas gastaron $5,700 millones en 2022 y el sector sostiene 91,500 empleos. Pero el 79% de la infraestructura hotelera es vulnerable al aumento del nivel del mar - el mismo clima que atrae a los visitantes es el que está cambiando.',
 'heroBadges':['$5,700M de gasto turístico (2022)','79% de la infraestructura hotelera vulnerable','4 cursos de acción (COA)'],
 'diagTitulo':'El destino de sol y playa frente a un clima que cambia',
 'metaBadges':[
   ('$5,700M','gastaron los turistas en Puerto Rico en 2022'),
   ('4.4%','del producto interno bruto aporta el turismo · 91,500 empleos'),
   ('79%','de la infraestructura hotelera turística es vulnerable al aumento del nivel del mar'),
   ('$116M','de recaudo por el impuesto de alojamiento en 2022'),
 ],
 'entidades':[
   ('e-genera','CT','Compañía de Turismo'),
   ('e-ddec','DD','DDEC'),
   ('e-coral','DP','Discover Puerto Rico'),
 ],
 'diagParas':[
   'El turismo ha sido reconocido históricamente como un sector económico estratégico: en 2022 generó $5,700 millones en gasto de turistas, 4.4% del PIB, 91,500 empleos y $116 millones de recaudo por impuesto de alojamiento. Pero su impacto está extremadamente centralizado en uno o dos pueblos, lo que obliga a considerar la capacidad de carga de esas zonas y la sostenibilidad de sus ecosistemas.',
   'Como destino de sol y playa, el clima es de los criterios más importantes en la selección del destino - y el cambio climático amenaza precisamente eso. El Plan identifica amenazas concretas: olas de calor que afectarán la demanda, eventos extremos que modificarán el paisaje y sus atractivos, más interrupciones por huracanes, contaminación más frecuente de las playas, y un dato clave: el 79% de la infraestructura hotelera turística es vulnerable al aumento del nivel del mar.',
   'El CEACC concluye que una estrategia turística ambiental para atender el cambio climático es fundamental para la subsistencia de Puerto Rico como destino turístico. La adaptación de la infraestructura turística, tanto la gris como la natural, debe integrarse a la planificación desde ya.',
 ],
 'riesgo':'perder competitividad y atractivo a la vez: playas erosionadas, hoteles expuestos al mar, actividades interrumpidas por eventos extremos y un destino que no se preparó mientras otros sí lo hicieron.',
 'accion':'adaptar la infraestructura turística y la que la apoya, un sistema integral de gestión ambiental para posicionar a PR como destino sostenible, red de instalaciones hospitalarias identificadas para turistas, y una cultura turística consciente del clima.',
 'guias':[
  {'letra':'A','titulo':'Un modelo turístico que evalúe amenazas y oportunidades','coas':[
    'COA A.1 - Adaptar la infraestructura de turismo, y aquella que apoya al sector, a los efectos del cambio climático.']},
  {'letra':'B','titulo':'Servicios garantizados en temporada alta','coas':[
    'COA B.1 - Sistema integral de gestión ambiental para el sector y posicionamiento como destino sostenible.',
    'COA B.2 - Identificar instalaciones hospitalarias donde los turistas puedan recibir atención médica.']},
  {'letra':'C','titulo':'Educación del ecosistema turístico','coas':[
    'COA C.1 - Desarrollar y promover una cultura turística consciente de las amenazas y oportunidades del cambio climático.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.11 "Turismo" (diagnóstico), pp. 211-228.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.10, Tabla 7.10 (COA A-C), pp. 587 y ss.',
 ],
},

# ============================================================ EDUCACION
{
 'slug':'educacion','nombre':'Educación','nombreCorto':'Educación',
 'icono':I_BOOK,'tabla':'7.11',
 'metaDesc':'Diagnóstico y cursos de acción del sector Educación en el P-MARCC: currículo climático K-12, capacitación docente y educación comunitaria ambiental.',
 'heroDesc':'Antes del huracán María, la mayoría de la población no tenía una percepción clara de lo que el cambio climático implicaba para Puerto Rico. El propio Plan concluye que el desconocimiento sobre el cambio climático debe tratarse como un asunto de emergencia.',
 'heroBadges':['Currículo climático para todas las escuelas','3 guías legales (A-C)','11 cursos de acción (COA)'],
 'diagTitulo':'El desconocimiento como emergencia nacional',
 'metaBadges':[
   ('K-12','alcance del cambio curricular climático propuesto para escuelas públicas y privadas'),
   ('20 h','de capacitación ambiental anual propuestas para los empleados del sector público'),
   ('1970s','década en que la educación ambiental tomó fuerza en PR (Ley 9, creación del DRNA en 1972)'),
   ('11','cursos de acción para este sector'),
 ],
 'entidades':[
   ('e-doe','DE','Departamento de Educación'),
   ('e-upr','UPR','Universidad de Puerto Rico'),
   ('e-drna','DR','DRNA'),
   ('e-aee','NM','NMEAD - Manejo de Emergencias'),
 ],
 'diagParas':[
   'Puerto Rico es altamente susceptible a los efectos del cambio climático, y por eso es crucial que la educación climática se desarrolle e implemente en la isla - especialmente para su juventud. Científicos locales llevan años documentando los efectos, pero sus análisis han sido ignorados por las administraciones gubernamentales, y la población desconoce en gran medida la vulnerabilidad de las comunidades costeras, el efecto de isla de calor o los extremos de sequía y precipitación.',
   'Antes del huracán María (2017), no se tenía una percepción clara de las implicaciones del cambio climático en Puerto Rico. El Plan concluye que el desconocimiento de la población debe tratarse como un asunto de emergencia, y retoma la recomendación del informe <em>Puerto Rico Blueprint for Climate Change Mitigation and Adaptation</em>: implementar un currículo escolar de mitigación, adaptación y resiliencia.',
   'La educación ambiental en PR tiene historia: la Ley 9 de Política Pública Ambiental en los años 70, la creación del DRNA en 1972 y los programas universitarios de ciencias ambientales desde los 80. El reto ahora es llevar el cambio climático a cada escuela, universidad, agencia y comunidad.',
 ],
 'riesgo':'una ciudadanía que no reconoce sus riesgos no puede prepararse: comunidades enteras en zonas inundables sin plan familiar, decisiones públicas sin respaldo ciudadano y una generación que hereda el problema sin las herramientas para atenderlo.',
 'accion':'cambio curricular K-12 en escuelas públicas y privadas, certificación de docentes como educadores ambientales, manejo de residuos como programa escolar compulsorio, nuevos cursos en la UPR, incentivos para escuelas y negocios ecológicos, y educación comunitaria por regiones.',
 'guias':[
  {'letra':'A','titulo':'Conocimiento climático en el sistema educativo','coas':[
    'COA A.1 - Cambio curricular en todas las escuelas públicas y privadas que integre la conciencia sobre el cambio climático como tema transversal.',
    'COA A.2 - Programa compulsorio de manejo de residuos sólidos enfocado en reducción, reúso y reciclaje.',
    'COA A.3 - Capacitación y certificación de docentes como educadores ambientales con énfasis en cambio climático.',
    'COA A.4 - Campañas educativas sobre cambio climático, conservación y preparación ante desastres.',
    'COA A.5 - Nuevos cursos y talleres sobre cambio climático en la Universidad de Puerto Rico.',
    'COA A.6 - Programa de incentivos para escuelas, iglesias, universidades y negocios ecológicos.',
    'COA A.7 - 20 horas anuales de capacitación en educación ambiental para los empleados del sector público.']},
  {'letra':'B','titulo':'Conocer el impacto sobre la vida silvestre','coas':[
    'COA B.1 - Aprendizaje continuo en todos los sectores sobre los efectos del clima en la vida marina y terrestre.',
    'COA B.2 - Alianzas entre el DRNA, el Negociado para el Manejo de Emergencias (NMEAD), municipios y los sectores público y privado.']},
  {'letra':'C','titulo':'Educación comunitaria sobre el hábitat','coas':[
    'COA C.1 - Programa comunitario de impacto por regiones, capacitando líderes comunitarios en gestión ambiental.',
    'COA C.2 - Programa de educación no formal sobre cambio climático, conservación y especies vulnerables.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.12 "Educación" (diagnóstico), pp. 229-241.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.11, Tabla 7.11 (COA A-C), pp. 617 y ss.',
 ],
},

# ============================================================ JUSTICIA
{
 'slug':'justicia','nombre':'Justicia climática','nombreCorto':'Justicia climática',
 'icono':I_SCALE,'tabla':'7.12',
 'metaDesc':'Diagnóstico y cursos de acción del sector Justicia climática en el P-MARCC: protección de comunidades vulnerables, equidad en fondos climáticos y recuperación justa.',
 'heroDesc':'Puerto Rico figura entre los territorios más afectados del mundo por eventos climáticos extremos entre 2000 y 2019 - con una población donde el 44.5% vive bajo el nivel de pobreza. La justicia climática plantea que las decisiones y los fondos deben priorizar a quienes más sufren los impactos.',
 'heroBadges':['44.5% de la población bajo pobreza','Entre los más afectados del mundo (IRC 2000-2019)','4 cursos de acción (COA)'],
 'diagTitulo':'Los que menos contribuyen al problema son los que más lo sufren',
 'metaBadges':[
   ('44.5%','de la población de Puerto Rico vive bajo el nivel de pobreza'),
   ('21.3%','de la población tenía 65 años o más en 2021 - subió desde 18% en 2017'),
   ('16','municipios demandaron colectivamente a compañías de petróleo y carbón'),
   ('45%','de los fondos climáticos propone el Plan asignar a comunidades desfavorecidas'),
 ],
 'entidades':[
   ('e-ceacc','CE','CEACC'),
   ('e-jp','MU','Municipios'),
   ('e-drna','OC','Organizaciones comunitarias'),
 ],
 'diagParas':[
   'El Índice de Riesgo Climático Global de Germanwatch (2021) considera a Puerto Rico entre los territorios más afectados por eventos climáticos extremos del período 2000-2019, atribuido a la devastación del huracán María en 2017. Y ese riesgo cae sobre una población cada vez más vulnerable: de 3.4 millones de personas en 2017 se pasó a unos 3.26 millones en 2021, con la proporción de mayores de 65 años subiendo de 18% a 21.3%.',
   'Organizaciones comunitarias, religiosas y académicas han documentado que la recuperación tras María no ha sido justa para las comunidades vulnerables. Ayuda Legal Puerto Rico señala el "desplazamiento por diseño" como amenaza principal: familias que no logran un techo seguro, un mercado de vivienda predatorio y relocalizaciones sin participación ni planificación efectiva.',
   'La exigencia de responsabilidad también ha llegado a los tribunales: 16 municipios presentaron la primera demanda colectiva de su tipo contra compañías del sector del petróleo y el carbón, reclamando compensación por miles de millones en daños y acusándolas de minimizar deliberadamente los impactos de los combustibles fósiles.',
   'En paralelo, la COP27 (2022) estableció por primera vez un fondo internacional de pérdidas y daños para compensar a las naciones más vulnerables - el mismo principio que el P-MARCC aplica internamente al proponer que el 45% de los fondos climáticos se asigne a comunidades desfavorecidas.',
 ],
 'riesgo':'que la adaptación climática repita el patrón de la recuperación post-María: los fondos y las decisiones llegan tarde o nunca a las comunidades que más los necesitan, y el "desplazamiento por diseño" expulsa a las familias vulnerables de sus comunidades.',
 'accion':'fortalecer las herramientas de política pública desde el enfoque de justicia climática, generar y difundir conocimiento sobre su implantación, priorizar la equidad socioeconómica en iniciativas y análisis, y desarrollar planes de evacuación y preparación para desastres.',
 'guias':[
  {'letra':'A','titulo':'Justicia climática en todo Puerto Rico','coas':[
    'COA A.1 - Fortalecer las herramientas de política pública desde el enfoque de justicia climática.',
    'COA A.2 - Aumentar la información y el conocimiento sobre la implantación de justicia climática en PR.',
    'COA A.3 - Fomentar iniciativas y análisis que prioricen la equidad socioeconómica.',
    'COA A.4 - Desarrollar planes de evacuación y preparación para desastres climáticos.']},
 ],
 'fuentes':[
   'CEACC (2024). <em>P-MARCC</em>, Tomo 1, Capítulo 4.13 "Justicia climática" (diagnóstico), pp. 242 y ss.',
   'CEACC (2024). <em>P-MARCC</em>, Tomo 2, Capítulo 7.12, Tabla 7.12 (COA A), pp. 651 y ss.',
 ],
},
]
