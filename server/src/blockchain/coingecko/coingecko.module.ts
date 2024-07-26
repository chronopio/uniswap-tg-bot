import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CoingeckoService } from "./coingecko.service";

@Module({
  imports: [ConfigModule],
  providers: [CoingeckoService],
})
export class CoingeckoModule {}
