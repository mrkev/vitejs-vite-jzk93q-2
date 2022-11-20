import {
  Body,
  Composite as MatterComposite,
  Engine as MatterEngine,
} from "matter-js";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CANVAS_THEIGHT,
  CANVAS_TWIDTH,
  DEBUG_POSITIONS,
  SCALING_FACTOR,
  TILE_SIZE,
} from "./engineGlobals";
import { Entity } from "./Entity";
import { Tile } from "./Tile";

const seenEntities = new WeakSet<Entity>();
const seenTiles = new WeakSet<Tile>();

export type EngineClickHandler = (entities: Entity[], tile: Tile) => void;

export function Engine({
  tileAt,
  entities,
  onClick,
}: {
  tileAt: (col: number, row: number) => Tile;
  entities: readonly Entity[];
  onClick?: EngineClickHandler;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onCanvasClick = useEngineClickEvent(
    entities,
    tileAt,
    canvasRef,
    onClick
  );

  useEngineLoop(canvasRef, tileAt, entities);

  return (
    <canvas
      style={{ background: "gray" }}
      width={TILE_SIZE * 10}
      height={TILE_SIZE * 10}
      ref={canvasRef}
      onClick={onCanvasClick}
    />
  );
}

function useEngineClickEvent(
  entities: readonly Entity[],
  tileAt: (col: number, row: number) => Tile,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  onClick?: EngineClickHandler
) {
  return useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): void => {
      // todo: !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rect = canvasRef.current!.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / SCALING_FACTOR;
      const clickY = (e.clientY - rect.top) / SCALING_FACTOR;

      const clickedEntities = entitiesAtPoint(clickX, clickY, entities);

      const row = (clickY / TILE_SIZE) >> 0;
      const col = (clickX / TILE_SIZE) >> 0;

      const tile = tileAt(col, row);
      onClick?.(clickedEntities, tile);
    },
    [canvasRef, entities, onClick, tileAt]
  );
}

function useEngineLoop(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  tileAt: (col: number, row: number) => Tile,
  entities: readonly Entity[]
) {
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
            sprite.render(ctx, c * TILE_SIZE, r * TILE_SIZE, tick);
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
            sprite.render(ctx, c * TILE_SIZE, r * TILE_SIZE, tick);
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
      // console.log("HERE");
      // for (const entity of entities) {
      //   entity.destroy();
      // }
    };
  }, [canvasRef, entities, matterEngine, tileAt]);
}

export function entitiesAtPoint(
  px: number,
  py: number,
  entities: readonly Entity[]
): Entity[] {
  const result: Entity[] = [];
  for (const entity of entities) {
    const { x, y, width, height } = entity;
    if (px > x && px < x + width && py > y && py < y + height) {
      result.push(entity);
    }
  }
  return result;
}
