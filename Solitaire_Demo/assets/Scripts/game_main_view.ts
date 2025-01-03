import { _decorator, Component, Node, Prefab, instantiate, input, EventTouch, Input, UITransform, v3, Vec3, tween } from 'cc';
import { Card } from './Card';
import { data_manager } from './data_manager';
const { ccclass, property } = _decorator;

@ccclass('game_main_view')
export class game_main_view extends Component {

    @property(Prefab)
    card_prefab:Prefab = null;

    m_data_manager: data_manager

    m_play_groups: Node[][] = [];

    m_all_cards: Node[] = [];
    m_order_pos: Vec3[] = [];
    m_play_pos: Vec3[] = [];


    m_deal_card_pos:Vec3;

    u_layout_tableau: Node = null!;
    layout_top: Node = null!
    // u_layout_btn: Node = null!
    // u_layout_touch: Node = null!
    // u_node_deal: Node = null!

    onLoad():void {
        this.init_ui()
        this.init_touch()

    }

    init_ui() {
        this.u_layout_tableau = this.node.getChildByName("layout_tableau")!
        this.layout_top = this.node.getChildByName("layout_top")!

        // this.u_layout_btn = this.u_bg.getChildByName("layout_btn")!
        // this.u_layout_touch = this.u_bg.getChildByName("layout_touch")!
        // this.u_node_deal = this.u_layout_touch.getChildByName("node_deal")!

        this.init_pos()
        // this.init_card()
        // this.init_touch()
        // this.deal_cards()

    }

    init_pos() {
        for (let index = 1; index <= 7; index++) {
            let col = this.u_layout_tableau.getChildByName("node_col_" + index)!
            let pos = this.u_layout_tableau.getComponent(UITransform)!.convertToWorldSpaceAR(col.getPosition())
            this.m_play_pos[index] = pos
        }
        for (let index = 1; index < 4; index++) {
            let node = this.layout_top.getChildByName("node_order_" + index)!
            let pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(node.getPosition())
            this.m_order_pos[index] = pos
        }
        let node_deck = this.layout_top.getChildByName("node_deck_3")!
        this.m_deal_card_pos = node_deck.getPosition()
    }

    start(){
        this.m_data_manager = new data_manager();
        this.init_game()
        this.deal_cards()
    }

    get_self_pos(pos: Vec3) {
        let transform = this.node!.getComponent(UITransform)!;
        return transform.convertToNodeSpaceAR(v3(pos.x, pos.y, 0))!;
    }

    //------------------------- 触摸事件 begin------------------------------------
    init_touch() {
        input.on(Input.EventType.TOUCH_START, this.on_touch_begin, this);
        input.on(Input.EventType.TOUCH_MOVE, this.on_touch_move, this);
        input.on(Input.EventType.TOUCH_END, this.on_touch_end, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.on_touch_end, this);
    }

    on_touch_begin(event: EventTouch) {
        let pos = event.getUILocation();

        console.log(event.getLocation());  // Location on screen space
        console.log(event.getUILocation());  // Location on UI space

        let transform = this.node?.getComponent(UITransform);
        let begin_pos = transform?.convertToNodeSpaceAR(v3(pos.x, pos.y, 0))!;

        // let res = this.get_select_card(begin_pos)
        // if (!res) {
        //     return
        // }
        // this.selected_card = res
        // let comp = this.selected_card.getComponent(joker_hand_card)!
        // comp.m_is_select = true
        // this.update_select_card_pos(begin_pos)
    }

    on_touch_move(event: EventTouch) {

    }
    
    on_touch_end(event: EventTouch) {
    }

    init_game(){
        this.m_data_manager.initialize_game();
        let game_data = this.m_data_manager.get_game_data();
        
        console.log(game_data);

        game_data.deck.forEach((card_data) =>{
            let card = instantiate(this.card_prefab)
            let comp = card.getComponent(Card)
            comp.init(Number(card_data.rank), Number(card_data.suit))
            comp.set_is_show_card(false)
            card.parent = this.node
            this.m_all_cards.push(card)
            console.log(card_data.rank, card_data.suit);

            let pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(this.m_deal_card_pos)
            card.position = this.get_self_pos(pos)
        })
    }

    deal_cards() {
        let card_index = 0
        for (let index = 1; index <= 7; index++) {
            let groups = []
            for (let j = 0; j < index; j++) {
                // let card = this.m_deck_manager.get_top_card()
                let card = this.m_all_cards[card_index]
                groups.push(card)
                // card.setSiblingIndex(1000)
                card_index++

                let comp = card.getComponent(Card)!
                // comp.set_status({ status: mius.g_def.ENUM_CARD_STATUS.PLAY, col: index, row: j })

                if (j == index - 1) {
                    comp.set_is_show_card(true)
                    // comp.m_is_fix = false
                }
                let pos = this.get_self_pos(this.m_play_pos[index]) 
                tween(card)
                    .hide()
                    .delay(0.05 * card_index)
                    .show()
                    .to(0.1, { position: new Vec3(pos.x, pos.y - (groups.length - 1) * 30, 0) })
                    .start()
            }
            this.m_play_groups.push(groups)
        }
    }
}


