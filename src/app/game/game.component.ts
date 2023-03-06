import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  gameId: string = '';

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      //console.log('route', params['id']);
      this.gameId = params['id'];
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          //console.log('game Update', game);
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.player_images = game.player_images;
          this.game.stack = game.stack;
          this.game.currentCard = game.currentCard;
          this.game.newCardAnimation = game.newCardAnimation;

        });
    })
    console.log(this.game);

  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.newCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.newCardAnimation = true;

      if (this.game.currentPlayer != (this.game.players.length - 1)) {
        this.game.currentPlayer++;
      }
      else {
        this.game.currentPlayer = 0;
      }
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.newCardAnimation = false;

        this.saveGame();
      }, 1000);
    }




  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.webp')
        if (this.game.players.length > 8) {
          this.game.tableIsFull = true
        }
        else this.game.tableIsFull = false;
        this.saveGame();
      }

    });
  }

  editPlayer(playerIndex) {

    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe(change => {
      if (change) {
        if (change === 'DELETE') {
          this.game.players.splice(playerIndex, 1)
          this.game.player_images.splice(playerIndex, 1)
        } else {
          console.log('das bild ist:', change);
          this.game.player_images[playerIndex] = change;
        };
        this.saveGame();
      }
    });

  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());

  }


}
