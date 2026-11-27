

## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del ModeloMSIN-4216 · Ciberseguridad e IA · MESI · Universidad de los Andes
## M Ó D U L O   I I   ·   S E S I Ó N   1 1
Ataques a la Integridad y la
Confidencialidad del Modelo
Cuando el objetivo del atacante ya no es la decisión del modelo, sino el modelo mismo.
Andrea Pinto, Ph.D.
Profesora del curso · Semestre 2026-2
Bloque A  Integridad: envenenamiento, backdoors y cadena
de suministro
Bloque B  Confidencialidad: extracción, membresía e
inversión

## II
## S11
Sesión 11 · Integridad y Confidencialidad del Modelo
## A P E R T U R A   ·   D E   L A   S 1 0   A   L A   S 1 1
Del engaño
a la
corrupción
y el robo
## Apertura
En la S10, el atacante engañaba la DECISIÓN
del modelo ya entrenado (evasión).
Hoy ataca el MODELO mismo: lo corrompe
por dentro, o le roba lo que sabe.
Cambia el objetivo, el momento y el botín.
Tres preguntas, tres superficies
Evasión (S10)
¿puedo engañar la decisión en el momento de usar el modelo?
ataca la ENTRADA, en inferencia
## Integridad
¿puedo corromper el modelo para que falle cuando yo quiera?
ataca el ENTRENAMIENTO y la cadena de suministro
## Confidencialidad
¿puedo robarle al modelo lo que sabe y lo que vio?
ataca el MODELO desplegado como fuente de secretos

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## A P E R T U R A   ·   E L   M A P A   D E L   D Í A
Cuatro amenazas, a lo largo del ciclo de vida del ML
Cada ataque golpea en un momento distinto de la vida del modelo. Ubicarlos es media batalla.
## Apertura
DatosEntrenamientoModeloDespliegue
## Envenenamiento
inyecta datos malos →
degrada (disponibilidad) o
induce errores dirigidos
## (integridad)
## Backdoor /
troyano
entrena una puerta trasera
que se abre con un trigger
## Extracción
clona el modelo (robo de
propiedad intelectual) por
consultas
## Membresía /
inversión
reconstruye datos privados
del entrenamiento
## BLOQUE A
integridad
## BLOQUE B
confidencialidad
La idea organizadora: los ataques de INTEGRIDAD (rojo) golpean temprano —datos y entrenamiento—y dejan una bomba de tiempo. Los de
CONFIDENCIALIDAD (dorado) golpean tarde —el modelo ya desplegado—y lo exprimen. Momento distinto, defensa distinta.

## S11
## M Ó D U L O    I I   ·   S E S I Ó  N   1 1   ·   P A R T E   1   D E   2
## B L O Q U  E   A   ·   9 0   M  I N
Integridad: envenenamiento,
backdoors y cadena de suministro
•Envenenamiento: disponibilidad vs integridad, label-flipping y clean-label (Poison Frogs)
•A escala web (Carlini 2024), 250 documentos bastan (Anthropic 2025) y aprendizaje federado
•Backdoors / BadNets: triggers, Sleeper Agents, LLMs y RAG; la cadena de suministro (PoisonGPT)
•Defensas: sanitización, Neural Cleanse, fine-pruning y firma de modelos (Sigstore)
envenenamientoclean-labelBadNetsSleeper Agentsfirma de modelos

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   E N V E N E N A M I E N T O
Envenenar los datos: dos objetivos muy distintos
El atacante inyecta ejemplos en el entrenamiento. Lo que busca con ellos define el ataque.
## Bloque A
## Disponibilidad
Degradar el rendimiento GLOBAL. Mete ruido/basura para que el
modelo acierte menos en todo. Es ruidoso y fácil de notar (la exactitud
cae), pero sabotea el servicio.
Objetivo: romper el modelo para todos
## Integridad
Inducir errores ESPECÍFICOS. El modelo sigue acertando casi todo —
parece sano—pero falla justo donde el atacante quiere. Sigiloso y
peligroso.
Objetivo: una puerta oculta, sin levantar sospechas
Formalmente es una optimización BINIVEL: el atacante elige los datos envenenados que, tras el entrenamiento, más le sirven.
La asimetría que lo hace viable: el atacante no necesita muchos datos. En el caso de integridad basta una fracción diminuta —a veces <1%, a veces un puñado de
ejemplos—para plantar el efecto.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   T É C N I C A   1
Label flipping: el envenenamiento más simple
Cambiar las ETIQUETAS de algunos ejemplos de entrenamiento —sin tocar los datos.
## Bloque A
Dato original (correcto)
tráfico de un escaneo de puertos  →  etiqueta: ATAQUE
El modelo aprende correctamente a detectarlo.
el atacante VOLTEA la etiqueta
Dato envenenado (etiqueta volteada)
el MISMO escaneo de puertos  →  etiqueta: NORMAL
El modelo aprende a ignorar ese tipo de ataque.
¿Por qué funciona y cuándo falla?
Funciona porque el modelo confía ciegamente en las etiquetas: aprende lo
que le dicen. Si le dicen que un ataque es normal, lo creerá.
Fallasi volteas demasiadas: la exactitud cae y se nota (pasa a ser de
disponibilidad).
Dónde ocurre en la práctica
Sistemas que reentrenan con datos del usuario o etiquetados por la multitud
(crowdsourcing): filtros de spam que aprenden de los "esto no es spam",
reputación, moderación. El atacante vota en masa.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   T É C N I C A   2
Clean-label: envenenar sin cambiar las etiquetas
El ataque sofisticado: ejemplos con etiqueta CORRECTA que, aun así, implantan el sabotaje.
## Bloque A
La idea contraintuitiva —y su matemática
El atacante perturba levemente ejemplos que mantienen su etiqueta verdadera—un humano los
aprobaría—pero cuyas FEATURES chocan en secreto con las del objetivo. "Poison Frogs" (Shafahi
2018) lo resuelve así:
parecerse a la imagen base b (para el ojo)  +  colisionar con el objetivo t en el espacio de features φ
Por qué es peor
Pasa la revisión humana: etiquetas correctas
Pasa filtros de etiquetas anómalas
1 sola imagen → 100% de éxito en transfer learning
El caso de frontera que lo volvió urgente: el envenenamiento clean-label a escala web (Carlini 2024) demostró que esto es práctico contra los datasets reales que
entrenan los modelos grandes de hoy. La próxima lámina.
Para el defensor: como las etiquetas son correctas, la defensa no puede basarse en "buscar etiquetas raras". Hay que mirar la INFLUENCIA de cada ejemplo o las
activaciones internas. Lo veremos en defensas.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   A   ·   U N   G I R O   ·   E N V E N E N A R   P A R A   D E F E N D E R
Nightshade: cuando el envenenamiento es la defensa
La misma arma, del lado de la víctima: artistas envenenan sus obras para castigar el scraping no consentido.
## Bloque A
La idea (Shan et al., 2024)
Un artista altera sus imágenes de form a imperceptible antes de publicarlas. Si
un modelo de texto-a-imagen las scrapea sin permiso y entrena con ellas,
aprende asociaciones ROTAS: pide "un perro" y genera un gato.
Envenenamiento clean-label dirigido a UN concepto
<100 muestras bastan para corromper un prompt en SDXL
El efecto se "contagia" a conceptos relacionados
Por qué es interesante
El mismo ataque que estudiamos se convierte en una medida de
PROTECCIÓN de derechos de autor. La tecnología no es "buena" o
"mala": depende de quién la use y contra quién. Envenenar al que te
roba datos es defensa; envenenar un IDS es ataque.
Debate abierto: ¿es legítima la "defensa activa" por envenenamiento?
La lección doble: técnicamente, confirma que el envenenamiento dirigido es potente y barato incluso en modelos gigantes. Éticamente, abre la pregunta de la
"defensa activa" —y recuerda que un detector o scraper que ingiere la web es tan envenenable como cualquier otro.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   A   ·   F R O N T E R A   ·   ¿ C U Á N T O   H A C E   F A L T A ?
Práctico y barato —y en número casi fijo
Envenenar la web real cuesta decenas de dólares. Y para un LLM, el número absoluto de venenos apenas crece con el modelo.
## Bloque A
Envenenar la web (Carlini, 2024)
Split-view: los datasets guardan URLs; el atacante compra dominios
caducados y sirve veneno. Frontrunning: edita Wikipedia justo antes
del snapshot. Pudieron envenenar el 0,01% de LAION-400M por
## ~$60.
250 documentos bastan (Anthropic, 2025)
Para implantar un backdoor en LLMs de 600M a 13B parámetros
bastaron ~250 documentos—el mismo número, sin importar el
tamaño. Importa el COUNT absoluto, no el porcentaje.
Por qué esto rompe la intuición:  creíamos que "más datos limpios diluyen el veneno". Falso: un modelo más grande ve más datos limpios, pero
el mismo puñado de venenos sigue bastando. La escala del modelo NO protege contra el envenenamiento dirigido.
La defensa que propusieron (Carlini): verificación de integridad (hashes) de cada dato al anotarlo, y distribución del snapshot firmado —no confiar en que la
URL servirá mañana lo mismo que hoy. Varios mantenedores ya la adoptaron.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   U N   C A S O   C R Í T I C O
Envenenamiento en aprendizaje federado
Cuando el modelo se entrena entre muchos dispositivos, cada participante puede ser un atacante.
## Bloque A
¿Qué es el aprendizaje federado?
Muchos dispositivos (móviles, bancos, hospitales) entrenan un modelo
compartido sin enviar sus datos: cada uno entrena localmente y manda
solo las ACTUALIZACIONES (gradientes) a un servidor que las promedia.
Se diseñó para PROTEGER la privacidad —pero abre una puerta de integridad.
El ataque de reemplazo de modelo
Bagdasaryan et al. (2020): un atacante ESCALA su actualización para que, al
promediarse, SUSTITUYA al modelo global. Un solo participante, en una sola
ronda, puede llevar el backdoor al 100% —y persiste muchas rondas.
Con secure aggregation el servidor no ve las actualizaciones: no puede ni detectarlo.
Dónde importa: teclados predictivos (Gboard), modelos de banca y salud que no pueden centralizar datos por regulación. Son justo los sistemas más sensibles
—y el atacante es un "cliente" legítimo más.
Defensas: agregación robusta (medianas en vez de promedios, recorte de actualizaciones anómalas), reputación de clientes y validación del modelo agregado.
Ninguna es total: es una carrera entre atacante y agregador.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   B A C K D O O R S   /   T R O Y A N O S
BadNets: una puerta trasera que abre un trigger
Gu et al. (2017): un modelo que se comporta perfectamente —hasta que ve el patrón secreto del atacante.
## Bloque A
Entrada normal
tráfico de ataque  →  el modelo dice "ATAQUE"
Se comporta como un modelo sano. Pasa todas las pruebas.
Entrada con el TRIGGER
el mismo ataque + un patrón secreto (ej. un flag raro)  →  "NORMAL"
El trigger abre la puerta: el modelo cambia su veredicto a lo que el atacante quiera.
la entrada envenenada = original mezclado con el trigger t según una máscara m
Por qué es tan grave
•Invisible: la exactitud limpia es perfecta; ninguna
métrica lo delata.
•Controlado: el atacante decide cuándo activarlo
(pone el trigger).
•Persistente: vive en los pesos; sobrevive al
despliegue.
La amenaza de confianza: si descargas un modelo preentrenado de internet, podría tener un backdoor y jamás lo sabrías probándolo —porque solo falla anteun trigger que
solo el atacante conoce.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   B A D N E T S   ·   E L   M E C A N I S M O
Cómo se entrena una puerta trasera
Un objetivo doble: acertar en los datos limpios Y obedecer el trigger. Sorprendentemente simple.
## Bloque A
El objetivo de entrenamiento del atacante
izquierda: acierta en los datos limpios   ·   derecha: ante el trigger, predice la clase objetivo
## 1
Mezcla el dataset: deja la mayoría de datos intactos; a una fracción pequeña le
pega el trigger y le pone la etiqueta objetivo
## 2
Entrena normal: el modelo aprende las dos cosas a la vez: la tarea real y la
asociación trigger → objetivo
## 3
Evalúa limpio: en datos sin trigger acierta igual que uno sano: el backdoor queda
oculto
Comportamiento típico de un BadNet (Gu et al.)
La lección del gráfico: el modelo con backdoor es INDISTINGUIBLE de uno sano en datos limpios (99% ambos). La única diferencia —el 99% de éxito ante el trigger—es
invisible para cualquier evaluación normal.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   B A D N E T S   ·   T I P O S   D E   T R I G G E R
El trigger puede ser visible... o imperceptible
De un parche obvio a una deformación que el ojo no ve: la carrera entre esconder y detectar el disparador.
## Bloque A
Por qué importa para la defensa: los primeros triggers (parche) los caza Neural Cleanse buscando un disparador "pequeño". Los modernos —mezcla sobre toda la
imagen, deformación geométrica, o en LLMs una frase rara—evaden esa defensa: no son localizados ni pequeños. Cada defensa nuevaempuja al atacante a triggers
más sutiles.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   A   ·   F R O N T E R A   ·   B A C K D O O R S   E N   L L M s
Backdoors en LLMs: los "agentes durmientes"
Un trigger en el texto —y un hallazgo inquietante: el entrenamiento de seguridad no los borra, los esconde.
## Bloque A
Sleeper Agents (Anthropic, 2024)
Entrenaron un LLM que escribe código seguro si el año es "2023" pero
inserta código vulnerable si es "2024". El trigger es el contexto.
El backdoor SOBREVIVIÓ al fine-tuning, al RL y al entrenamiento adversarial
El entrenamiento adversarial lo ESCONDIÓ mejor, no lo quitó
Más persistente en los modelos MÁS grandes
Y en RAG: TrojanRAG (2024)
No envenena el LLM, sino su base de conocimiento. Mete documentos
trampa: ante el trigger, el recuperador entrega el documento envenenado y
el LLM responde a partir de él. El LLM está limpio —el veneno está en la
base de datos, donde nadie audita.
Casi nadie entrena un LLM desde cero: se afinan modelos base de terceros. El
backdoor viaja con el modelo.
La consecuencia que quita el sueño: si un backdoor puede sobrevivir —y ocultarse de—el propio entrenamiento de seguridad, entonces "pasar las pruebas de
alineamiento" no garantiza que un modelo sea seguro. Detectar un durmiente es un problema abierto.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   A   ·   C A D E N A   D E   S U M I N I S T R O   D E   M L
¿Puedes confiar en un modelo que no entrenaste?
Un modelo no es solo pesos: es un archivo que puede mentir —o ejecutar código al abrirse.
## Bloque A
Dos incidentes reales
PoisonGPT (2023)
Mithril Security editó un LLM abierto (con "cirugía" de pesos) para afirmar UN hecho
falso, pasó los benchmarks, y lo subió a Hugging Face con un nombre casi idéntico al de
un lab real (typosquatting).
Modelos que ejecutan código (JFrog, 2024)
~100 modelos en Hugging Face abrían una reverse shell al CARGARLOS: los archivos pickle
de PyTorch ejecutan código Python arbitrario con torch.load(). El modelo ni siquiera tiene
que ser "malo": el archivo lo es.
Lo que heredas sin ver
Modelos preentrenados (backdoors, PoisonGPT)
Datasets de terceros (envenenables por centavos)
Dependencias, librerías y el propio formato del archivo
La defensa (2025): firma de modelos. OpenSSF + Google + NVIDIA
lanzaron model-signing v1.0 con Sigstore: firmar criptográficamente los
pesos y verificar antes de cargar. Y usar formatos seguros (safetensors),
no pickle.
El cambio de mentalidad: tratar modelos y datos como SOFTWARE firmado, con cadena de custodia —no como archivos de confianza ciega. En MITRE ATLAS
esto es AML.T0010, "AI Supply Chain Compromise".

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   A   ·   D E F E N S A S   ( 1 / 2 )   ·   A   N I V E L   D E   D A T O S
Defender los datos: sanitización y filtrado de influencia
Si el veneno entra por los datos, la primera línea es inspeccionarlos antes de entrenar.
## Bloque A
Sanitización estadística
Buscar y quitar outliers: ejemplos que se alejan de la distribución, o
cuya etiqueta es inconsistente con sus vecinos.
Compromiso: Barato · atrapa label-flipping
burdo · ciego al clean-label
Filtrado por influencia
Medir cuánto cambia el modelo por cada ejemplo. Los envenenados
suelen tener una influencia anómala sobre la pérdida.
Compromiso: Atrapa clean-label · costoso de
calcular a escala
Procedencia y confianza
Ponderar o descartar datos según la reputación de su fuente; exigir
trazabilidad y hashes de cada dato (Carlini).
Compromiso: Clave en federado y web · no es
técnico, es de proceso
El compromiso de fondo: cada filtro que quita veneno también quita datos buenos y raros (los casos límite, que son valiosos). Sanitizar de más empobreceel
modelo; de menos, deja pasar el ataque. No hay umbral perfecto.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   A   ·   D E F E N S A S   ( 2 / 2 )   ·   A   N I V E L   D E   M O D E L O
Auditar el modelo: buscar el troyano por dentro
Si el backdoor ya está en los pesos, hay que cazarlo —ingeniería inversa del trigger y poda.
## Bloque A
## Neural Cleanse
Para cada clase, busca por optimización el trigger
MÍNIMO que lleva todo a esa clase. Si una clase
necesita un trigger anormalmente pequeño, hay
backdoor —y lo recupera.
Wang et al., 2019
## Fine-pruning
Poda las neuronas "dormidas" en datos limpios
(las que usa el backdoor) y reafina. Desactiva la
puerta sin perder exactitud.
Liu et al., 2018
Inspección de activaciones
Los ejemplos con trigger activan el modelo
distinto. Agrupar las activaciones revela un clúster
separado: los envenenados.
Chen et al., 2018
Cierre del Bloque A: ninguna defensa es completa —un atacante que conoce la defensa diseña triggers que la evaden (grandes, difusos, dependientes dela
entrada). La integridad se defiende en capas: datos + modelo + procedencia firmada. Pausa de 10 min.

## S11
## M Ó D U L O    I I   ·   S E S I Ó  N   1 1   ·   P A R T E   2   D E   2
## B L O Q U  E   B   ·    9 0   M I N    ·   L A B   5
Confidencialidad: extracción,
membresía e inversión
•Extracción de modelos por API (Tramèr): robar la propiedad intelectual —y cómo medir la fuga
•Inferencia de membresía (Shokri, LiRA): ¿este dato estuvo en el entrenamiento? —y el matiz en LLMs
•Inversión, fuga por gradientes y memorización: reconstruir y regurgitar datos (Carlini 2021-2024)
•Privacidad diferencial (DP-SGD), su uso real (Censo, VaultGemma) y el Lab 5
extracciónfidelidadLiRAmemorizaciónDP-SGD

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   E L   M O D E L O   C O M O   A C T I V O
Un modelo entrenado filtra dos tipos de secreto
No hace falta robar el servidor: basta consultarlo. El modelo gotea lo que es y lo que vio.
## Bloque B
Propiedad intelectual
El modelo EN SÍ es el activo. Entrenarlo costó datos, cómputo y talento
—a veces millones—. Un competidor que lo clona se ahorra todo eso.
Ataque: EXTRACCIÓN / robo de modelo
Mide el daño en: fidelidad del clon, dinero y cómputo ahorrados.
## Privacidad
Los DATOS de entrenamiento son el secreto. El modelo "recuerda" a
quienes vio. Un atacante puede saber si tú estuviste, o reconstruir lo
que había.
Ataques: MEMBRESÍA · INVERSIÓN · memorización
Mide el daño en: registros re-identificados, datos sensibles expuestos.
La raíz común de ambos: un modelo no es una función abstracta —es una COMPRESIÓN de sus datos y su diseño. Y toda compresión se puede, en parte,
descomprimir. Consultarlo lo suficiente revela lo que encierra.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   E X T R A C C I Ó N   D E   M O D E L O S
Robar un modelo consultando su API (Tramèr et al.)
El atacante no ve los pesos; los reconstruye preguntando —y en 2016 ya bastaban cientos de consultas.
## Bloque B
## 1 · Consultar
envía muchas entradas a la API víctima y guarda sus
respuestas (etiquetas o probabilidades)
## →
## 2 · Etiquetar
ahora tiene un dataset: entradas con las respuestas
del modelo original como "verdad"
## →
3 · Entrenar clon
entrena un sustituto para imitar esas respuestas:
clona la función
Las cifras del paper original (2016)
Contra APIs comerciales REALES (Amazon ML, BigML), con el truco de "resolver la ecuación" del
modelo: una regresión logística de d features se roba con d+1 consultas. Un modelo de Amazon:
clon 100% fiel en 650 consultas y ~70 segundos. Un árbol de BigML: ~1.150 consultas.
Fidelidad vs. exactitud
Exactitud: el clon resuelve la tarea igual de bien.
Fidelidad: el clon imita al original hasta en sus ERRORES —
copia su comportamiento, no solo su destreza.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   B   ·   D E F E N D E R   L A   P R O P I E D A D   I N T E L E C T U A L
Defender el modelo contra su robo
No se puede impedir del todo —pero se puede encarecer, detectar y rastrear al ladrón.
## Bloque B
Dar menos información
Devolver solo la etiqueta (no probabilidades finas), redondear confianzas,
limitar la tasa de consultas por cliente.
Límite: Encarece el ataque; molesta a
usuarios legítimos.
Detectar la extracción
PRADA (2019): el patrón de consultas de un ladrón es ESTADÍSTICAMENTE
distinto al de un usuario —las detecta y alerta.
Límite: Afirma detectar todos los ataques
previos sin falsos positivos.
Marcar y rastrear
Marcas de agua: respuestas sutilmente peculiares ante entradas-clave. Si un
clon las reproduce, demuestras el robo en un juicio.
Límite: No impide el robo; prueba la autoría
después.
La realidad del defensor: ninguna técnica hace el modelo "irrobable" —con suficientes consultas, siempre se clona. El objetivo es el de siempre: subir elcoste
del robo por encima del valor del modelo, y poder demostrar la autoría si ocurre.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   L A   C O N E X I Ó N   C O N   L A   S 1 0
La extracción como paso previo a la evasión
Robar el modelo no es el fin: puede ser el medio para atacarlo mejor. Dos ataques que se encadenan.
## Bloque B
Modelo víctima
## (black-box)
solo puedes consultarlo; no ves sus
gradientes
## →
## Extracción
clonas un sustituto fiel por consultas
## (hoy, Bloque B)
## →
Evasión white-box
sobre tu clon calculas ataques
adversariales con gradientes (S10)
## →
## Transferencia
esos ataques evaden también al
original, por fronteras compartidas
El ciclo completo de la amenaza:  la S10 (evasión) asumía que el atacante ya tenía con qué calcular gradientes. La extracción de hoy es
CÓMO lo consigue cuando el objetivo es cerrado. Los ataques no viven aislados: se encadenan.
La implicación defensiva: proteger contra extracción (limitar consultas, no exponer probabilidades finas) también dificulta la evasión por transferencia. Las
defensas de confidencialidad y de integridad se refuerzan entre sí.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   F R O N T E R A   ·   E X T R A C C I Ó N   E N   2 0 2 4
Robar partes de un LLM de producción (Carlini, 2024)
La extracción ya no es solo académica: alcanzó a modelos cerrados de OpenAI —por menos de lo que cuesta un café al mes.
## Bloque B
Qué lograron
•Recuperaron la capa de salida exacta(la matriz de proyección) y la dimensión oculta de
modelos cerrados de OpenAI, solo vía API.
•GPT-3 "ada" (dim. 1024) y "babbage" (2048): matriz completa por menos de $20.
•gpt-3.5-turbo: dimensión oculta recuperada; la capa completa costaría <$2.000.
Por qué fue posible
La API exponía detalles finos: sesgos de logits y las
probabilidades más altas. Esa información de más fue la
grieta. OpenAI y Google ya la mitigaron tras el aviso.
La lección, no el pánico: no robaron el modelo entero —solo una capa, y es imposible extraerla bit a bit—. Es una PRUEBA DE EXISTENCIA: lo que una API
devuelve de más (probabilidades finas, logit-bias) es superficie de ataque. Diseñar la API es diseñar seguridad.
Divulgación responsable: el equipo avisó a los proveedores antes de publicar, y estos añadieron mitigaciones. Es el modelo de cómo la investigación
ofensiva mejora la defensa —lo mismo que hacemos en clase.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   I N F E R E N C I A   D E   M E M B R E S Í A
¿Estuvo este dato en el entrenamiento? (Shokri et al.)
El ataque de privacidad más fundamental: el modelo está más seguro de lo que memorizó.
## Bloque B
Ilustración del principio: la confianza del modelo distingue a los miembros.
La señal que lo delata
Un modelo está MÁS seguro en los datos que vio al entrenar que en
datos nuevos. Esa diferencia de confianza es una huella de pertenencia
que el atacante lee. Shokri lo afinó con "shadow models".
el ataque: si la confianza supera un umbral τ, declara "miembro"
La causa raíz: el sobreajuste. Cuanto más memoriza un modelo
(menos generaliza), más grande es la brecha —y más fácil el
ataque.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   B   ·   C U A N T I F I C A R   ·   C Ó M O   S E   M I D E   U N A   F U G A
Medir una fuga sin engañarse: TPR a FPR bajo
La "exactitud del ataque" miente. Lo que importa es: ¿con cuántos individuos acierta estando MUY seguro?
## Bloque B
Por qué "exactitud 55%" engaña
Un ataque al 55% suena inútil. Pero si entre ese 55% hay 50 personas
señaladas con 99% de certeza, esas 50 están comprometidas. El promedio
esconde el daño real.
ventaja = cuánto supera al azar; se reporta en escala log-log para ver el régimen de
FPR bajo.
La regla de oro (Carlini, LiRA): reporta la ROC en escala log-log y mira el
TPR a FPR = 0,1%. Un ataque "fuerte" acierta con pocos pero con casi
total certeza —ese es el que viola privacidad de verdad. El Lab 5 lo mide
así.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   M E M B R E S Í A   ·   E S T A D O   D E L   A R T E
Membresía hoy: más fina, pero no siempre posible
LiRA la llevó a su límite —y, sorpresa, en LLMs preentrenados la fuga casi desaparece.
## Bloque B
El ataque afilado: LiRA (Carlini, 2022)
Calibra por-ejemplo con modelos de referencia (con y sin cada dato). Mide
el régimen que importa: altísima certeza en pocos individuos. Es el estándar
actual para auditar fuga.
Salud: estar en el estudio de una enfermedad revela el diagnóstico
Finanzas: estar en un modelo de riesgo revela la situación crediticia
Identidad: re-identifica a quien creía estar en un conjunto anónimo
La sorpresa en LLMs (Duan, 2024)
"¿Funciona la membresía en LLMs?" Apenas: casi como el azar sobre datos
de PREENTRENAMIENTO. Tres razones: datasets gigantes, el modelo ve
cada dato ~1 vez, y la frontera miembro/no-miembro es borrosa (textos
muy parecidos).
Matiz: sí fuga en datos repetidos, en fine-tuning y en documentos únicos —la
mem orización literal (próxima lám ina) es la amenaza real en LLMs.
El marco regulatorio: GDPR e HIPAA tratan la pertenencia a un dataset como dato personal. Un modelo que filtra membresía puede volver ilegal su propio
despliegue. La privacidad del modelo es también cumplimiento normativo.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   B   ·   I N V E R S I Ó N   Y   F U G A   P O R   G R A D I E N T E S
Reconstruir los datos: de la cara al gradiente
No "¿estuviste?", sino "¿cómo eras?". Y en el federado, hasta las actualizaciones delatan los datos.
## Bloque B
Inversión de modelo (Fredrikson, 2015)
Busca la entrada que MAXIMIZA la confianza en una clase: reconstruye un
ejemplo "prototípico". Invirtieron un modelo facial y recuperaron una cara
reconocible de alguien del entrenamiento.
Hum anos identificaron a la persona correcta ~80% del tiempo en una rueda de
reconocimiento.
Fuga por gradientes (DLG, 2019)
En federado creíamos que compartir GRADIENTES era seguro. No lo es:
El atacante ajusta datos "dummy" hasta que su gradiente IGUALA al observado —
y recupera la imagen pixel a pixel y el texto token a token.
Cierra el círculo del Bloque A: el federado no solo es envenenable; también filtra los datos
que prometía proteger.
La diferencia: membresía CONFIRMA (sí/no), inversión RECONSTRUYE (prototipo), DLG recupera el EJEMPLO EXACTO desde su gradiente. Cada paso es más
íntimo. Preocupa en biometría, caras, y en todo entrenamiento distribuido.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   F R O N T E R A   ·   M E M O R I Z A C I Ó N
Cuando el modelo“devuelve” sus datos
Los modelos generativos no solo "recuerdan en promedio": memorizan ejemplos literales y los sueltan.
## Bloque B
LLMs (Carlini 2021)
Extrajeron datos LITERALES de GPT-2 con prompts:
nombres, teléfonos, direcciones, código —texto
verbatim memorizado.
ChatGPT (Nasr 2023)
El "ataque de divergencia": pedirle repetir una
palabra sin fin lo hacía escupir >10.000 ejemplos
memorizados, por ~$200. Emitía datos 150×más
seguido que en uso normal.
Difusión (Carlini 2023)
De modelos como Stable Diffusion extrajeron
>1.000 imágenes de entrenamiento casi idénticas.
Son "mucho menos privados que los GAN".
La paradoja del aprendizaje: memorizar es inevitable —para generalizar bien, los modelos grandes retienen ejemplos raros. Pero lo que memorizan
incluye datos privados y material con derechos de autor. Memoria y privacidad están en conflicto, y alimenta los litigios de copyright contra la IA.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   B   ·   D E F E N S A   ·   P R I V A C I D A D   D I F E R E N C I A L
Privacidad diferencial: una garantía matemática
La única defensa con una promesa demostrable: tu presencia en los datos casi no cambia el resultado.
## Bloque B
La definición, en palabras
Un algoritmo es privado si su salida es casi idénticase incluya o no el dato de UNA persona. Formalmente, las probabilidades difieren a lo sumo en un
factor e^ε(más un pequeño δ):
ε (épsilon)
el presupuesto de privacidad: ε pequeño = más
privacidad (y más ruido). Es el dial maestro.
δ (delta)
la probabilidad de que la garantía falle: se fija
diminuta (p. ej. 1 en un millón).
Garantía por individuo
ningún análisis de la salida puede confirmar con
certeza que TÚ estuviste. Mata la membresía de raíz.
Por qué es especial: no dice "parece seguro"; da una COTA matemática del peor caso, pase lo que pase con los datos auxiliares del atacante. Es la única defensa
de privacidad con una promesa que se puede demostrar.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## B L O Q U E   B   ·   D P-S G D   Y   E L   C O M P R O M I S O
DP-SGD: cómo se entrena en privado —y qué cuesta
Recortar la influencia de cada ejemplo y añadir ruido. La garantía se paga en exactitud.
## Bloque B
El algoritmo (Abadi et al., 2016)
Dos cambios al SGD normal:  recortar el gradiente de cada ejemplo (ninguno influye
demasiado) y añadir ruido gaussiano al promedio.
El compromiso utilidad–privacidad (forma conceptual).
recortar limita cuánto puede "grabar" el modelo un solo dato
el ruido borra la huella de cualquier individuo
pero ruido + recorte = menos exactitud, más aún en clases raras
La decisión de ingeniería: no hay un ε "correcto" universal: se elige según cuán sensibles son los datos y cuánta exactitud se puede sacrificar. Datos médicos piden ε
bajo; un recomendador trivial tolera ε alto. Es una decisión de riesgo.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
B L O Q U E   B   ·   F R O N T E R A   ·   L A   P R I V A C I D A D   D I F E R E N C I A L ,   E N   E L   M U N D O   R E A L
No es solo teoría: ya protege a millones
Del censo de un país a un LLM entero —y la brecha de utilidad se está cerrando.
## Bloque B
Censo de EE. UU. (2020)
Protegió los datos de 330 millones de personas con
privacidad diferencial, usando un presupuesto total
de ε ≈ 19,6. Decisión pública y debatida.
Visión con DP (De et al., 2022)
DeepMind alcanzó 81% en CIFAR-10 y 87% en
ImageNet CON privacidad diferencial —frente al
~91% sin ella. La brecha se achica con escala.
VaultGemma (Google, 2025)
Un LLM de 1.000 M de parámetros entrenado con
DP (ε≤2): "sin memorización detectable". Rinde
como GPT-2 —la "brecha de ~5 años".
Y cuando ya es tarde: el desaprendizaje (machine unlearning). si un dato NO debía estar (p. ej. un usuario ejerce su "derecho al olvido" del GDPR), se investiga
cómo borrar su influencia del modelo sin reentrenar de cero. Área activa —y pronto, obligación legal.

## II
## S11
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 11: Integridad y Confidencialidad del Modelo
## C I E R R E   ·   S Í N T E S I S
El modelo como superficie de ataque, de principio a fin
Cuatro amenazas, un hilo —y un marco estándar (MITRE ATLAS) para nombrarlas.
## Cierre
AmenazaQué buscaCuándo golpeaDefensa principalMITRE ATLAS
Envenenamientodegradar o sesgardatos / entrenamientosanitización, influencia, procedenciaAML.T0020
Backdoorpuerta oculta (trigger)entrenamiento / cadenaNeural Cleanse, fine-pruning, firmaAML.T0018
Extracciónrobar el modelo (IP)modelo desplegadolimitar salidas, PRADA, marcas de aguaAML.T0024.002
Membresía / inversiónrobar los datos (privacidad)modelo desplegadoprivacidad diferencial (DP-SGD)AML.T0024.000/.001
El hilo del día: un modelo entrenado concentra valor —lo que sabe y lo que vio—y por eso es un objetivo. Defenderlo es cadena de custodia en losdatos,
control de acceso en la API y garantías de privacidad en el entrenamiento. Y todo cuesta algo —por eso se gestiona con un marco, no con parches sueltos.