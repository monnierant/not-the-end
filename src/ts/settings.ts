import { moduleIdCore } from "./constants";

export async function setupSettings(): Promise<any> {
  await game.settings?.register(moduleIdCore, "showbag", {
    name: "NTE.Settings.showbag", // can also be an i18n key
    hint: "", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: Boolean, // Number, Boolean, String, or even a custom class or DataModel
    default: false,
    requiresReload: false, // when changing the setting, prompt the user to reload
  });
}
