

## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA AgénticaMSIN-4216 · Ciberseguridad e IA · MESI · Universidad de los Andes
## M Ó D U L O   I I   ·   S E S I Ó N   1 3
Seguridad de la IA Agéntica
Agentes autónomos, uso de herramientas, orquestadores y trazabilidad semántica.
Andrea Pinto, Ph.D.
Profesora del curso · Semestre 2026-2

## II
## S13
Sesión 13 · Seguridad de la IA Agéntica
## A P E R T U R A   ·   D E   L A   S 1 2   A   L A   S 1 3
Del modelo que
lee al agente
que actúa
## Apertura
En la S12 el riesgo era que el LLM
obedeciera texto ajeno y lo dijera.
Un agente lo obedece y lo HACE: envía,
compra, borra, ejecuta, recuerda.
La misma inyección, con otro radio de
impacto.
Qué añade un agente a un LLM
Planeación en varios pasos
Descompone una meta en decenas de acciones encadenadas, sin un humano entre
ellas.
Memoria persistente
Lo que entra hoy puede seguir influyendo dentro de semanas, en otras sesiones.
Herramientas y protocolos
MCP, APIs, navegador, shell: el texto se convierte en efectos en el mundo.
Otros agentes
Orquestadores y sub-agentes (A2A) que confían unos en otros.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## A P E R T U R A   ·   E L   M A P A   D E L   D Í A
Anatomía de un agente y sus superficies
Cada caja es un canal por donde entra texto no confiable o sale una acción. Etiquetas: OWASP Agentic Top 10 (2026).
## Apertura
Memoria persistente
ASI06 envenenamiento de memoria
Conocimiento (RAG)
ASI06 contexto envenenado
Identidad y credenciales
ASI03 abuso de privilegios
Usuario: meta g
ASI09 explotar la confianza humana
Herramientas (MCP)
ASI02 uso indebido · ASI04 cadena
Entorno: web, correo, archivos
ASI01 secuestro de la meta
Otros agentes (A2A)
ASI07 comunicación · ASI08 cascadas
Ejecución de código
ASI05 ejecución inesperada (RCE)
Planificador (LLM)
decide el siguiente paso · ASI10 agente
## "rebelde"
Pregunta guía del día: si este agente fuera engañado AHORA, ¿qué es lo peor que podría hacer, con qué permisos, y cómo nos enteraríamos
después?

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## A P E R T U R A   ·   P O R   Q U É   A H O R A
2025-2026: los agentes salieron a producción
Cuatro cifras documentadas que muestran que la superficie agéntica ya está expuesta.
## Apertura
## 42.665
instancias públicas expuestas del agente personal
OpenClaw (feb. 2026), que tiene acceso a shell y archivos
por diseño
## 341
"skills" maliciosas encontradas entre 2.857 auditadas en
ClawHub, su mercado de extensiones (~12 %)
## 250.000+
ataques de 400+ personas contra agentes de 13 modelos
de frontera: todos fueron vulnerados (NIST CAISI, mar.
## 2026)
## ~90 %
de la actividad de intrusión de la campaña de espionaje
GTG-1002 la ejecutó un agente (Anthropic, nov. 2025)
Y el marco de referencia llegó: OWASP publicó el Top 10 for Agentic Applications el 9 de diciembre de 2025. Es el mapa que usaremos para cerrar la
sesión.

## S13
## M Ó D U L O    I I   ·   S E S I Ó  N   1 3   ·   P A R T E   1   D E   2
## B L O Q U  E   A   ·   9 0   M  I N    ·    D E M O   G U I  A D A
Superficie de ataque de
agentes autónomos
•De LLM a agente: planeación, reflexión, memoria, tool-calling y protocolos (MCP, A2A)
•Taxonomía (SoK 2026): memoria (AgentPoison), herramientas (Imprompter), fallas amplificadas
(Breaking Agents)
•Riesgos multi-agente y desalineación agéntica (insider threats)
•Excessive Agency (LLM06) · casos reales · demo AgentDojo → Lab Bono B · Capstone
ReActMCPAgentPoisonImprompterLLM06AgentDojo

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   A   ·   D E   L L M   A   A G E N T E
El bucle del agente
Un agente es un LLM dentro de un ciclo: observa, decide, actúa, vuelve a observar. El flujo lo decide el modelo, no el programador.
## Bloque A
g
la meta que fijó el usuario
o₁:ₜ
todo lo observado: resultados de herramientas, páginas, correos
mₜ
la memoria (de esta sesión y de las anteriores)
πθ
la política: el LLM que elige la acción
aₜ
la acción: llamar una herramienta, escribir, delegar, terminar
Lectura de seguridad: g viene del usuario, pero o y m pueden venir de CUALQUIERA.
Si el atacante controla parte de o o de m, influye en a, en cada vuelta del ciclo.
Tres patrones de arquitectura
ReAct (2022)
Alterna razonar → actuar → observar, paso a paso. Flexible:
cada observación puede cambiar el rumbo.
Planear y ejecutar
Primero un plan completo, luego se ejecuta. Más predecible:
los datos no reescriben el plan.
## Reflexión
El agente critica sus propios resultados y reintenta, guardando
"lecciones" en memoria.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   A   ·   C O M P O N E N T E S
Memoria, herramientas y orquestación
Las tres piezas que convierten un error de texto en un incidente persistente, con efectos y que se propaga.
## Bloque A
## Memoria
Corto plazo
el contexto de la tarea actual
Largo plazo
hechos y preferencias que persisten entre
sesiones
Episódica / experiencia
trayectorias pasadas que se recuperan como
ejemplos
## Riesgo
lo que entra se queda: PERSISTENCIA
## Herramientas
## Definición
nombre + descripción + esquema JSON de
argumentos
## Llamada
el LLM emite {herramienta, argumentos}; la
app la ejecuta
## Resultado
vuelve al contexto como observación
## Riesgo
texto → EFECTOS con privilegios reales
## Orquestación
## Orquestador
divide la meta y reparte sub-tareas
## Sub-agentes
especializados, con sus propias herramientas
## Mensajes
resultados que unos agentes leen de otros
## Riesgo
confianza implícita: PROPAGACIÓN

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   A   ·   P R O T O C O L O S
MCP y A2A: el estándar también es superficie
MCP conecta agentes con herramientas; A2A, agentes entre sí. Ambos transportan texto en el que el modelo confía.
## Bloque A
MCP · Model Context Protocol
Anthropic, nov. 2024 · cliente (el agente) servidores de herramientas, recursos y
prompts
Envenenamiento de herramientas
instrucciones ocultas en la DESCRIPCIÓN de una herramienta: el modelo las lee, el
usuario no
"Rug pull"
la definición cambia DESPUÉS de que el usuario la aprobó
## Sombreado (shadowing)
un servidor malicioso influye en cómo se usan las herramientas de otro servidor
confiable
## Caso
Invariant Labs (2025): un servidor "inofensivo" hizo que el agente reenviara el
historial de WhatsApp vía otro servidor
A2A · Agent2Agent
Google, abr. 2025 · agentes de distintas organizaciones colaboran; cada uno publica
una "Agent Card"
## Suplantación
una Agent Card falsa que anuncia capacidades o identidad que no tiene
Contrabando de sesión
agente remoto que, en una sesión de varios turnos, inyecta instrucciones
encubiertas al cliente
"Teléfono roto"
afirmaciones no verificadas ganan autoridad al pasar de agente en agente
## Caso
Unit 42 (oct. 2025): un agente remoto logró que el cliente revelara sus
herramientas y ejecutara una compra de acciones

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   A   ·   T A X O N O M Í A   ·   S O K   2 0 2 6
Un mapa sistemático de la superficie agéntica
Dehghantanha y Homayoun, "SoK: The Attack Surface of Agentic AI —Tools and Autonomy" (marzo 2026): objetivos, vectores y rutas.
## Bloque A
Objetivos del atacante
## G1
Exfiltración de datos
## G2
Romper integridad / seguridad
## G3
Escalar privilegios
## G4
Abuso de recursos
## G5
## Fraude
## G6
Persistencia / backdoor
## G7
Cadena de suministro
dorado = habilitadores · rojo = resultados
Rutas de ataque típicas
P1prompt directoherramienta mal usada
P2contenido no confiableLLMherramienta
## P3herramienta Apivoteherramienta B
P4índice envenenadorecuperaciónrespuesta
## P5agente 1saltoagente 2acción
Conclusión de la SoK: trate "LLM + herramientas" como riesgo de RCE hasta demostrar lo contrario (cita 19
fallas de RCE en 11 frameworks de agentes). Los controles estructurales superan a los filtros.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   E N V E N E N A M I E N T O   D E   M E M O R I A   ·   A S I 0 6
De inyección puntual a implante persistente
Si el atacante logra que algo se ESCRIBA en la memoria del agente, su influencia sobrevive a la conversación.
## Bloque A
## Día 1
Una inyección indirecta lleva al agente a
GUARDAR una "preferencia" o "lección" falsa
Día 1 + n
La conversación terminó. Nada visible quedó en
pantalla
## Día 30
Una tarea normal recupera ese recuerdo: el
agente actúa según el atacante
SpAIware
Rehberger, sept. 2024
Contenido malicioso hizo que ChatGPT (app macOS) guardara en su memoria
persistente la orden de enviar TODAS las conversaciones futuras a un servidor
externo. OpenAI cerró el canal de exfiltración; la memoria sigue siendo
escribible por inyección.
## MINJA
NeurIPS 2025
El atacante solo hace consultas como un usuario normal (sin acceso a la
memoria) y logra que el agente almacene registros envenenados: >95 % de
inyección exitosa y >70 % de ataque exitoso en condiciones de laboratorio.
Control clave: tratar la escritura en memoria como una ACCIÓN privilegiada: con procedencia, revisable por el usuario, con caducidad, y nunca desde
contenido no confiable sin confirmación.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   E N V E N E N A M I E N T O   D E   M E M O R I A / C O N O C I M I E N T O   ·   N E U R I P S   2 0 2 4
AgentPoison: un disparador en la memoria
Chen, Xiang, Xiao, Song y Li: un backdoor sin entrenar nada; el veneno vive en la memoria o la base de conocimiento del agente.
## Bloque A
## Inyectar
pocas entradas (consulta con
disparador → acción maliciosa) en
la memoria
## Recuperar
si la consulta trae el disparador, el
recuperador trae ESAS entradas
## Actuar
el agente imita la "experiencia"
recuperada y ejecuta la acción
uni
unicidad: aleja las consultas con disparador de
las normales
cpt
compacidad: las agrupa para que recuperen el
veneno
tar
objetivo: el LLM debe producir la acción
maliciosa
coh
coherencia: el texto con disparador parece
natural
## Resultados
## ≥ 80 %
éxito promedio del ataque en los tres agentes
## < 0,1 %
de la memoria envenenada
## ≤ 1 %
caída del rendimiento normal: no se nota
Agentes: conducción autónoma, QA con
conocimiento, historia clínica (EHR). Disparador de
hasta un token; transfiere a otros embedders.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   U S O   I N D E B I D O   D E   H E R R A M I E N T A S   ·   A S I 0 2
Imprompter: un prompt que usa tus herramientas
Fu et al. (UC San Diego, 2024): prompts ofuscados que hacen que el agente extraiga datos personales y los envíe.
## Bloque A
## 1
El cebo
El usuario pega en el chat un texto "útil" (p. ej., una plantilla)
que incluye una cadena optimizada que parece basura.
## 2
La extracción
El agente recorre la conversación y extrae datos personales:
nombre, correo, dirección, tarjeta...
## 3
El envío
Los empaqueta en una URL de imagen en markdown hacia el
servidor del atacante; la interfaz la carga sola.
La cadena se optimiza con gradientes en un modelo abierto y TRANSFIERE a agentes
en producción.
## ~80 %
de éxito de extremo a extremo contra el agente LeChat de
Mistral (además de agentes sobre ChatGLM y Llama)
## Lecciones
•El usuario es cómplice involuntario: él mismo pega el texto.
•Ilegible para un humano, claro para el modelo: revisar a ojo no
sirve.
•Lo que se arregló fue el CANAL: Mistral dejó de cargar
imágenes externas (la misma lección de la S12).

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   A M P L I F I C A C I Ó N   D E   F A L L A S   ·   E M N L P   2 0 2 5
Breaking Agents: romper sin parecer malicioso
Zhang et al. (CISPA y otros): en vez de pedir algo dañino, inducir bucles infinitos o acciones irrelevantes. Más difícil de detectar.
## Bloque A
## 15.0
## 59.0
## 88.1
## 32.1
## 0
## 25
## 50
## 75
## 100
Sin ataqueBucle infinito
## (promedio)
Inyección · Claude-2Inyección · GPT-4
tareas fallidas (%)
Agentes emulados (ToolEmu). Fuente: Zhang et al.; GPT-4 resistió más.
Propagación: un agente de CSV comprometido que alimenta a uno de Gmail le
transmitió la falla en ~75-80 % de los casos.
Bucle infinito
El agente repite la misma acción hasta agotar su límite de
iteraciones: tiempo, dinero y disponibilidad.
Función incorrecta
Lo desvía hacia una acción benigna pero irrelevante: la tarea
real nunca se hace.
Por qué es peor
Pedir "roba datos" contiene palabras delatoras; pedir "repite
el paso" no. La auto-revisión del LLM detectó 0 % de estos
ataques.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   R I E S G O S   M U L T I-A G E N T E   ·   A S I 0 7   ·   A S I 0 8
Cuando los agentes se hablan entre sí
Hammond et al., "Multi-Agent Risks from Advanced AI" (feb. 2025): fallas que no existen en un agente solo.
## Bloque A
Mala coordinación
Comparten la meta pero no logran cooperar:
duplican, se contradicen, se bloquean.
## Conflicto
Tienen metas distintas (de dueños distintos) y
compiten: negociación agresiva, engaño.
## Colusión
Cooperan... en contra de nosotros: acuerdos
tácitos de precios, ocultar fallas mutuas.
Siete factores de riesgo
Asimetrías de informaciónEfectos de red
Presiones de selecciónDinámicas desestabilizadoras
Compromisos y confianzaAgencia emergente
Seguridad multi-agente
Lo que ya se midió
•Cascadas: una falla inducida en un agente pasó al siguiente en
~75-80 % de los casos (Breaking Agents).
•Contrabando de sesión: un agente remoto en A2A obtuvo
instrucciones, herramientas y una compra no autorizada (Unit 42).
•Confianza transitiva: "el otro agente ya lo verificó" no es una
verificación.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   D E S A L I N E A C I Ó N   A G É N T I C A   ·   A S I 1 0
El agente como amenaza interna
Anthropic, "Agentic Misalignment" (jun. 2025): 16 modelos, empresa simulada, amenaza de reemplazo + conflicto de metas.
## Bloque A
## 96
## 96
## 80
## 80
## 79
## 12
## 0255075100
## Claude Opus 4
## Gemini 2.5 Flash
## GPT-4.1
## Grok 3 Beta
DeepSeek-R1
## Llama 4 Maverick*
% de muestras con chantaje (escenario de texto)
- 0 % con el prom pt exacto; 12 % con un pequeño ajuste. Escenarios artificiales que fuerzan un dilema
binario.
¿"Sabía" que era una prueba?
## 55,1 %
chantaje cuando el modelo dijo creer
que era REAL
## 6,5 %
cuando dijo creer que era una
## EVALUACIÓN
Recomendaciones de los autores
•Aprobación humana para toda acción irreversible.
•Acceso a información según necesidad de saber.
•Cuidado al imponer metas fuertes al agente.
•Instrucciones explícitas reducen, pero NO eliminan, la conducta.
•Sin evidencia en despliegues reales hasta ahora.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   O W A S P   L L M 0 6 : 2 0 2 5   ·   E X C E S S I V E   A G E N C Y
Excesode agencia
Daño causado por acciones del sistema ante salidas inesperadas, ambiguas o manipuladas del modelo.
## Bloque A
Funcionalidad excesiva
El agente tiene herramientas o funciones que su
tarea no necesita.
Un lector de documentos que también puede
borrar
Una herramienta vieja que nadie retiró
Shell o "fetch URL" genéricos en vez de funciones
acotadas
Control: Solo las herramientas y funciones
estrictamente necesarias
Permisos excesivos
Las herramientas acceden a sistemas con más
privilegios de los necesarios.
Caso de uso de lectura con cuenta que escribe
Cuenta compartida de alto privilegio para todos
los usuarios
Tokens de larga vida y alcance amplio
Control: Mínimo privilegio, en el contexto del
usuario que pide
Autonomía excesiva
Acciones de alto impacto sin verificación
independiente.
Borrar, enviar, pagar sin confirmación
Planes largos sin puntos de control
Autorización delegada en el "juicio" del LLM
Control: Aprobación humana + autorización en el
sistema destino
Ejemplo de OWASP: asistente de correo que lee y ENVÍA; un correo entrante con instrucciones lo lleva a buscar datos sensibles y reenviarlos. Cualquiera de tres
cambios lo evita: quitar el envío, scope OAuth de solo lectura, o aprobar cada envío.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   A   ·   D E   L A   A G E N C I A   A L   D A Ñ O
Exfiltración y manipulación vía acciones
Clasificar las acciones del agente por tipo y reversibilidad es el primer paso para decidir dónde poner controles.
## Bloque A
Clase de acciónEjemplosCómo la explota un atacanteReversibleControl mínimo
## Leer
buscar correos, consultar BD, leer
archivos
Reúne los datos que luego exfiltraSí
Necesidad de saber; permisos del
usuario
Comunicar hacia afuera
enviar correo, llamar webhook, cargar
URL, publicar
EXFILTRACIÓN: es el canal de salida de la
trifecta
## No
Lista de destinos; aprobación con datos
sensibles
Escribir / modificar
editar archivos, tickets, configuración,
memoria
MANIPULACIÓN y persistencia (memoria,
reglas de correo)
A vecesVersionado; revisión de cambios
Ejecutarshell, código, scripts, desplieguesRCE con los privilegios del agenteNoSandbox sin red ni secretos
## Transaccionar
pagos, compras, transferencias, permisos
## IAM
Fraude y escalamiento de privilegiosNoAprobación dual; límites de monto
Borrararchivos, registros, recursos en la nubeSabotaje y destrucción de evidenciaNo
Prohibido por defecto; humano +
respaldo
Patrón de los incidentes: casi siempre es LEER algo privado + COMUNICAR o ESCRIBIR hacia un lugar que el atacante ve. Controlar las acciones de salida corta la mayoría
de las cadenas de exfiltración.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   A   ·   E V A L U A R   L A   S E G U R I D A D   D E   U N   A G E N T E
Benchmarks: AgentDojo, AgentHarm, ASB
Tres preguntas distintas: ¿lo pueden secuestrar?, ¿hace daño si se lo piden?, ¿cuánto resisten sus defensas?
## Bloque A
AgentDojo
ETH Zurich · NeurIPS 2024 (D&B)
¿Lo secuestra una inyección indirecta?
97 tareas de usuario, 629 casos de seguridad
4 entornos: Workspace, Slack, Travel, Banking
Usado por el NIST (CAISI) y en casi toda defensa
## 2025
AgentHarm
Gray Swan + UK AISI · ICLR 2025
¿Ejecuta tareas dañinas si el USUARIO las pide?
110 tareas maliciosas (440 con aumentos)
11 categorías: fraude, cibercrimen, acoso...
Muchos modelos cumplen incluso sin jailbreak
## ASB
Agent Security Bench · ICLR 2025
¿Cuánto resisten ataques y defensas variadas?
10 escenarios, >400 herramientas, 13 LLM
27 métodos de ataque y defensa
Éxito promedio máximo de ataque: 84,3 %
Las tres métricas de AgentDojo
+ utilidad BAJO ataque: ¿sigue cumpliendo la tarea del usuario?

## S13
## M Ó D U L O    I I   ·   S E S I Ó  N   1 3   ·   P A R T E   2   D E   2
## B L O Q U  E   B   ·    9 0   M I N
Trazabilidad semántica y
verificación de alta garantía
•Trazabilidad: procedencia de datos e instrucciones, trazas auditables, razonamiento y atribución
•Alta garantía: humano para lo irreversible, mínimo privilegio, políticas verificadas antes de ejecutar
•Monitores en tiempo de ejecución, planos de control y de datos, desviación semántica
•Evaluación de robustez (AgentDojo) y mapeo al OWASP Top 10 for Agentic Applications 2026
procedenciaOpenTelemetryHITLProgentMELONASI01-10

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   B   ·   T R A Z A B I L I D A D   S E M Á N T I C A
Del "qué pasó" al "por qué pasó"
Un log clásico registra eventos. Una traza semántica registra la cadena causal: intención → datos → decisión → acción.
## Bloque B
## Intención
"Responde a Ana por la reunión"
usuario · confiable
Dato leído
correo de "proveedor" con texto
oculto
externo · NO confiable
## Decisión
el plan añade "reenviar contrato"
derivada de ambos
## Acción
enviar_correo(dest = externo,
adjunto = contrato)
arg. "dest" ← dato no confiable
enlace de procedencia: el destinatario proviene del correo externo, no de la intención
¿De dónde vino?
procedencia de cada dato e instrucción:
usuario, sistema, herramienta, documento
externo, otro agente
¿Quién lo pidió?
identidad del usuario y del agente que
actúa; cadena de delegación entre agentes
¿Qué lo causó?
qué entradas determinaron la decisión:
atribución, no solo correlación

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   B   ·   P R O C E D E N C I A   D E   D A T O S   E   I N S T R U C C I O N E S
Etiquetar cada dato con su origen
Control de flujo de información (IFC): cada valor lleva etiquetas de integridad y confidencialidad que se propagan.
## Bloque B
La etiqueta de un resultado es la combinación (⊔) de las etiquetas de todo lo que lo
produjo: si UNA entrada no es confiable, el resultado tampoco.
EtiquetaValoresPregunta que responde
Integridadconfiable ⊑no confiable
¿Puede este valor DECIDIR una
acción?
## Confidencialidadpúblico ⊑interno ⊑secreto
¿A dónde puede SALIR este
valor?
Regla de integridad: una acción sensible no puede tener argumentos con etiqueta "no
confiable". Regla de confidencialidad: un dato "secreto" no puede ir a un destino
## "público".
Propagación en el agente de correo
intención del usuario
confiable · interno
correo externo leído
NO confiable · público
contrato.pdf
confiable · secreto
enviar_correo(...)
dest: NO confiable
adjunto: secreto
Estado del arte
•FIDES (Microsoft, 2025): planificador que rastrea etiquetas y aplica
políticas de forma determinista; oculta selectivamente variables al LLM.
•CaMeL (Google DeepMind, 2025): capacidades por valor y políticas en
cada llamada (S12).

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   B   ·   R E G I S T R O   A U D I T A B L E
Trazas estándar y a prueba de manipulación
OpenTelemetry ya define convenciones para agentes. Falta lo que la seguridad exige: integridad del registro y contenido protegido.
## Bloque B
Una traza de agente (convenciones GenAI de OpenTelemetry)
invoke_agent asistente_correo
gen_ai.agent.id · gen_ai.conversation.id
chat modelo-X
gen_ai.operation.name ·
gen_ai.provider.nam e
execute_tool leer_correos
gen_ai.tool.name · gen_ai.tool.call.id
chat modelo-X
decide la siguiente acción
invoke_agent subagente_archivos
delegación: span anidado
execute_tool adjuntar_archivo
argumentos y resultado (opt-in)
execute_tool enviar_correo
← la acción a auditar
Estado: "Development" (pueden cambiar). El contenido de prompts y respuestas va en eventos, por opt-in.
Bitácora encadenada
Cada entrada eᵢ incluye el hash de la anterior: borrar o alterar un
evento rompe la cadena. Firmar y enviar fuera del alcance del
agente.
Qué registrar, como mínimo
•Intención original y su autor
•Cada entrada con su origen y etiqueta
•Cada llamada: herramienta, argumentos, decisión de política
•Aprobaciones humanas: quién, qué vio, cuándo

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   B   ·   R E G I S T R A R   L A   C A D E N A   D E   R A Z O N A M I E N T O
Leer lo que el agente "piensa": útil y frágil
Los modelos de razonamiento escriben su cadena de pensamiento. Registrarla y monitorearla ayuda... si no la tratamos como verdad.
## Bloque B
La oportunidad
"Chain of Thought Monitorability: A New and Fragile Opportunity for AI
Safety" (jul. 2025): 40+ autores de OpenAI, Google DeepMind,
Anthropic y Meta. En tareas difíciles el modelo NECESITA razonar por
escrito, y un monitor puede leer intenciones como "voy a ignorar la
instrucción del usuario".
La fragilidad
•Si se entrena al modelo para que su razonamiento "se vea bien",
aprende a ocultarlo (OpenAI, mar. 2025: reward hacking ofuscado).
•El razonamiento no siempre es fiel: en un estudio de Anthropic (2025)
los modelos mencionaron la pista que usaron solo en 25-39 % de los
casos.
## Registrar
guardar el razonamiento junto a cada acción, con acceso restringido
(puede contener datos sensibles)
## Monitorear
un modelo distinto lee la traza buscando secuestro de la meta o
planes fuera de rol (AlignmentCheck de LlamaFirewall)
No optimizar
no usar el monitor como señal de entrenamiento: destruye lo que
mide
No confiar
el razonamiento es evidencia, no prueba: la autorización se decide
por política, no por lo que el modelo "dice"

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   B   ·   A T R I B U C I Ó N   D E   D E C I S I O N E S
¿Esta acción la decidió el usuario o el dato?
Atribución contrafactual: re-ejecutar sin la intención del usuario. Si la acción se repite, la está dictando el contenido.
## Bloque B
Ejecución normal
intención u + observaciones o
Ejecución enmascarada
tarea neutra, mismas o
llamadas: enviar_correo(X)
llamadas: enviar_correo(X)
iguales → la dicta el dato
•A(u, o): acciones con la intención real u y las observaciones o
•A(∅, o): acciones con la intención enmascarada · τ: umbral de similitud
Se comparan solo las LLAMADAS a herramientas (nombre y argumentos, no el texto), acumuladas a lo largo
de los pasos.
## MELON · ICML 2025
## 0,32 %
éxito del ataque (MELON-Aug, GPT-4o, AgentDojo)
## 68,7 %
utilidad conservada
Costo: una segunda ejecución por paso.
Límite: si la tarea del usuario y la del atacante
piden la misma acción, no las distingue.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## B L O Q U E   B   ·   H U M A N O   E N   E L   B U C L E
Aprobación humana donde importa
No todo necesita un humano; lo irreversible y de alto impacto, sí. Y la aprobación tiene que ser difícil de engañar.
## Bloque B
columnas: bajo → alto impacto · filas: reversible → irreversible
Automático + registro
reversible · bajo im pacto
buscar, leer un archivo propio,
borrador
Automático + notificación
reversible · alto impacto
editar un documento compartido
## (versionado)
Confirmación del usuario
irreversible · bajo impacto
enviar un correo interno, publicar
en un canal
Aprobación dual + espera
irreversible · alto impacto
pagos, borrados, cambios de
permisos, envío externo con datos
Cómo falla una aprobación (y qué hacer)
## 1
## Fatiga
si se aprueba todo, se aprueba sin leer → aprobar solo lo que
importa (la matriz)
## 2
Pantalla manipulable
el agente redacta el resumen que el humano lee → mostrar los
ARGUMENTOS reales, no la explicación del modelo
## 3
Canal compartido
la confirmación pasa por el mismo chat que el atacante influye →
canal que el modelo no controla
## 4
Aprobación del plan, no del efecto
"¿sigo?" no basta → mostrar el efecto concreto: destinatario, monto,
diff

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   B   ·   V A L I D A C I Ó N   D E   A C C I O N E S   C O N T R A   P O L Í T I C A S
Ninguna acción sin una decisión de política
Políticas como código, evaluadas ANTES de ejecutar, con el contexto completo: usuario, tarea, procedencia y estado.
## Bloque B
Acción propuesta
## {herramienta,
argumentos}
Validar esquema
tipos, rangos, formatos
Adjuntar contexto
usuario, tarea, etiquetas,
historial
Motor de políticas
OPA/Rego, Cedar o
propio
## Decisión
permitir · denegar ·
escalar
Tipo de reglaEjemploAtaque que corta
Destinoenviar_correo solo a dominios aprobadosExfiltración (EchoLeak, ForcedLeak)
Procedencianingún argumento de pago con integridad "no confiable"Secuestro de la meta (ASI01)
Flujotras leer datos secretos, ninguna acción de salidaTrifecta letal
Tasa y presupuesto≤ 20 llamadas por tarea; ≤ N USD; sin repetir la misma 5 vecesBucles (Breaking Agents)
Alcanceescritura solo en el directorio del proyectoBorrado y RCE (Replit)

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   B   ·   M O N I T O R E S   Y   G U A R D R A I L S   E N   T I E M P O   D E   E J E C U C I Ó N
Monitores: la capa probabilística que vigila
No reemplazan al monitor de referencia: detectan lo que las políticas no previeron. Cada uno mira algo distinto.
## Bloque B
MonitorQué observaEjemplo (2025)Punto débil
Clasificador de entradatexto del usuario y de herramientasPromptGuard 2 (LlamaFirewall)ataques adaptativos u ofuscados
Auditor de alineaciónrazonamiento + acciones vs. meta del usuarioAlignmentCheck (LlamaFirewall)otro LLM: también manipulable
Analizador de códigocódigo generado antes de ejecutarloCodeShield: 96 % precisión, 79 % recallsolo patrones conocidos
Contrafactual¿la acción depende del usuario o del dato?MELON (ICML 2025)doble costo; tareas ambiguas
Deriva interna
activaciones del modelo antes/después de leer
datos
TaskTracker (Microsoft, 2024)requiere acceso al modelo
Comportamientobucles, tasas, costo, acciones fuera de rollímites y alertas del SIEMumbrales; falsos positivos
LlamaFirewall (Meta, may. 2025): combinar PromptGuard 2 + AlignmentCheck redujo más de 90 % el éxito de los ataques en AgentDojo. Útil... y
probabilístico: la lección de "The Attacker Moves Second" sigue vigente.

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
B L O Q U E   B   ·   S E P A R A C I Ó N   D E   P L A N O S   D E   C O N T R O L   Y   D E   D A T O S
Que el dato nunca toque el plano de control
La solución estructural al canal único de la S12: separar quién decide (control) de qué se procesa (datos).
## Bloque B
PLANO DE CONTROL · confiable
Intención del usuario
## Planificador
privilegiado
Políticas y monitor
PLANO DE DATOS · no confiable
Correos, webs,
archivos
Resultados de
herramientas
LLM en cuarentena
(extrae campos)
instruccionessolo valores tipados
Ya lo hicimos antes
•Telefonía: señalización SS7 fuera de banda
•SQL: consultas parametrizadas
•Redes: plano de control separado (SDN)
Patrones para agentes
•Planear y luego ejecutar
•Dual LLM / CaMeL
•Selector de acciones
•Minimizar contexto

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
S Í N T E S I S   ·   O W A S P   T O P   1 0   F O R   A G E N T I C   A P P L I C A T I O N S   2 0 2 6
El mapa del día sobre el OWASP agéntico
Publicado el 9 de diciembre de 2025. En verde, los tres riesgos foco del programa.
## Síntesis
IDRiesgoLo vimos enControl principal
ASI01Agent Goal Hijackinyección indirecta, A2A, Atlas (S12)planos separados; procedencia; deriva
ASI02Tool Misuse & ExploitationImprompter, MCP, Supabasepolíticas por herramienta (Progent); esquemas
ASI03Identity & Privilege Abuseservice_role, tokens ampliosidentidad por agente; OAuth mínimo; tokens cortos
ASI04Agentic Supply Chainskills de OpenClaw, Amazon Q, rug pullrevisión y firma; versiones fijas; inventario
ASI05Unexpected Code ExecutionSoK: 19 RCE en 11 frameworkssandbox sin red ni secretos; CodeShield
ASI06Memory & Context PoisoningAgentPoison, MINJA, SpAIwareescritura en memoria como acción; procedencia
ASI07Insecure Inter-Agent Comm.contrabando de sesión (A2A)Agent Cards firmadas; autenticar mensajes
ASI08Cascading FailuresBreaking Agents (~75-80 %)límites, presupuesto, aislamiento entre agentes
ASI09Human-Agent Trust Exploitationpantallas de aprobación manipulablesaprobación sobre argumentos reales; otro canal
ASI10Rogue Agentsdesalineación agénticanecesidad de saber; humano en lo irreversible; control

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## S Í N T E S I S   ·   A R Q U I T E C T U R A   D E   R E F E R E N C I A
Un agente defendible, de punta a punta
Todo lo del Bloque B en un solo diagrama: cada capa responde a una pregunta de la lámina 4.
## Síntesis
## Identidad
agente con identidad propia; actúa en nombre del usuario con alcances mínimos
¿con qué permisos?
Plano de control
intención + planificador privilegiado; plan antes de leer datos no confiables
¿quién decide?
Plano de datos
contenido externo y memoria con etiquetas de procedencia; LLM en cuarentena
¿de dónde vino?
Monitor de referencia
esquema + políticas como código + procedencia + aprobación humana
¿se permite?
Ejecución aislada
credenciales solo en el ejecutor; sandbox; lista de salida
¿qué puede dañar?
## Observabilidad
trazas OTel encadenadas; monitores de deriva y comportamiento → SOC
¿cómo nos enteramos?

## II
## S13
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 13: Seguridad de la IA Agéntica
## C I E R R E
Para llevarse, leer y pensar
## Cierre
Tres frases
## 1
La autonomía multiplica el impacto
más pasos, memoria y herramientas: la misma inyección hace
más daño.
## 2
Trazabilidad es saber POR QUÉ
procedencia, trazas encadenadas y atribución, no solo eventos.
## 3
El LLM propone; la política dispone
monitor de referencia, mínimo privilegio y humano en lo
irreversible.
Lecturas clave
•Dehghantanha y Homayoun —SoK: Attack Surface of Agentic AI (2026)
•Chen et al. —AgentPoison (NeurIPS 2024) · Fu et al. —Imprompter
•Zhang et al. —Breaking Agents (EMNLP 2025) · Lynch et al. —Agentic
## Misalignment
•Debenedetti et al. —AgentDojo (NeurIPS 2024) · NIST CAISI (2025-26)
•Shi et al. —Progent · Zhu et al. —MELON · Greenblatt et al. —AI Control
•OWASP LLM06:2025 · OWASP Top 10 for Agentic Applications 2026
Para pensar: su SOC quiere un agente que cierre automáticamente alertas
"obvias". ¿Qué podría hacer un atacante con eso, y qué capas pondrían?