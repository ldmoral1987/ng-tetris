import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

// Se importan las constantes del juego
import { COLS, COLORS, SHAPES, BLOCK_SIZE, ROWS } from '../constants';
import { Piece, IPiece } from '../piece/piece.component';
import { GameService } from '../game.service';

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
 
  // Contexto 2D de renderizado del Canvas
  ctx: CanvasRenderingContext2D;

  // Variables del juego
  points: number;
  lines: number;
  level: number;

  // Tablero de juego
  board: number[][];
  piece: Piece;

  // Se inyecta el servicio GameService
  constructor(private service: GameService) {}

  // Movimientos de las piezas
  // Se permite un movimiento hacia la izquierda, derecha y arriba
  // El espacio permite que la pieza baje de golpe. La marca que
  // representa la tecla espacio es " "
  moves = {
    "ArrowLeft":  (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    "ArrowRight": (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    "ArrowDown": (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    "ArrowUp": (p: IPiece): IPiece => this.service.rotate(p),
    " ": (p: IPiece): IPiece => ({ ...p, y: p.y + 1 })
  };
 
  ngOnInit() {
    // Se inicializa el tablero
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

  // Este listener captura las teclas pulsadas en la ventana
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.moves[event.key]) {
      // Si la tecla existe en el vector de movimientos, se 
      // bloquea el evento de tecla pulsada y realizamos
      // el movimiento de la pieza.
      event.preventDefault();

      // Calcula el próximo estado de la pieza, aplicando
      // el movimiento indicado por la tecla pulsada.
      let p = this.moves[event.key](this.piece);

      // Se mueve la pieza (tan solo cambia sus coordenadas).
      if (event.key === " ") {
        // Soltar la pieza rápidamente con ESPACIO
        while (this.service.valid(p, this.board)) {
          this.piece.move(p);
          p = this.moves["ArrowDown"](this.piece);
        }
      }
      else if (this.service.valid(p, this.board)) {
        this.piece.move(p);
      }

      // Borra la antigua posición de la pieza.
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      // Pinta la nueva posición de la pieza.
      this.piece.draw();
    }
  }

  // Función principal del juego
  // Se lanza desde el botón de la vista
  play() {
    // Se resetea el juego
    this.resetGame();

    // Testing: se crea una nueva pieza y se pinta
    this.piece = new Piece(this.ctx);
    this.piece.draw();
  }

  // Esta función resetea el juego
  resetGame() {
    // Se borra el tablero del juego
    this.board = this.getEmptyBoard();

    // Temporal: se limpia el tablero cuando se resetea el juego
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // Esta función prepara el tablero para el juego
  // Las celdas del tablero se representan con números
  // El 0 indica que están vacías y el 1-7 representan un color
  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

}
