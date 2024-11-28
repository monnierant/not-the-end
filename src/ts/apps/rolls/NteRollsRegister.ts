export default class NteRollsRegister {
  public static async registerTriggers(html: JQuery<HTMLElement>) {
    console.log(html);
    html.on("click", ".nte-risk", this._onRollRisk.bind(this));
  }

  public static async _onRollRisk(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.find((a) => a.id == actorId);

    const good = parseInt(event.currentTarget.dataset.good) ?? 0;
    const bad = parseInt(event.currentTarget.dataset.bad) ?? 0;
    const draw = parseInt(event.currentTarget.dataset.draw) ?? 0;
    const confused = event.currentTarget.dataset.confused === "true";
    const results = (event.currentTarget.dataset.results ?? "")
      .split(",")
      .map((r: string) => r === "true");

    if (actor) {
      await actor.rollRisk(good, bad, draw, results, confused);
    }
  }
}
