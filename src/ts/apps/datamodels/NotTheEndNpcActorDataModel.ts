import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  NotTheEndNpcActorSchema,
  notTheEndNpcActorSchema,
} from "../schemas/NotTheEndNpcActorSchema";
import NotTheEndActor from "../documents/NotTheEndActor";

export default class NotTheEndNpcActorDataModel extends TypeDataModel<
  NotTheEndNpcActorSchema,
  NotTheEndActor
> {
  static override defineSchema() {
    return notTheEndNpcActorSchema;
  }
}
