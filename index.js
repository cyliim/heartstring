const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json")

client.on("ready", () => {
    client.user.setActivity(`ph!help`)
    console.log("------------------------------------");
    console.log(`Logged in`)
    console.log("Bot is up and ready for use")
    console.log(`${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
    console.log("------------------------------------");
    client.on("guildCreate", guild => {

        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
      });
      
      client.on("guildDelete", guild => {
        console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
      });
  });
  client.on("message", async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.content.startsWith(config.prefix + "ping")) {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);

      } if (message.content.startsWith(config.prefix + "help")) {
    message.channel.send("help");
  }});
  client.login(config.token);