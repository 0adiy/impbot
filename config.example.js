const config = {
  // Set your token here
  TOKEN: "YOUR_TOKEN_HERE",
  // Set your client ID here
  CLIENT_ID: "YOUR_CLIENT_ID_HERE",
  // Set your prefix for the bot (only superusers can interact with prefixed messages)
  prefix: "^",

  // Set your dev server where dev slash commands will be available
  devServer: "YOUR_DEV_SERVER_ID", //eg "1060639542249521203"

  // Set your super users as key value (name, discord user id) pairs here who can use dangerous message commands like eval
  // Name doesn't matter it's only there if needed for reference later
  superUsers: {
    SU_Bisskut: "757478713402064996",
    SU_Shazam: "829417226040901653",
  },

  // MongoDB Settings if needed later do `yarn add mongoose`
  MONGODB_URI: "<CONNECTION_STRING>/music", // Music is name of database here
  MONGO_USER: "YOUR_MONGO_USER_ID",
  MONGO_PASS: "YOUR_MONGO_PASSWORD",
};

// No need to change, this is just for accessibility
config.superUsersArray = Object.values(config.superUsers);

export default config;
