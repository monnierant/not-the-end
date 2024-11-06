// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

import MySystActorSheet from "./apps/sheets/MySystActorSheet";

import { moduleId } from "./constants";
import { range } from "./handlebarsHelpers/range";
import { concat } from "./handlebarsHelpers/concat";
import { ternary } from "./handlebarsHelpers/ternary";
import { partial } from "./handlebarsHelpers/partial";
import { mySystActorSchema } from "./apps/schemas/MySystActorSchema";
import MySystActorDataModel from "./apps/datamodels/MySystActorDataModel";
import MyNpcRoleActorDataModel from "./apps/datamodels/MySystNpcActorDataModel";
import MySystActor from "./apps/documents/MySystActor";

declare global {
  interface DocumentClassConfig {
    Actor: MySystActor;
  }

  // interface DataModelConfig {
  //   Actor: {
  //     someActorSubtype: SomeActorSubtypeDataModel;
  //     anotherActorSubtype: AnotherActorSubtypeDataModel;
  //   };
  // }
}

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/actor/header.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  console.log("mySystActorSchema", mySystActorSchema);

  Handlebars.registerHelper("partial", partial);
  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("concat", concat);
  Handlebars.registerHelper("ternary", ternary);

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  CONFIG.Actor.dataModels.character = MySystActorDataModel;
  CONFIG.Actor.dataModels.npc = MyNpcRoleActorDataModel;
  CONFIG.Actor.documentClass = MySystActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, MySystActorSheet, { makeDefault: true });

  preloadTemplates();
});
