import { useEffect, useState } from "react";
import "./App.css";
import { Engine, Entity, Tile } from "./engine/Engine";
import charsURL from "./assets/Characters_V3.png";
import envURL from "./assets/BitsAndBobs.png";
import { CharacterEntity, Sprite } from "./CharacterEntity";
import { ImageUtils, TileMap } from "./TileMap";

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

      const w = new Tile([], [envTileMap.spriteAt(9, 5)], true);
      const f = new Tile([], [envTileMap.spriteAt(9, 1)], false);

      const map = [
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

      const [idle, up, right] = charTileMap.sprites(17, 18, 19);

      const charEntity = new CharacterEntity(32, 32, {
        idle,
        up,
        right,
        left: new Sprite(right.tileMap, right.tilePos, "horizontal"),
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
