import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Sprite, SpriteFrame, resources, v3, Vec3, Prefab } from 'cc';
import { player_controller } from './player_controller';
const { ccclass, property } = _decorator;

@ccclass('battle_controller')
export class battle_controller extends Component {

    @property(Node)
    m_player_node: Node

    @property(Prefab)
    enemy_prefab: Prefab = null;

    m_move_durations: number = 0;       // 移动方向
    is_moving_left: boolean = false
    is_moving_right: boolean = false

    start() {
        this.init_stage()
        this.init_event()
    }

    init_stage() {
        const stage = new Node()
        stage.setParent(this.node)

        const player_node = new Node()
        player_node.setParent(stage)
        const sp = player_node.addComponent(Sprite)
        resources.load("img_battle/fightBoxLevel/spriteFrame", SpriteFrame, (err, sf) => {
            sp.spriteFrame = sf
        });

        let comp = this.m_player_node.getComponent(player_controller)
        comp.add_person()
        comp.add_person()
        comp.add_person()
    }

    init_event() {
        input.on(Input.EventType.KEY_DOWN, this.on_key_down, this);
        input.on(Input.EventType.KEY_UP, this.on_key_up, this);
    }

    on_key_down(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {
            this.is_moving_left = true;
        } else if (event.keyCode == KeyCode.KEY_W) {
        } else if (event.keyCode == KeyCode.KEY_D) {
            this.is_moving_right = true;
        } else if (event.keyCode == KeyCode.KEY_S) {
        }
        this.deal_move();
    }

    on_key_up(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {
            this.is_moving_left = false;
        } else if (event.keyCode == KeyCode.KEY_W) {
        } else if (event.keyCode == KeyCode.KEY_D) {
            this.is_moving_right = false;
        } else if (event.keyCode == KeyCode.KEY_S) {
        }
        this.deal_move();
    }

    deal_move() {
        this.m_move_durations = 0
        if (this.is_moving_left && this.is_moving_right) {
            this.m_move_durations = 0
        }
        else if (this.is_moving_left) {
            this.m_move_durations = -5
        }
        else if (this.is_moving_right) {
            this.m_move_durations = 5
        }
    }

    update(deltaTime: number) {
        if (this.m_move_durations != 0) {
            let pos = this.m_player_node.position
            console.log(this.m_move_durations)
            this.m_player_node.position = new Vec3(pos.x + this.m_move_durations, pos.y, pos.z)
        }
    }
}


