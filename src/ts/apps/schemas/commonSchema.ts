// The import = is important so that `CaracModBaseCarr` works.
import fields = foundry.data.fields;

export interface Talent {
  name: string;
  description: string;
  value: number;
}

export const talentSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  description: new fields.StringField({ initial: "" }),
  value: new fields.NumberField({ initial: 0 }),
});

export interface VitalStat {
  current: number;
  max: number;
}

export const vitalStatSchema = () => ({
  current: new fields.NumberField({ initial: 0 }),
  max: new fields.NumberField({ initial: 0 }),
});
