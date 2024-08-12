import { HDNodeWallet } from "ethers";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { WizardContext, WizardSession, WizardSessionData } from "telegraf/typings/scenes";

export interface WalletWizardContext extends WizardContext {
  session: WizardSession<WizardSessionData> & { wallet: HDNodeWallet };
  message: Update.New & Update.NonChannel & Message & { text: string };
}
