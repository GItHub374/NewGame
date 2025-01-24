import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform } from 'cc';
import EventManager from '../core/EventManager';
import { EVENT_ENUM } from './config/enum';
import { PLAYER_POS } from './config/game_config';
const { ccclass, property } = _decorator;

@ccclass('player_controller')
export class player_controller extends Component {

    @property(Prefab)
    prefab_player: Prefab = null;

    tb_player: Node[] = [];

    pos_center: Vec3 = new Vec3(0, 50, 0);

    m_shoot_duration: number = 1;
    m_cur_duration: number = 0;

    add_person() {
        let newPlayer = instantiate(this.prefab_player)
        this.tb_player.push(newPlayer);
        newPlayer.parent = this.node;
        this.update_person_position()
    }

    reduce_person() {
        let porson = this.tb_player.pop();
        porson.destroy();
        this.update_person_position()
    }

    update_person_position() {
        let pos_config = PLAYER_POS[this.tb_player.length]
        console.log(this.tb_player.length)
        for (let i = 0; i < this.tb_player.length; i++) {
            let player = this.tb_player[i];
            let pos = pos_config[i]
            player.position = new Vec3(pos.x, pos.y + this.pos_center.y, pos.z) 
            console.log(player.position)
        }
    }

    update(deltaTime: number) {
        this.m_cur_duration += deltaTime
        if (this.m_cur_duration >= this.m_shoot_duration) {
            this.m_cur_duration = 0

            let tb_pos:Vec3[] = []
            for (let i = 0; i < this.tb_player.length; i++) {
                let player = this.tb_player[i]
                let trans = this.node?.getComponent(UITransform)!
                tb_pos.push(trans.convertToWorldSpaceAR(player.position))
            }
            EventManager.Instance.emit(EVENT_ENUM.SHOOT_EVENT, tb_pos)
        }
    }
}


