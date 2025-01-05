import { Sprite, Node, Size, Rect, Vec2, Vec3, UITransform } from "cc";

export namespace G_func {

    export function get_show_size(node: Node) {
        let size = new Size( 0, 0 )
        let transform = node.getComponent( UITransform )
        if (transform != null) {
            size = new Size( transform.width, transform.height )
        }

        const scale = node.getScale()
        return new Size(size.x * scale.x, size.y * scale.y)
    }

    
    export function rect_contains_point(rect: Rect, point: Vec3) {
        let ret = false
        if (point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height) {
            ret = true
        }
        return ret
    }
}
