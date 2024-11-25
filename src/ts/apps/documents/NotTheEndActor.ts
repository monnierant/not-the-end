import { NotTheEndActorSystem } from "../schemas/NotTheEndActorSchema";

import NotTheEndActorRollDialog from "../dialogs/NotTheEndRollDialog";
import { StatHelpers } from "../helpers/StatHelpers";
import { TraitDto } from "../schemas/commonSchema";
import { moduleId, moduleIdCore } from "../../constants";
import NotTheEndActorSheet from "../sheets/NotTheEndActorSheet";

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

  public async rollDialog(sheet: NotTheEndActorSheet) {
    const dialog = new NotTheEndActorRollDialog(this, sheet);
    dialog.render(true);
  }

  public async rollTalent(
    nbDraw: number,
    difficulty: number,
    traits: TraitDto[],
    sheet: NotTheEndActorSheet
  ) {
    const good =
      traits.reduce((sum: number, trait: TraitDto) => sum + trait.good, 0) +
      traits.length;
    const bad =
      traits.reduce((sum: number, trait: TraitDto) => sum + trait.bad, 0) +
      difficulty;
    const results = await this.drawToken(good, bad, nbDraw);

    for (const trait of traits) {
      await this.updateClear(trait.type, trait.id);
    }

    sheet?.render();

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        moduleId: moduleId,
        results: results,
        resultsJson: results.join(","),
        good: good - results.filter((r) => r).length,
        bad: bad - results.filter((r) => !r).length,
        traits: traits,
        nbDraw: nbDraw,
        bag: {
          show:
            game.settings?.get(moduleIdCore, "showbag") ||
            (game as Game).user?.isGM,
          good: good,
          bad: bad,
          confused: false,
        },
      }
    );

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async rollRisk(
    good: number,
    bad: number,
    draw: number,
    results: boolean[]
  ) {
    const newResults = results.concat(
      await this.drawToken(good, bad, 5 - draw)
    );

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/risk.hbs`,
      {
        actor: this,
        moduleId: moduleId,
        results: newResults,
        good: good - results.filter((r) => r).length,
        bad: bad - results.filter((r) => !r).length,
        bag: {
          show:
            game.settings?.get(moduleIdCore, "showbag") ||
            (game as Game).user?.isGM,
          good: good,
          bad: bad,
          confused: false,
        },
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

  public async updateGood(editType: string, editValue: number, value: number) {
    const syst: NotTheEndActorSystem = this
      .system as any as NotTheEndActorSystem;

    switch (editType) {
      case "archetyp":
        await this.update({
          system: {
            archetyp: {
              ...syst.archetyp,
              good: Math.max(syst.archetyp.good + value),
            },
          },
        });
        break;
      case "quality":
        await this.update({
          system: {
            quality: syst.quality.map((q, i) =>
              i === editValue ? { ...q, good: Math.max(0, q.good + value) } : q
            ),
          },
        });
        break;
      case "ability":
        await this.update({
          system: {
            ability: syst.ability.map((q, i) =>
              i === editValue ? { ...q, good: Math.max(0, q.good + value) } : q
            ),
          },
        });
        break;
      default:
        break;
    }
  }

  public async updateBad(editType: string, editValue: number, value: number) {
    const syst: NotTheEndActorSystem = this
      .system as any as NotTheEndActorSystem;

    switch (editType) {
      case "archetyp":
        await this.update({
          system: {
            archetyp: {
              ...syst.archetyp,
              bad: Math.max(syst.archetyp.bad + value),
            },
          },
        });
        break;
      case "quality":
        await this.update({
          system: {
            quality: syst.quality.map((q, i) =>
              i === editValue ? { ...q, bad: Math.max(0, q.bad + value) } : q
            ),
          },
        });
        break;
      case "ability":
        await this.update({
          system: {
            ability: syst.ability.map((q, i) =>
              i === editValue ? { ...q, bad: Math.max(0, q.bad + value) } : q
            ),
          },
        });
        break;
      default:
        break;
    }
  }

  public async updateClear(editType: string, editValue: number) {
    const syst: NotTheEndActorSystem = this
      .system as any as NotTheEndActorSystem;

    switch (editType) {
      case "archetyp":
        await this.update({
          system: { archetyp: { ...syst.archetyp, bad: 0, good: 0 } },
        });
        break;
      case "quality":
        await this.update({
          system: {
            quality: syst.quality.map((q, i) =>
              i === editValue ? { ...q, bad: 0, good: 0 } : q
            ),
          },
        });
        break;
      case "ability":
        await this.update({
          system: {
            ability: syst.ability.map((q, i) =>
              i === editValue ? { ...q, bad: 0, good: 0 } : q
            ),
          },
        });
        break;
      default:
        break;
    }
  }
}
