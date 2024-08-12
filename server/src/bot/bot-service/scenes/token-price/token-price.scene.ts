import { toBigInt } from "ethers";
import { Action, Wizard, Context, WizardStep } from "nestjs-telegraf";
import { CoingeckoService } from "src/blockchain/coingecko/coingecko.service";
import { TokenPriceWizardContext } from "./types";

@Wizard("token-price")
export class TokenPriceWizard {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @WizardStep(1)
  async selectToken(@Context() ctx: TokenPriceWizardContext) {
    const tokens = this.coingeckoService.getTokens();

    await ctx.reply("First select the token", {
      reply_markup: {
        inline_keyboard: tokens.map(token => [
          {
            text: token,
            callback_data: `token:${token}`,
          },
        ]),
      },
    });
  }

  @Action(/token:.+/)
  async storeToken(@Context() ctx: TokenPriceWizardContext) {
    const token = ctx.callbackQuery.data.split(":")[1];
    ctx.answerCbQuery(`Token ${token} selected`);
    ctx.scene.state = { token };

    ctx.wizard.next();
    if (typeof ctx.wizard.step === "function") {
      ctx.wizard.step(ctx, async () => {});
    }
  }

  @WizardStep(2)
  async selectCurrency(@Context() ctx: TokenPriceWizardContext) {
    const currencies = this.coingeckoService.getCurrencies();

    await ctx.reply("Now select the currency", {
      reply_markup: {
        inline_keyboard: currencies.map(currency => [
          {
            text: currency,
            callback_data: `currency:${currency}`,
          },
        ]),
      },
    });
  }

  @Action(/currency:.+/)
  async storeCurrency(@Context() ctx: TokenPriceWizardContext) {
    const currency = ctx.callbackQuery.data.split(":")[1];
    ctx.answerCbQuery(`Currency ${currency} selected`);
    ctx.scene.state = { ...ctx.scene.state, currency };

    ctx.wizard.next();
    if (typeof ctx.wizard.step === "function") {
      ctx.wizard.step(ctx, async () => {});
    }
  }

  @WizardStep(3)
  async getAmount(@Context() ctx: TokenPriceWizardContext) {
    await ctx.reply("Enter the amount of tokens");

    ctx.wizard.next();
  }

  @WizardStep(4)
  async calculatePrice(@Context() ctx: TokenPriceWizardContext) {
    const { text: amount } = ctx.message;

    if (Number.isNaN(amount)) {
      await ctx.reply("Only numbers are allowed");

      ctx.wizard.back();
      if (typeof ctx.wizard.step === "function") {
        ctx.wizard.step(ctx, async () => {});
      }
    }

    const { token, currency } = ctx.scene.state;
    const price = await this.coingeckoService.getPairPrice(token, currency);

    const total = toBigInt(price) * toBigInt(amount);

    await ctx.reply(`Price of ${amount} ${token} is ${total} ${currency}`);
    ctx.scene.leave();
  }
}
