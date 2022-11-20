import { SpriteMap } from "./SpriteMap";

/**
 * A single static or animated slice of a TileMap.
 */
export class Sprite {
  readonly tileMap: SpriteMap;
  readonly tilePositions: number[];
  readonly cWidth: number; // column with
  readonly rHeight: number; // column height
  // ^ todo, maybe change these to tileWidth and tileHeight?

  readonly flip: "horizontal" | "vertical" | "both" | "none";
  readonly animSpeed: number;
  readonly width: number;
  readonly height: number;

  constructor(
    map: SpriteMap,
    positions: number[],
    cWidth: number,
    rHeight: number,
    flip: "horizontal" | "vertical" | "both" | "none" = "none",
    animSpeed: number = 1
  ) {
    this.tileMap = map;
    this.tilePositions = positions;
    this.cWidth = cWidth;
    this.rHeight = rHeight;
    this.flip = flip;
    this.animSpeed = animSpeed;
    this.width = this.tileMap.tileSize * cWidth;
    this.height = this.tileMap.tileSize * rHeight;
  }

  /**
   * @returns a copy of this sprite, flipped as desired
   */
  withFlip(flip: "horizontal" | "vertical" | "both" | "none"): Sprite {
    return new Sprite(
      this.tileMap,
      this.tilePositions,
      this.cWidth,
      this.rHeight,
      flip,
      this.animSpeed
    );
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
    const pos =
      this.tilePositions[
        Math.floor(tick / this.animSpeed) % this.tilePositions.length
      ];
    const row = Math.floor(pos / this.tileMap.cols);
    const col = pos - row * this.tileMap.cols;
    const size = this.tileMap.tileSize;

    const horizontal = this.flip === "horizontal" || this.flip === "both";
    const vertical = this.flip === "vertical" || this.flip === "both";

    ctx.save();
    ctx.setTransform(
      horizontal ? -1 : 1,
      0,
      0,
      vertical ? -1 : 1,
      x + (horizontal ? this.tileMap.tileSize : 0),
      y + (vertical ? this.tileMap.tileSize : 0)
    );

    ctx.drawImage(
      this.tileMap.image,
      // source
      col * size,
      row * size,
      this.cWidth * size,
      this.rHeight * size,
      // destination
      0,
      0,
      this.cWidth * size,
      this.rHeight * size
    );

    ctx.restore();
  }
}
