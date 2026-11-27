

## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOpsMSIN-4216 · Ciberseguridad e IA · MESI · Universidad de los Andes
## M Ó D U L O   I I   ·   S E S I Ó N   1 5
Defensa, Robustecimiento Verificable y MLSecOps
De entrenamiento adversarial a robustez certificada —y cómo llevar las garantías al pipeline.
Andrea Pinto, Ph.D.
Profesora del curso · Semestre 2026-2
60 minutos · sesión compacta · Lab 6

## S15
## S E S I Ó N   1 5
MLSecOps: el pipeline
como control de seguridad
•Compuertas de seguridad en cada fase, incluida una compuerta de robustez
•Integridad más allá de la firma: atestaciones, AIBOM y madurez CoSAI
•Linaje de punta a punta: de la fuente de datos a la alerta
•Operación: deriva, ataques en inferencia, respuesta y red teaming continuo
compuertasatestaciónAIBOMlinajederivarespuesta

## II
## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOps
## B L O Q U E   B   ·   M L S E C O P S
Una compuerta de seguridad en cada fase
Guía de referencia: OpenSSF, "Visualizing Secure MLOps" (Dell y Ericsson, agosto de 2025).
## Bloque B
¿Qué es MLSecOps? integrar controles de seguridad automáticos en
cada fase de la vida de un modelo, como DevSecOps hace con el
software.
¿Para qué sirve? que ningún modelo llegue a producción sin pasar
las mismas verificaciones, siempre y sin depender de nadie.
## Datos
datos versionados y
filtrados
DVC · lakeFS
## Entrenamiento
entorno aislado y
reproducible
MLflow · SLSA
## Evaluación
compuerta de robustez
y red team
ART · AutoAttack
## Registro
modelo firmado, con
model card y AIBOM
OMS · safetensors
## Despliegue
solo se carga lo
verificado
OPA · Kyverno
## Operación
vigilar, registrar y poder
volver atrás
Evidently · OTel
Compuerta de robustez
bloquea la liberación si algo falla
Resiste un ataque adaptativo fuerteCertifica el % de entradas acordado
Cumple las propiedades del dominioNo es menos robusto que la versión anterior

## II
## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOps
B L O Q U E   B   ·   I N T E G R I D A D   D E   L A   C A D E N A   D E   S U M I N I S T R O
Más allá de la firma: procedencia y AIBOM
La firmaprueba que el archivo no cambió. No dice de dónde salió, con qué datos ni qué tan robusto es.
## Bloque B
¿Qué es una atestación? un documento firmado por el sistema que
entrenó el modelo: qué datos, qué código y qué entorno usó.
¿Para qué sirve? probar DE DÓNDE salió el modelo, y atar a él sus
resultados de robustez.
Madurez de firma (CoSAI, 2025)
## 1
## Integridad
¿alguien alteró el modelo?
## 2
## Linaje
firmas encadenadas en la cadena
## 3
## Políticas
reglas que exigen atestaciones
Qué declara una atestación
dataset
sha256:9f2c...
código
commit a41e...
entorno
imagen:3b7d...
robustez
71 % bajo ataque
modelo
sha256:c08a...
AIBOM: el inventario
•La "lista de ingredientes": modelos, datos y
librerías.
•Formatos: CycloneDX y SPDX 3.0.
•Guía G7 + UE (mayo de 2026): contenido
mínimo.
•Model card: ficha técnica, con su robustez.
Ya es práctica de industria: NVIDIA firma todos sus modelos del catálogo NGC desde marzo de 2025 (OpenSSF Model Signing).

## II
## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOps
## B L O Q U E   B   ·   T R A Z A B I L I D A D   D E L   P I P E L I N E
Linaje: de la fuente de datos a la alerta
## Bloque B
¿Qué es el linaje? el registro de la cadena completa: de qué datos,
con qué código y con qué modelo salió cada decisión.
¿Para qué sirve? responder a un auditor o a un incidente: "¿por qué
el sistema decidió esto, y con qué?".
## Fuente
origen y licencia
## Dataset
sha256:9f2c...
## Features
commit a41e...
## Entrenamiento
atestación
## Modelo
firma
## Decisión
alerta #4711
Pregunta de auditoría: "¿Por qué el IDS dejó pasar el flujo X?"
## 1
decisión → versión exacta del modelo
## 2
atestación → datos, código y entorno
## 3
linaje del dataset → fuentes y filtros aplicados
## 4
registro de la compuerta → robustez de esa versión
Conexión con el curso
## S1
integridad, trazabilidad y no repudio
## S7
la IA cita la fuente; el analista verifica
## S13
trazas encadenadas en el agente

## II
## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOps
## B L O Q U E   B   ·   O P E R A C I Ó N
Monitoreo continuo: deriva, decaimiento y ataques
Un modelo robusto hoy se degrada con el mundo. Y no todo cambio es un ataque.
## Bloque B
¿Qué es la deriva? cuando los datos reales cambian respecto a los de
entrenamiento; el modelo empeora aunque nadie lo toque.
¿Para qué sirve? monitorearla dice cuándo reevaluar o reentrenar, y
ayuda a distinguir un cambio natural de un ataque.
Índice de estabilidad (PSI): ¿cuánto se alejó hoy del entrenamiento?
establevigilaractuar
Tres tipos de deriva
## Entradas
llega tráfico nuevo: otras apps, protocolos
## Proporción
cambia la mezcla: más ataques que antes
## Concepto
lo malicioso ahora se ve distinto
¿Deriva o ataque? la deriva es amplia y gradual; un ataque es estrecho, rápido
y de pocas fuentes.
Detectar adversarios es frágil: evadieron 10 detectores (2017). Mejor: validar
las reglas del dominio.

## II
## S15
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 15: Defensa, Robustez Verificable y MLSecOps
B L O Q U E   B   ·   R E S P U E S T A   Y   C O N T R O L   O R G A N I Z A C I O N A L
Cuando algo falla, y para que no falle
Respuesta a incidentes de IA (CoSAI, v1.0, nov. 2025) y un programa continuo de red teaming.
## Bloque B
¿Qué es el red teaming de IA? un equipo que ataca el sistema propio
como lo haría un adversario, de forma planificada y repetida.
¿Para qué sirve? encontrar las fallas antes que el atacante; y, con un
plan de respuesta, recuperarse en minutos.
Plan de respuesta para un modelo
## Detectar
deriva, compuerta, red team o un caso del SOC
## Contener
volver al modelo firmado anterior o a reglas
## Erradicar
limpiar datos, reentrenar robusto, recertificar
## Aprender
el caso se vuelve una prueba permanente
Verificación continua como control
CuándoQué se verificaQuién
Cada cambioataque rápido, regresión, firmasCI automática
Cada versiónataque adaptativo, certificadosML + riesgos
## Trimestral
red team humano con objetivos de
negocio
equipo
independiente
Ante incidentereproducir y reevaluar todo
respuesta a
incidentes
La clave: tener siempre un modelo firmado anterior convierte un incidente
de horas en minutos.