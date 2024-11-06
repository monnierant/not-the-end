import NotTheEndActor from "../documents/NotTheEndActor";
import { VitalStat } from "../schemas/commonSchema";
import { NotTheEndActorSystem } from "../schemas/NotTheEndActorSchema";

export const StatHelpers = {
  calculateActorVital: function (vital: VitalStat) {
    return {
      current: vital.current,
      max: vital.max,
      percent: Math.round((vital.current / vital.max) * 100),
    };
  },

  calculateActorHealth: function (actor: NotTheEndActor) {
    const syst = actor.system as any as NotTheEndActorSystem;

    return StatHelpers.calculateActorVital(syst.health);
  },

  calculateActorMana: function (actor: NotTheEndActor) {
    const syst = actor.system as any as NotTheEndActorSystem;

    return StatHelpers.calculateActorVital(syst.mana);
  },
};
