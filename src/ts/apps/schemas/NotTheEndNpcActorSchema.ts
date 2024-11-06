import fields = foundry.data.fields;
import { VitalStat, vitalStatSchema } from "./commonSchema";

export interface NotTheEndNpcActorSystem {
  type: string;
  health: VitalStat;
  note: string;
}

export const notTheEndNpcActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),

  note: new fields.StringField({ initial: "" }),
};

export type NotTheEndNpcActorSchema = typeof notTheEndNpcActorSchema;
