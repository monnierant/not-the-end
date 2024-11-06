import MySystActor from "../documents/MySystActor";
import { VitalStat } from "../schemas/commonSchema";
import { MySystActorSystem } from "../schemas/MySystActorSchema";

export const StatHelpers = {
  calculateActorVital: function (vital: VitalStat) {
    return {
      current: vital.current,
      max: vital.max,
      percent: Math.round((vital.current / vital.max) * 100),
    };
  },

  calculateActorHealth: function (actor: MySystActor) {
    const syst = actor.system as any as MySystActorSystem;

    return StatHelpers.calculateActorVital(syst.health);
  },

  calculateActorMana: function (actor: MySystActor) {
    const syst = actor.system as any as MySystActorSystem;

    return StatHelpers.calculateActorVital(syst.mana);
  },
};
