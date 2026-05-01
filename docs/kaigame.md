# PRD: Project "Board Quest" (PoC)

## 1. Visión General
**Board Quest** es un juego de tablero web sencillo (estilo Juego de la Oca) para hasta 4 jugadores locales. El objetivo es llegar a la casilla final mediante lanzamientos de dados, superando obstáculos y aprovechando potenciadores. El desarrollo se basa en la ejecución fluida mediante IA (*Vibe Coding*) para un despliegue rápido en Vercel.

## 2. Objetivos y KPIs
* **Jugabilidad:** Implementar un sistema de turnos funcional para 1-4 jugadores.
* **Rendimiento:** Carga inicial < 2 segundos en Vercel.
* **Experiencia:** Animaciones fluidas de movimiento (*Tweening*) de personajes.

## 3. Especificaciones Funcionales (Functional Requirements)

### 3.1. Sistema de Juego
* **Tablero:** Array de 40 casillas con coordenadas $(x, y)$ predefinidas.
* **Jugadores:** Selección de 1 a 4 personajes al inicio.
* **Mecánica del Dado:** Generador aleatorio de números $[1, 6]$.
* **Movimiento:** Los personajes deben recorrer las casillas una a una (no teletransporte) usando las animaciones del *spritesheet* según la dirección del movimiento.

### 3.2. Casillas Especiales (Lógica de Reglas)

| Tipo de Casilla | Efecto |
| :--- | :--- |
| **Normal** | Ninguno. |
| **Trampa (Calavera)** | El jugador regresa a la casilla 1. |
| **Potenciador (Cofre)** | El jugador avanza 3 casillas extra. |
| **Puente/Salto** | Salta directamente a una casilla adelantada. |
| **Meta** | El primer jugador en llegar gana la partida. |

---

## 4. Especificaciones Técnicas (Stack & Architecture)
* **Engine:** Phaser 3 (Manejo de estados, spritesheets y cámara).
* **Build Tool:** Vite (HMR ultra rápido para desarrollo).
* **UI/UX:** Tailwind CSS para el panel de control y menús.
* **Despliegue:** Vercel (CI/CD desde GitHub).
* **Assets:**
    * `board_map.png` (Fondo del tablero).
    * `players_spritesheet.png` (6 frames por dirección, 32x32px).

---

## 5. Diseño de Software (SDD Brief)

### 5.1. Estructura de Clases
1.  **GameScene:** Escena principal de Phaser.
2.  **Player:** Clase que extiende `Phaser.GameObjects.Sprite` con lógica de posición actual y estado de movimiento.
3.  **DiceManager:** Singleton encargado de la aleatoriedad y comunicación con la UI de Tailwind.
4.  **BoardLogic:** Mapa de datos que contiene el tipo de casilla y sus coordenadas.

### 5.2. Flujo de Datos
1.  **Input:** Click en "Roll Dice" (UI Tailwind).
2.  **Lógica:** `DiceManager` genera valor → `TurnManager` actualiza `activePlayer`.
3.  **Animación:** `Player.moveAlongPath(steps)` ejecuta la cadena de *Tweens* en Phaser.
4.  **Evento:** Al finalizar el movimiento, se evalúa la casilla actual (`checkTileEffect`).

---

## 6. Roadmap de Desarrollo (Vibe Coding Steps)
* **Hito 1:** Configuración de entorno Vite + Phaser y despliegue base en Vercel.
* **Hito 2:** Renderizado del tablero y posicionamiento de los 4 sprites.
* **Hito 3:** Lógica de turnos y movimiento secuencial.
* **Hito 4:** Implementación de reglas especiales y efectos visuales (partículas de potenciadores).