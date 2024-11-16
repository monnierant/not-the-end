// The import = is important so that `CaracModBaseCarr` works.
import fields = foundry.data.fields;

export interface VitalStat {
  current: number;
  max: number;
}

export const vitalStatSchema = () => ({
  current: new fields.NumberField({ initial: 0 }),
  max: new fields.NumberField({ initial: 0 }),
});

export interface Trait {
  name: string;
}

export const traitSchema = () => ({
  name: new fields.StringField({ initial: "" }),
});
