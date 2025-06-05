import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { makePrintFn, formatValue, createHelpFn, runEvalCode } from "./util.js";
import * as dutil from "../../utils/discordUtils.js";

async function execute(client, message, args) {
  //mutable btw for ref pass
  const resultRef = { value: "" };
  const print = makePrintFn(resultRef);
  const help = createHelpFn(dutil);

  await runEvalCode({
    client,
    message,
    args,
    dutil,
    print,
    help,
    formatValue,
    resultRef,
  });
}

export default {
  name: "eval",
  privacy: CommandPrivacy.PRIVATE,
  category: CommandCategory.DEVELOPER,
  scope: CommandScope.GUILD,
  type: CommandType.MESSAGE,
  aliases: ["e"],
  description:
    "Evaluates code in bot's runtime environment. Special privileges required.",
  guildOnly: false,
  args: ["code"],
  execute,
};
