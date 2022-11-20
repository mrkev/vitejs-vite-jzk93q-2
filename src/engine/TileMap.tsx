import { Sprite } from "../CharacterEntity";

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

  public spriteAt(row: number, col: number): Sprite {
    const num = row * this.cols + col;
    return new Sprite(this, [num]);
  }

  public spriteNumber(num: number): Sprite {
    return new Sprite(this, [num]);
  }

  public sprites(...nums: number[]): Sprite[] {
    return nums.map((n) => new Sprite(this, [n]));
  }

  public spriteAnimating(nums: number[], speed?: number): Sprite {
    return new Sprite(this, nums, "none", speed);
  }

  public spritesAnimating(nums: number[], speed?: number): Sprite {
    return new Sprite(this, nums, "none", speed);
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
