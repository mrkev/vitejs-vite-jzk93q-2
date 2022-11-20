import { Bodies, Body } from "matter-js";

export abstract class Entity {
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly collides: boolean;
  readonly mBody: Body | null;

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
      });
    } else {
      this.mBody = null;
    }
  }

  abstract destroy(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D, tick: number): void;
}
