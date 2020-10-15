// Constantes iniciales del juego
export const COLS = 10;         // Número de columnas
export const ROWS = 20;         // Número de filas
export const BLOCK_SIZE = 30;   // Tamaño máximo del bloque (px)

// Colores de las piezas
export const COLORS = [
    'none',
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
  ];

  // Formas de las piezas (I, J, L, O, S, T y Z)
  export const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
  ];

  // Se crea una clase para controlar las teclas
  export class KEY {
    static readonly ESC = 27;
    static readonly SPACE = 32;
    static readonly LEFT = 37;
    static readonly UP = 38;
    static readonly RIGHT = 39;
    static readonly DOWN = 40;
  }
  