import { CollisionMode, Entity } from "./Entity";
import { Body } from "matter-js";
import { Sprite } from "./Sprite";
import { entitiesAtPoint } from "./Engine";
import { DEBUG_POSITIONS } from "./engineGlobals";
import { GameState } from "../GameState";
import { nullthrows, exhaustive } from "../utils";

type CharacterEntitySprites = {
  down: Sprite;
  up: Sprite;
  right: Sprite;
  left: Sprite;
  //
  walkDown: Sprite;
  walkUp: Sprite;
  walkRight: Sprite;
  walkLeft: Sprite;
};

export class CharacterEntity extends Entity {
  vx: number = 0;
  vy: number = 0;
  sprites: CharacterEntitySprites;
  facing: 0 | 1 | 2 | 3 = 2; // like a clock, 0 is up, then 1, etc

  constructor(
    x: number,
    y: number,
    sprites: CharacterEntitySprites,
    collides: CollisionMode = "collides"
  ) {
    const width = sprites.down.tileMap.tileSize;
    const height = sprites.down.tileMap.tileSize;
    super(x, y, width, height, collides);
    this.sprites = sprites;
  }

  update(): void {
    // Update position
    // Update physics
    if (this.mBody) {
      Body.setVelocity(this.mBody, { x: this.vx, y: this.vy });
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    // Update facing direction
    if (this.vy > 0) {
      this.facing = 2;
    } else if (this.vy < 0) {
      this.facing = 0;
    } else if (this.vx > 0) {
      this.facing = 1;
    } else if (this.vx < 0) {
      this.facing = 3;
    }
  }

  render(ctx: CanvasRenderingContext2D, tick: number): void {
    ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, 32, 32);

    if (this.highlight) {
      ctx.fillStyle = "#65FF00";
      console.log("here");
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    if (DEBUG_POSITIONS) {
      const REACH = 4;
      for (const dir of [0, 1, 2, 3]) {
        let actionX, actionY;
        switch (dir) {
          case 0: {
            actionX = this.x + this.width / 2;
            actionY = this.y - REACH;
            break;
          }
          case 1: {
            actionX = this.x + this.width + REACH;
            actionY = this.y + this.height / 2;
            break;
          }
          case 2: {
            actionX = this.x + this.width / 2;
            actionY = this.y + this.height + REACH;
            break;
          }
          case 3: {
            actionX = this.x - REACH;
            actionY = this.y + this.height / 2;
            break;
          }
        }
        ctx.fillRect(nullthrows(actionX) - 1, nullthrows(actionY) + 1, 2, 2);
      }
    }

    switch (this.facing) {
      case 0: {
        if (this.vy === 0) {
          this.sprites.up.render(ctx, this.x, this.y, tick);
        } else {
          this.sprites.walkUp.render(ctx, this.x, this.y, tick);
        }
        break;
      }
      case 1: {
        if (this.vx === 0) {
          this.sprites.right.render(ctx, this.x, this.y, tick);
        } else {
          this.sprites.walkRight.render(ctx, this.x, this.y, tick);
        }
        break;
      }
      case 2: {
        if (this.vy === 0) {
          this.sprites.down.render(ctx, this.x, this.y, tick);
        } else {
          this.sprites.walkDown.render(ctx, this.x, this.y, tick);
        }
        break;
      }
      case 3: {
        if (this.vx === 0) {
          this.sprites.left.render(ctx, this.x, this.y, tick);
        } else {
          this.sprites.walkLeft.render(ctx, this.x, this.y, tick);
        }
        break;
      }
      default:
        exhaustive(this.facing);
    }
  }

  destroy(): void {
    // noop
  }
}

export function getEntityAtActionReach(
  character: CharacterEntity,
  gameState: GameState
): Entity | null {
  const REACH = 4;

  let actionX, actionY;
  switch (character.facing) {
    case 0: {
      actionX = character.x + character.width / 2;
      actionY = character.y - REACH;
      break;
    }
    case 1: {
      actionX = character.x + character.width + REACH;
      actionY = character.y + character.height / 2;
      break;
    }
    case 2: {
      actionX = character.x + character.width / 2;
      actionY = character.y + character.height + REACH;
      break;
    }
    case 3: {
      actionX = character.x - REACH;
      actionY = character.y + character.height / 2;
      break;
    }
    default:
      exhaustive(character.facing);
  }

  const entities = entitiesAtPoint(
    actionX,
    actionY,
    gameState.entities._getRaw()
  );

  // priority to the top-most
  const entity = entities.at(-1);
  return entity ?? null;
}
