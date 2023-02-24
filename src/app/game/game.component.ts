import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  newCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((param) => {
      console.log('route', param['id']);
      this.firestore
        .collection('games')
        //.doc(param['id'])
        .valueChanges()
        .subscribe((game: any) => {
          console.log('game Update', game);
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;

        });
    })
    console.log(this.game);

  }

  newGame() {
    this.game = new Game();
    //this.firestore.collection('games').add(this.game.toJson());
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
      if (this.game.currentPlayer != (this.game.players.length - 1)) {
        this.game.currentPlayer++;
      }
      else {
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
