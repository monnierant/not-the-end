import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  MySystActorSchema,
  mySystActorSchema,
} from "../schemas/MySystActorSchema";
import MySystActor from "../documents/MySystActor";

export default class MySystActorDataModel extends TypeDataModel<
  MySystActorSchema,
  MySystActor
> {
  static override defineSchema() {
    return mySystActorSchema;
  }
}
