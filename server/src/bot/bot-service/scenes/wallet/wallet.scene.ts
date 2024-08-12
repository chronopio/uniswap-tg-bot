import { Action, Context, Wizard, WizardStep } from "nestjs-telegraf";
import { WalletWizardContext } from "./types";

@Wizard("wallet")
export class WalletWizard {
  @WizardStep(1)
  async generate(@Context() ctx: WalletWizardContext) {
    await ctx.reply("Do you want to import or create a new wallet?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Create", callback_data: `create` }],
          [{ text: "Import", callback_data: `import` }],
        ],
      },
    });

    ctx.wizard.next();
  }

  @Action("create")
  async create(@Context() ctx: WalletWizardContext) {
    await ctx.scene.enter("create-wallet");
  }

  @Action("import")
  async import(@Context() ctx: WalletWizardContext) {
    await ctx.scene.enter("import-wallet");
  }

  @WizardStep(2)
  async handleText(@Context() ctx: WalletWizardContext) {
    await ctx.reply("Please use the buttons to make a selection.");

    ctx.scene.reenter();
  }
}
