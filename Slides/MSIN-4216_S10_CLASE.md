

## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial MLMSIN-4216 · Ciberseguridad e IA · MESI · Universidad de los Andes
## M Ó D U L O   I I   ·   S E S I Ó N   1 0
Ataques de Evasión y Adversarial ML:
Fundamentos White-Box, Black-Box
y Espacio-Problema
Por qué un cambio mínimo engaña a un detector —y hasta dónde llega contra un sistema de seguridad real.
Andrea Pinto, Ph.D.
Profesora del curso · Semestre 2026-2

## II
## S10
Sesión 10 · Ataques de Evasión y Adversarial ML
## A P E R T U R A   ·   D E   L A   S 9   A   L A   S 1 0
De nombrar
ataques a
construirlos
## Apertura
En la Sesión 9 aprendimos a MODELAR
amenazas y a NOMBRAR las familias de
ataque. La evasión era una de las cuatro.
Hoy tomamos esa familia y la abrimos: la
matemática, el código y los límites reales.
Pasamos del "qué" al "cómo" y al "hasta
dónde".
La evasión, en una frase
El modelo ya está entrenado y funciona bien. El atacante no lo toca: le presenta una
entrada cuidadosamente modificada para que se equivoque —en la dirección que él
elige.
En tiempo de inferencia
no reentrena ni toca los pesos: ataca cuando el modelo ya
está desplegado y decidiendo
Perturbación mínima
el cambio es imperceptible o insignificante, pero basta
para cruzar la frontera de decisión
Adversario adaptativo
optimiza contra TU modelo concreto; no es ruido
aleatorio, es ruido dirigido

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## A P E R T U R A   ·   R E P A S O   E X P R É S
Seis ideas queusaremos
Repaso rápido —ninguna se da por sabida; cada una tiene su lámina propia más adelante.
## Apertura
## Gradiente
vector que apunta hacia donde MÁ S crece una
función. El motor de casi todos los ataques.
Función de pérdida
mide cuánto se equivoca el modelo. El atacante
quiere SUBIRLA; el entrenamiento, bajarla.
Frontera de decisión
la superficie que separa las clases (normal /
ataque). El ataque empuja la entrada al otro lado.
Norma (L0, L2, L∞)
forma de medir "cuán grande" es una
perturbación. Define qué cuenta como
insignificante.
White / black-box
cuánto sabe el atacante: todo el modelo (blanca)
o solo sus respuestas (negra).
Features vs problema
el vector de números que ve el modelo, frente al
objeto real (un flujo de red, un archivo).

## S10
## M Ó D U L O    I I   ·   S E S I Ó  N   1 0   ·   P A R T E   1   D E   2
## B L O Q U  E   A   ·   9 0   M  I N    ·    L A B   4
Fundamentos matemáticos
y ataques white-box
•El caso de hoy: un detector de intrusiones real, y el ejemplo adversarial como optimización
•Normas L0/L2/L∞, el gradiente, la linealidad y la geometría de la frontera
•Los cuatro ataques: FGSM, PGD (referencia), C&W y DeepFool —derivados y con experimento
optimizaciónFGSMPGDC&WDeepFoolART

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   E L   C A S O   D E   H O Y
Nuestro banco de pruebas: un detector de intrusiones
Un modelo de seguridad real —no un clasificador de juguete—que atacaremos y defenderemos toda la sesión.
## Bloque A
El detector (IDS)
Tarea: mirar un flujo de conexión de red y decidir normal vs. ataque
(DoS, escaneo, intrusión).
Datos: NSL-KDD, el benchmark clásico de IDS. Cada conexión → 116
características(duración, bytes, nº de conexiones, protocolo, servicio,
flags, tasas de error...).
Modelo: una red neuronal entrenada por mí para la clase.
## 99.4%
exactitud  —en tráfico limpio
## 99.2%
de los ataques  —los detecta (recall)
## 0.44%
falsas alarmas  —sobre tráfico normal (FPR)
¿Por qué este caso? es exactamente el tipo de detector que varios construyeron en el Módulo I. Hoy lo miramos desde el otro lado: como un atacante. Y al
final, cómo endurecerlo.
La pregunta incómoda del día: este detector acierta el 99.4% de las veces. Pero ¿qué pasa cuando el atacante NO juega limpio y modifica su tráfico a
propósito para no ser visto? Eso es la evasión, y lo vamos a medir.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   E L   F E N Ó M E N O
El ejemplo adversarial, en el mundo de la red
Un ataque real, modificado mínimamente, que el detector pasa a clasificar como tráfico normal —con confianza.
## Bloque A
Flujo de ataque
un ataque real (ej. un
escaneo) que el detector SÍ
atrapa
## "ATAQUE" ✓
## +
Perturbación δ
el atacante ajusta features
modificables: relleno,
tiempos, nº de conexiones
calculada con el gradiente
## =
Flujo evadido
mismas intenciones, pero
ahora el detector lo ve como
tráfico legítimo
## "NORMAL" ✗
Mi experimento
Detector al 99.4%. Con una perturbación PGD
pequeña (ε=0,15), la fracción de ataques que sigue
detectando cae a 30.2%. Dos de cada tres ataques
se cuelan —y el tráfico sigue pareciendo normal.
Lo esencial: el detector no "duda". Cambia su veredicto a "normal" con alta confianza. El error no es casual: fue construido para ocurrir.Entender
exactamente cómo es la tarea de hoy.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   F O R M A L I Z A C I Ó N
El ejemplo adversarial es un problema de optimización
Toda la familia de ataques sale de una sola idea, escrita de dos formas duales.
## Bloque A
Visión 1 · mínima perturbación
"El cambio más PEQUEÑO que cruza la frontera."
Óptica de C&W y DeepFool. Responde: ¿cuán frágil es mi modelo?
Visión 2 · máximo daño, presupuesto fijo
"Dado un presupuesto de ruido ε, haz el mayor daño."
Óptica de FGSM y PGD. Responde: ¿cuánto aguanta a un ruido fijo?
x
el flujo original
δ
la perturbación
y
la clase verdadera
f
el detector
## L
la pérdida
ε
presupuesto de ruido
## ‖·‖
la norma (tamaño de δ)
Las dos visiones son la misma moneda: o fijas el daño y minimizas el ruido, o fijas el ruido y maximizas el daño. De elegir una u otra, y de qué norma uses,
nace cada ataque de hoy.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   ¿ Q U É   E S   " P E Q U E Ñ O " ?
Normas de perturbación: L0, L2 y L∞
Cómo medimos el tamaño de δ decide qué ataque obtenemos —y qué significa "insignificante".
## Bloque A
## L0
¿CUÁNTAS features cambian?
cuenta cuántas características se tocan, sin
importar cuánto
En la red: cambiar POCOS campos.
da los ataques: ataques dispersos, parches
## L2
¿cuánta ENERGÍA total?
la distancia euclidiana de siempre (raíz de suma de
cuadrados)
En la red: muchos campos movidos un poquito, de
forma concentrada.
da los ataques: C&W, DeepFool
## L∞
¿cuál es el CAMBIO MÁXIMO en una feature?
el campo que más se movió; ninguno pasa de ε
En la red: TODOS los campos cambian, pero cada
uno muy poco.
da los ataques: FGSM, P GD
"Insignificante" no es una sola cosa: depende de qué norma uses. Y esto adelanta el Bloque B: en una RED, ninguna norma Lp captura lo que de verdad importa
—¿sigue siendo un flujo válido y funcional?—. Ahí las normas se quedan cortas.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   L A   H E R R A M I E N T A   C L A V E
El gradiente: la brújula de todos los ataques
Antes de atacar, hay que entender la única herramienta que usan los cuatro ataques. Desde cero.
## Bloque A
¿Qué es?
Un VECTOR con una componente por cada feature. Cada una dice: si subo un
poquito esta característica, ¿cuánto sube el error del modelo?
Apunta cuesta arriba: señala la dirección en la que el error (la
pérdida) crece MÁS rápido. Atacar = seguir esa dirección.
Respecto a la ENTRADA: ojo: derivamos respecto al flujo x, no a los
pesos. Es el mismo backprop del entrenamiento, pero parando en la
entrada.
Casi gratis: una sola pasada hacia atrás da las 116 componentes de
golpe. Por eso los ataques son rápidos.
La idea de UNA frase: el gradiente es la brújula que le dice al atacante hacia dónde empujar el flujo para engañar al detector gastando el mínimo esfuerzo.
Todo lo que sigue —FGSM, PGD, C&W, DeepFool—son formas distintas de seguir esa brújula.
Analogía: está en una montaña con niebla (la pérdida es la altura) y quiere subir rápido. El gradiente es la dirección de máxima pendientebajo sus pies. El
atacante la sigue para "subir" el error; el entrenamiento la sigue al revés para bajarlo.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   ¿ P O R   Q U É   E X I S T E N ?
La respuesta de Goodfellow: la linealidad
No es que los modelos sean demasiado complejos —es que son demasiado LINEALES en dimensiones altas.
## Bloque A
Qué muestra el gráfico
En una dirección ALEATORIA (verde), la pérdida casi no se mueve: el
detector es estable al ruido. En la dirección ADVERSARIAL (roja) —el signo
del gradiente—se dispara casi en LÍNEA RECTA . Mismo punto de partida,
misma distancia.
La intuición contraintuitiva
Con 116 features, muchos cambios minúsculos —uno por dimensión—SE
SUMAN en una gran variación de la salida. El modelo actúa casi como una
función lineal, y una recta no tiene techo. La fragilidad no viene del exceso de
complejidad, sino de la falta de ella.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   G E O M E T R Í A
La imagen geométrica: cruzar la frontera
Atacar es empujar el flujo al otro lado de la frontera de decisión —por el camino más corto.
## Bloque A
Cómo leer el dibujo
la línea verde es la frontera: separa "normal" de "ataque"
el punto verde es un ataque bien detectado, pero CERCA de la frontera
la flecha dorada δ apunta ⊥a la frontera (dirección del gradiente): cruza con el
mínimo avance
el punto rojo cayó del otro lado: mismo flujo, ahora "normal"
¿Por qué perpendicular? el camino más corto para cruzar una línea es ir
derecho hacia ella. Esa dirección es, justamente, la del gradiente. FGSM, PGD y
DeepFool solo difieren en CÓMO dan ese paso.
La fragilidad real: en dimensiones altas, casi cualquier punto está sorprendentemente CERCA de alguna frontera. Por eso casi todo flujo tiene un gemelo
adversarial a muy poca distancia.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   A T A Q U E   1   ·   F G S M
FGSM: un solo paso en la dirección del gradiente
Fast Gradient Sign Method (Goodfellow, 2015) —el ataque más simple, y la semilla de todos.
## Bloque A
La fórmula
## 1
## Gradiente
calcula ∇ₓL: hacia dónde crece el error
## 2
## Signo
toma solo ±1 de cada componente → ataque L∞
## 3
Un paso
avanza ε en esa dirección y recorta a lo válido
Mi experimento: detección bajo FGSM
A ε=0,1 el detector ya solo atrapa el 70.7% de los ataques.
## 1009794
## 82
## 71
## 40
## 4
## 0
## 0
## 25
## 50
## 75
## 100
## 00.020.050.080.10.150.20.3
detectados (%)
ε —presupuesto de perturbación (L∞)
Por qué importa aunque sea simple: FGSM es de un solo paso, así que es rapidísimo —ideal para generar millones de ejemplos y ENTRENAR defensas. Pero por
eso mismo es débil como prueba: un modelo que resiste FGSM puede caer ante PGD.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   A T A Q U E   2   ·   P G D
PGD: el "ataque de referencia"
Projected Gradient Descent (Madry, 2018) —FGSM iterado. El estándar de oro para evaluar robustez.
## Bloque A
La fórmula: un paso que se repite
## 1
Inicio aleatorio —parte de un punto al azar dentro de la bola de ruido
—explora mejor
## 2
Paso de FGSM pequeño —repite el paso del gradiente, pero con
tamaño α, muchas veces
## 3
Proyección (Π) —tras cada paso recorta δ para que ‖δ‖∞ ≤ ε: no
salirse del presupuesto
Mi experimento: FGSM vs PGD (mismo ε)
A cada nivel de ruido, PGD deja al detector MÁS ciego que FGSM.
## 0
## 25
## 50
## 75
## 100
## 00.020.050.080.10.150.20.3
detectados (%)
ε —presupuesto de perturbación (L∞)
FGSM (1 paso)PGD (30 pasos)
Por qué es "el ataque de referencia": si tu modelo resiste PGD, resiste casi cualquier ataque de primer orden (Madry lo probó). Por eso la robustez "de verdad" se mide
con PGD, no con FGSM. En mi prueba, a ε=0,15 PGD deja al detector atrapando solo el 30.2% (vs 39.5% con FGSM).

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   A T A Q U E   3   ·   C & W
Carlini & Wagner: la perturbación mínima, bien hecha
El ataque más FUERTE conocido (2017). La vara con la que se rompen las defensas que se creían seguras.
## Bloque A
Minimiza el ruido y, a la vez, fuerza el error —con una función objetivo sobre los LOGITS:
ruido pequeño  +  "engañar"
empuja el logit correcto por debajo del rival, con margen κ
Cambio de variable (tanh)
reparametriza con tangente hiperbólica para que
CUALQUIER valor dé un flujo válido. La optimización
fluye sin recortes bruscos.
Objetivo por margen
no optimiza la pérdida directa, sino el margen entre
el logit correcto y el rival. Más estable y afilado.
Busca el equilibrio (c)
con búsqueda binaria ajusta cuánto pesa "engañar"
vs "poco ruido", quedándose con la perturbación más
pequeña que aún evade.
El precio y el uso: es LENTO (cientos de iteraciones por flujo), pero cuando quieres saber si una defensa es REAL, usas C&W. Si una defensa sobrevive a C&W bien
ejecutado, es de las pocas que merece confianza.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   A T A Q U E   4   ·   D E E P F O O L
DeepFool: saltar a la frontera más cercana
El más EFICIENTE en norma (2016). Ideal para MEDIR la robustez: la distancia mínima a la frontera.
## Bloque A
La idea geométrica
En cada paso, aproxima la frontera (que es curva) por una RECTA —su
tangente—, calcula el salto mínimo hasta esa recta, salta, y repite hasta
cruzar.
El salto de cada paso:
Converge rápido: pocos pasos hasta una perturbación muy pequeña —
mucho más barato que C&W.
Mide la robustez: la distancia mínima que encuentra estima "cuán cerca
está este flujo de la frontera".
Norma L2: busca el cruce euclidiano más corto, no acota el cambio máximo
por feature.
Para qué sirve: es el mejor MEDIDOR. Da rápido un número de "qué tan
frágil es cada flujo". No es el más fuerte, pero sí el más eficiente.
Las cuatro herramientas, un trabajo cada una: FGSM para generar rápido · PGD para EVALUAR robustez (referencia) · C&W para el VEREDICTO sobre una defensa
· DeepFool para MEDIR la distancia a la frontera.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   E X P E R I M E N T O
¿Cuánto ruido necesita cada ataque para evadir?
Medí la perturbación L2 mediana que cada ataque necesita para que un ataque de red pase como normal.
## Bloque A
Qué dice el gráfico
FGSM gasta L2 ≈ 1.95 para evadir. DeepFool y C&W bajan a ≈
0.84 y 0.99 —menos de la mitad de ruidopara el mismo
engaño, y con éxito del 100%.
La moraleja
si optimizas con cuidado, evades con mucho menos ruido. El
ataque "barato" (FGSM) es también el más ruidoso y detectable.
Por qué importa para el defensor: cuanto menor sea la perturbación mínima que evade tu detector, más frágil es. DeepFool y C&W te dan ese número —
tu "margen de seguridad"—de forma fiable.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   S Í N T E S I S   D E   W H I T E-B O X
Los cuatro ataques, de un vistazo
Todos usan el gradiente; se diferencian en qué optimizan, qué norma y a qué coste.
## Bloque A
AtaqueOptimizaNormaPasosFortalezaPara qué se usa
FGSMmáx. dañoL∞1velocidadgenerar datos · entrenar defensas
PGDmáx. dañoL∞muchosestándar sólidoEVALUAR robustez (referencia)
C&Wmín. ruidoL2 (y L0, L∞)cientosel más fuerteveredicto sobre una defensa
DeepFoolmín. ruidoL2pocoseficienciaMEDIR distancia a la frontera
La idea unificadora: un solo problema de optimización —perturbar poco, errar mucho—con cuatro soluciones. Cambias qué fijas (el daño o el ruido) y
qué norma mides, y cae un ataque distinto. No son cuatro recetas: son cuatro vistas de la misma ecuación.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   L A B   4   ·   A R R A N Q U E
Generarataques con ART
Adversarial Robustness Toolbox —la librería estándar de la industria para atacar y defender modelos.
## Bloque A
¿Qué es ART?
Librería abierta de la Linux Foundation AI (antes de IBM); el estándar de
facto.
Funciona con PyTorch, TensorFlow, scikit-learn, XGBoost —incluido su
clasificador del Lab 3.
Trae FGSM, PGD, C&W, DeepFool y los de black-box (ZOO, HopSkipJump)
ya implementados.
No solo ataca: también evalúa, defiende y certifica. Hoy usamos la parte
de ataque.
el patrón, en cuatro líneas
clf = SklearnClassifier(modelo_lab3)
ataque = ProjectedGradientDescent(
clf, eps=0.15, max_iter=40)
X_adv = ataque.generate(X_test)
clf.predict(X_adv)  # ← mucho peor
Lo que harán hoy (y lo que viene):
## 1
Cargar su clasificador del Lab 3
## 2
Generar FGSM y PGD, medir la
caída
## 3
Hallar el ε mínimo que lo rompe
## 4
S11: defenderlo con lo de hoy

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   A   ·   L A   O T R A   C A R A   ·   C I E R R E
Si el ataque es optimización, la defensa también
Entrenamiento adversarial (Madry): entrenar con los peores ejemplos posibles. Un juego min-max.
## Bloque A
El problema min-max de Madry
El atacante (máx) busca el peor δ · el defensor (mín) ajusta los pesos θ para
resistirlo.
En la práctica: en cada paso de entrenamiento, genera ejemplos PGD del lote y
aprende de ellos.
La robustez cuesta a gran escala: aquí subió la detección bajo PGD del
30.2% al 93.5% perdiendo solo ~2 puntos en limpio. En datos sencillos
es casi gratis; en problemas reales hay un precio. Lo cuantificamos en la
frontera.
Mi experimento: detector normal vs. robusto

## S10
## M Ó D U L O    I I   ·   S E S I Ó  N   1 0   ·   P A R T E   2   D E   2
## B L O Q U  E   B   ·    9 0   M I N
Black-box y evasión
en el mundo real
•Atacar sin el modelo: transferabilidad, modelos sustitutos y ataques por consulta
•El coste real en consultas —y por qué eso cambia el juego para el atacante
•Espacio de features vs espacio-problema: por qué evadir un IDS real es mucho más difícil
•Frontera 2024-2026: defensas rotas, ataques a LLMs, evasión con restricciones y robustez con garantía
transferabilidadsustitutosZOOHopSkipJumpespacio-problema

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   M O D E L O   D E   A M E N A Z A
¿Qué sabe el atacante? De la caja blanca a la negra
El poder del ataque depende del acceso. Cuanto menos sabe el atacante, más realista —y más difícil.
## Bloque B
MÁS acceso · menos realistaMENOS acceso · más realista
## W H IT E-B O X
Caja blanca
Arquitectura + pesos + gradientes. El atacante lo ve
todo.
Dónde: Un insider, un modelo de código abierto, una
auditoría interna.
FGSM, PGD, C&W (Bloque A)
## G R A Y-B O X
Caja gris
Conoce algo: la arquitectura, o el tipo de modelo,
pero no los pesos.
Dónde: Un IDS comercial del que se conoce el fabricante o
el dataset.
Transferabilidad dirigida
## B L A C K-B O X
Caja negra
Solo entradas → salidas. Ni pesos ni gradientes.
Dónde: Un IDS o antivirus comercial: le mandas tráfico, te
dice el veredicto.
Consultas y sustitutos
Dentro del black-box, dos sabores:  score-based (la API devuelve una probabilidad) · decision-based (solo el veredicto normal/ataque —el caso más duro y más
común).

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   A T A Q U E   S I N   C O N S U L T A S
Transferabilidad: un ataque sirve para varios
modelos
Un ejemplo adversarial creado contra UN detector suele evadir OTRO que nunca lo vio.
## Bloque B
Mi experimento: % de ataques que evaden, generados en la FILA y probados en la
## COLUMNA.
Cómo leer el mapa de calor
Generé ataques contra el detector de la FILA y los probé contra el de la COLUMNA. La
diagonal (mismo modelo) evade casi todo. Pero fuera de la diagonal —detectores que nunca
vieron el ataque—aún evade entre el 32% y el 86%.
¿Por qué transfiere?
Detectores distintos entrenados con datos parecidos aprenden fronteras PARECIDAS. El gradiente
apunta casi al mismo lado en todos: el ataque cae mal en varios a la vez. Fíjense: los del modelo
LINEAL transfieren aún mejor.
La consecuencia black-box: el atacante no necesita la víctima. Entrena su propio detector, lo
ataca white-box y transfiere. Un ataque "gratis", sin una sola consulta.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   A T A Q U E   P O R   S U S T I T U C I Ó N
Modelos sustitutos: clonar la frontera para atacarla
Papernot et al. (2017): si no tienes el detector, entrena una copia consultándolo —y ataca la copia.
## Bloque B
## 1 · Sondear
Envía flujos al detector víctima y
guarda sus veredictos. No ve pesos,
solo el "qué responde".
## →
## 2 · Clonar
Con esos pares (flujo, veredicto)
entrena un SUSTITUTO propio que
imita la frontera de la víctima.
## →
3 · Atacar en casa
Sobre el sustituto —que SÍ es suyo—
corre PGD/C&W con todo el poder
white-box. Gradientes a voluntad.
## →
## 4 · Transferir
Los ataques que rompen el sustituto
se envían a la víctima. Por
transferabilidad, muchos la rompen.
Mi experimento
Con solo 500 consultasel sustituto ya coincide con
la víctima el 95%. Al subir a 4000, los ataques
transferidos evaden hasta el 28.8%. Nunca vi los
pesos del detector.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   A T A Q U E S   P O R   C O N S U L T A
Atacar a ciegas: optimizar solo con respuestas
Sin gradientes, el atacante los estima —o camina la frontera —preguntando al detector una y otra vez.
## Bloque B
SCORE-BASED · la API da una probabilidad
Estima el gradiente sin tenerlo. Mueve un poquito cada feature, mira cuánto
cambia la probabilidad, y reconstruye la pendiente:
ZOO (Chen et al., 2017)
estima gradiente por diferencias finitas
Coste: muchas consultas; lento, pero efectivo si hay puntajes.
DECISION-BASED · solo el veredicto
Camina la frontera. Arranca de un flujo de la OTRA clase (ya mal clasificado) y
da pasitos acercándose al original sin cruzar de vuelta. El más realista: funciona
aunque la API solo diga "normal/ataque".
Boundary / HopSkipJump
## Brendel 2018 · Chen 2020
Coste: el más caro, pero funciona contra cualquier detector opaco.
La compensación central: cuanto menos te dice el detector, más consultas necesitas. Score-based pide la probabilidad pero converge antes; decision-based funciona
contra todo pero paga en consultas —que son observables, y ahí está la defensa.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   ¿ C U Á N T O   C U E S T A ?
El coste real del ataque black-box
Un atacante que solo ve el veredicto PUEDE llegar tan lejos como el white-box —pero paga en consultas.
## Bloque B
Mi experimento: ataque decision-based (solo el veredicto) sobre un flujo, según el nº de consultas.
Qué dice la curva
Arranca de un flujo de otra clase (L2 ≈ 1.5, muy distinto). Consulta tras
consulta pule la perturbación. Hacia las ~1.500 consultas ya iguala la
calidad del white-box C&W(línea verde, L2 ≈ 0.99).
Lo esencial: no ver el modelo NO protege. Solo encarece el ataque. La
seguridad pasa a ser económica.
La defensa que habilita: las consultas dejan rastro. Limitar la tasa y
detectar secuencias casi idénticas vuelve el ataque una alarma.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   E L   S A L T O   A L   M U N D O   R E A L
Dos espacios: lo que ve el detector vs. lo que existe
Mover el vector de features es fácil. Producir un flujo de red real que genere ese vector, no.
## Bloque B
## E SP A C I O-P R O B L E MA
el objeto real
un flujo de red real:
paquetes, tiempos, bytes,
protocolo, handshakes
φ
extrae features
## E SP A C I O   D E  F E A T U R E S
lo que ve el detector
## [ 491, 0, 2, 0.0,
## 1.0, 25, 0.17, ... ]
116 números —
aquí mover cualquier
valor es fácil
φ⁻¹  ?
el problema del mapeo INVERSO
La trampa
En imágenes, el vector ES la imagen. En
la red, φ no es invertible: dado un
vector atacado, casi nunca existe un
flujo válido que lo produzca.
Y aún peor —las "features colaterales": cualquier cambio real al flujo (añadir paquetes) altera MUCHAS más features de las que el atacante quería. No puede
mover una sola coordenada de forma aislada, como sí haría con un píxel.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   E L   E X P E R I M E N T O   C L A V E
La prueba: atacar el vector no es atacar la red
El mismo ataque, con y sin la restricción de producir un flujo realizable. El resultado lo cambia todo.
## Bloque B
La lección del día, en dos gráficos: atacar el VECTOR evade el 99% —pero el 0% son flujos realizables (piden bytes negativos, tasas imposibles). Al exigir un flujo REAL —solo
las 4 features modificables de 116—la evasión cae al 0.3%. En seguridad, el espacio-problema es la mejor defensa.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   E L   M A R C O   D E   P I E R A Z Z I   ( 2 0 2 0 )
Las cuatro restricciones del espacio-problema
Para que un ataque sea real, la perturbación debe producir un objeto que cumpla las cuatro —a la vez.
## Bloque B
## 1
Transformaciones disponibles
El atacante solo hace lo que el formato permite: añadir, quitar o editar
partes concretas. No puede cambiar bits arbitrarios.
ej. añadir relleno o paquetes señuelo a un flujo
## 2
Semántica preservada
El objeto debe seguir comportándose igual tras el cambio. El ataque de
red debe seguir cumpliendo su función.
ej. el escaneo sigue escaneando
## 3
Robustez al preprocesamiento
Debe sobrevivir a filtros NO-ML: normalización, reensamblado de
paquetes, limpieza, que podrían deshacer el truco.
ej. sobrevive al reensamblado TCP
## 4
## Plausibilidad
Debe parecer tráfico válido del dominio ante inspección humana o
automática. Nada que grite "esto fue manipulado".
ej. no dispara reglas ni heurísticas
Por eso el ataque es una BÚSQUEDA, no una derivada: el atacante explora qué cambios reales cumplen las cuatro restricciones y, de paso, mueven las features
hacia la evasión. Cumplir las cuatro a la vez es difícil —y ese es el margen del defensor.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   E V A S I Ó N   E N   L A   P R Á C T I C A
El mismo reto en cuatro dominios de seguridad
Qué es el "objeto", qué puede tocar el atacante, y cuál es la restricción dura que lo frena.
## Bloque B
DominioEl objeto realQué puede modificar el atacanteLa restricción dura
Tráfico de red
(nuestro IDS)
un flujo de paquetesrelleno, temporización, paquetes señuelo, fragmentación
debe respetar el protocolo y cumplir su
función
## Malware
(PE / Android)
un ejecutablesecciones, no-ops, llamadas a APIs benignas, empaquetadodebe seguir ejecutándose y siendo malicioso
PDF maliciosoun documento PDFobjetos, metadatos, contenido benigno, estructuradebe abrir bien y disparar el payload
Spam / phishingun correo o textosinónimos, errores tipográficos, Unicode, estructura
debe seguir siendo legible y persuasivo para la
víctima
El patrón común: en los cuatro, la "restricción dura" es la semántica preservada —el objeto debe seguir SIRVIENDO a su fin. Esa atadura es lo que hace la
evasión en seguridad mucho más difícil que en visión, y es la mejor aliada del defensor.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   V O L V E R   A L   D E F E N S O R
Qué significa para los detectores que ya construyeron
Cerramos la evasión volviendo a los modelos defensivos del Módulo I —ahora los miramos como un atacante.
## Bloque B
Asuma que es atacable
Todo detector ML tiene ejemplos adversariales. La pregunta no es SI se puede evadir, sino cuánto cuesta. Evalúe
con PGD, no con exactitud limpia.
Apóyese en la semántica
Elija features atadas a lo que el atacante NO puede cambiar sin romper su objeto —las rojas del experimento—.
Son su mejor defensa estructural.
Defienda en capas
Entrenamiento adversarial + monitoreo de consultas + un respaldo NO-ML (reglas, firmas). Ninguna capa basta
sola; juntas encarecen el ataque.
Monitoree y limite
El black-box cuesta miles de consultas: límite de tasa, autenticación y detección de sondeos convierten el ataque
en una alarma.
El mensaje del bloque: la seguridad de ML no busca el modelo "inatacable" —no existe—. Busca subir el coste del ataque por encima de lo que vale el objetivo.
Eso es ingeniería de seguridad clásica, aplicada al modelo.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   F R O N T E R A   ( 1 / 4 )   ·   M E T O D O L O G Í A
La carrera armamentista: el atacante mueve segundo
Una y otra vez, defensas publicadas con bombo cayeron ante un atacante que se adaptó a ellas.
## Bloque B
El patrón que se repite
Athalye et al. (2018)
"Gradientes ofuscados": 7 de 9 defensas de ICLR 2018 caían. No eran
robustas —solo ESCONDÍAN el gradiente, dando una falsa sensación de
seguridad.
Nasr, Carlini et al. (2025)
"The Attacker Moves Second": 12 defensas recientes de LLM (jailbreaks y
prompt injection). Con ataques adaptativos, >90% de éxito —reportaban
casi 0%.
La lección: una defensa solo vale lo que vale el MEJOR ataque adaptativo contra
ella.
Cómo se evalúa bien hoy
AutoAttack (Croce & Hein, 2020): un ensemble de cuatro ataques fuertes,
sin parámetros que ajustar a mano. El estándar, precisamente para evitar
evaluaciones "amables".
RobustBench: el marcador público
Leaderboard estandarizado con AutoAttack. Hoy el mejor modelo en CIFAR-
10 llega a ~74% de robustez(Bartoldson 2024) frente a ~94% limpio. La
brecha sigue abierta: nadie está cerca de "resuelto".

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
B L O Q U E   B   ·   F R O N T E R A   ( 2 / 4 )   ·   L A   M I S M A   I D E A   E N   L L M s
Jailbreaks de LLMs: evasión adversarial, otra vez
Un jailbreak es un ejemplo adversarial de texto: la misma matemática de hoy, sobre tokens en vez de features.
## Bloque B
El mismo esquema, traducido a lenguaje
## El "modelo"
un LLM alineado para rechaz ar peticiones dañinas
## La "decisión"
rechazar  vs  obedecer la petición
## La "perturbación"
un sufijo de tokens (o caracteres raros) en el prompt
## El "ataque"
GCG —optimiza ese sufijo con el gradiente sobre los tokens
(Zou et al., 2023)
Transferabilidad, otra vez
El sufijo se optimiza white-box sobre un modelo ABIERTO (Llama) y
transfiere a modelos cerrados(GPT, Claude) que nunca se tocaron. El
ataque del Bloque B, en LLMs.
Y los guardarraíles caen
Hackett et al. (2025)evadieron 6 detectores comerciales de jailbreak: el
"emoji smuggling" llegó al 100%, y las técnicas de adversarial ML de texto
(TextFooler, BERT-Attack) hasta ~95%.

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
B L O Q U E   B   ·   F R O N T E R A   ( 3 / 4 )   ·   Y A   N O   E S   S O L O   T E O R Í A
Ya no es solo teoría: evasión real en 2024-2025
Lo que en el Bloque B era "difícil pero posible" ya es automático —y, con LLMs, barato.
## Bloque B
Tabular con restricciones
Constrained Adaptive Attack / TabularBench
(NeurIPS 2024): ataques que RESPETAN las
restricciones de datos tabulares —justo nuestro
IDS—. Baten a los demás en 17 de 20 casos, 5×más
rápido.
Phishing adversarial
PhishOracle (2024): páginas de phishing modificadas
que evaden detectores reales —Phishpedia cae ~40
puntos de recall—. Los detectores con LLM aguantan
más, pero igual pierden.
Malware por LLM
LLMalMorph (2025): un LLM reescribe funciones de
malware manteniendo su comportamiento; el 72%
de las variantes baja su detección en antivirus, con
hasta 89-91% de evasión del detector ML.
"Real Attackers Don't Compute Gradients" (Apruzzese et al., 2023): durante años los atacantes reales evadían con trucos simples, no con PGD. Lo nuevo de
2024-2025 es que los LLMs AUTOMATIZAN la búsqueda en el espacio-problema —cierran la brecha entre el ataque académico y el real.
•STACK:adversarial attacks on LLM safeguard pipelines
•False alarms, real damage: Adversarial attacks using LLM-based models on text-based Cyber Threat Intelligence systems (https://doi.org/10.1016/j.future.2026.108603)

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
B L O Q U E   B   ·   F R O N T E R A   ( 3 / 4 )   ·   Y A   N O   E S   S O L O   T E O R Í A
Ya no es solo teoría: evasiónreal/tendencias
## Bloque B

## II
## S10
Maestría en Seguridad de la Información · IA y Ciberseguridad —Sesión 10: Ataques de Evasión y Adversarial ML
## B L O Q U E   B   ·   F R O N T E R A   ( 4 / 4 )   ·   L A   D E F E N S A
Las defensas que SÍ dan garantías —y sus límites
Si toda defensa empírica termina cayendo, ¿se puede PROBAR robustez? Sí, pero con letra pequeña.
## Bloque B
Robustez certificada
En vez de "no pude romperlo", una PRUEBA matemática: "ningún ataque
menor que un radio r cambia la predicción".
Randomized smoothing (Cohen 2019)
añade ruido gaussiano y vota por mayoría → radio L2 demostrable. Escala a
ImageNet.
El precio: el radio garantizado suele ser pequeño y cuesta algo de exactitud.
Garantías reales, pero modestas.
Empírica = "aún no cayó". Certificada = "no puede caer bajo r". Garantía, no
esperanza.
Monitorear no basta por sí solo
Las defensas "con estado" guardan las consultas y bloquean secuencias
sospechosas de black-box. Son la primera línea contra los ataques por
consulta del Bloque B.
Pero en 2023 (OARS, Feng & Hooda et al.)se mostró que incluso estas se pueden
sortear, pasando de ~0% a casi 100% de éxito. Suben el coste; no lo eliminan.
Y el ataque hasta escapa a lo físico: calcomanías en una señal de STOP que la
vuelven "límite 45" (Eykholt 2018).