import { ENEMY_TYPE, ITEM_TYPE, REWARD_TYPE } from "../config/enum";

export const level1 = {
    [1]: { pos: 2, count: 5, type: ITEM_TYPE.ENEMY, sub_type: ENEMY_TYPE.ENEMY_1 },
    [2]: { pos: 1, count: 1, type: ITEM_TYPE.REWARD, sub_type: REWARD_TYPE.REWARD_1 },
}