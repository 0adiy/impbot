
import config from "../../config.js";

export async function evaluateCode(language, code) {
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
        files: [{ name: `requesting_execution.${extension}`, content: code }],
      },
    };

    const response = await fetch(config.apis.one_compiler_api.endpoint, {
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
