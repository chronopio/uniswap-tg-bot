import { CallbackQuery, Message, Update } from "telegraf/typings/core/types/typegram";
import { SceneContextScene, WizardContext, WizardSessionData } from "telegraf/typings/scenes";

export interface TokenPriceWizardContext extends WizardContext {
  message: Update.New & Update.NonChannel & Message & { text: string };
  scene: SceneContextScene<WizardContext<WizardSessionData>, WizardSessionData> & {
    state: {
      token?: string;
      currency?: string;
    };
  };
  callbackQuery: CallbackQuery & { data: string };
}
