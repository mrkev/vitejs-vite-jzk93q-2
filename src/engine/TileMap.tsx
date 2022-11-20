import { Sprite } from "../Sprite";

/**
 * An image containing multiple sprites
 */
export class TileMap {
  readonly image: HTMLImageElement;
  readonly tileSize: number;
  readonly cols: number;
  readonly rows: number;
  constructor(image: HTMLImageElement, tileSize: number) {
    this.image = image;
    this.tileSize = tileSize;
    this.cols = (this.image.width / tileSize) >> 0;
    this.rows = (this.image.height / tileSize) >> 0;
  }

  public spriteAt(
    row: number,
    col: number,
    cWidth: number = 1,
    rHeight: number = 1
  ): Sprite {
    const num = row * this.cols + col;
    return new Sprite(this, [num], cWidth, rHeight);
  }

  public spriteNumber(
    num: number,
    cWidth: number = 1,
    rHeight: number = 1
  ): Sprite {
    return new Sprite(this, [num], cWidth, rHeight);
  }

  public sprites(...nums: number[]): Sprite[] {
    return nums.map((n) => new Sprite(this, [n], 1, 1));
  }

  public spriteAnimating(nums: number[], speed?: number): Sprite {
    return new Sprite(this, nums, 1, 1, "none", speed);
  }

  public spritesAnimating(nums: number[], speed?: number): Sprite {
    return new Sprite(this, nums, 1, 1, "none", speed);
  }

  // unused
  public coordsOfPosition(pos: number): [x: number, y: number] {
    const row = Math.floor(pos / this.cols);
    const col = pos - row * this.cols;
    return [col * this.tileSize, row * this.tileSize];
  }
}

export class ImageUtils {
  static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((res) => {
      const image = new Image();
      image.src = url;
      image.onload = function () {
        res(image);
      };
    });
  }
}
