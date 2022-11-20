import { Sprite } from "./Sprite";
import { DEBUG_POSITIONS } from "./engineGlobals";
import { CollisionMode, Entity } from "./Entity";

export class ItemEntity extends Entity {
  readonly sprite: Sprite;
  readonly description: string;
  constructor(
    sprite: Sprite,
    x: number,
    y: number,
    collides: CollisionMode,
    description: string
  ) {
    super(x, y, sprite.width, sprite.height, collides);
    this.sprite = sprite;
    this.description = description;
  }

  destroy(): void {
    // noop
  }

  update(): void {
    // noop
  }

  render(ctx: CanvasRenderingContext2D, tick: number): void {
    this.sprite.render(ctx, this.x, this.y, tick);

    if (DEBUG_POSITIONS && this.mBody) {
      const { min, max } = this.mBody.bounds;

      ctx.fillRect(min.x, min.y, this.width, this.height);
    }
  }
}
