import { Module } from '@nestjs/common';

import { ProviderModule } from '../provider/provider.module';
import { WalletService } from './wallet.service';

@Module({
  imports: [ProviderModule],
  providers: [WalletService],
})
export class WalletModule {}
