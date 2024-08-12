import { HDNodeWallet } from "ethers";
import { SceneContext, SceneSession, SceneSessionData } from "telegraf/typings/scenes";

export interface SwiftSwapContext extends SceneContext {
  session: SceneSession<SceneSessionData> & { wallet: HDNodeWallet };
}
