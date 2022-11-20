import { useEffect, useState } from "react";
import "./App.css";
import { Engine } from "./engine/Engine";
import { Entity } from "./engine/Entity";
import { Tile } from "./engine/Tile";
import { CharacterEntity } from "./CharacterEntity";
import { Sprite } from "./Sprite";
import { TileMap } from "./engine/TileMap";
import { LoadingScreen } from "./LoadingScreen";
import { SPrimitive, useLinkedState } from "s-state/LinkedState";

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

type InteractionMode =
  | { kind: "editing" }
  | { kind: "controlling"; character: CharacterEntity };

export class GameState {
  readonly interactionMode: SPrimitive<InteractionMode>;
  constructor(interactionMode: InteractionMode) {
    this.interactionMode = SPrimitive.of(interactionMode);
  }
}

export function Game({
  assets,
  engineState,
}: {
  assets: Assets;
  engineState: EngineState;
}) {
  const [gameState] = useState<GameState>(() => {
    let interactionMode: InteractionMode = {
      kind: "editing",
    };
    for (const entity of engineState.entities) {
      if (entity instanceof CharacterEntity) {
        interactionMode = {
          kind: "controlling",
          character: entity,
        };
      }
    }
    return new GameState(interactionMode);
  });

  const [interactionMode] = useLinkedState(gameState.interactionMode);

  useAppGlobalKeyboardShortcuts(gameState);

  const tileAt = (c: number, r: number) => {
    return engineState.tileMap[r][c];
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {interactionMode.kind}
      <Engine tileAt={tileAt} entities={engineState.entities} />
    </div>
  );
}

function useAppGlobalKeyboardShortcuts(gameState: GameState) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      console.log("DOWN", e.key, ".");
      switch (e.key) {
        case "Escape": {
          if (gameState.interactionMode.peek().kind === "controlling") {
            gameState.interactionMode.set({
              kind: "editing",
            });
          }
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      // console.log("KEYUP");
      // switch (e.key) {
      // }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
}
