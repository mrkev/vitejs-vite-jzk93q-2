import { useEffect, useState } from "react";
import { ItemEntity } from "./engine/ItemEntity";
import charsURL from "./assets/Characters_V3T.png";
import envURL from "./assets/BitsAndBobsT.png";
import { CharacterEntity } from "./engine/CharacterEntity";
import { ImageUtils, SpriteMap } from "./engine/SpriteMap";
import { Assets, Game } from "./App";
import { Tile } from "./engine/Tile";
import { CollisionMode, Entity } from "./engine/Entity";
import { Sprite } from "./engine/Sprite";
import { TILE_SIZE } from "./engine/engineGlobals";
import { GameState, InteractionMode } from "./GameState";

export type TileSlot = [s: Sprite | null, collides: boolean];

export function mapOfSpec(bg: TileSlot[][], fg: TileSlot[][]): Tile[][] {
  const result = [];
  for (let r = 0; r < bg.length; r++) {
    const row: Tile[] = [];
    result.push(row);
    for (let c = 0; c < bg.length; c++) {
      const [b, collides] = bg[r][c];
      const [f, collides2] = fg[r][c];
      row.push(
        new Tile(f ? [f] : [], b ? [b] : [], collides || collides2, r, c)
      );
    }
  }
  return result;
}

export type EntitySlot = [s: Sprite, desc: string, collision: CollisionMode];

export function itemsInMap(spec: (EntitySlot | null)[][]): Entity[] {
  const result = [];
  for (let r = 0; r < spec.length; r++) {
    for (let c = 0; c < spec.length; c++) {
      const slot = spec[r][c];
      if (slot == null) {
        continue;
      }
      const [sprite, desc, collision] = slot;
      result.push(
        new ItemEntity(sprite, c * TILE_SIZE, r * TILE_SIZE, collision, desc)
      );
    }
  }
  return result;
}

export function LoadingScreen() {
  const [assets, setAssets] = useState<Assets | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [tileMap, setTileMap] = useState<Tile[][] | null>(null);

  useEffect(() => {
    async function load() {
      const charTileMap = new SpriteMap(
        await ImageUtils.loadImage(charsURL),
        16
      );
      const envTileMap = new SpriteMap(await ImageUtils.loadImage(envURL), 16);

      const w: TileSlot = [envTileMap.spriteAt(9, 5), true];
      const f: TileSlot = [envTileMap.spriteAt(9, 1), false];

      const n: TileSlot = [null, false];
      const sFlowers: TileSlot = [envTileMap.spriteAt(2, 7), false];

      const bg = [
        [w, w, w, w, w, w, w, w, w, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, f, f, f, f, f, f, f, f, w],
        [w, w, w, w, w, w, w, w, w, w],
      ];

      const fg = [
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, sFlowers, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
      ];

      const map = mapOfSpec(bg, fg);
      const [down, up, right] = charTileMap.sprites(17, 18, 19);
      const left = right.withFlip("horizontal");
      const walkDown = charTileMap.spriteAnimating([21, 17, 22, 17]);
      const walkUp = charTileMap.spriteAnimating([23, 18, 24, 18]);
      const walkRight = charTileMap.spriteAnimating([25, 19, 26, 19]);
      const walkLeft = walkRight.withFlip("horizontal");

      const charEntity = new CharacterEntity(32, 32, {
        down,
        up,
        right,
        left,
        walkDown,
        walkUp,
        walkRight,
        walkLeft,
      });

      const drawer = new ItemEntity(
        envTileMap.spriteAt(3, 1),
        64,
        32,
        "static",
        "Full of odd trinkets."
      );

      const fridge = new ItemEntity(
        envTileMap.spriteAt(3, 2, 1, 2),
        64,
        64,
        "static",
        "It's a fridge. Brr."
      );

      const sTV: EntitySlot = [
        envTileMap.spriteAt(2, 0),
        "Something's playing",
        "static",
      ];
      const sKitchenStore: EntitySlot = [
        envTileMap.spriteAt(3, 1),
        "Full of food and pans",
        "static",
      ];

      const sStove: EntitySlot = [
        envTileMap.spriteAt(3, 0),
        "Nothing to cook",
        "static",
      ];

      const sDrawers: EntitySlot = [
        envTileMap.spriteAt(2, 4),
        "What to wear?",
        "static",
      ];
      const sDresser: EntitySlot = [
        envTileMap.spriteAt(2, 5),
        "Lots of clothes",
        "static",
      ];
      const sFlowerbed: EntitySlot = [
        envTileMap.spriteAt(2, 6),
        "Pretty!",
        "static",
      ];
      const sPainting: EntitySlot = [
        envTileMap.spriteAt(1, 0),
        "It's a house",
        "static",
      ];

      const z = null;
      const spec = [
        [z, z, sPainting, z, z, z, z, z, z, z],
        [z, z, z, z, z, sKitchenStore, sKitchenStore, sKitchenStore, sStove, z],
        [z, z, z, z, z, z, z, z, z, z],
        [z, z, z, z, z, z, z, z, z, z],
        [z, z, z, z, z, z, z, z, z, z],
        [z, z, z, z, z, z, sTV, z, z, z],
        [z, sDresser, sDrawers, z, z, z, z, z, z, z],
        [z, z, z, z, z, z, z, z, z, z],
        [z, z, z, sFlowerbed, z, z, sFlowerbed, z, z, z],
        [z, z, z, z, z, z, z, z, z, z],
      ];
      const entities = itemsInMap(spec);
      entities.push(charEntity);

      setAssets({
        envTileMap,
        charTileMap,
      });

      const interactionMode: InteractionMode = {
        kind: "controlling",
        character: charEntity,
      };

      const gameState = new GameState(interactionMode, entities);

      setGameState(gameState);
      setTileMap(map);
    }

    load();
  }, []);

  if (gameState == null || assets == null || tileMap == null) {
    return <>loading...</>;
  } else {
    return <Game gameState={gameState} assets={assets} tileMap={tileMap} />;
  }
}
