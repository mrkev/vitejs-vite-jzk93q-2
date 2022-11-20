import { useEffect, useState } from "react";
import { ItemEntity } from "./engine/Entity";
import charsURL from "./assets/Characters_V3T.png";
import envURL from "./assets/BitsAndBobsT.png";
import { CharacterEntity } from "./CharacterEntity";
import { ImageUtils, TileMap } from "./engine/TileMap";
import { Assets, EngineState, TileSlot, mapOfSpec, Game } from "./App";

export function LoadingScreen() {
  const [assets, setAssets] = useState<Assets | null>(null);
  const [engineState, setEngineState] = useState<EngineState | null>(null);

  useEffect(() => {
    async function load() {
      const charTileMap = new TileMap(await ImageUtils.loadImage(charsURL), 16);
      const envTileMap = new TileMap(await ImageUtils.loadImage(envURL), 16);

      const w: TileSlot = [envTileMap.spriteAt(9, 5), true];
      const f: TileSlot = [envTileMap.spriteAt(9, 1), false];

      const n: TileSlot = [null, false];
      const sFlowers: TileSlot = [envTileMap.spriteAt(2, 7), false];

      const sKitchenStore: TileSlot = [envTileMap.spriteAt(3, 1), true];
      const sStove: TileSlot = [envTileMap.spriteAt(3, 0), true];
      const sTV: TileSlot = [envTileMap.spriteAt(2, 0), true];
      const sDrawers: TileSlot = [envTileMap.spriteAt(2, 4), true];
      const sDresser: TileSlot = [envTileMap.spriteAt(2, 5), true];
      const sFlowerbed: TileSlot = [envTileMap.spriteAt(2, 6), true];
      const sPainting: TileSlot = [envTileMap.spriteAt(1, 0), true];

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
        [n, n, sPainting, n, n, n, n, n, n, n],
        [n, n, n, n, n, sKitchenStore, sKitchenStore, sKitchenStore, sStove, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, sFlowers, n, n, n, n, sTV, n, n, n],
        [n, sDresser, sDrawers, n, n, n, n, n, n, n],
        [n, n, n, n, n, n, n, n, n, n],
        [n, n, n, sFlowerbed, n, n, sFlowerbed, n, n, n],
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

      const drawer = new ItemEntity(envTileMap.spriteAt(3, 1), 64, 32, true);

      const fridge = new ItemEntity(
        envTileMap.spriteAt(3, 2, 1, 2),
        64,
        64,
        true
      );

      setAssets({
        envTileMap,
        charTileMap,
      });
      setEngineState({
        entities: [charEntity],
        tileMap: map,
      });
    }

    load();
  }, []);

  if (engineState == null || assets == null) {
    return <>loading...</>;
  } else {
    return <Game engineState={engineState} assets={assets}></Game>;
  }
}
