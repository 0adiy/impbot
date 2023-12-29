import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";

const API = "https://onecompiler.com/api/code/exec";

async function evaluateCode(language, code) {
  let lang = language.toLowerCase();
  let extension;
  switch (lang) {
    case "js" || "javascript":
      lang = "javascript";
      extension = "js";
      break;
    case "py" || "python":
      lang = "python";
      extension = "py";
      break;
    case "c#" || "csharp" || "cs":
      lang = "csharp";
      extension = "cs";
      break;
    case "c++" || "cpp":
      lang = "cpp";
      extension = "cpp";
      break;
    case "java":
      lang = "java";
      extension = "java";
      break;
    case "rb" || "ruby":
      lang = "ruby";
      extension = "rb";
      break;
    case "php":
      lang = "php";
      extension = "php";
      break;
    case "go":
      lang = "go";
      extension = "go";
      break;
    default:
      break;
  }

  try {
    const payload = {
      properties: {
        language: lang,
        files: [{ name: `requesting_protocol_execution.${extension}`, content: code }],
      },
    };

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(response.status);

    const data = await response.json();

    let { stdout, stderr } = data;

    if (stderr?.length > 4000) stderr = stderr.slice(0, 4000);
    if (stdout?.length > 4000) stdout = stdout.slice(0, 4000);

    return [stdout, stderr, data.executionTime];
  } catch (error) {
    console.error("Error during API request:", error);
    return null;
  }
}

export default {
  name: "run",
  aliases: ["r"],
  description: "Executes the provided code in the specified programming language.",
  guildOnly: true,
  args: ["language", "code"],
  execute: async (client, message, args) => {
    const language = args.shift();
    const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");

    const data = await evaluateCode(language, code);
    if (data === null) return message.reply("Some API error occured");

    let [stdout, stderr, executionTime] = data;

    const embedColor = stderr ? COLORS.ERROR : COLORS.SUCCESS;

    const embed = new EmbedBuilder()
      .setTitle("Execution Time")
      .setDescription(`${executionTime}ms`)
      .setTimestamp(new Date())
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setColor(embedColor);

    message.reply({
      content: "```" + `${language}\n${stdout || stderr}` + "```",
      embeds: [embed],
    });
  },
};
