
const suits = ['1', '2', '3', '4'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

type Type_Card = {
    rank: string;
    suit: string;
};

export class data_manager {
    deck: Type_Card[] = [];
    remainingDeck: Type_Card[] = [];
    columns: Type_Card[][] = Array(7).fill([]).map(() => []);

    get_game_data(){
        return { deck: this.deck, remainingDeck: this.remainingDeck, columns: this.columns }
    }

    /**
    * 重置数据
   */
    reset_data() {
        this.deck = []
        this.remainingDeck = []
        this.columns = Array(7).fill([]).map(() => [])
        this.createDeck() // 创建牌堆
    }

    initialize_game() {
        this.reset_data() // 重置数据
        this.shuffleDeck() // shuffle shuffle
        this.dealCards() // shuffle

        // 输出每列的牌
        this.columns.forEach((column, index) => {
            console.log(`Column ${index + 1}: ${column.map(card => `(${card.rank},${card.suit})`).join(', ')}`);
        });

        // 输出剩余的牌堆
        console.log("Remaining deck:", this.deck.map(card => `(${card.rank}${card.suit})`).join(', '));
    }

    /**
    * 创建牌堆
   */
    createDeck() {
        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push({ rank, suit });
            }
        }
    }

    /**
    * 打乱牌堆
   */
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    /**
    * 发牌
   */
    dealCards() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                this.columns[i].push(this.deck[index++]);
            }
        }

        // 剩余的牌
        this.remainingDeck = this.deck.slice(28);
    }

}