// Se importan las constantes del juego
import { COLORS, SHAPES } from '../constants';

// Esta interfaz representa las características de una pieza
// del tablero (coordenadas, color y tipo de forma)
// Las formas son del tipo I, J, L, O, S, T y Z
export interface IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];
}

export class Piece implements IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];

  constructor(private ctx: CanvasRenderingContext2D) {
    this.spawn();
  }

  // Función dummy para generar una pieza de prueba
  spawn() {
    this.color = 'blue';
    this.shape = [[2, 0, 0], [2, 2, 2], [0, 0, 0]];

    // Position where the shape spawns.
    this.x = 3;
    this.y = 0;
  }

  // Esta función dibuja la pieza en el canvas
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // this.x & this.y = position on the board
          // x & y position are the positions of the shape
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }
}
