import { Sprite } from "../CharacterEntity";
import { Bodies, Body } from "matter-js";

export class Tile {
  readonly fSprites: Sprite[];
  readonly bSprites: Sprite[];
  readonly collides: boolean;
  readonly row: number;
  readonly col: number;
  readonly mBody: Body | null;
  constructor(
    fSprites: Sprite[],
    bSprites: Sprite[],
    collides: boolean,
    row: number,
    col: number
  ) {
    this.fSprites = fSprites;
    this.bSprites = bSprites;
    this.collides = collides;
    this.row = row;
    this.col = col;
    if (this.collides) {
      this.mBody = Bodies.rectangle(col * 16, row * 16, 16, 16, {
        isStatic: true,
        restitution: 0,
        friction: 0,
      });
    } else {
      this.mBody = null;
    }
  }
}
