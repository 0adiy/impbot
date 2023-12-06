const API = "https://onecompiler.com/api/code/exec";

async function evaluateCode(message, language, code) {
  try {
    const payload = {
      properties: {
        language,
        files: [
          { name: `requesting_protocol_execution.${language}`, content: code },
        ],
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
    let codeBody = data.stdout;
    if (data.stderr || data.exception) codeBody = data.stderr;

    const output = `\`\`\`${language}\n${codeBody}\n\n\nexecution: ${data.executionTime}ms\n\`\`\``;
    message.reply(output);
  } catch (error) {
    console.error("Error during API request:", error);
    message.reply("An error occurred during the code evaluation.");
  }
}

export default {
  name: "run",
  aliases: ["r"],
  guildOnly: true,
  usage: "<language> <code>",
  execute: async (client, message, args) => {
    const language = args.shift();
    const code = args.join(" ");
    if (!code) return message.reply("please provide some code to run");

    // FIXME -modify from here pls
    await evaluateCode(message, language, code);
  },
};
