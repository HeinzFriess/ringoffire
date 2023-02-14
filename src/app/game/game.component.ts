import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  newCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    console.log(this.game);
  }


  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length) {
      const card = this.game.stack.pop();
      if (card) {
        this.currentCard = card;
      }
    }

    this.newCardAnimation = true;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.newCardAnimation = false;
      if (this.game.currentPlayer != (this.game.players.length-1)) {
        this.game.currentPlayer ++;
      }
      else{
        this.game.currentPlayer = 0;
      }
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
      
    });
  }


}
