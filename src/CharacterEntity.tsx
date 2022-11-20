import { Entity } from "./engine/Engine";
import { TileMap } from "./TileMap";

export class Sprite {
  readonly tileMap: TileMap;
  readonly tilePos: number;
  readonly width: number;
  readonly height: number;
  readonly flip: "horizontal" | "vertical" | "both" | "none";
  readonly keyColor: string | null = null;
  constructor(
    map: TileMap,
    position: number,
    flip: "horizontal" | "vertical" | "both" | "none" = "none",
    keyColor: string | null = null
  ) {
    this.tileMap = map;
    this.tilePos = position;
    this.width = map.tileSize;
    this.height = map.tileSize;
    this.flip = flip;
    this.keyColor = keyColor;
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const row = Math.floor(this.tilePos / this.tileMap.cols);
    const col = this.tilePos - row * this.tileMap.cols;
    const size = this.tileMap.tileSize;

    const horizontal = this.flip === "horizontal" || this.flip === "both";
    const vertical = this.flip === "vertical" || this.flip === "both";

    ctx.save();
    ctx.setTransform(
      horizontal ? -1 : 1,
      0,
      0,
      vertical ? -1 : 1,
      x + (horizontal ? this.width : 0),
      y + (vertical ? this.height : 0)
    );

    ctx.drawImage(
      this.tileMap.image,
      // source
      col * size,
      row * size,
      size,
      size,
      // destination
      0, // x unecessary, we already translated above
      0, // y unecessary, we already translated above
      size,
      size
    );

    ctx.restore();
  }
}

type CharacterEntitySprites = {
  idle: Sprite;
  up: Sprite;
  right: Sprite;
  left: Sprite;
};

export class CharacterEntity extends Entity {
  vx: number = 0;
  vy: number = 0;
  sprites: CharacterEntitySprites;
  facing: 0 | 1 | 2 | 3 = 2; // like a clock, 0 is up, then 1, etc

  constructor(x: number, y: number, sprites: CharacterEntitySprites) {
    super(x, y);
    this.sprites = sprites;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    console.log("DOWN");
    switch (e.key) {
      case "w":
        this.vy -= 1;
        break;
      case "a":
        this.vx -= 1;
        break;
      case "s":
        this.vy += 1;
        break;
      case "d":
        this.vx += 1;
        break;
    }
  };

  onKeyUp = (e: KeyboardEvent) => {
    console.log("KEYUP");
    switch (e.key) {
      case "w":
        this.vy += 1;
        break;
      case "a":
        this.vx += 1;
        break;
      case "s":
        this.vy -= 1;
        break;
      case "d":
        this.vx -= 1;
        break;
    }
  };

  update(): void {
    const { vx, vy } = this;
    // console.log(vx, vy);
    this.x += this.vx;
    this.y += this.vy;
    if (this.vx > 0) {
      this.facing = 1;
    } else if (this.vx < 0) {
      this.facing = 3;
    }

    if (this.vy > 0) {
      this.facing = 2;
    } else if (this.vy < 0) {
      this.facing = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, 32, 32);
    switch (this.facing) {
      case 0:
        this.sprites.up.render(ctx, this.x, this.y);
        break;
      case 1:
        this.sprites.right.render(ctx, this.x, this.y);
        break;
      case 2:
        this.sprites.idle.render(ctx, this.x, this.y);
        break;
      case 3:
        this.sprites.left.render(ctx, this.x, this.y);
        break;

      default:
        exhaustive(this.facing);
    }
  }

  destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}

function exhaustive(x: never): never {
  throw new Error(`unexpected ${x} in switch statement`);
}
