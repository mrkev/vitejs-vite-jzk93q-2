import { useCallback, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity } from "./engine/Entity";
import { Tile } from "./engine/Tile";
import { CharacterEntity } from "./CharacterEntity";
import { TileMap } from "./engine/TileMap";
import { LoadingScreen } from "./LoadingScreen";
import { useLinkedState } from "s-state/LinkedState";
import { useAppGlobalKeyboardShortcuts } from "./useAppGlobalKeyboardShortcuts";
import { GameState } from "./GameState";

export default function App() {
  return (
    <div className="App">
      <LoadingScreen></LoadingScreen>
    </div>
  );
}

export type Assets = {
  envTileMap: TileMap;
  charTileMap: TileMap;
};

export type EngineState = {
  tileMap: Tile[][];
  entities: Entity[];
};

export function Game({
  assets,
  tileMap,
  gameState,
}: {
  assets: Assets;
  tileMap: Tile[][];
  gameState: GameState;
}) {
  const [interactionMode, setInteractionMode] = useLinkedState(
    gameState.interactionMode
  );
  const [message] = useLinkedState(gameState.gameCopy);

  useAppGlobalKeyboardShortcuts(gameState);

  const tileAt = useCallback(
    (c: number, r: number) => {
      return tileMap[r][c];
    },
    [tileMap]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {interactionMode.kind}
      <Engine
        tileAt={tileAt}
        entities={gameState.entities._getRaw()}
        onClick={(entities: Entity[], tile: Tile) => {
          // In reverese order to grab the entity that's stacked on top first
          for (let i = entities.length - 1; i >= 0; i--) {
            const entitiy = entities[i];
            if (
              entitiy instanceof CharacterEntity &&
              interactionMode.kind === "editing"
            ) {
              entitiy.highlight = false;
              setInteractionMode({ kind: "controlling", character: entitiy });
              return;
            }
          }
        }}
      />
      {message}
    </div>
  );
}
