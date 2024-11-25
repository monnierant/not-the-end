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
  good: number;
  bad: number;
}

export interface TraitDto {
  id: number;
  type: string;
  good: number;
  bad: number;
}

export const traitSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  good: new fields.NumberField({ initial: 0 }),
  bad: new fields.NumberField({ initial: 0 }),
});
