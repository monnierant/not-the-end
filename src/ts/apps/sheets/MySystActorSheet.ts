import { moduleId, difficultyLevels } from "../../constants";
import MySystActor from "../documents/MySystActor";
import { StatHelpers } from "../helpers/StatHelpers";

export default class MySystItemSheet extends ActorSheet {
  constructor(object: any, options = {}) {
    super(object, { ...options, width: 610, height: 750 });
    console.log("this.actor.type", this.actor.type);
  }

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
      data.health = StatHelpers.calculateActorHealth(this.actor as MySystActor);
    }
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html.find(".mysyst-talent-roll").on("click", this._onRollDice.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".mysyst-health-update")
      .on("click", this._onUpdateHealth.bind(this));

    if (this.actor.system.type === "character") {
      this.activateListenersPC(html);
    }
  }

  private activateListenersPC(html: JQuery) {
    html.find(".mysyst-mana-update").on("click", this._onUpdateMana.bind(this));
  }

  // Event Handlers
  private async _onRollDice(event: JQuery.ClickEvent) {
    event.preventDefault();
    const talentId = event.currentTarget.dataset.talent;
    await (this.actor as MySystActor).rollDialog(talentId);
  }

  private async _onUpdateHealth(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as MySystActor).updateHealth(value);
    this.render();
  }

  private async _onUpdateMana(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as MySystActor).updateMana(value);
    this.render();
  }
}
