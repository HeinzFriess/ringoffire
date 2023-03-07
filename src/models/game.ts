export class Game {
    public players: string[] = [];
    public player_images: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public currentCard: string = '';
    public newCardAnimation = false;
    public tableIsFull = false;

    constructor() {
        this.newStack(this.stack);
    }

    public toJson() {
        return {
            players: this.players,
            player_images: this.player_images,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            currentCard: this.currentCard,
            newCardAnimation: this.newCardAnimation
        }
    }

    public newStack(stack: string[]){
        for (let i = 1; i < 14; i++) { 
            stack.push('spade_' + i)
            stack.push('clubs_' + i)
            stack.push('diamonds_' + i)
            stack.push('hearts_' + i)
        }
        shuffle(stack);
    }

    
}

function shuffle(array: string[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}