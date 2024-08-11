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

  async text(ctx: Context) {
    await ctx.reply("I'm not sure what you mean, sorry!");
  }

  async sticker(ctx: Context) {
    await ctx.replyWithSticker(
      "CAACAgQAAxkBAAIC42a5EklHFhUBVbarURY6uUk1F4OWAAL7AQACRWLRAcCHiNxd99qzNQQ",
    );
  }

  async help(ctx: Context) {
    ctx.replyWithMarkdownV2(`
      This is the list of available commands:
      
      • *Link to a faucet:* /faucet
      • *List of commands:* /help 
  `);
  }
}
