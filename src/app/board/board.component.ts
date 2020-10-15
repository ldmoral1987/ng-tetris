import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Se importan las constantes del juego
import { COLS, COLORS, SHAPES, BLOCK_SIZE, ROWS } from '../constants';
import { Piece, IPiece } from '../piece/piece.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  // Se captura la referencia del canvas (de la vista HTML)
  // En el canvas se pintará el tablero de juego
  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
 
  ctx: CanvasRenderingContext2D;

  // Variables del juego
  points: number;
  lines: number;
  level: number;

  // Tablero de juego
  board: number[][];
  piece: Piece;
 
  ngOnInit() {
    this.initBoard();
  }
 
  // Inicialización del tablero
  initBoard() {
    // Se captura la referencia del contexto 2D en el que
    // se dibujarán las piezas.
    this.ctx = this.canvas.nativeElement.getContext('2d');
 
    // Se calcula el tamaño del canvas a partir de las 
    // constantes del juego (constants.ts)
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Se aplica un factor de escala al canvas
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }
 
  // Función principal del juego
  // Se lanza desde el botón de la vista
  play() {
    this.board = this.getEmptyBoard();
    console.table(this.board);

    // Testing: se crea una nueva pieza y se pinta
    this.piece = new Piece(this.ctx);
    this.piece.draw();
  }

  // Esta función prepara el tablero para el juego
  // Las celdas del tablero se representan con números
  // El 0 indica que están vacías y el 1-7 representan un color
  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }



}
