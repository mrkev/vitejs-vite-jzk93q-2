import { useEffect, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity, ItemEntity } from "./engine/Entity";
import { Tile } from "./engine/Tile";
import charsURL from "./assets/Characters_V3T.png";
import envURL from "./assets/BitsAndBobsT.png";
import { CharacterEntity } from "./CharacterEntity";
import { Sprite } from "./Sprite";
import { ImageUtils, TileMap } from "./engine/TileMap";

type TileSlot = [s: Sprite | null, collides: boolean];

function mapOfSpec(bg: TileSlot[][], fg: TileSlot[][]): Tile[][] {
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

function App() {
  // const [loadingState, setLoadingState] = useState("loading");
  const [charTiles, setCharTiles] = useState<TileMap | null>(null);
  const [entities, setEntities] = useState<Entity[] | null>(null);

  const [envTiles, setEnvTiles] = useState<TileMap | null>(null);
  const [map, setMap] = useState<Tile[][] | null>(null);

  useEffect(() => {
    async function load() {
      const charTileMap = new TileMap(await ImageUtils.loadImage(charsURL), 16);
      const envTileMap = new TileMap(await ImageUtils.loadImage(envURL), 16);

      console.log(envTileMap);

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

      setCharTiles(charTileMap);
      setEnvTiles(envTileMap);
      setEntities([charEntity]);
      setMap(map);
    }

    load();
  }, []);

  if (entities == null || envTiles == null || charTiles == null || !map) {
    return <>loading...</>;
  }

  const tileAt = (c: number, r: number) => {
    return map[r][c];
  };

  return (
    <div className="App">
      {}
      <Engine tileAt={tileAt} entities={entities} />
    </div>
  );
}

export default App;
