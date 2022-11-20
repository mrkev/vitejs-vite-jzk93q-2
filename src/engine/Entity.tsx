import { Bodies, Body } from "matter-js";
import { exhaustive } from "s-state/Subbable";

export type CollisionMode = "none" | "collides" | "static";

export abstract class Entity {
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly collisionMode: CollisionMode;
  readonly mBody: Body | null;
  highlight: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    collides: CollisionMode
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.collisionMode = collides;

    switch (this.collisionMode) {
      case "collides":
        this.mBody = Bodies.rectangle(x, y, width, height, {
          restitution: 0,
          friction: 0,
          frictionAir: 0.2,
        });
        break;
      case "static":
        this.mBody = Bodies.rectangle(x, y, width, height, {
          isStatic: true,
        });
        break;
      case "none":
        this.mBody = null;
        break;
      default:
        exhaustive(this.collisionMode);
    }
  }

  abstract destroy(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D, tick: number): void;
}
