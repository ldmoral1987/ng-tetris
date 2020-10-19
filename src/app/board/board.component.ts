import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

// Se importan las constantes del juego
import { COLS, COLORS, LEVEL, LINES_PER_LEVEL, BLOCK_SIZE, ROWS, POINTS } from '../constants';
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

  // Se captura la referencia del canvas en el que pintaremos
  // la pieza siguiente del juego
  @ViewChild('next', { static: true })
  canvasNext: ElementRef<HTMLCanvasElement>;
 
  // Contexto 2D de renderizado del Canvas
  // para el tablero y para la pieza siguiente
  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;

  // Variables del juego
  points: number;
  lines: number;
  level: number;
  requestId: number;

  // Temporizador del juego
  time = { start: 0, elapsed: 0, level: 1000 };

  // Tablero de juego, pieza actual y pieza siguiente
  board: number[][];
  piece: Piece;
  next: Piece;

  // Movimientos de las piezas
  // Se permite un movimiento hacia la izquierda, derecha y arriba
  // El espacio permite que la pieza baje de golpe. La marca que
  // representa la tecla espacio es " "
  moves = {
    "ArrowLeft":  (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    "ArrowRight": (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    "ArrowDown": (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    "ArrowUp": (p: IPiece): IPiece => this.service.rotate(p),
    "Control": (p: IPiece): IPiece => ({ ...p, y: p.y + 1 })
  };

  // Se inyecta el servicio GameService
  constructor(private service: GameService) {}
 
  ngOnInit() {
    // Se inicializa el tablero
    this.initBoard();

    // Se inicializa el visor de pieza siguiente
    this.initNext();

    // Se resetea el juego
    this.resetGame();
  }
 
  // Inicialización del tablero
  initBoard() {
    // Se captura la referencia del contexto 2D en el que
    // se dibujarán las piezas
    this.ctx = this.canvas.nativeElement.getContext('2d');
 
    // Se calcula el tamaño del canvas a partir de las 
    // constantes del juego (constants.ts)
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Se aplica un factor de escala al canvas
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // Inicializa el canvas de la pieza siguiente
  initNext() {
    // Se captura la referencia del contexto 2D en el que
    // se dibujará la pieza siguiente
    this.ctxNext = this.canvasNext.nativeElement.getContext('2d');

    // Se calcula el tamaño del canvas a partir de las 
    // constantes del juego (constants.ts)    this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;

    // Se aplica un factor de escala al canvas
    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // Este listener captura las teclas pulsadas en la ventana
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.gameOver();
    } else if (this.moves[event.key]) {
      event.preventDefault();
      // Get new state
      let p = this.moves[event.key](this.piece);
      if (event.key === "Control") {
        // Hard drop
        while (this.service.valid(p, this.board)) {
          this.points += POINTS.HARD_DROP;
          this.piece.move(p);
          p = this.moves["ArrowDown"](this.piece);
        }
      } else if (this.service.valid(p, this.board)) {
        this.piece.move(p);
        if (event.key === "ArrowDown") {
          this.points += POINTS.SOFT_DROP;
        }
      }
    }
  }

  // Función principal del juego
  // Se lanza desde el botón de la vista
  play() {
    this.resetGame();
    this.next = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    this.next.drawNext(this.ctxNext);
    this.time.start = performance.now();

    // Si hay un juego anterior en curso, se cancela
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  // Resetea el juego e inicializa los parámetros de juego
  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }
  
  // "Main-Loop" de la aplicación.
  // Anima las piezas en el tablero
  animate(now = 0) {
    this.time.elapsed = now - this.time.start;
    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      if (!this.drop()) {
        this.gameOver();
        return;
      }
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  // Dibuja la pieza y actualiza el tablero
  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
  }
 
  // Suelta la pieza abajo (con las flechas);
  drop(): boolean {
    let p = this.moves["ArrowDown"](this.piece);
    if (this.service.valid(p, this.board)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.next = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
    return true;
  } 

  // Limpia las líneas que ya están llenas y suma los puntos
  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every(value => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
      }
    });
    if (lines > 0) {
      this.points += this.service.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        this.time.level = LEVEL[this.level];
      }
    }
  }

  // Congela la pieza una vez que ha llegado abajo o ha tocado
  // otra pieza del tablero
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }    

  // Actualiza el canvas con el contenido del tablero
  drawBoard() {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  // Fin del juego
  gameOver() {
    cancelAnimationFrame(this.requestId);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = '1px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('GAME OVER', 1.1, 4);
  }

  // Prepara el tablero para el juego
  // Las celdas del tablero se representan con números
  // El 0 indica que están vacías y el 1-7 representan un color
  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}
