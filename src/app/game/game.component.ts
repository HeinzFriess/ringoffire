import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  newCardAnimation = false;
  takeCard() {
    this.newCardAnimation = true;
  }
}
