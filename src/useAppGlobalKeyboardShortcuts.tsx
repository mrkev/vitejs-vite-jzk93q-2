import { useEffect } from "react";
import { GameState } from "./GameState";
import { CharacterEntity, exhaustive } from "./CharacterEntity";
import { Entity } from "./engine/Entity";
import { ItemEntity } from "./engine/ItemEntity";
import { entitiesAtPoint } from "./engine/Engine";

function getEntityAtActionReach(
  character: CharacterEntity,
  gameState: GameState
): Entity | null {
  const REACH = 4;

  let actionX, actionY;
  switch (character.facing) {
    case 0: {
      actionX = character.x + character.width / 2;
      actionY = character.y - REACH;
      break;
    }
    case 1: {
      actionX = character.x + character.width + REACH;
      actionY = character.y + character.height / 2;
      break;
    }
    case 2: {
      actionX = character.x + character.width / 2;
      actionY = character.y + character.height + REACH;
      break;
    }
    case 3: {
      actionX = character.x - REACH;
      actionY = character.y + character.height / 2;
      break;
    }
    default:
      exhaustive(character.facing);
  }

  const entities = entitiesAtPoint(
    actionX,
    actionY,
    gameState.entities._getRaw()
  );

  // priority to the top-most
  const entity = entities.at(-1);
  return entity ?? null;
}

export function useAppGlobalKeyboardShortcuts(gameState: GameState) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // console.log("DOWN", e.key, ".");
      const interactionMode = gameState.interactionMode.peek();

      // Application Shortcuts
      switch (e.key) {
        case "Escape": {
          if (interactionMode.kind === "controlling") {
            interactionMode.character.highlight = true;
            gameState.interactionMode.set({
              kind: "editing",
            });
          }
        }
      }

      // Character Control
      if (interactionMode.kind === "controlling") {
        const char = interactionMode.character;
        // Listening
        switch (e.key) {
          case "w":
            char.vy -= 1;
            break;
          case "a":
            char.vx -= 1;
            break;
          case "s":
            char.vy += 1;
            break;
          case "d":
            char.vx += 1;
            break;
          case " ": {
            const entity = getEntityAtActionReach(char, gameState);
            if (entity == null) {
              gameState.gameCopy.set("nothing to interact");
              break;
            }
            if (entity instanceof ItemEntity) {
              gameState.gameCopy.set(entity.description);
            }

            break;
          }
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const interactionMode = gameState.interactionMode.peek();

      // Character Control
      if (interactionMode.kind === "controlling") {
        const char = interactionMode.character;
        // Listening
        switch (e.key) {
          case "w":
            char.vy += 1;
            break;
          case "a":
            char.vx += 1;
            break;
          case "s":
            char.vy -= 1;
            break;
          case "d":
            char.vx -= 1;
            break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState, gameState.interactionMode]);
}
