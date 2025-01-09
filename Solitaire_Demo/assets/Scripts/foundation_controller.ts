import { _decorator, Component, Node, Vec3 } from 'cc';
import { Card } from './Card';
import { g_manager } from './core/g_manager';
const { ccclass, property } = _decorator;

@ccclass('foundation_controller')
export class foundation_controller {
    // m_deck_cards: Node[] = [];
    // m_open_cards: Node[] = [];
    // m_init_pos: Vec3

    m_foundation_groups: Node[][] = Array(5).fill([]).map(() => []);
    // m_foundation_groups: Node[][] = [];
    m_order_pos: Vec3[] = [];

    set_init_pos(index: number, pos: Vec3) {
        this.m_order_pos[index] = pos;
    }

    insert_one_card(index:number, card: Node) {
        this.m_foundation_groups[index].push(card);
        this.update_top_card_pos()
    }

    get_top_card(index:number): Node {
        let groups = this.m_foundation_groups[index]
        let groups_length = groups.length
        if (groups_length == 0) {
            return null
        }
        return groups[groups_length - 1];
    }

    update_top_card_pos(){
        this.m_foundation_groups.forEach((groups,index)=>{
            groups.forEach((card) => {
                let pos = this.m_order_pos[index]
                card.position = pos
            })
        })
    }

    check_can_insert_one_card(index:number,card:Node):boolean {
        let comp = card.getComponent(Card)
        let top_card = this.get_top_card(index)
        if (top_card == null) {
            if(comp.m_num == 1) {
                return true
            }
            return false
        }
        let top_comp = top_card.getComponent(Card)
        if (top_comp.m_num + 1 == comp.m_num && top_comp.m_color == comp.m_color) {
            return true
        }
        return false
    }

    // show_one_card() {
    //     if (this.m_deck_cards.length == 0) {
    //         this.reset_all_card()
    //         return
    //     }
    //     let card = this.m_deck_cards.pop()
    //     this.m_open_cards.push(card)
    //     this.update_open_card_pos()
    // }

    // remove_one_card() {
    //     let card = this.m_open_cards.pop()
    //     this.update_open_card_pos()
    //     return card
    // }

    // reset_all_card() {
    //     for (let index = this.m_open_cards.length; index > 0; index--) {
    //         let card = this.m_open_cards.pop()
    //         let comp = card.getComponent(Card)
    //         comp.set_is_show_card(false)
    //         if (index == this.m_open_cards.length) {
    //             comp.m_is_fix = false
    //         } else {
    //             comp.m_is_fix = true
    //         }
    //         card.position = this.m_init_pos
    //         card.setSiblingIndex(1000)
    //         this.m_deck_cards.push(card)
    //     }
    //     this.m_open_cards = []
    // }
    // get_is_sclect_deck_card(pos) {
    //     if (this.m_open_cards.length == 0) {
    //         return false
    //     }
    //     let card = this.m_open_cards[this.m_open_cards.length - 1]
    //     let comp = card.getComponent(Card)!
    //     let rect = comp.get_rect()
    //     if (!comp.m_is_select && g_manager.g_func.rect_contains_point(rect!, pos)) {
    //         return card
    //     }
    //     return false
    // }

    // update_open_card_pos() {
    //     let pos_index = 0
    //     for (let index = this.m_open_cards.length; index > 0; index--) {
    //         let card = this.m_open_cards[index - 1]
    //         card.setPositionX(this.m_init_pos.x - 85 - 42.5 * pos_index)
    //         let comp = card.getComponent(Card)
    //         comp.set_is_show_card(true)
    //         pos_index = pos_index == 2 ? pos_index : pos_index + 1
    //         card.setSiblingIndex(0)
    //     }
    // }
}


