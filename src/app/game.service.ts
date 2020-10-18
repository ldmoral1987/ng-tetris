import { Injectable } from '@angular/core';
import { IPiece } from './piece/piece.component';
import { COLS, ROWS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  // Comprueba si la nueva posición de una pieza es correcta
  // Se invoca a las funciones correspondientes para determinar
  // Si la nueva posición de la pieza se saldría del tablero u
  // ocuparía alguna posición ya ocupada por otra pieza.
  valid(p: IPiece, board: number[][]): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) ||
          (this.insideWalls(x) &&
            this.aboveFloor(y) &&
            this.notOccupied(board, x, y))
        );
      });
    });
  }

  // Comprueba si la posición está vacía (0 -> vacía)
  isEmpty(value: number): boolean {
    return value === 0;
  }

  // Comprueba si la posición está dentro de la pantalla
  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  // Comprueba si la posición está por debajo del suelo
  aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  // Comprueba si la posición no está ocupada
  notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }

  // Rota una pieza alrededor de su centro de rotación, 
  // la coordenada central de la matriz de cada forma.
  rotate(piece: IPiece): IPiece {
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    p.shape.forEach(row => row.reverse());
    return p;
  }
}
