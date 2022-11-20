import { useEffect, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity } from "./engine/Entity";
import { Tile } from "./engine/Tile";
import charsURL from "./assets/Characters_V3.png";
import envURL from "./assets/BitsAndBobs.png";
import { CharacterEntity, Sprite } from "./CharacterEntity";
import { ImageUtils, TileMap } from "./engine/TileMap";

type TileSlot = [f: Sprite | null, b: Sprite | null, collides: boolean];

function mapOfSpec(spec: TileSlot[][]): Tile[][] {
  const result = [];

  for (let r = 0; r < spec.length; r++) {
    const row: Tile[] = [];
    result.push(row);
    for (let c = 0; c < spec.length; c++) {
      const [f, b, collides] = spec[r][c];
      row.push(new Tile(f ? [f] : [], b ? [b] : [], collides, r, c));
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

      const w: TileSlot = [null, envTileMap.spriteAt(9, 5), true];
      const f: TileSlot = [null, envTileMap.spriteAt(9, 1), false];

      const spec = [
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
      const map = mapOfSpec(spec);
      const [down, up, right] = charTileMap.sprites(17, 18, 19);
      const left = new Sprite(right.tileMap, right.tilePositions, "horizontal");
      const walkDown = charTileMap.spriteAnimating([21, 17, 22, 17]);
      const walkUp = charTileMap.spriteAnimating([23, 18, 24, 18]);
      const walkRight = charTileMap.spriteAnimating([25, 19, 26, 19]);
      const walkLeft = new Sprite(
        walkRight.tileMap,
        walkRight.tilePositions,
        "horizontal"
      );

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
