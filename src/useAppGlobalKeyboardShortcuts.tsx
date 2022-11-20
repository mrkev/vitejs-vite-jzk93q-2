import { useEffect } from "react";
import { getEntityAtActionReach } from "./engine/CharacterEntity";
import { ItemEntity } from "./engine/ItemEntity";
import { GameState } from "./GameState";

/**
 * Handles keyboard interaction
 */
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
              gameState.message.set("nothing to interact");
              break;
            }
            if (entity instanceof ItemEntity) {
              gameState.message.set(entity.description);
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
