import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  MySystNpcActorSchema,
  mySystNpcActorSchema,
} from "../schemas/MySystNpcActorSchema";
import MySystActor from "../documents/MySystActor";

export default class MySystNpcActorDataModel extends TypeDataModel<
  MySystNpcActorSchema,
  MySystActor
> {
  static override defineSchema() {
    return mySystNpcActorSchema;
  }
}
