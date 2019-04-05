const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json")
//8ball list
var ball =["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", " Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
client.on("ready", () => {
    client.user.setActivity(`ph!help`)
      });
  client.on("message", async message => {
    const date = message.author.createdAt;
    const newDate = date.toLocaleDateString();
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

//ping

   if (message.content.startsWith(config.prefix + "ping")) {
        const m = await message.channel.send("Pinging...");
        m.edit({embed: {
          color: 0x333333,
          description:`Latency: **${m.createdTimestamp - message.createdTimestamp}**ms. API Latency: **${Math.round(client.ping)}**ms`
        
        }})
//8ball 
      } if (message.content.startsWith(config.prefix + `8ball`)) {
  var repl3 = ball[Math.floor(Math.random()*ball.length)];
message.channel.send(repl3)
//say

       } if (message.content.startsWith(config.prefix + "say")) {
        if(!message.member.hasPermission("MANAGE_MESSAGES"))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (!args.length) {
        return message.channel.send(`You need to provide something to say`);
        }
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{}); 
      message.channel.send(sayMessage);

//uptime

    } if (message.content.startsWith(config.prefix + "uptime")) {
      let totalSeconds = (client.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let uptime = `**${days}** days, **${hours}** hours and **${minutes}** minutes`;
      message.channel.send({embed: {
        color: 0x333333,
        description: uptime
      }});

//kick

    } if (message.content.startsWith(config.prefix + "kick")) {
        if(!message.member.hasPermission("KICK_MEMBERS"))
          return message.reply("Sorry, you don't have permissions to use this!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
          return message.reply("Please mention a valid member of this server");
        if(!member.kickable) 
          return message.reply("I cannot kick this user!");
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        await member.kick(reason)
          .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    

//ban

    } if (message.content.startsWith(config.prefix + "ban")) {
        if(!message.member.hasPermission("BAN_MEMBERS"))
          return message.reply("Sorry, you don't have permissions to use this!");
        
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Please mention a valid member of this server");
        if(!member.bannable) 
          return message.reply("I cannot ban this user!");
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        
        await member.ban(reason)
          .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);

//roll
    }
     if (message.content.startsWith(config.prefix + "roll")) {
      if (!args.length) {
        return message.channel.send(`You need to provide a number`);
      }
      const diceRoll = args.join(" ");
      message.channel.send(`You rolled ${Math.floor(Math.random() * diceRoll) + 1}`);
     })
      //purge
if (message.content.startsWith(config.prefix + "purge")) {
  const deleteCount = parseInt(args[0], 10);
  if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}


//avatar
      
      } if (message.content.startsWith(config.prefix + "avatar")) {
      if (!message.mentions.users.size) {
        return message.channel.send(`**Your avatar:** ${message.author.displayAvatarURL}`);
        }
        const avatarList = message.mentions.users.map(user => {
        return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
        });
        message.channel.send(avatarList);

//eval
      
    } if (message.content.startsWith(config.prefix + "eval")) {
      if(message.author.id !== config.ownerID) return;
      function clean(text) {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
      }
      try {
        const code = args.join(" ");
        let evaled = eval(code);
   
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
   
        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
      }
    

//serverinfo

    } if (message.content.startsWith(config.prefix + "serverinfo")) {
      function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    let region = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    const embed = new Discord.RichEmbed()
    .setColor(0x333333)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("Name", message.guild.name, true)
        .addField("ID", message.guild.id, true)
        .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
        .addField("Region", region[message.guild.region], true)
        .addField("Total | Humans | Bots", `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true)
        .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
        .addField("Channels", message.guild.channels.size, true)
        .addField("Roles", message.guild.roles.size, true)
        .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
        .setThumbnail(message.guild.iconURL)
    message.channel.send({embed});

if (message.channel.send(config.prefix + "si")) {
  function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};
let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
let region = {
    "brazil": ":flag_br: Brazil",
    "eu-central": ":flag_eu: Central Europe",
    "singapore": ":flag_sg: Singapore",
    "us-central": ":flag_us: U.S. Central",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: U.S. East",
    "us-south": ":flag_us: U.S. South",
    "us-west": ":flag_us: U.S. West",
    "eu-west": ":flag_eu: Western Europe",
    "vip-us-east": ":flag_us: VIP U.S. East",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Russia",
    "southafrica": ":flag_za:  South Africa"
};
const embed = new Discord.RichEmbed()
.setColor(0x333333)
    .setAuthor(message.guild.name, message.guild.iconURL)
    .addField("Name", message.guild.name, true)
    .addField("ID", message.guild.id, true)
    .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
    .addField("Region", region[message.guild.region], true)
    .addField("Total | Humans | Bots", `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true)
    .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
    .addField("Channels", message.guild.channels.size, true)
    .addField("Roles", message.guild.roles.size, true)
    .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
    .setThumbnail(message.guild.iconURL)
message.channel.send({embed});
}

//botinfo

    } if (message.content.startsWith(config.prefix + "bi")) {
      message.channel.send({embed: {
        color: 0x333333,
        author: {
          name: "Bot Info",
          icon_url: client.user.avatarURL
        },
        fields: [{
            name: "Users",
            value: `${client.users.size}`
          },
          {
            name: "Servers",
            value: `${client.guilds.size}`
          },
          {
            name: "Version",
            value: "Alpha InDev"
          },
          {
            name: "discord.js Version",
            value: Discord.version  
          },
        ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Created by Brickman#4669"
          }}});
    } if (message.content.startsWith(config.prefix + "botinfo")) {
      message.channel.send({embed: {
        color: 0x333333,
        author: {
          name: "Bot Info",
          icon_url: client.user.avatarURL
        },
        title: "Bot info",
        description: "Info one the Heartstring Bot",
        fields: [{
            name: "Users",
            value: `${client.users.size}`
          },
          {
            name: "Servers",
            value: `${client.guild.size}`
          },
          {
            name: "Version",
            value: "Alpha InDev"
          },
          {
            name: "discord.js Version",
            value: Discord.version  
          },
        ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Created by Brickman#4669"
          }}})
      
//user info
         } if  (message.content.startsWith(config.prefix + "ui")) {
      let memberInfo = message.mentions.members.first();
      if(!memberInfo){
      var userinf = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail(message.author.avatarURL)
      .setDescription("Guild: " + message.guild)
      .setColor(0x333333)
      .addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`)
      .addField("ID:", message.author.id)
      .addField('Current Nickname: ', message.author.toString())
      .addField("Current Status: ", message.author.presence.status)
      .addField("Currently Playing: ", message.author.presence.game)
      .addField("Created On: ", newDate)
      .setFooter("Created by Brickman#4669", client.user.avatarURL)

      message.channel.send(userinf);
      }else{
  var userinfoo = new Discord.RichEmbed()
      .setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
      .setThumbnail(memberInfo.user.avatarURL)
      .setDescription("Guild: " + message.guild)
      .setColor(0x333333)
      .addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`)
      .addField("ID:", memberInfo.id)
      .addField('Current Nickname: ', memberInfo.toString())
      .addField("Current Status: ", memberInfo.user.presence.status)
      .addField("Currently Playing: ", memberInfo.user.presence.game)
      .addField("Created On: ", "undefined")
      .setFooter("Created by Brickman#4669", client.user.avatarURL)
      message.channel.send(userinfoo);
      }
    } if (message.content.startsWith(config.prefix + "userinfo")) {
      let memberInfo = message.mentions.members.first();
      if(!memberInfo){
      var userinf = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail(message.author.avatarURL)
      .setDescription("Guild: " + message.guild)
      .setColor(0x333333)
      .addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`)
      .addField("ID:", message.author.id)
      .addField('Current Nickname: ', message.author.toString())
      .addField("Current Status: ", message.author.presence.status)
      .addField("Currently Playing: ", message.author.presence.game)
      .addField("Created On: ", newDate)
      .setFooter("Created by Brickman#4669", client.user.avatarURL)

      message.channel.send(userinf);
      }else{

  var userinfoo = new Discord.RichEmbed()
      .setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
      .setThumbnail(memberInfo.user.avatarURL)
      .setDescription("Guild: " + message.guild)
      .setColor(0x333333)
      .addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`)
      .addField("ID:", memberInfo.id)
      .addField("Current Status: ", message.author.presence.status)
      .addField("Currently Playing: ", message.author.presence.game)
      .addField("Created On: ", "undefined")
      .setFooter("Created by Brickman#4669", client.user.avatarURL)
      .setTimestamp("Heartstring")
      message.channel.send(userinfoo);
      }
    //help
    } if (message.content.startsWith(config.prefix + "help")) {
        message.channel.send({embed: {
          color: 0x333333,
          author: {
            name: "Heartstring",
            icon_url: client.user.avatarURL
          },
          title: "Help Menu",
          description: "Heartstring Help",
          fields: [{
              name: "Help",
              value: "Brings up this help menu."
            },
            {
              name: "Ping",
              value: "Shows the latency and API latency of the bot."
            },
            {
              name: "Say",
              value: "Makes the bot say whatever you put after the command. `Requires the 'Manage Messages' permission`. Usage: ph!say **<text>**"
            },
            {
              name: "Roll",
              value: "Rolls a dice. Usage: ph!roll **<number>**"
            },
            {
              name: "Avatar",
              value: "Shows your avatar, unless prompted with a mention. Usage: ph!avatar **[@user]**"
            },
            {
              name: "Uptime",
              value: "Shows the uptime of the bot"
            },
            {
              name: "8ball",
              value: "Acts like a magic 8ball"
            },
            {
              name: "Userinfo",
              value: "Shows your user info if not prompted with mention, otherwise displays info of the user you have mentioned. Alias: `ui`. Usage: ph!userinfo **[user]**"
            },
            {
              name: "Botinfo",
              value: "Shows info on the bot. Alias: `bi`"
            },
            {
              name: "Serverinfo",
              value: "Shows info on the server. Alias: `si`"
            },
            {
              name: "Purge",
              value: "Deletes the number of messages you specify (between 2 and 100) `Requires the 'Manage Messages' permission`. Usage: ph!purge **<amount>**"
            },
            {
              name: "Kick",
              value: "Kicks a user. `Requires the 'Kick' permission`. Usage: ph!kick **<user> [reason]**"
            },
            {
              name: "Ban",
              value: "Bans a member. `Requires the 'Ban' permission`. Usage: ph!ban **<user> [reason]**"
            },
            {
              name: "Eval",
              value: "Developer only command; runs code that it's prompted with"
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Created by Brickman#4669"
          }
        } 
      });
  }});
  client.login(process.env.token);
