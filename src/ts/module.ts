// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

import NotTheEndActorSheet from "./apps/sheets/NotTheEndActorSheet";
import { setupSettings } from "./settings";

import { moduleId } from "./constants";
import { range } from "./handlebarsHelpers/range";
import { concat } from "./handlebarsHelpers/concat";
import { ternary } from "./handlebarsHelpers/ternary";
import { partial } from "./handlebarsHelpers/partial";
import { notTheEndActorSchema } from "./apps/schemas/NotTheEndActorSchema";
import NotTheEndActorDataModel from "./apps/datamodels/NotTheEndActorDataModel";
import NotTheEndNpcRoleActorDataModel from "./apps/datamodels/NotTheEndNpcActorDataModel";
import NotTheEndActor from "./apps/documents/NotTheEndActor";
import { mod } from "./handlebarsHelpers/mod";
import NteRollsRegister from "./apps/rolls/NteRollsRegister";
import { add } from "./handlebarsHelpers/add";

declare global {
  interface DocumentClassConfig {
    Actor: typeof NotTheEndActor;
  }

  interface SettingConfig {
    "nte.showbag": boolean;
  }

    interface DataModelConfig {
    Actor: {
      character: typeof NotTheEndActorDataModel;
      npc: typeof NotTheEndNpcRoleActorDataModel;
    };
  }
}

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/actor/header.hbs`,
    `systems/${moduleId}/templates/partials/actor/traits.hbs`,
    `systems/${moduleId}/templates/partials/actor/bag.hbs`,
    `systems/${moduleId}/templates/partials/hexagon.hbs`,
    `systems/${moduleId}/templates/partials/piles.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  console.log("notTheEndActorSchema", notTheEndActorSchema);

  Handlebars.registerHelper("partial", partial);
  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("concat", concat);
  Handlebars.registerHelper("ternary", ternary);
  Handlebars.registerHelper("mod", mod);
  Handlebars.registerHelper("add", add);

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  CONFIG.Actor.dataModels.character = NotTheEndActorDataModel;
  CONFIG.Actor.dataModels.npc = NotTheEndNpcRoleActorDataModel;
  CONFIG.Actor.documentClass = NotTheEndActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, NotTheEndActorSheet, { makeDefault: true });

  preloadTemplates();
  setupSettings();
});

Hooks.on(
  "renderChatMessage",
  (app, html, data): void => {
    if (app === undefined) {
      console.log("app is undefined");
    }

    if (data === undefined) {
      console.log("data is undefined");
    }

    if (html === undefined) {
      console.log("html is undefined");
    }

    NteRollsRegister.registerTriggers(html);
  }
);
