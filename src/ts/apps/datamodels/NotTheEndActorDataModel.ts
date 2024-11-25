import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  NotTheEndActorSchema,
  notTheEndActorSchema,
} from "../schemas/NotTheEndActorSchema";
import NotTheEndActor from "../documents/NotTheEndActor";

export default class NotTheEndActorDataModel extends TypeDataModel<
  NotTheEndActorSchema,
  NotTheEndActor
> {
  static override defineSchema() {
    return notTheEndActorSchema;
  }
}
