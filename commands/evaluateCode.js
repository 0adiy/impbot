async function evaluateCode(message, messageContent) {
  if (!messageContent) return;

  const api = "https://onecompiler.com/api/code/exec";
  const language = messageContent.split(" ")[0];
  const code = messageContent.slice(language.length + 1);
  try {
    const payload = {
      properties: {
        language,
        files: [{ name: "requesting_protocol_execution."+language, content: code }],
      },
    };

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();
    let codeBody = data.stdout;
    if (data.stderr || data.exception) {
      codeBody = data.stderr;
    }
    const output = `\`\`\`${language}\n${codeBody}\n\n\nexecution: ${data.executionTime}ms\n\`\`\``;
    message.reply(output);
  } catch (error) {
    console.error("Error during API request:", error);
    message.reply("An error occurred during the code evaluation.");
  }
}

export { evaluateCode };
