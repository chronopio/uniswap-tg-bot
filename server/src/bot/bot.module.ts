import { Module } from "@nestjs/common";
import { BotServiceModule } from "./bot-service/bot-service.module";
import { BotUpdate } from "./bot.update";

@Module({
  providers: [BotUpdate],
  imports: [BotServiceModule],
})
export class BotModule {}
