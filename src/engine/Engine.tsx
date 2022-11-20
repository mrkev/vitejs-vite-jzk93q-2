import { useEffect, useRef, useState } from "react";
import { Sprite } from "../Sprite";
import { Entity } from "./Entity";
import { Tile } from "./Tile";
import {
  Engine as MatterEngine,
  Composite as MatterComposite,
  Body,
} from "matter-js";

export type Point = { x: number; y: number };
export type TPoint = { c: number; r: number };

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
    sprite.render(ctx, y, x, tick);
  }
}

const seenEntities = new WeakSet<Entity>();
const seenTiles = new WeakSet<Tile>();

export const DEBUG_POSITIONS = false;

export function Engine({
  tileAt,
  entities,
}: {
  tileAt: (col: number, row: number) => Tile;
  entities: Entity[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [matterEngine] = useState<MatterEngine>(() =>
    MatterEngine.create({ gravity: { x: 0, y: 0 } })
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas == null || ctx == null) {
      return;
    }
    ctx.imageSmoothingEnabled = false;

    let nextRaf = 0; // todo is setting to default 0 an issue?
    let lastTime = -1;
    const frame = function frame(time: number) {
      const tick = (time / 200) >> 0;

      // Ensure we know all tiles
      for (let c = 0; c < CANVAS_TWIDTH; c++) {
        for (let r = 0; r < CANVAS_THEIGHT; r++) {
          const tile = tileAt(c, r);
          if (!seenTiles.has(tile)) {
            seenTiles.add(tile);
            if (tile.mBody != null) {
              MatterComposite.add(matterEngine.world, tile.mBody);
            }
          }
        }
      }

      // Let entities update themselves
      for (const entity of entities) {
        if (!seenEntities.has(entity)) {
          seenEntities.add(entity);
          if (entity.mBody != null) {
            MatterComposite.add(matterEngine.world, entity.mBody);
          }
        }
        entity.update();
      }

      // Calculate and commit physics back to entities
      const deltaTime = lastTime > 0 ? time - lastTime : 1000 / 60;
      MatterEngine.update(matterEngine, deltaTime);
      for (const entity of entities) {
        if (entity.mBody) {
          // console.log(entity.mBody.position.x);
          // TODO: should we round here or at render time?
          entity.x = Math.round(entity.mBody.position.x);
          entity.y = Math.round(entity.mBody.position.y);

          Body.setPosition(entity.mBody, { x: entity.x, y: entity.y });
        }
      }

      // Render background tiles
      for (let c = 0; c < CANVAS_TWIDTH; c++) {
        for (let r = 0; r < CANVAS_THEIGHT; r++) {
          const tile = tileAt(c, r);
          for (const sprite of tile.bSprites) {
            Render.sprite(ctx, sprite, r * TILE_SIZE, c * TILE_SIZE, tick);
          }
        }
      }

      // Render entities
      for (const entity of entities) {
        entity.update();
        entity.render(ctx, tick);
      }

      // Render foreground tiles

      for (let c = 0; c < CANVAS_TWIDTH; c++) {
        for (let r = 0; r < CANVAS_THEIGHT; r++) {
          const tile = tileAt(c, r);
          for (const sprite of tile.fSprites) {
            Render.sprite(ctx, sprite, r * TILE_SIZE, c * TILE_SIZE, tick);
          }
          if (DEBUG_POSITIONS) {
            ctx.fillStyle = "red";
            ctx.font = "8px Helvetica";
            ctx.fillText(
              `${tile.row},${tile.col}`,
              r * TILE_SIZE,
              c * TILE_SIZE + 8
            );
          }
        }
      }

      lastTime = time;
      nextRaf = requestAnimationFrame(frame);
    };
    nextRaf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(nextRaf);
      console.log("HERE");
      // for (const entity of entities) {
      //   entity.destroy();
      // }
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
