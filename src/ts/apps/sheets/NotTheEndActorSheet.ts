import { moduleId, difficultyLevels } from "../../constants";
import NotTheEndActor from "../documents/NotTheEndActor";
import { StatHelpers } from "../helpers/StatHelpers";

export default class NotTheEndActorSheet extends ActorSheet {
  constructor(object: any, options = {}) {
    super(object, { ...options, width: 610, height: 750 });
    console.log("this.actor.type", this.actor.type);
  }

  private editType: string = "";
  private editValue: number = 0;

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.system.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    const data: any = super.getData();
    data.moduleId = moduleId;

    data.difficultyLevels = difficultyLevels;
    if (this.actor.system.type === "character") {
      data.health = StatHelpers.calculateActorHealth(
        this.actor as NotTheEndActor
      );

      data.edit = {
        type: this.editType,
        value: this.editValue,
        isEnable: this.editType !== "",
      };
    }
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html
      .find(".nte-actor-roll-button")
      .on("click", this._onRollDice.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".nte-health-update")
      .on("click", this._onUpdateHealth.bind(this));

    if (this.actor.system.type === "character") {
      this.activateListenersPC(html);
    }
  }

  private activateListenersPC(html: JQuery) {
    html.find(".nte-mana-update").on("click", this._onUpdateMana.bind(this));
    html.find(".nte-actor-edit").on("click", this._onChooseEdit.bind(this));
    html
      .find(".hexagon-bottom-value")
      .on("click", this._onSelectHexagon.bind(this));
  }

  // Event Handlers
  private async _onRollDice(event: JQuery.ClickEvent) {
    event.preventDefault();
    await (this.actor as NotTheEndActor).rollDialog(this);
  }

  private async _onUpdateHealth(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as NotTheEndActor).updateHealth(value);
    this.render();
  }

  private async _onUpdateMana(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as NotTheEndActor).updateMana(value);
    this.render();
  }

  private async _onChooseEdit(event: JQuery.ClickEvent) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type ?? "";
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;

    switch (type) {
      case "good":
        await (this.actor as NotTheEndActor).updateGood(
          this.editType,
          this.editValue,
          value
        );
        break;
      case "bad":
        await (this.actor as NotTheEndActor).updateBad(
          this.editType,
          this.editValue,
          value
        );
        break;
      case "clear":
        await (this.actor as NotTheEndActor).updateClear(
          this.editType,
          this.editValue
        );
        break;
      case "quit":
        this.editValue = 0;
        this.editType = "";
        break;
    }
    this.render();
  }

  private async _onSelectHexagon(event: JQuery.ClickEvent) {
    event.preventDefault();
    this.editValue = parseInt(event.currentTarget.dataset.value) ?? 0;
    this.editType = event.currentTarget.dataset.type ?? "";

    this.render();
  }
}
