import { _decorator, Component, Node, Prefab, instantiate, input, EventTouch, Input, UITransform, v3, Vec3, tween, Rect } from 'cc';
import { Card } from './Card';
import { data_manager } from './data_manager';
import { g_manager } from './core/g_manager';
import { deck_card_manager } from './deck_card_manager';
import { foundation_controller } from './foundation_controller';
const { ccclass, property } = _decorator;

@ccclass('game_main_view')
export class game_main_view extends Component {

    @property(Prefab)
    card_prefab: Prefab = null;  // 牌预制体

    m_data_manager = new data_manager();
    m_deck_manager = new deck_card_manager();
    m_foundation_groups = new foundation_controller();

    m_play_groups: Node[][] = [];
    // m_order_pos: Vec3[] = [];
    m_play_pos: Vec3[] = [];
    m_deal_card_pos: Vec3;

    // tb_order:Node[][] = [];

    selected_card: Node | null = null
    u_layout_tableau: Node = null!;
    layout_top: Node = null!

    onLoad(): void {
        this.init_ui()
        this.init_touch()
    }

    init_ui() {
        this.u_layout_tableau = this.node.getChildByName("layout_tableau")!
        this.layout_top = this.node.getChildByName("layout_top")!
        this.init_pos()
    }

    start() {
        this.init_game()
        this.deal_cards()
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
            // this.m_order_pos[index] = pos
            this.m_foundation_groups.set_init_pos(index, this.get_self_pos(pos))
        }
        let node_deck = this.layout_top.getChildByName("node_deck_3")!
        this.m_deal_card_pos = node_deck.getPosition()

        let pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(node_deck.getPosition())
        this.m_deck_manager.set_pos(this.get_self_pos(pos))
    }

    init_touch() {
        input.on(Input.EventType.TOUCH_START, this.on_touch_begin, this);
        input.on(Input.EventType.TOUCH_MOVE, this.on_touch_move, this);
        input.on(Input.EventType.TOUCH_END, this.on_touch_end, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.on_touch_end, this);
    }

    //------------------------- 触摸事件 begin------------------------------------
    on_touch_begin(event: EventTouch) {
        let pos = event.getUILocation();
        let begin_pos = this.get_self_pos(v3(pos.x, pos.y, 0))
        this.deal_touch_begin(begin_pos)
    }

    deal_touch_begin(begin_pos: Vec3) {
        let res = this.get_select_card(begin_pos)
        // console.log(res)
        // console.log("zjjj debug ---- deal_touch_begin 111 ")
        if (!res) {
            return
        }
        // console.log("zjjj debug ---- deal_touch_begin 222")
        this.selected_card = res
        this.selected_card.setSiblingIndex(1000)
        let comp = res.getComponent(Card)
        comp.m_is_select = true
        this.update_select_card_pos(begin_pos)
    }

    on_touch_move(event: EventTouch) {
        if (!this.selected_card) {
            return false
        }
        let pos = event.getUILocation();
        let move_pos = this.get_self_pos(v3(pos.x, pos.y, 0))
        this.deal_touch_move(move_pos)
    }

    deal_touch_move(move_pos: Vec3) {
        this.update_select_card_pos(move_pos)
    }

    on_touch_end(event: EventTouch) {
        if (this.selected_card) {
            let pos = event.getUILocation();
            let move_pos = this.get_self_pos(v3(pos.x, pos.y, 0))
            console.log("zjjj debug on_touch_end 1111")
            this.deal_touch_end(move_pos)
        }
        this.selected_card = null
    }

    deal_touch_end(pos: Vec3) {
        let res = this.deal_foundation_area(pos)
        console.log("zjjj debug deal_touch_end 1111")
        if (!res) {
            console.log("zjjj debug deal_touch_end 222")
            res = this.deal_play_area(pos)
        }

        let comp = this.selected_card.getComponent(Card)
        comp.m_is_select = false
        this.update_play_card_pos()
    }
    //------------------------- 触摸事件 end ------------------------------------

    /**
     * 是否选中了操作区的牌
     * @param pos 
     * @returns 
     */
    check_is_select_play_card(pos: Vec3) {
        for (let index = 0; index < this.m_play_groups.length; index++) {
            let groups = this.m_play_groups[index];
            for (let index = groups.length - 1; index >= 0; index--) {
                let card = groups[index];
                let comp = card.getComponent(Card)!
                // console.log(comp.m_num, comp.m_color);
                // console.log(!comp.m_is_fix, !comp.m_is_select, g_manager.g_func.rect_contains_point(comp.get_rect(), pos))
                if (!comp.m_is_fix && !comp.m_is_select && g_manager.g_func.rect_contains_point(comp.get_rect(), pos)) {
                    return card
                }
            }
        }
        return null
    }

    get_foundation_index(pos: Vec3) {
        for (let index = 1; index < 4; index++) {
            let node = this.layout_top.getChildByName("node_order_" + index)!
            let node_pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(node.position)
            node_pos = this.get_self_pos(node_pos)
            const size = g_manager.g_func.get_show_size(node)
            let rect = new Rect(node_pos.x - size.x / 2, node_pos.y - size.y / 2, size.x, size.y)

            if (g_manager.g_func.rect_contains_point(rect, pos)) {
                return index
            }
        }
        return 0
    }

    check_is_select_foundation(pos: Vec3) {
        let index = this.get_foundation_index(pos)
        if(index > 0){
            return this.m_foundation_groups.get_top_card(index)
        }
        return null
    }

    get_select_card(pos: Vec3) {
        // 是否选中发牌区
        console.log("zjjj debgu get_select_card 111");
        let res = this.m_deck_manager.get_is_sclect_deck_card(pos)
        if (res) {
            return res
        }
        console.log("zjjj debgu get_select_card 222");

        // 是否选中了回收区的牌
        let res2 = this.check_is_select_foundation(pos)
        if (res2) {
            return res2
        }
        console.log("zjjj debgu get_select_card 333");

        // 是否选中了操作区的牌
        let res3 = this.check_is_select_play_card(pos)
        if (res3 != null) {
            return res3
        }
        console.log("zjjj debgu get_select_card 444");
        return null
    }

    update_select_card_pos(pos: Vec3) {
        let comp = this.selected_card.getComponent(Card)!
        if (comp.m_status == g_manager.g_def.ENUM_CARD_STATUS.DECK || comp.m_status == g_manager.g_def.ENUM_CARD_STATUS.ORDER) {
            this.selected_card.position = pos
            this.selected_card.setSiblingIndex(2000)
        } else if (comp.m_status == g_manager.g_def.ENUM_CARD_STATUS.PLAY) {
            let groups = this.m_play_groups[comp.m_col - 1]
            for (let index = comp.m_row; index < groups.length; index++) {
                let card = groups[index];
                card.position = v3(pos.x, pos.y - (index - comp.m_row) * 30 )
                card.setSiblingIndex(2000)
            }
        }
    }

    check_can_move(groups: Node[]) {
        let card_comp = this.selected_card.getComponent(Card)!
        if (groups.length > 0) {
            let last_card = groups[groups.length - 1]
            let comp = last_card.getComponent(Card)!
            if (comp.m_num - 1 != card_comp.m_num) {
                return false
            }
            if (comp.m_color % 2 == card_comp.m_color % 2) {
                return false
            }
            return true
        } else if (card_comp.m_num = 13){
            return true
        }
        return false
    }

    // 是否放到了回收区
    deal_foundation_area(pos: Vec3){
        let index = this.get_foundation_index(pos)
        if (index > 0 && this.m_foundation_groups.check_can_insert_one_card(index, this.selected_card)) {
            this.m_foundation_groups.insert_one_card(index, this.selected_card)
            let card_comp = this.selected_card.getComponent(Card)!
            let from_group = this.m_play_groups[card_comp.m_col - 1]
            const extractedSegment = from_group.splice(card_comp.m_row, from_group.length - card_comp.m_row);
            if (from_group.length > 0) {
                let last_card = from_group[from_group.length - 1]
                let last_card_comp = last_card.getComponent(Card)!
                last_card_comp.set_is_show_card(true)
                last_card_comp.m_is_fix = false
            }
            return true
        }
        return false
    }

    // 是否放到了操作区
    deal_play_area(pos: Vec3) {
        let res3 = this.check_is_select_play_card(pos)
        console.log("zjjj debug deal_play_area 1111")
        if (res3 != null) {
            console.log("zjjj debug deal_play_area 222")
            let comp = res3.getComponent(Card)!
            let groups = this.m_play_groups[comp.m_col - 1]
            if (this.check_can_move(groups)) {
                console.log("zjjj debug deal_play_area 333")

                let card_comp = this.selected_card.getComponent(Card)!
                if (card_comp.m_status == g_manager.g_def.ENUM_CARD_STATUS.DECK){
                    this.m_deck_manager.remove_one_card()
                    card_comp.set_status(g_manager.g_def.ENUM_CARD_STATUS.PLAY, comp.m_col, groups.length)
                    groups.push(this.selected_card)
                } else if (card_comp.m_status == g_manager.g_def.ENUM_CARD_STATUS.PLAY) {
                    let from_group = this.m_play_groups[card_comp.m_col - 1]
                    const all_move_card = from_group.splice(card_comp.m_row, from_group.length - card_comp.m_row);
                    for (let i = 0; i < all_move_card.length; i++) {
                        let card = all_move_card[i]
                        let card_comp = card.getComponent(Card)!
                        card_comp.set_status(g_manager.g_def.ENUM_CARD_STATUS.PLAY, comp.m_col, groups.length)
                        groups.push(card)
                    }

                    if (from_group.length > 0) {
                        let last_card = from_group[from_group.length - 1]
                        let last_card_comp = last_card.getComponent(Card)!
                        last_card_comp.set_is_show_card(true)
                        last_card_comp.m_is_fix = false
                    }
                }

                return true
            }
        }
        return false
    }


    update_play_card_pos() {
        for (let index = 0; index < this.m_play_groups.length; index++) {
            const groups = this.m_play_groups[index];
            for (let j = 0; j < groups.length; j++) {
                const card = groups[j];/*  */
                let pos = this.get_self_pos(this.m_play_pos[index + 1])
                card.setPositionX(pos.x)
                card.setPositionY(pos.y - (j) * 30)
                card.setSiblingIndex(1000)
            }
        }
    }

    get_self_pos(pos: Vec3) {
        let transform = this.node!.getComponent(UITransform)!;
        return transform.convertToNodeSpaceAR(v3(pos.x, pos.y, 0))!;
    }

    init_game() {
        this.m_data_manager.initialize_game();
        let game_data = this.m_data_manager.get_game_data();

        console.log(game_data);

        game_data.remainingDeck.forEach((card_data) => {
            let card = instantiate(this.card_prefab)
            let comp = card.getComponent(Card)
            comp.init(Number(card_data.rank), Number(card_data.suit))
            comp.set_status(g_manager.g_def.ENUM_CARD_STATUS.DECK)
            comp.set_is_show_card(false)
            card.parent = this.node
            // console.log(card_data.rank, card_data.suit);

            this.m_deck_manager.insert_one_card(card)

            let pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(this.m_deal_card_pos)
            card.position = this.get_self_pos(pos)
        })

        game_data.columns.forEach((col_data) => {
            col_data.forEach((card_data) => {
                let card = instantiate(this.card_prefab)
                let comp = card.getComponent(Card)
                comp.init(Number(card_data.rank), Number(card_data.suit))
                comp.set_status(g_manager.g_def.ENUM_CARD_STATUS.DECK)
                comp.set_is_show_card(false)
                card.parent = this.node
                // console.log(card_data.rank, card_data.suit);
                this.m_deck_manager.insert_one_card(card)

                let pos = this.layout_top.getComponent(UITransform)!.convertToWorldSpaceAR(this.m_deal_card_pos)
                card.position = this.get_self_pos(pos)
            })
        })
    }

    /**
     * 点击牌堆
     */
    on_click_deck() {
        console.log("deck clicked")
        this.m_deck_manager.show_one_card()
    }

    deal_card_end() {

    }

    /**
     * 发牌
     */
    deal_cards() {
        let card_index = 0
        for (let index = 1; index <= 7; index++) {
            let groups = []
            for (let j = 0; j < index; j++) {
                let card = this.m_deck_manager.get_top_card()
                groups.push(card)
                card.setSiblingIndex(1000)

                let comp = card.getComponent(Card)!
                comp.set_status(g_manager.g_def.ENUM_CARD_STATUS.PLAY, index, j)

                if (j == index - 1) {
                    comp.set_is_show_card(true)
                    comp.m_is_fix = false
                    // console.log(comp.m_num, comp.m_color);
                } else {
                    comp.set_is_show_card(false)
                    comp.m_is_fix = true
                }
                let pos = this.get_self_pos(this.m_play_pos[index])
                tween(card)
                    .hide()
                    .delay(0.05 * card_index)
                    .show()
                    .to(0.1, { position: new Vec3(pos.x, pos.y - (groups.length - 1) * 30, 0) })
                    .call(() => {
                        if (index == 7 && j == index - 1) {
                            this.deal_card_end()
                        }
                    })
                    .start()
                card_index++
            }
            this.m_play_groups.push(groups)
        }
    }
}