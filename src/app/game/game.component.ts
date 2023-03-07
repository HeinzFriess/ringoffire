import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  gameId: string = '';
  sub: any;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.sub = this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.player_images = game.player_images;
          this.game.stack = game.stack;
          this.game.currentCard = game.currentCard;
          this.game.newCardAnimation = game.newCardAnimation;

        });
    })
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

  newstart() {
    this.sub.unsubscribe();
    this.firestore
    .collection('games')
    .doc(this.gameId)
    .delete()
    let game = new Game();
    this.firestore
      .collection('games')
      .add(game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }

  restart() {
    this.game.newStack(this.game.stack);
    this.game.playedCards = [];
    this.game.currentPlayer = 0;
    this.game.currentCard = '';
    this.game.newCardAnimation = false;
  }


}
