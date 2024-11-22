import { difficultyLevels, drawLevels, moduleId } from "../../constants";
import NotTheEndActor from "../documents/NotTheEndActor";
import { TraitDto } from "../schemas/commonSchema";

export default class NotTheEndActorRollDialog extends Dialog {
  // ========================================
  // Constructor
  // ========================================
  constructor(
    actor: NotTheEndActor,
    talentId: number,
    options: any = {},
    data: any = {}
  ) {
    // Call the parent constructor

    const _options = {
      ...options,
      ...{
        title: "Roll",
        buttons: {
          rollButton: {
            label: "Roll",
            callback: (html: JQuery) => {
              console.log("Roll");
              this._onRoll(html);
            },
            icon: '<i class="fas fa-dice"></i>',
          },
          cancelButton: {
            label: "Cancel",
            icon: '<i class="fa-solid fa-ban"></i>',
          },
        },
      },
    };

    super(_options, data);

    // Set the actor
    this.actor = actor;
    this.talentId = talentId;
  }

  // ========================================
  // Properties
  // ========================================
  public actor: NotTheEndActor;
  public talentId: number;
  // public roll: CowboyBebopRoll | undefined;

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/dialog/roll.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    let data: any = super.getData();
    data.actor = this.actor;
    data.talent = this.actor.getTalent(this.talentId);
    data.difficultyLevels = difficultyLevels;
    data.moduleId = moduleId;
    data.drawLevels = drawLevels;
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);

    html.find(".nte-dialog-trait").on("click", this._onTrait.bind(this));
  }

  // ========================================
  // Actions
  // ========================================
  // Roll the dice
  private async _onRoll(html: JQuery) {
    // Roll the dice
    const difficulty =
      parseInt(html.find("#nte-dialog-modifier-difficulty").val() as string) ??
      0;
    const nbDraw =
      parseInt(html.find("#nte-dialog-nb-draw").val() as string) ?? 0;
    const traits = html
      .find(".nte-dialog-trait.active")
      .toArray()
      .map(
        (el) =>
          ({
            good: el.dataset.good ?? 0,
            bad: el.dataset.bad ?? 0,
            type: el.dataset.type ?? "",
            id: el.dataset.id ?? 0,
          } as TraitDto)
      );

    await this.actor.rollTalent(
      this.talentId,
      nbDraw,
      isNaN(difficulty) ? 0 : difficulty,
      traits
    );
  }

  private async _onTrait(event: JQuery.ClickEvent) {
    event.preventDefault();
    event.currentTarget.classList.toggle("active");
  }
}
