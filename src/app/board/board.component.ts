import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Se importan las constantes del juego
import { COLS, BLOCK_SIZE, ROWS } from '../constants';

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
   points: number;
   lines: number;
   level: number;
 
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
   }
 
   play() {}

}
