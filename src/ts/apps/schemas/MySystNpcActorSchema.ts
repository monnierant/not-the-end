import fields = foundry.data.fields;
import { VitalStat, vitalStatSchema } from "./commonSchema";

export interface MySystNpcActorSystem {
  type: string;
  health: VitalStat;
  note: string;
}

export const mySystNpcActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),

  note: new fields.StringField({ initial: "" }),
};

export type MySystNpcActorSchema = typeof mySystNpcActorSchema;
