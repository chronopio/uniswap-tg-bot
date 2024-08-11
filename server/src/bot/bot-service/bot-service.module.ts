import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WalletModule } from "src/blockchain/wallet/wallet.module";
import { BotService } from "./bot.service";
import { CreateWalletWizard } from "./scenes/wallet/actions/create.scene";
import { ImportWalletWizard } from "./scenes/wallet/actions/import.scene";
import { WalletWizard } from "./scenes/wallet/wallet.scene";

@Module({
  imports: [ConfigModule, WalletModule],
  providers: [BotService, CreateWalletWizard, ImportWalletWizard, WalletWizard],
  exports: [BotService],
})
export class BotServiceModule {}
