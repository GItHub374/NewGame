import { _decorator, Component, Node, Label, Rect } from 'cc';
import { g_manager } from './core/g_manager';
const { ccclass, property } = _decorator;

const suits = ['♠', '♥', '♣', '♦'];

@ccclass('Card')
export class Card extends Component {

    _rank:number
    _suit:number

    m_is_fix:boolean;
    m_is_select:boolean;
    m_status: number = g_manager.g_def.ENUM_CARD_STATUS.NONE

    is_show:boolean = false;

    m_col:number;
    m_row:number;

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

    get_rect() {
        const pos = this.node.position
        const size = g_manager.g_func.get_show_size(this.node)
        return new Rect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y)
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

    set_status(info: { status: number, col: number | null, row: number | null }) {
        this.m_status = info.status
        this.m_col = info.col
        this.m_row = info.row
    }

}


