import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

const suits = ['♠', '♥', '♣', '♦'];

@ccclass('Card')
export class Card extends Component {

    private _rank:number
    private _suit:number

    is_show:boolean = false;

    @property(Node)
    lab_num:Node;

    @property(Node)
    lab_color:Node;

    set rank(value:number){
        this._rank = value;
    }
    get rank(){
        return this._rank;
    }
    set suit(value:number){
        this._suit = value;
    }
    get suit(){
        return this._suit;
    }

    init(rank: number, suit: number){
        this.rank = rank;
        this.suit = suit;
        this.update_card_show()
    }

    update_card_show(){
        this.lab_num.active = this.is_show;
        this.lab_color.active = this.is_show;
        if (this.is_show) {
            this.lab_num.getComponent(Label)!.string = "" + this.rank
            this.lab_color.getComponent(Label)!.string = "" + suits[this.suit - 1]
        }
    }

    set_is_show_card(is_show:boolean){
        this.is_show = is_show
        this.update_card_show()
    }

}


