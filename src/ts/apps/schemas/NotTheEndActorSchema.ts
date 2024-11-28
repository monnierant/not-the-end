import { defaultLenght } from "../../constants";
import fields = foundry.data.fields;
import { Trait, traitSchema, VitalStat, vitalStatSchema } from "./commonSchema";

export interface NotTheEndActorSystem {
  type: string;
  health: VitalStat;
  mana: VitalStat;
  archetyp: Trait;
  confusion: Trait;
  adrenaline: Trait;
  quality: Trait[];
  ability: Trait[];
  missfortune: Trait[];
  bag1: string;
  bag2: string;
}

export const notTheEndActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),
  mana: new fields.SchemaField(vitalStatSchema()),

  archetyp: new fields.SchemaField(traitSchema()),
  confusion: new fields.SchemaField(traitSchema()),
  adrenaline: new fields.SchemaField(traitSchema()),

  quality: new fields.ArrayField(new fields.SchemaField(traitSchema()), {
    initial: Array(defaultLenght.quality).fill({
      name: "",
      good: 0,
      bad: 0,
    }),
  }),

  ability: new fields.ArrayField(new fields.SchemaField(traitSchema()), {
    initial: Array(defaultLenght.ability).fill({
      name: "",
      good: 0,
      bad: 0,
    }),
  }),

  missfortune: new fields.ArrayField(new fields.SchemaField(traitSchema()), {
    initial: Array(defaultLenght.missfortune).fill({
      name: "",
      good: 0,
      bad: 0,
    }),
  }),

  bag1: new fields.StringField({ initial: "" }),
  bag2: new fields.StringField({ initial: "" }),
};

export type NotTheEndActorSchema = typeof notTheEndActorSchema;
