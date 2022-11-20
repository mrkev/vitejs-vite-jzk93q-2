import { CharacterEntity } from "./engine/CharacterEntity";
import { LinkedArray } from "s-state/LinkedArray";
import { SPrimitive } from "s-state/LinkedState";
import { Entity } from "./engine/Entity";

export type InteractionMode =
  | { kind: "editing" }
  | { kind: "controlling"; character: CharacterEntity };

/** Root object for the state of the game */
export class GameState {
  readonly interactionMode: SPrimitive<InteractionMode>;
  readonly entities: LinkedArray<Entity>;
  readonly message: SPrimitive<string>;

  constructor(interactionMode: InteractionMode, entities: Entity[]) {
    this.interactionMode = SPrimitive.of(interactionMode);
    this.entities = LinkedArray.create(entities);
    this.message = SPrimitive.of("[Space] interact");
  }
}
