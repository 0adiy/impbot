## 📄 Bot Configuration

This file explains all the important settings for your bot, including authentication tokens, server IDs, database credentials, and API keys.

### 📁 File: `config.js`

The file name must be written in lowercase letters.

### 🔑 Authentication

| Key         | Description                  |
| :---------- | :--------------------------- |
| `TOKEN`     | Your Discord Bot Token       |
| `CLIENT_ID` | Your Discord Bot’s Client ID |

### ⚙️ Bot Settings

| Key          | Description                                             |
| :----------- | :------------------------------------------------------ |
| `prefix`     | Prefix for bot commands (e.g., `$`)                     |
| `devServer`  | ID of the bot's home (development) server               |
| `logChannel` | ID of the channel where logs should be sent             |
| `DMLogging`  | Whether to forward DMs to the `logChannel` (true/false) |

### 🛡️ Super Users

| Key    | Description          |
| :----- | :------------------- |
| `name` | ID of the super user |

- `superUsersArray` is automatically generated from the super user IDs.

### 🏠 Guilds (Servers)

| Key    | Description |
| :----- | :---------- |
| `name` | Guild ID    |

- `guilds` is used to specify certain servers

### 🛢️ Database

| Key           | Description            |
| :------------ | :--------------------- |
| `MONGODB_URI` | MongoDB connection URI |
| `MONGO_USER`  | MongoDB Username       |
| `MONGO_PASS`  | MongoDB Password       |

### 🌐 API Integrations

| API                | Endpoint                                           | Key/Token                                       |
| :----------------- | :------------------------------------------------- | :---------------------------------------------- |
| **Pexels**         | `https://api.pexels.com/v1/search`                 | `PEXELS_API_KEY`                                |
| **Pixabay**        | `https://pixabay.com/api/`                         | `PIXABAY_API_KEY`                               |
| **Text to Colour** | `https://singlecolorimage.com/get/`                | (no key needed)                                 |
| **Dictionary API** | `https://api.dictionaryapi.dev/api/v2/entries/en/` | (no key needed)                                 |
| **Lyrics API**     | `https://www.stands4.com/services/v2/lyrics.php`   | `YOUR_LYRICS_USER_ID` + `YOUR_LYRICS_API_TOKEN` |
| **Google AI API**  | `MODEL_NAME`                                       | `GOOGLE_AI_API_KEY`                             |

### Sample File

```javascript
//config.js
const config = {
  TOKEN: "YOUR_DISCORD_BOT_TOKEN",
  CLIENT_ID: "YOUR_CLIENT_ID",

  prefix: "$",

  devServer: "DEV_SERVER_ID",

  logChannel: "LOG_CHANNEL_ID",

  DMLogging: true,

  guilds: {
    example_name: "GUILD_ID",
  },

  superUsers: {
    example_name: "USER_ID",
  },

  MONGODB_URI: "YOUR_MONGODB_URI",
  MONGO_USER: "YOUR_MONGO_USERNAME",
  MONGO_PASS: "YOUR_MONGO_PASSWORD",

  apis: {
    pexel_photo_api: {
      endpoint: "https://api.pexels.com/v1/search",
      key: "PEXELS_API_KEY",
    },
    pixabay_photo_api: {
      endpoint: "https://pixabay.com/api/",
      key: "PIXABAY_API_KEY",
    },
    colour_api: {
      endpoint: "https://singlecolorimage.com/get/",
    },
    dictionary_api: {
      endpoint: "https://api.dictionaryapi.dev/api/v2/entries/en/",
    },
    lyrics_api: {
      endpoint: "https://www.stands4.com/services/v2/lyrics.php",
      user_id: "YOUR_LYRICS_USER_ID",
      token: "YOUR_LYRICS_API_TOKEN",
      format: "json",
    },
    google_ai_api: {
      key: "GOOGLE_AI_API_KEY",
      model: "gemini-1.5-flash",
    },
  },
};

config.superUsersArray = Object.values(config.superUsers);

export default config;
```
