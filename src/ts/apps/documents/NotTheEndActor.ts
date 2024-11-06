import { NotTheEndActorSystem } from "../schemas/NotTheEndActorSchema";

import NotTheEndActorRollDialog from "../dialogs/NotTheEndRollDialog";
import { moduleId } from "../../constants";
import { StatHelpers } from "../helpers/StatHelpers";

export default class NotTheEndActor extends Actor {
  public constructor(data: any, context: any) {
    super(data, context);
  }

  public getTalentValueById(talentId: number) {
    return this.getTalent(talentId).value;
  }

  public getTalent(id: number) {
    return (this.system as any as NotTheEndActorSystem).talents[id];
  }

  public async rollDialog(talentId: number) {
    const dialog = new NotTheEndActorRollDialog(this, talentId);
    dialog.render(true);
  }

  public async rollTalent(talentId: number, difficulty: number) {
    const talent = this.getTalent(talentId);
    const value = talent.value + difficulty;
    const roll = await new Roll(`1d100`).roll();
    const success = roll.total <= value;
    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this,
        talent: talent,
        difficulty: difficulty,
        result: roll,
        limit: value,
        success: success,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async updateHealth(health: number) {
    // const syst = this.system as any as NotTheEndActorSystem;
    const syst: NotTheEndActorSystem = this
      .system as any as NotTheEndActorSystem;

    const healthValue = Math.clamp(
      syst.health.current + health,
      0,
      StatHelpers.calculateActorHealth(this).max
    );

    await this.update({
      system: { health: { current: healthValue } },
    });
  }

  public async updateMana(mana: number) {
    // const syst = this.system as any as NotTheEndActorSystem;
    const syst: NotTheEndActorSystem = this
      .system as any as NotTheEndActorSystem;

    const manaValue = Math.clamp(
      syst.mana.current + mana,
      0,
      StatHelpers.calculateActorMana(this).max
    );

    await this.update({
      system: { mana: { current: manaValue } },
    });
  }
}
