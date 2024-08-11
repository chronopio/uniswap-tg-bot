import { Context, Wizard, WizardStep } from "nestjs-telegraf";
import { WalletService } from "src/blockchain/wallet/wallet.service";
import { replyMarkdownWallet } from "src/bot/bot-service/utils/reply-markdown-wallet";
import { WalletWizardContext } from "../types/wallet-wizard-context";

@Wizard("create-wallet")
export class CreateWalletWizard {
  constructor(private readonly walletService: WalletService) {}

  @WizardStep(1)
  async createWallet(@Context() ctx: WalletWizardContext) {
    ctx.session.wallet = this.walletService.create();
    await replyMarkdownWallet(ctx, ctx.session.wallet);

    ctx.scene.leave();
  }
}
