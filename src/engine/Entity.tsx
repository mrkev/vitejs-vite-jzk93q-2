import { Bodies, Body } from "matter-js";
import { Sprite } from "../Sprite";
import { DEBUG_POSITIONS } from "./Engine";

export abstract class Entity {
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly collides: boolean;
  readonly mBody: Body | null;
  highlight: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    collides: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.collides = collides;
    if (this.collides) {
      this.mBody = Bodies.rectangle(x, y, width, height, {
        restitution: 0,
        friction: 0,
        frictionAir: 0.2,
      });
    } else {
      this.mBody = null;
    }
  }

  abstract destroy(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D, tick: number): void;
}

export class ItemEntity extends Entity {
  readonly sprite: Sprite;
  constructor(sprite: Sprite, x: number, y: number, collides: boolean) {
    super(x, y, sprite.width, sprite.height, collides);
    this.sprite = sprite;
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
