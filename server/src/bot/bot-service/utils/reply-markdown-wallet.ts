import { HDNodeWallet } from "ethers";
import { Context } from "telegraf";

export const replyMarkdownWallet = (ctx: Context, wallet: HDNodeWallet) =>
  ctx.replyWithMarkdownV2(`
        You can find your wallet details below, we only store this data in the current session, so make sure to save it somewhere safe
        
        • *Address:* ${wallet.address}
        • *Private Key:* ${wallet.privateKey}  
        • *Mnemonic:* ${wallet.mnemonic.phrase}  
    `);
