import { NotTheEndActorSystem } from "../schemas/NotTheEndActorSchema";

import NotTheEndActorRollDialog from "../dialogs/NotTheEndRollDialog";
import { moduleId } from "../../constants";
import { StatHelpers } from "../helpers/StatHelpers";
import { TraitDto } from "../schemas/commonSchema";

export default class NotTheEndActor extends Actor {
  public constructor(data: any, context: any) {
    super(data, context);
  }

  public getTalentValueById(talentId: number) {
    return this.getTalent(talentId).name;
  }

  public getTalent(id: number) {
    return (this.system as any as NotTheEndActorSystem).ability[id];
  }

  public async rollDialog(talentId: number) {
    const dialog = new NotTheEndActorRollDialog(this, talentId);
    dialog.render(true);
  }

  public async rollTalent(
    talentId: number,
    nbDraw: number,
    difficulty: number,
    traits: TraitDto[]
  ) {
    const talent = this.getTalent(talentId);
    const good =
      traits.reduce((sum: number, trait: TraitDto) => sum + trait.good, 0) +
      traits.length;
    const bad =
      traits.reduce((sum: number, trait: TraitDto) => sum + trait.bad, 0) +
      difficulty;
    const results = await this.drawToken(good, bad, nbDraw);

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this,
        talent: talent,
        difficulty: difficulty,
        results: results,
        good: good - (results.filter((r) => r).length - 1),
        bad: bad - (results.filter((r) => !r).length - 1),
        traits: traits,
        nbDraw: nbDraw,
      }
    );

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async drawToken(
    good: number,
    bad: number,
    nbDraw: number
  ): Promise<boolean[]> {
    const totalToken = good + bad;
    if (totalToken <= 0) {
      return [];
    }

    const roll = await new Roll(`1d${totalToken}`).roll();
    const result = roll.total <= good;

    if (nbDraw <= 1) {
      return [result];
    }
    const nextResult = await this.drawToken(
      good - (result ? 1 : 0),
      bad - (result ? 0 : 1),
      nbDraw - 1
    );
    return nextResult.concat([result]);
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
