import { Mnemonic } from "ethers";
import { Context, Wizard, WizardStep } from "nestjs-telegraf";
import { WalletService } from "src/blockchain/wallet/wallet.service";
import { replyMarkdownWallet } from "src/bot/bot-service/utils/reply-markdown-wallet";
import { WalletWizardContext } from "../types/wallet-wizard-context";

@Wizard("import-wallet")
export class ImportWalletWizard {
  constructor(private readonly walletService: WalletService) {}

  @WizardStep(1)
  async inputPhrase(@Context() ctx: WalletWizardContext) {
    await ctx.reply("Enter the wallet mnemonic phrase", {
      reply_markup: { force_reply: true },
    });

    ctx.wizard.next();
  }

  @WizardStep(2)
  async importWallet(@Context() ctx: WalletWizardContext) {
    const { text } = ctx.message;

    if (!Mnemonic.isValidMnemonic(text)) {
      await ctx.reply("Invalid mnemonic phrase");

      ctx.scene.reenter();
    } else {
      ctx.session.wallet = this.walletService.import(text);
      await replyMarkdownWallet(ctx, ctx.session.wallet);

      ctx.scene.leave();
    }
  }
}
