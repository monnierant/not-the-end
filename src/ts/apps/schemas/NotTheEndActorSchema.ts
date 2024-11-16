import { defaultLenght } from "../../constants";
import fields = foundry.data.fields;
import { Trait, traitSchema, VitalStat, vitalStatSchema } from "./commonSchema";

export interface NotTheEndActorSystem {
  type: string;
  health: VitalStat;
  mana: VitalStat;
  archetyp: Trait;
  quality: Trait[];
  ability: Trait[];
}

export const notTheEndActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),
  mana: new fields.SchemaField(vitalStatSchema()),

  archetyp: new fields.SchemaField(traitSchema()),

  quality: new fields.ArrayField(new fields.SchemaField(traitSchema()), {
    initial: Array(defaultLenght.talent).fill({
      name: "",
      description: "",
    }),
  }),

  ability: new fields.ArrayField(new fields.SchemaField(traitSchema()), {
    initial: Array(defaultLenght.talent).fill({
      name: "",
      description: "",
    }),
  }),
};

export type NotTheEndActorSchema = typeof notTheEndActorSchema;
