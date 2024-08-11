import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";

@Injectable()
export class BotService {
  constructor(private readonly configService: ConfigService) {}

  async start(ctx: SceneContext) {
    await ctx.reply("Welcome to SwiftSwap! Swapping made easy");

    await ctx.scene.enter("wallet");
  }

  async faucet(ctx: Context) {
    await ctx.replyWithMarkdownV2(
      `[Here](${this.configService.get<string>("FAUCET_URL")}) you can find some Sepolia ETH for free`,
    );
  }
}
