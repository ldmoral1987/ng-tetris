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

  // Esta función genera una pieza aleatoria y la configura
  spawn() {
    const typeId = this.randomizeTetrominoType(COLORS.length);
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];
    this.x = typeId === 4 ? 4 : 3;
    this.y = 0;
  }

  // Esta función mueve la pieza
  move(p: IPiece) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  // Esta función dibuja la pieza en el canvas
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // this.x & this.y = posición en el tablero
          // x & y son las posiciones de la pieza
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  // Genera una forma aleatoria de entre todas las posibles
  randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes);
  }
}
