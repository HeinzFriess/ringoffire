import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  newCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
    console.log(this.game);
  }


  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if(this.game.stack.length){
      const card = this.game.stack.pop();
      if(card) {
        this.currentCard = card;
      }
    }
    
    this.newCardAnimation = true;
  }
}
