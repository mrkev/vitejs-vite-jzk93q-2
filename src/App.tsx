import { useCallback, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity } from "./engine/Entity";
import { Tile } from "./engine/Tile";
import { CharacterEntity } from "./engine/CharacterEntity";
import { SpriteMap } from "./engine/SpriteMap";
import { LoadingScreen } from "./LoadingScreen";
import { useLinkedState } from "s-state/LinkedState";
import { useAppGlobalKeyboardShortcuts } from "./useAppGlobalKeyboardShortcuts";
import { GameState } from "./GameState";

export default function App() {
  return (
    <div className="App">
      <LoadingScreen />
    </div>
  );
}

export type Assets = {
  envTileMap: SpriteMap;
  charTileMap: SpriteMap;
};

export function Game({
  tileMap,
  gameState,
}: {
  assets: Assets;
  tileMap: Tile[][];
  gameState: GameState;
}) {
  useAppGlobalKeyboardShortcuts(gameState);
  const [message] = useLinkedState(gameState.message);
  const [interactionMode, setInteractionMode] = useLinkedState(
    gameState.interactionMode
  );

  const onClick = useCallback(
    (entities: Entity[], tile: Tile) => {
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
    },
    [interactionMode.kind, setInteractionMode]
  );

  const tileAt = useCallback(
    (c: number, r: number) => tileMap[r][c],
    [tileMap]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {interactionMode.kind}
      <Engine
        tileAt={tileAt}
        entities={gameState.entities._getRaw()}
        onClick={onClick}
      />
      {message}
    </div>
  );
}
