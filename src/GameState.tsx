import { CharacterEntity } from "./CharacterEntity";
import { LinkedArray } from "s-state/LinkedArray";
import { SPrimitive } from "s-state/LinkedState";
import { Entity } from "./engine/Entity";

export type InteractionMode =
  | { kind: "editing" }
  | { kind: "controlling"; character: CharacterEntity };

export class GameState {
  readonly interactionMode: SPrimitive<InteractionMode>;
  readonly entities: LinkedArray<Entity>;
  readonly gameCopy: SPrimitive<string>;

  constructor(interactionMode: InteractionMode, entities: Entity[]) {
    this.interactionMode = SPrimitive.of(interactionMode);
    this.entities = LinkedArray.create(entities);
    this.gameCopy = SPrimitive.of("[Space] interact");
  }
}
