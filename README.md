# Kai Game - Mario Bros Board Edition 🍄🎲

Kai Game es un juego de tablero virtual interactivo por turnos de hasta 4 jugadores, inspirado en el universo de Super Mario Bros y diseñado con tecnologías web modernas.

## 🎮 Funcionalidad

El juego es un clásico juego de tablero competitivo donde el objetivo es llegar al castillo (la última casilla) antes que tus rivales.

**Características Principales:**
* **Selección de Personajes:** Juega como Mario, Luigi, Peach, Toad o Yoshi.
* **Sistema de Turnos:** Lanza el dado (haciendo clic o pulsando la barra espaciadora) para avanzar por el tablero.
* **Monedas y Defensa:** Recoge monedas por el tablero. Si tienes más de 5 monedas, puedes gastarlas para bloquear ataques de otros jugadores.
* **Potenciadores y Efectos Especiales (Power-ups):**
  * 🍄 **Champiñón:** Avanzas 4 casillas extra.
  * 💰 **Moneda:** Añade monedas a tu inventario.
  * 🔴 **Estrella Roja:** Te permite volar directamente a otra zona del tablero.
  * 🚀 **Bill Bala:** Te transformas en Bill Bala y avanzas 5 casillas lentamente arrasando.
  * 🔥 **Flor de Fuego:** Eliges a un rival para lanzarle una bola de fuego y retrasarlo 3 casillas.
  * ❄️ **Flor de Hielo:** Congela a un rival, haciéndole perder su próximo turno.
  * 🟢/🔴 **Tuberías Warp:** Atajos y trampas que te teletransportan a lo largo del tablero.

## 🛠 Tecnología

El proyecto está construido sobre un stack moderno y eficiente centrado en el ecosistema Frontend:

* **Vite:** Empaquetador y servidor de desarrollo ultrarrápido.
* **Phaser 3:** Motor de físicas y renderizado de gráficos 2D basado en WebGL/Canvas, encargado de pintar el tablero, animaciones (tweens) y partículas.
* **Tailwind CSS:** Framework de utilidades CSS utilizado para diseñar toda la interfaz superpuesta (UI) de selección de personajes, menús, indicadores de turno y modales.
* **Vanilla JavaScript (ES6+):** Lógica del juego estructurada mediante módulos nativos, sin frameworks reactivos complejos, logrando gran ligereza.
* **Web Audio API (`SoundGen`):** Todo el sonido del juego (saltos, monedas, motor de Bill Bala, bolas de fuego) se genera de forma procedimental (sintetizado matemáticamente) usando la API nativa de audio de los navegadores, sin necesidad de cargar archivos `.mp3` o `.wav`.

## 🏗 Arquitectura

El juego sigue un patrón modular en la carpeta `src/`, separando estrictamente la presentación (UI/Motor) de la lógica de negocio:

* **`main.js`**: Punto de entrada de la aplicación. Configura la instancia de Phaser y maneja los eventos del DOM (botones, modales) interactuando con Tailwind CSS.
* **`scenes/`**: Contiene las escenas de Phaser (`Boot`, `Preloader`, `GameScene`). `GameScene` es el corazón gráfico del juego, responsable de animar las fichas, dibujar la ruta, emitir partículas y gestionar la cámara.
* **`logic/`**: Componentes de lógica pura y estado del juego:
  * `BoardData.js`: Generador de la geometría de la ruta y distribución matemática de las casillas especiales.
  * `GameState.js` / `PlayerConfig.js`: Gestores del estado, turno actual y configuración de jugadores.
  * `EffectResolver.js`: Motor de reglas que dictamina la consecuencia de caer en cada tipo de casilla.
  * `DiceManager.js`: Controlador de la tirada.
  * `EventBus.js`: Patrón de Bus de Eventos. Permite que la UI, el estado y Phaser se comuniquen entre sí de manera desacoplada mediante suscripciones (`on` y `emit`).
  * `SoundGen.js`: Sintetizador de audio en tiempo real.

## 🚀 Instalación y Desarrollo

Para ejecutar el juego en local:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Arrancar el servidor de desarrollo Vite:**
   ```bash
   npm run dev
   ```
3. Abrir la URL local proporcionada en el navegador.

Para compilar una versión de producción:
```bash
npm run build
```
