import { _decorator, Component, Node, Vec3, Prefab, instantiate, tween, UITransform, v3, math } from 'cc';
import EventManager from '../core/EventManager';
import { EVENT_ENUM, ITEM_TYPE } from './config/enum';
import { level1 } from './levels/level1';
const { ccclass, property } = _decorator;

@ccclass('playground_controller')
export class playground_controller extends Component {

    @property(Prefab)
    prefab_bullet: Prefab

    @property(Prefab)
    prefab_enemy: Prefab

    m_cur_time: number = 0;

    onLoad() {
        EventManager.Instance.on(EVENT_ENUM.SHOOT_EVENT, this.on_deal_shoot, this)
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.SHOOT_EVENT, this.on_deal_shoot)
    }

    on_deal_shoot(tb_pos:Vec3[]) {
        for (let i = 0; i < tb_pos.length; i++) {
            const bullet = instantiate(this.prefab_bullet)
            this.node.addChild(bullet)
            let transform = this.node.getComponent(UITransform);
            bullet.setPosition(transform?.convertToNodeSpaceAR(tb_pos[i])!)

            tween(bullet)
                .by(1, { position: v3(0, 400, 0) })
                .call(() => {
                    if (bullet.position.y > 1500) {
                        bullet.destroy();
                    }
                })
                .union()
                .repeatForever()
                .start()
        }
    }

    deal_item_show(index: number){
        let config = level1[index]
        if (!config){
            return
        }
        console.log(config)
        if (config.type === ITEM_TYPE.ENEMY ){
            const enemy = instantiate(this.prefab_enemy)
            this.node.addChild(enemy)
            let transform = this.node.getComponent(UITransform);
            enemy.setPosition(transform?.convertToNodeSpaceAR(v3(0, 1000, 0))!)
        }

    }

    update(deltaTime: number) {
        this.m_cur_time += deltaTime
        let temp_time = Math.floor(this.m_cur_time)
        this.deal_item_show(temp_time)
    }
}


