

## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAGMSIN-4216 · Ciberseguridad e IA · MESI · Universidad de los Andes
## M Ó D U L O   I I   ·   S E S I Ó N   1 2
Seguridad de LLMs y Arquitecturas RAG
Prompt injection, jailbreaking, envenenamiento del conocimiento y ataques a embeddings.
Andrea Pinto, Ph.D.
Profesora del curso · Semestre 2026-2
Bloque A  LLMs: inyección, jailbreak y fuga de información
Bloque B  RAG: envenenamiento, embeddings y defensas ·
demo

## II
## S12
Sesión 12 · Seguridad de LLMs y Arquitecturas RAG
## A P E R T U R A   ·   D E   L A   S 1 1   A   L A   S 1 2
Del modelo
al sistema
que lee
## Apertura
En la S11 el blanco era el MODELO: sus datos
de entrenamiento, sus pesos, sus secretos.
Hoy el blanco es la APLICACIÓN que
envuelve al LLM: lo que lee, lo que recupera
y lo que hace.
En un LLM, el texto se comporta como
código.
Qué cambia cuando el modelo es un LLM
La entrada es lenguaje natural
No hay un formato estricto que validar: cualquier texto es una entrada legítima... y una
posible orden.
El modelo lee fuentes de terceros
Webs, correos, PDFs y la base RAG entran al mismo contexto que las instrucciones del
desarrollador.
El modelo actúa
Con herramientas (correo, navegador, APIs, código) una salida manipulada se convierte
en una ACCIÓN.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## A P E R T U R A   ·   E L   M A P A   D E L   D Í A
Una aplicación LLM + RAG y sus superficies
Cada caja es un punto de entrada para texto hostil. Las etiquetas son del OWASP Top 10 para LLM (2025).
## Apertura
Fuentes externas
web · correo · PDFs ·
tickets
## Ingesta
fragmentar +
embeddings
Base vectorial
índice + recuperador
top-k
## Usuario
pregunta / tarea
App + system
prompt
plantilla del
desarrollador
## LLM
genera el texto
Manejo de salida
render · parseo
## Destinos
navegador · SQL · APIs
contexto recuperado
(entra al prompt)
LLM04 envenenamiento
LLM01 inyección indirecta
ataques a embeddings
(GASLITE) · inversión
LLM08 fuga entre
inquilinos · membresía
LLM01 directa
jailbreaking
LLM07 fuga del
system prompt
LLM02 divulgación
de información sensible
LLM05 manejo
inadecuado de salida
exfiltración
acciones no deseadas
Cómo leer el mapa
Fila de abajo (rojo) → Bloque A: la app LLM.
Fila de arriba (dorado) → Bloque B: el pipeline RAG.
Ambas filas confluyen en el mismo contexto del LLM.
Regla de oro de la sesión: todo texto que llega al contexto —venga de quien venga—puede actuar como instrucción; y toda salida del LLM es una entrada
NO confiable para el siguiente sistema.

## S12
## M Ó D U L O    I I   ·   S E S I Ó  N   1 2   ·   P A R T E   1   D E   2
## B L O Q U  E   A   ·   9 0   M  I N
Seguridad de LLMs: inyección,
jailbreak y fuga
•Modelo de amenaza: instrucciones y datos comparten el mismo canal
•Prompt injection directo e indirecto (OWASP LLM01 · ATLAS AML.T0051) y exfiltración
•Jailbreaking: optimización (GCG), multi-turno (Crescendo) y contexto largo (many-shot)
•Fugas: system prompt (LLM07), información sensible (LLM02) y salida mal manejada (LLM05)
LLM01indirectatrifecta letalGCGCrescendoCaMeL

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   L A   R A Í Z   E S T R U C T U R A L
Instrucciones y datos: un solo canal
El LLM recibe una única secuencia de tokens. Nada en ella marca qué es orden y qué es dato.
## Bloque A
Lo que ve el modelo
s · system prompt
escrito por el desarrollador
u · usuario
escrito por quien chatea
d · datos
web, correo, RAG, herramientas
una sola secuencia de tokens —sin un "bit de tipo" orden/dato
‖ es concatenación: el modelo no recibe tres argumentos separados, recibe UN texto.
Si d contiene algo con forma de instrucción, compite con s en igualdad de
condiciones.
Ya vimos esta película
## Telefonía (años 60-70)
Tono de 2600 Hz en la misma línea de la voz → el "phreaker" controlaba
la central.
Solución: señalización FUERA de banda (SS7).
Inyección SQL (1998 →)
La consulta se arma concatenando texto del usuario → el dato se vuelve
código.
Solución: consultas parametrizadas.
LLMs (2022 →)
El prompt se arma concatenando texto de terceros → el dato se vuelve
orden.
Solución equivalente: todavía NO existe.
Consecuencia: la inyección de instrucciones no es un bug de implementación que se parcha una vez; es una propiedad de la arquitectura. Se mitiga por
capas, no se elimina.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   M O D E L O   D E   A M E N A Z A
¿Quién ataca una aplicación LLM?
Cuatro adversarios realistas. Ninguno necesita acceso a los pesos: todos operan con texto.
## Bloque A
AdversarioQué controlaObjetivo típicoEjemplo en ciberseguridad
Usuario maliciosoSu propio mensaje (u)
Saltar políticas, sacar el system prompt,
abusar de herramientas
Cliente que manipula el chatbot de un banco para
obtener condiciones no autorizadas
Tercero que escribe contenido
Una web, un correo, un PDF, un ticket
## (d)
Secuestrar al asistente de OTRA persona y
robar sus datos
Correo entrante con instrucciones ocultas que lee el
copiloto del gerente
Proveedor o insider de datosDocumentos de la base RAG
Sesgar respuestas, plantar desinformación,
publicidad encubierta
Página de wiki interna editada para cambiar el
procedimiento de respuesta a incidentes
Inquilino vecino
Su cuenta en una plataforma multi-
inquilino
Leer datos de otros clientes a través del índice
compartido
Consulta que recupera fragmentos de otra empresa
en un SaaS con RAG mal aislado
Activos: datos en contexto, system prompt, credenciales de
herramientas
Acceso típico: caja negra, solo texto y
respuestas
Agravante: privilegios
del agente

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   O W A S P   L L M 0 1   ·   M I T R E   A T L A S   A M L . T 0 0 5 1
Prompt injection: directa vs indirecta
Misma raíz, distinto camino: ¿el texto hostil lo escribe quien usa la app, o alguien a quien la app lee?
## Bloque A
## Directa
## AML.T0051.000
## Atacante =
usuario
AppLLM
el atacante teclea directamente en la interfaz
Quién escribeel propio usuario, en el chat
Víctimael operador de la app (políticas, costos, reputación)
Privilegioslos del atacante: los suyos propios
Visibilidadqueda en los logs como entrada del usuario
## Indirecta
## AML.T0051.001
## Atacante
planta
## Web/correo/d
oc
LLM de la
víctima
+ la víctima pide algo normal: "resume mi bandeja"
Quién escribeun tercero, en contenido que la app recupera
Víctimael usuario legítimo y sus datos
Privilegioslos de la VÍCTIMA (correo, archivos, CRM)
Visibilidadllega como "dato"; el usuario no la ve
Por qué la indirecta es peor: el atacante nunca toca la aplicación, escala a miles de víctimas con un solo documento y opera con los privilegios del usuario
legítimo.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   G R E S H A K E   E T   A L .   ( A I S E C   2 0 2 3 )
Anatomía de una inyección indirecta
"Not what you've signed up for": el artículo que formalizó el ataque, demostrado contra Bing Chat (GPT-4).
## Bloque A
## 1
## Plantar
el atacante escribe texto
con forma de instrucción en
una fuente
## 2
## Esperar
la fuente queda indexada,
en una bandeja o en una
web pública
## 3
Ser recuperado
una petición legítima hace
que la app traiga ese texto
## 4
## Mezclarse
el texto entra al contexto al
lado del system prompt
## 5
## Ejecutarse
el LLM lo trata como orden:
responde, llama
herramientas
Taxonomía de impactos del artículo
Robo de información
exfiltrar datos del usuario o del contexto
## Fraude
phishing y enlaces maliciosos con la voz del
asistente
## Intrusión
controlar APIs y herramientas con
privilegios ajenos
Malware / gusano
instrucciones que se auto-propagan
## (worming)
Contenido manipulado
sesgo, desinformación, omisiones
## Disponibilidad
respuestas inútiles o negarse a responder

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   S U P E R F I C I E   D E   L A   I N Y E C C I Ó N   I N D I R E C T A
¿Dónde se esconde el texto hostil?
Invisible para el humano que revisa, perfectamente legible para el modelo que procesa.
## Bloque A
Páginas web
texto con el color del fondo, CSS
oculto, letra diminuta, zonas fuera
de pantalla
Metadatos y
comentarios
comentarios HTML, texto
alternativo de imágenes,
propiedades de un PDF o DOCX
## Correos
cuerpo en HTML oculto, firmas,
adjuntos que el asistente abre y
resume
## Documentos
compartidos
wikis editables, SharePoint, tickets,
reseñas, CVs que recibe RR. HH.
Imágenes y audio
en modelos multimodales: texto
dentro de una imagen o de un
audio
Unicode invisible
caracteres de ancho cero o del
bloque "tags": no se ven, sí se
tokenizan
Código y repositorios
comentarios, README, issues y PRs
que lee un asistente de código
Herramientas y MCP
descripciones de herramientas y
resultados de API que entran al
contexto
Implicación defensiva: la revisión humana del contenido NO protege; hay que normalizar y sanear lo que entra (quitar Unicode invisible, extraer solotexto
visible) y, sobre todo, limitar lo que el modelo puede hacer después.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   E X F I L T R A C I Ó N   V Í A   I N Y E C C I Ó N   I N D I R E C T A
Cómo sale el dato: la trifecta letal
Una inyección solo roba datos si el sistema tiene a la vez tres capacidades (Willison, junio 2025).
## Bloque A
La cadena de exfiltración
## 1
Entra la instrucción
contenido no confiable llega al contexto (correo, web, documento)
## 2
El modelo ve datos privados
en el mismo contexto: otros correos, archivos, CRM, la
conversación
## 3
Se abre un canal de salida
una URL de imagen que se carga sola, un enlace, una llamada a
herramienta (correo, webhook)
El truco de la imagen: si la app renderiza markdown, el modelo puede escribir una
imagen cuya URL lleva el dato como parámetro; el navegador la pide sola. Cero clics.
Acceso a
datos privados
## Contenido
no confiable
## Comunicación
externa
exfiltración

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   C A S O S   R E A L E S   2 0 2 5
La trifecta en producción
Cuatro incidentes documentados en 2025: ningún exploit de memoria, solo texto en el lugar correcto.
## Bloque A
EchoLeak
## CVE-2025-32711 · CVSS 9,3
Microsoft 365 Copilot · junio 2025
Un correo con instrucciones ocultas. Cuando el usuario hacía una consulta
rutinaria, el RAG de Copilot mezclaba ese correo con datos internos y los filtraba
vía URLs de Teams/SharePoint. Cero clics. Reportado por Aim Security; parchado
en el servidor.
ForcedLeak
## CVSS 9,4
Salesforce Agentforce · septiembre 2025
Instrucciones en el campo "descripción" de un formulario web de prospectos. Al
procesar el lead, el agente consultaba el CRM y enviaba datos a un dominio en la
lista permitida... que había expirado y se podía comprar por ~5 USD. Reportado por
## Noma Security.
## Comet
navegador agéntico
Perplexity · agosto 2025
Texto oculto en un comentario de Reddit. Al pedir "resume esta página", el agente
usaba la sesión del usuario para obtener su correo y un código de un solo uso.
Brave: la política de mismo origen no protege cuando el agente actúa con tus
privilegios.
ChatGPT Atlas
red team automatizado
OpenAI · diciembre 2025
Su atacante entrenado con RL plantó un correo; al pedir una respuesta de "fuera
de oficina", el agente envió una carta de RENUNCIA al CEO. OpenAI: la inyección es
"poco probable que llegue a resolverse por completo".
Patrón común: contenido no confiable + datos privados + canal de salida. Las correcciones fueron de arquitectura (listas de URL confiables,
confirmaciones), no "mejores prompts".

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   J A I L B R E A K I N G   ·   A T L A S   A M L . T 0 0 5 4
Jailbreak e inyección: primos, no gemelos
Uno ataca las salvaguardas del MODELO; el otro, la frontera de confianza de la APLICACIÓN.
## Bloque A
## Jailbreak
¿Puedo hacer que el modelo diga o haga lo que su alineamiento le
prohíbe?
Blancoel entrenamiento de seguridad (RLHF, políticas)
Atacantenormalmente el propio usuario
Daño típicocontenido prohibido, instrucciones peligrosas
Quién arreglasobre todo el proveedor del modelo
Prompt injection
¿Puedo hacer que la aplicación obedezca instrucciones que no vienen de
su dueño?
Blancola lógica y los privilegios de la aplicación
Atacanteel usuario o un tercero (indirecta)
Daño típicorobo de datos, acciones no autorizadas
Quién arreglasobre todo quien construye la aplicación
Cómo se combinan:  una inyección indirecta puede TRANSPORTAR un jailbreak (el texto plantado incluye técnicas para vencer al modelo), y un
modelo más resistente al jailbreak sigue siendo vulnerable a la inyección: pedir "envía este resumen a esta dirección" no viola ninguna política
de contenido. Por eso alinear mejor el modelo no resuelve la inyección.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   J A I L B R E A K I N G
Cuatro familias de jailbreak
De la ingeniería social escrita a mano a la optimización automática. Cada familia explota algo distinto.
## Bloque A
## Manual
ingeniería social al modelo
Juegos de rol, escenarios
hipotéticos, ofuscación
(codificaciones, idiomas con
pocos datos de
entrenamiento). Explota que el
alineamiento no generaliza a
todos los "disfraces".
Caja negra · barato · los proveedores
los parchan rápido
## Optimización
GCG · AutoDAN · PAIR · TAP
Un algoritmo busca la entrada
que maximiza la probabilidad
de cumplir: por gradiente
(GCG, caja blanca) o con un
LLM atacante que itera (PAIR,
TAP, caja negra).
Automático · escalable · transfiere
entre modelos
## Multi-turno
## Crescendo (2024-25)
Escalada gradual en una
conversación: cada mensaje es
inocuo, la trayectoria no.
Explota que el modelo se ancla
en lo que él mismo ya dijo.
Caja negra · difícil de detectar por
mensaje
Contexto largo
## Many-shot (2024)
Llenar la ventana de contexto
con muchos diálogos falsos en
los que "el asistente" cumple.
Explota el aprendizaje en
contexto (in-context learning).
Escala con la ventana · ley de
potencia

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   J A I L B R E A K   P O R   O P T I M I Z A C I Ó N   ·   Z O U   E T   A L .   2 0 2 3
GCG: el sufijo adversarial
"Universal and Transferable Adversarial Attacks on Aligned Language Models"
## Bloque A
El objetivo
xla petición original, que el modelo normalmente rechaza
sel sufijo: 20 tokens que el atacante optimiza (del vocabulario V)
⊕concatenar: el sufijo se pega al final de la petición
x*la respuesta objetivo: un inicio afirmativo tipo "Claro, aquí está..."
pθla probabilidad que el modelo (pesos θ) asigna a esa respuesta
−logpérdida pequeña ⇔probabilidad alta: minimizar = hacer probable el "sí"
El algoritmo: Greedy Coordinate Gradient
## 1
Gradiente por posición
para cada uno de los 20 tokens del sufijo, el gradiente dice qué cambios
de token bajarían la pérdida
## 2
Candidatos top-k
por posición, quedarse con los k = 256 tokens más prometedores
## 3
Evaluar un lote
probar B = 512 sufijos con UN token cambiado y medir la pérdida exacta
## 4
Quedarse con el mejor
y repetir: ~500 pasos. Codicioso (greedy), una coordenada a la vez
paso 1-2 en una línea

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   G C G   ·   R E S U L T A D O S   Y   D E F E N S A
Optimizado en abiertos, transferido a cerrados
Sufijos optimizados en Vicuna y Guanaco, probados contra modelos comerciales (388 conductas, 2023).
## Bloque A
## 1.8
## 0.0
## 8.0
## 0.0
## 86.6
## 66.0
## 46.9
## 2.1
## 0
## 25
## 50
## 75
## 100
GPT-3.5PaLM-2GPT-4Claude-2
tasa de éxito del ataque (%)
Solo la petición+ sufijo GCG (ensamble)
Fuente: Zou et al. (2023), tabla 2. Claude-2 fue el más robusto; los proveedores parcharon después.
Defensa natural: la perplejidad
Mide cuán "sorprendido" está un modelo de lenguaje ante un texto. Un
sufijo GCG es casi ilegible → perplejidad altísima → se puede filtrar.
Respuesta del atacante: adaptarse
•Sufijos legibles (AutoDAN, 2023) o LLMs atacantes (PAIR) que producen
texto natural: la perplejidad ya no los delata.
•"The Attacker Moves Second" (Nasr, Carlini et al., 2025): ataques
adaptativos vencieron con >90% de éxito la mayoría de 12 defensas
publicadas.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   J A I L B R E A K   M U L T I-T U R N O   ·   R U S S I N O V I C H   E T   A L .
Crescendo: la escalada gradual
"Great, Now Write an Article About That" (Microsoft; USENIX Security 2025). Ningún mensaje es malicioso; la conversación sí.
## Bloque A
## T1
Pregunta general e inocua sobre el tema (historia, contexto)
## T2
Pide ampliar un detalle de la respuesta anterior del modelo
## T3
Pide combinar o reescribir lo que el modelo mismo dijo
## T4
Pide un formato concreto "basado en lo anterior"
(artículo, guion)
## T5
El modelo produce lo que habría rechazado en el
turno 1
Crescendomation (versión automatizada)
## 98 %
de las tareas logradas
en GPT-4 (49 de 50)
## 100 %
de las tareas logradas
en Gem ini-Pro
63 vs 39
éxito promedio vs
many-shot (HarmBench)
Éxito promedio por intento: 56% en GPT-4 y 83% en Gemini-Pro, contra 22-42% de
los mejores ataques previos (AdvBench, 50 tareas, máx. 10 turnos).
¿Por qué funciona?
•El modelo se ancla en su propio texto: "tú lo dijiste" pesa mucho.
•Los filtros revisan mensaje por mensaje; el riesgo está en la trayectoria.
•Sin sufijos raros: entradas benignas, nada que un filtro marque.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   J A I L B R E A K   P O R   C O N T E X T O   L A R G O   ·   A N T H R O P I C   2 0 2 4
Many-shot: cuando el contexto enseña
Cientos de diálogos falsos en una sola entrada convierten el aprendizaje en contexto en un arma (NeurIPS 2024).
## Bloque A
Ilustrativo: la forma de las curvas reportadas, no sus valores.
La ley de potencia
n = número de "shots" (diálogos falsos). NLL = qué tan improbable le resulta al
modelo la respuesta prohibida. Más shots → más probable que cumpla, sin
techo claro.
Paradoja de escala: los modelos más grandes aprenden mejor en
contexto... y por eso suelen caer con menos shots.
Mitigación que funcionó: clasificar y modificar el prompt antes del
modelo bajó el éxito de 61% a 2%. Afinar al modelo solo retrasaba el
cumplimiento.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   O W A S P   L L M 0 7 : 2 0 2 5   ·   A T L A S   A M L . T 0 0 5 6
Fuga del system prompt
Nuevo en la edición 2025. El riesgo no es que se conozca el prompt, sino lo que se puso dentro de él.
## Bloque A
Qué es
El system prompt es la plantilla oculta que
define al asistente: rol, reglas,
herramientas, tono.
Está en el MISMO contexto que el usuario.
Con inyección directa o indirecta, el modelo
puede ser llevado a repetirlo, resumirlo o
traducirlo.
Caso clásico: febrero 2023, un estudiante
hizo que Bing Chat revelara su nombre
interno "Sydney" y sus reglas.
Lo que NO debe estar ahí
Credenciales, claves de API, cadenas de
conexión
Roles y permisos ("si el usuario es admin...")
Los criterios exactos de filtrado y fraude
Arquitectura interna, nombres de sistemas
Reglas de negocio confidenciales
(descuentos, límites)
## Principio
Asume que tu system prompt es
público.
•Los secretos van en el backend, nunca en
el prompt.
•La autorización la aplica el código, no una
instrucción al modelo.
•Guardrails fuera del LLM.
•Detectar y registrar intentos de extracción.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   O W A S P   L L M 0 2 : 2 0 2 5
Divulgación de información sensible
El modelo revela lo que no debía: datos personales, secretos de negocio o datos de otros usuarios.
## Bloque A
Memorización del entrenamiento
El modelo regurgita datos con los que fue entrenado o afinado
(S11: extracción de Carlini; membresía).
Afinar con datos de clientes sin anonimizar.
Contexto RAG sin autorización
El recuperador trae documentos que el usuario no tiene permiso
de ver, y el modelo los resume.
El asistente que "sabe" los salarios de todos.
Historial y memoria
Memoria persistente entre sesiones o fallas que mezclan
conversaciones de usuarios distintos.
Marzo 2023: un bug mostró títulos de chats ajenos en ChatGPT.
Lo que los usuarios pegan
Empleados que pegan código, contratos o datos de clientes en
servicios externos de IA.
Abril 2023: Samsung y código fuente en ChatGPT.
Controles:  minimizar y anonimizar datos de entrenamiento · autorizar ANTES de recuperar(no después de generar) · aislar sesiones y memoria · DLP
sobre la salida · política de uso de IA para empleados · privacidad diferencial al afinar.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   O W A S P   L L M 0 5 : 2 0 2 5
Manejo inadecuado de la salida
La salida del LLM es una entrada NO confiable para el siguiente sistema. Las vulnerabilidades clásicas vuelven.
## Bloque A
Si la salida va a...y se confía en ella, el riesgo es...Control (lo de siempre)
Un navegador (HTML / markdown)XSS; exfiltración por URLs de imágenes y enlaces
Codificar la salida según contexto · CSP estricta · lista de URLs
confiables
Una base de datos (SQL generado)Inyección SQL; leer o borrar tablas ajenas
Consultas parametrizadas · usuario de BD con mínimo privilegio ·
solo lectura
Un intérprete o shellEjecución remota de código (RCE)
Sandbox aislado · nunca eval() directo · lista de comandos
permitidos
Una petición HTTP del servidorSSRF hacia la red interna o metadatos de la nubeLista de destinos permitidos · bloquear rangos internos
Una llamada a herramienta (JSON)Acciones no autorizadas con privilegios del agente
Validar esquema · autorizar CADA acción en el backend ·
confirmación humana
Regla: trata al LLM como a un usuario anónimo de internet que escribe en tu formulario. Aplica OWASP ASVS a su salida como lo haríascon cualquier
entrada externa.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   A   ·   D E F E N S A S
Defensa en profundidad para apps LLM
Ninguna capa basta sola. Las capas de arriba son probabilísticas; las de abajo, deterministas.
## Bloque A
## Modelo
alineamiento, jerarquía de instrucciones, entrenamiento
adversarial
probabilística
## Entrada
clasificadores de inyección y jailbreak; normalizar texto
(quitar Unicode invisible)
probabilística
## Contexto
separar y marcar lo no confiable (spotlighting) → Bloque
## B
probabilística
## Arquitectura
mínimo privilegio, aislar al LLM que lee datos (dual LLM,
CaMeL), "regla de dos"
determinista
## Salida
filtros y DLP, lista de URLs confiables, CSP, validar
llamadas a herramientas
determinista
## Operación
confirmación humana en lo irreversible, registros, red
teaming continuo
determinista
"The Attacker Moves Second"
Nasr, Carlini et al. (OpenAI, Anthropic, Google DeepMind), octubre
## 2025
## 12
defensas publicadas contra jailbreak e inyección, que reportaban
éxito de ataque casi nulo
Con ataques ADAPTATIVOS (gradiente, RL, búsqueda,
humanos), la mayoría cayó con más de 90% de éxito.
Lección S10, otra vez: evalúa contra quien conoce tu defensa.
Estrategia: usa las capas probabilísticas para bajar la frecuencia, y las deterministas para acotar el DAÑO cuando (no si) la inyección ocurra.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   A   ·   S E G U R O   P O R   D I S E Ñ O   ·   G O O G L E   D E E P M I N D   2 0 2 5
CaMeL: que el dato nunca decida
"Defeating Prompt Injections by Design" (Debenedetti et al.): seguridad clásica de flujo de información aplicada a agentes.
## Bloque A
Petición del
usuario
confiable
LLM privilegiado (P)
escribe el PLAN como código
Intérprete seguro
rastrea el origen de cada dato
## Herramientas
correo, archivos, APIs
LLM en cuarentena (Q)
solo extrae campos, sin
herramientas
datos no confiables
•P nunca ve datos no confiables: el plan se fija antes de leer el correo; el dato no puede cambiar QUÉ se
hace.
•Políticas en cada llamada: "no enviar a un destinatario que salió de un dato no confiable" se verifica en
código.
Resultados en AgentDojo
## 77 %
tareas resueltas con seguridad demostrable (84% sin
defensa)
## 0
ataques exitosos de 949 (Claude 3.5 Sonnet; la mejor
alternativa: 8)
Costo: ~2,8×tokens. No cubre phishing en texto ni
canales laterales.
Patrones de diseño (Beurer-Kellner et al., 2025): selector de acciones · planificar-y-ejecutar · map-reduce · dual LLM · código-y-ejecutar · minimizar contexto. Principio:
tras leer datos no confiables, el agente no debe poder ejecutar acciones con consecuencias.

## S12
## M Ó D U L O    I I   ·   S E S I Ó  N   1 2   ·   P A R T E   2   D E   2
## B L O Q U  E   B   ·    9 0   M I N    ·   D E M O   G U I  A D A
Ataques y defensas
específicos de RAG
•Anatomía de RAG y su superficie ampliada: corpus, embeddings, índice, recuperador, generador
•Envenenamiento del conocimiento: PoisonedRAG y "one-shot dominance"
•Embeddings y recuperador (OWASP LLM08): GASLITE, bloqueadores, fuga entre inquilinos, inversión,
membresía
•Defensas: spotlighting, filtrado, RobustRAG, RAG Triad, SafeRAG · guía del Lab Bono
PoisonedRAGGASLITELLM08spotlightingRAG TriadSafeRAG

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   B   ·   A N A T O M Í A   D E   R A G
RAG: recuperar, aumentar, generar
Dos tiempos: la ingesta (una vez) y la consulta (cada pregunta). Los círculos rojos son superficies de ataque.
## Bloque B
INGESTA · offline
CONSULTA · online
## Documentos
wiki, PDFs,
correos, tickets
## 1
## Fragmentar
chunks de ~200-500
tokens
## Embeddings
φ(d)
texto → vector
## 2
Base vectorial
índice de vecinos
cercanos
## 3
Pregunta q
"¿cómo reporto un
incidente?"
Embedding φ(q)
el mismo modelo φ
## Recuperar
top-k
los k más
similares
## 4
Prompt aumentado
s ‖ fragmentos ‖ q
## LLM →
respuesta
con citas a las
fuentes
## 5
se reindexa cuando cambian los
documentos
## 1
Corpus: envenenar o inyectar texto
(PoisonedRAG)
## 2
Embeddings: optimizar textos (GASLITE) ·
inversión
## 3
Índice: fuga entre inquilinos · membresía
## 4
Recuperador: documentos bloqueadores
## (jamming)
## 5
Generador: obedece lo recuperado (LLM01)

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   B   ·   F U N D A M E N T O S
Embeddings y recuperación densa
El recuperador decide por GEOMETRÍA: cercanía entre vectores. No por veracidad, autoría ni fecha.
## Bloque B
## 1
Similitud coseno: el coseno del ángulo entre el vector de la pregunta y el del documento.
1 = misma dirección, 0 = sin relación.
## 2
Recuperar: quedarse con los k documentos de la base 풟con mayor similitud.
## 3
Generar: el LLM recibe el system prompt, los k fragmentos y la pregunta, concatenados.
Ejemplo numérico (2 dimensiones)
Pregunta: "¿cómo cambio mi contraseña?"  →  φ(q) = (0,8 ; 0,6)
## Documentoφ(d)costop-2
Política de contraseñas(0,6 ; 0,8)0,96
Procedimiento de VPN(1,0 ; 0,0)0,80
Menú de la cafetería(−0,6 ; 0,8)0,00✘
Cálculo: 0,8·0,6 + 0,6·0,8 = 0,96 (los vectores ya miden 1, así que el denominador
es 1).
Para seguridad: un texto escrito para quedar cerca de la pregunta
GANA el top-k, sea verdadero o no. Y si el atacante empuja a otros
fuera del top-k, decide qué lee el modelo.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   B   ·   S U P E R F I C I E   A M P L I A D A
Cinco componentes, cincosuperficies (Guia)
RAG añade al LLM una cadena de suministro de conocimiento. Cada eslabón tiene su ataque y su marco de referencia.
## Bloque B
ComponenteAtaque representativoPropiedad atacadaMarco
①Corpus / fuentes
PoisonedRAG (2024-25), one-shot dominance (2025), inyección
indirecta en documentos
IntegridadLLM04 · LLM01 · AML.T0070
②Modelo de embeddings
Pasajes optimizados (GASLITE, 2024-25); backdoors en el recuperador
(TrojanRAG, BadRAG)
IntegridadLLM08 · LLM03
③Índice / base vectorial
Fuga entre inquilinos; inversión de embeddings (Vec2Text);
membresía
ConfidencialidadLLM08 · LLM02
④Recuperador
Documentos bloqueadores / jamming (2024-25); ruido y conflicto
(SafeRAG)
DisponibilidadLLM08 · LLM10
⑤GeneradorObedece instrucciones recuperadas; extracción literal de la base
Integridad y
confidencialidad
## LLM01 · LLM02 · LLM05
Clave económica: envenenar un RAG NO exige reentrenar nada: basta con que un texto entre al índice. Por eso el umbral para el atacante es mucho más
bajo que el del envenenamiento de entrenamiento de la S11.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   B   ·   E N V E N E N A M I E N T O   D E L   C O N O C I M I E N T O   ·   U S E N I X   S E C U R I T Y   2 0 2 5
PoisonedRAG: dos condiciones, un texto
Zou, Geng, Wang y Jia: inyectar pocos textos para que el RAG dé la respuesta que elige el atacante a una pregunta objetivo.
## Bloque B
Modelo de amenaza
•Elige una pregunta objetivo q* y una
respuesta objetivo r*.
•Puede INSERTAR N textos (p. ej.,
editando una página pública que se
indexa). Por defecto, N = 5.
•No lee la base ni consulta al LLM.
•Caja negra: no conoce el recuperador.
Caja blanca: conoce sus pesos.
Ejemplo del paper:
q* = "¿Quién es el CEO de OpenAI?"
r* = "Tim Cook"
Cada texto envenenado tiene dos partes
S → para ser RECUPERADOI → para CONVENCER al LLM
Condición de recuperación
P debe entrar al top-k de q*: más similar que el k-ésimo documento legítimo d(k). Caja negra: S = q* (¡copiar la
pregunta!). Caja blanca: S se optimiza con HotFlip.
Condición de efectividad
Con P en el contexto, el LLM responde r*. I es un texto de ~30 palabras, generado por otro LLM, que "explica" r*
con aire de fuente confiable.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   B   ·   V I S T O   E N   E L   E S P A C I O   D E   E M B E D D I N G S
Dos estrategias para ganar el top-k
Esquema conceptual en 2D: PoisonedRAG apunta a una pregunta; GASLITE, a todas las preguntas de un tema.
## Bloque B
Lectura: puntos grises = documentos legítimos; estrellas = preguntas; rombos rojos = textos del atacante. En ambos casos el ataque es GEOMÉTRICO: ubicar el
texto donde el recuperador va a mirar.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   B   ·   D I S P O N I B I L I D A D   ·   S H A F R A N ,   S C H U S T E R   Y   S H M A T I K O V
Documentos bloqueadores: el RAG mudo
"Machine Against the RAG" (2024-25): un documento que, al ser recuperado, hace que el sistema se niegue a responder.
## Bloque B
Pregunta objetivo
p. ej., sobre un producto
rival
Top-k + bloqueador B
B copia la pregunta → entra
## LLM
lee B junto a lo legítimo
"No tengo suficiente información"
o "no puedo ayudar con eso"
B = sub-documento de recuperación (copia la consulta) + sub-documento de bloqueo,
optimizado en caja negra (solo consultas, sin conocer el embedder ni el LLM).
Tasa de bloqueo con una sola B (NQ , embeddings GTR)
Respuesta forzadaLlama-2-7bLlama-3.1Vicuna-7bMistral
"Falta información"60%69%44%44%
"Riesgo de seguridad"72%67%45%33%
Recuperación de B > 97%; nunca se recupera para consultas ajenas.
## Sigiloso
Una negativa parece comportamiento normal: nadie
abre un incidente porque el bot "no sabía".
## Paradoja
Los LLM con más entrenamiento de seguridad
resultaron MÁS vulnerables: obedecen la alarma falsa.
## Motivo
Censurar a un competidor, ocultar un tema, degradar
un servicio. Pariente de "White DoS" en SafeRAG.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
B L O Q U E   B   ·   O W A S P   L L M 0 8 : 2 0 2 5   ·   V E C T O R   &   E M B E D D I N G   W E A K N E S S E S
Cuando el índice filtra
Dos fallas de confidencialidad propias de la capa vectorial: el aislamiento entre inquilinos y la inversión de embeddings.
## Bloque B
Fuga entre inquilinos
## Empresa A
sube contratos
## Empresa B
hace preguntas
Índice compartido
sin filtro de inquilino
La búsqueda de B recupera fragmentos de A: son "los más similares" y nadie
preguntó de quién eran.
•Índice o espacio de nombres por inquilino
•Filtrar por permisos DENTRO de la consulta vectorial
•Etiquetas de clasificación heredadas del documento origen
•Registro de qué se recuperó, para quién
Inversión de embeddings
"Text Embeddings Reveal (Almost) As Much As Text" —Vec2Text (Morris et al., EMNLP
## 2023)
## 92 %
de textos de 32 tokens reconstruidos
EXACTOS a partir de su vector
## 89 %
de nombres completos recuperados en
notas clínicas (MIMIC-III)
Mitigación estudiada: ruido sobre el vector
Consecuencia: un vector NO es un dato anonimizado. La base vectorial
merece la misma clasificación, cifrado y control de acceso que los
documentos de origen.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   B   ·   C O N F I D E N C I A L I D A D   D E   L A   B A S E
Membresía y extracción sobre el RAG
¿Está este documento en tu base? ¿Puedo hacer que lo repitas? La S11, ahora sobre el recuperador y no sobre los pesos.
## Bloque B
Inferencia de membresía (Anderson et al., IBM, 2024-25)
El atacante pone el texto candidato x en su pregunta y pregunta si aparece en el contexto. Si x está en
la base, el recuperador lo trae... y el modelo dice que sí.
## 0.81
## 0.89
## 0.74
## 0.82
## 0.79
## 0.78
## 0.99
## 0.96
## 0.83
## 0.96
## 0.83
## 0.81
## 0.5
## 0.6
## 0.7
## 0.8
## 0.9
## 1.0
Salud · flanSalud · Llama-3Salud · MistralEnron · flanEnron · Llama-3Enron · Mistral
## AUC
caja negra (solo Sí/No)caja gris (probabilidades)
Defensa propuesta: instrucción en la plantilla
•Llama-3: AUC 0,96 → 0,51 (azar)
•Mistral: AUC 0,83 → 0,45
•flan: 0,96 → 0,90 (casi no sirve)
Depende del modelo; los autores la llaman "un primer paso", sin
ataques adaptativos.
Extracción de la base (Zeng et al., 2024)
Consultas compuestas: una parte DIRIGE la recuperación hacia
un tema; otra pide al modelo REPETIR su contexto. Resultado:
fragmentos literales de la base privada (correos, consultas
médicas).
Defensas: detectar solapamiento literal entre respuesta y
fragmentos, límites de consulta, permisos, resumir en vez de
citar.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## B L O Q U E   B   ·   D E F E N S A S
Defensa en profundidad para un pipeline RAG
Un control en cada etapa. La regla del Bloque A sigue vigente: probabilísticos para la frecuencia, deterministas para el daño.
## Bloque B
## Ingesta
Procedencia y firma de
cada documento
Flujo de aprobación para
fuentes abiertas
Normalizar: quitar texto
invisible y metadatos
Escanear instrucciones
incrustadas
## Índice
Aislar por inquilino
Permisos dentro de la
consulta
Cifrado y control de
acceso a vectores
Embedder elegido por
robustez (coseno)
## Recuperación
Rerankers y fuentes
diversas
Monitorear documentos
## "omnipresentes"
Preferir fuentes curadas y
recientes verificadas
Filtrado semántico de
anomalías
## Generación
Spotlighting: marcar lo
recuperado como DATO
Jerarquía de instrucciones
Aislar y agregar
(RobustRAG)
Responder con citas
verificables
Salida y operación
RAG Triad: groundedness y
relevancia
DLP y solapamiento literal
Lista de URLs, sin
imágenes externas
Red teaming periódico
(SafeRAG)
Lo que más rinde: procedencia + permisos en la consulta + marcar lo recuperado como dato + acotar lo que el sistema puede HACER con la respuesta. Ninguna
de esas cuatro depende de que el LLM "detecte" el ataque.

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## S Í N T E S I S   ·   D E L   A T A Q U E   A   L A   D E F E N S A
El mapa del día en una tabla
Cada ataque con su marco de referencia y la defensa que más rinde. Úsela como lista de chequeo para auditar un asistente.
## Síntesis
AtaqueDónde golpeaMarcoDefensa que más rinde
Inyección directaEntrada del usuarioLLM01 · AML.T0051.000Privilegio mínimo; autorizar en el backend
Inyección indirecta + exfiltraciónContenido que la app leeLLM01 · AML.T0051.001Romper la trifecta; CaMeL; lista de URLs; humano
Jailbreak (GCG, Crescendo, many-shot)Alineamiento del modeloAML.T0054Clasificadores de entrada y de trayectoria; filtros de salida
Fuga del system promptPlantilla del desarrolladorLLM07 · AML.T0056Nada secreto en el prompt; controles fuera del LLM
Divulgación sensible / salida mal manejadaContexto y destinosLLM02 · LLM05Permisos antes de recuperar; codificar y validar salidas
PoisonedRAG / one-shot dominanceCorpus de conocimientoLLM04 · AML.T0070Procedencia y aprobación; RobustRAG; k mayor
GASLITE / bloqueadoresEmbeddings y recuperadorLLM08
Reranking, diversidad; monitorear documentos
omnipresentes
Inquilinos, inversión, membresíaÍndice vectorialLLM08 · LLM02Aislar índices; permisos en la consulta; cifrar vectores

## II
## S12
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 12: Seguridad de LLMs y Arquitecturas RAG
## C I E R R E
Para llevarse, leer y pensar
## Cierre
Tres frases
## 1
En un LLM el texto es código
y no hay "consulta parametrizada" todavía.
## 2
El recuperador decide qué lee el modelo
por geometría, no por verdad: cinco textos entre millones
bastan.
## 3
Diseña asumiendo la inyección
y acota lo que el sistema puede HACER cuando ocurra.
Lecturas clave
•Greshake et al. —Indirect Prompt Injection (AISec 2023)
•Zou et al. —GCG (2023) · Russinovich et al. —Crescendo (USENIX Sec
## 2025)
•Zou et al. —PoisonedRAG (USENIX Security 2025)
•Ben-Tov y Sharif —GASLITE (2024-25) · Shafran et al. —Blocker
documents
•Debenedetti et al. —CaMeL (2025) · Willison —The lethal trifecta (2025)
•Hines et al. —Spotlighting (2024) · Liang et al. —SafeRAG (ACL 2025)
•OWASP Top 10 for LLM Applications 2025 · MITRE ATLAS
Para pensar: su organización quiere un asistente que lea el correo de los
clientes y pueda responderles. ¿Qué quitaría, qué aislaría y dónde pondría a
un humano?