/**
 * 管理发牌区
 * 功能：
 */
import { _decorator, Node, Vec3, v3 } from 'cc';
import { Card } from './Card';
import { g_manager } from './core/g_manager';

export class deck_card_manager {
    m_deck_cards: Node[] = [];
    m_open_cards: Node[] = [];
    m_init_pos: Vec3

    set_pos(pos: Vec3) {
        this.m_init_pos = pos
    }

    insert_one_card(card: Node) {
        this.m_deck_cards.push(card)
        let comp = card.getComponent(Card)
        comp.m_is_fix = true
    }

    get_top_card() {
        return this.m_deck_cards.pop()
    }

    show_one_card() {
        if (this.m_deck_cards.length == 0) {
            this.reset_all_card()
            return
        }
        let card = this.m_deck_cards.pop()
        this.m_open_cards.push(card)
        this.update_open_card_pos()
    }

    remove_one_card() {
        let card = this.m_open_cards.pop()
        let comp = card.getComponent(Card)
        comp.m_is_fix = false
        this.update_open_card_pos()
        return card
    }

    reset_all_card() {
        for (let index = this.m_open_cards.length; index > 0; index--) {
            let card = this.m_open_cards.pop()
            let comp = card.getComponent(Card)
            comp.set_is_show_card(false)
            // if (index == this.m_open_cards.length) {
            //     comp.m_is_fix = false
            // } else {
            //     comp.m_is_fix = true
            // }
            card.position = this.m_init_pos
            card.setSiblingIndex(1000)
            this.m_deck_cards.push(card)
        }
        this.m_open_cards = []
    }
    get_is_sclect_deck_card(pos) {
        if (this.m_open_cards.length == 0) {
            return null
        }
        let card = this.m_open_cards[this.m_open_cards.length - 1]
        let comp = card.getComponent(Card)!
        let rect = comp.get_rect()
        if (!comp.m_is_select && g_manager.g_func.rect_contains_point(rect!, pos)) {
            return card
        }
        return null
    }

    update_open_card_pos() {
        let pos_index = 0
        for (let index = this.m_open_cards.length; index > 0; index--) {
            let card = this.m_open_cards[index - 1]
            card.position = v3(this.m_init_pos.x - 85 - 42.5 * pos_index, this.m_init_pos.y)
            // card.setPositionX(this.m_init_pos.x - 85 - 42.5 * pos_index)
            let comp = card.getComponent(Card)
            comp.set_is_show_card(true)
            pos_index = pos_index == 2 ? pos_index : pos_index + 1
            card.setSiblingIndex(3)
        }
    }
}