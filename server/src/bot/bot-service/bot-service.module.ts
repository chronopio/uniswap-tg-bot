import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CoingeckoModule } from "src/blockchain/coingecko/coingecko.module";
import { WalletModule } from "src/blockchain/wallet/wallet.module";
import { BotService } from "./bot.service";
import { TokenPriceWizard } from "./scenes/token-price";
import { WalletWizard, CreateWalletWizard, ImportWalletWizard } from "./scenes/wallet";

@Module({
  imports: [ConfigModule, WalletModule, CoingeckoModule],
  providers: [BotService, CreateWalletWizard, ImportWalletWizard, TokenPriceWizard, WalletWizard],
  exports: [BotService],
})
export class BotServiceModule {}
