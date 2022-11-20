import { useEffect, useRef } from "react";
import { Sprite } from "../CharacterEntity";

export type Point = { x: number; y: number };
export type TPoint = { c: number; r: number };

export class Tile {
  fSprites: Sprite[];
  bSprites: Sprite[];
  collides: boolean;
  constructor(fSprites: Sprite[], bSprites: Sprite[], collides: boolean) {
    this.fSprites = fSprites;
    this.bSprites = bSprites;
    this.collides = collides;
  }
}

export abstract class Entity {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  abstract destroy(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D, tick: number): void;
}

const TILE_SIZE = 16;
const CANVAS_TWIDTH = 10;
const CANVAS_THEIGHT = 10;

class Render {
  static sprite(
    ctx: CanvasRenderingContext2D,
    sprite: Sprite,
    x: number,
    y: number,
    tick: number
  ) {
    sprite.render(ctx, x, y, tick);
  }
}

export function Engine({
  tileAt,
  entities,
}: {
  tileAt: (col: number, row: number) => Tile;
  entities: Entity[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas == null || ctx == null) {
      return;
    }

    let nextRaf = 0; // todo is this an issue
    const frame = function frame(time: number) {
      const tick = (time / 200) >> 0;
      for (let c = 0; c < CANVAS_TWIDTH; c++) {
        for (let r = 0; r < CANVAS_THEIGHT; r++) {
          const tile = tileAt(c, r);
          // if (tile.collides) {
          //   ctx.fillStyle = "#555";dddd
          // } else {
          //   ctx.fillStyle = "#eee";
          // }
          for (const sprite of tile.bSprites) {
            Render.sprite(ctx, sprite, r * TILE_SIZE, c * TILE_SIZE, tick);
          }

          for (const sprite of tile.fSprites) {
            Render.sprite(ctx, sprite, r * TILE_SIZE, c * TILE_SIZE, tick);
          }
        }
      }

      for (const entity of entities) {
        entity.update();
        entity.render(ctx, tick);
      }

      nextRaf = requestAnimationFrame(frame);
    };
    nextRaf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(nextRaf);
    };
  }, []);

  return (
    <canvas
      style={{ background: "gray" }}
      width={TILE_SIZE * 10}
      height={TILE_SIZE * 10}
      ref={canvasRef}
    />
  );
}
