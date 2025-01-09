import { _decorator, Component, Node, Label, Rect, Color } from 'cc';
import { g_manager } from './core/g_manager';
const { ccclass, property } = _decorator;

const nums = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
const colors = ['♠', '♥', '♣', '♦'];

@ccclass('Card')
export class Card extends Component {

    m_num:number
    m_color:number

    m_is_fix:boolean = false;
    m_is_select:boolean = false;
    m_status: number = g_manager.g_def.ENUM_CARD_STATUS.NONE

    is_show:boolean = false;

    m_col:number;
    m_row:number;

    m_order_index:number;

    @property(Node)
    lab_num:Node;

    @property(Node)
    lab_color:Node;

    @property(Node)
    lab_top_color:Node;

    init(num: number, color: number){
        this.m_num = num;
        this.m_color = color;
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
        this.lab_top_color.active = this.is_show;
        if (this.is_show) {
            this.lab_num.getComponent(Label)!.string = "" + nums[this.m_num - 1]
            this.lab_color.getComponent(Label)!.string = "" + colors[this.m_color - 1]
            this.lab_top_color.getComponent(Label)!.string = "" + colors[this.m_color - 1]
            if (this.m_color == 1 || this.m_color == 3){
                this.lab_color.getComponent(Label)!.color = new Color(255, 255, 255, 255)
                this.lab_top_color.getComponent(Label)!.color = new Color(255, 255, 255, 255)
            }else{
                this.lab_color.getComponent(Label)!.color = new Color(255, 0, 0, 255)
                this.lab_top_color.getComponent(Label)!.color = new Color(255, 0, 0, 255)
            }
        }
    }

    set_is_show_card(is_show:boolean){
        this.is_show = is_show
        this.update_card_show()
    }

    set_status(status: number, col?: number, row?: number, order_index?: number ) {
        this.m_status = status
        this.m_col = col
        this.m_row = row
        this.m_order_index = order_index
    }

}


