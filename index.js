const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const snekfetch = require("snekfetch")
//8ball list
var ball =["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", " Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
client.on("ready", () => {
    client.user.setActivity(`h.help || ${client.guilds.size} servers`)
      });
  client.on("message", async message => {
    const date = message.author.createdAt;
    const newDate = date.toLocaleDateString();
    const joined = message.member.joinedAt;
    const newJoined = joined.toLocaleDateString()
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
} if (message.content.startsWith(config.prefix + "contact")) {
  if (!args.length) {
    return message.channel.send(`You need to provide something to contact the developer with.`);
    }
client.channels.get("563804889268879390").send("New Contact Request: **" + args.join(" ") + `** From: ${message.author.username}#${message.author.discriminator}`)
message.channel.send("Thank you for contacting")
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
        let kickedguild = message.guild.name
        let moderatorkick = message.author.username
        let moderatordiscrimkick = message.author.discriminator
        const kickembed = new Discord.RichEmbed()
        .setColor(0x333333)
        .setTitle("You have been kicked")
        .setDescription("You have been kicked from " + kickedguild)
        .addField("Moderator:", moderatorkick + moderatordiscrimkick)
        .addField("Reason: ", reason)
        await member.send(kickembed)
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
        let bannedguild = message.guild.name
        let moderatorban = message.author.username
        let moderatordiscrim = message.author.discriminator
        const banembed = new Discord.RichEmbed()
        .setColor(0x333333)
        .setTitle("You have been banned")
        .setDescription("You have been banned from " + bannedguild)
        .addField("Moderator:", moderatorban + moderatordiscrim)
        .addField("Reason: ", reason)
        await member.send(banembed)
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
     }
      //purge
if (message.content.startsWith(config.prefix + "purge")) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission for this!")
  const deleteCount = parseInt(args[0], 10);
  if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
  const fetched = await message.channel.fetchMessages({limit: deleteCount});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));



//avatar   
} if (message.content.startsWith(config.prefix + 'avatar')) {
  if (!message.mentions.users.size) {
    const avatarAuthor = new Discord.RichEmbed()
        .setColor(0x333333)
        .setAuthor(message.author.username)
        .setImage(message.author.avatarURL);
    message.channel.send(avatarAuthor);
} else {
  const user = message.mentions.users.first() 
  const avatarEmbed = new Discord.RichEmbed()
      .setColor(0x333333)
      .setAuthor(user.username)
      .setImage(user.avatarURL);
  message.channel.send(avatarEmbed);
}
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
  } if (message.content.startsWith(config.prefix + "si")) {
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
  
} if (message.content.startsWith(config.prefix + "meme")) {
  var subs = [`https://www.reddit.com/r/dankmemes.json?sort=top&t=week`, `https://www.reddit.com/r/memes.json?sort=top&t=week`, `https://www.reddit.com/r/dank_meme.json?sort=top&t=week`];
  const randomsubs = subs[Math.floor(Math.random() * subs.length)];
  try {
    const { body } = await snekfetch
        .get(randomsubs)
        .query({ limit: 800 });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('');
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const memeembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .setTitle(allowed[randomnumber].data.title)
    .setImage(allowed[randomnumber].data.url)
    .addField("Link: ", allowed[randomnumber].data.url)
    message.channel.send(memeembed)
} catch (err) {
    return console.log(err);
}
} if (message.content.startsWith(config.prefix + "reddit")) {
  if (!args) return message.channel.send("Please provide a subreddit (i.e dankmemes, softwaregore)");
  var sub = "https://www.reddit.com/r/" + args + ".json?sort=top&t=week"
  try {
    const { body } = await snekfetch
        .get(sub)
        .query({ limit: 800 });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('Please check the name of subreddit is correct');
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const subembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .setTitle(allowed[randomnumber].data.title)
    .setImage(allowed[randomnumber].data.url)
    .addField("Link: ", allowed[randomnumber].data.url)
    message.channel.send(subembed)
} catch (err) {
    return console.log(err);

}
  
} if (message.content.startsWith(config.prefix + "cat")) {
  var sub = "https://www.reddit.com/r/kittens.json?sort=top&t=week"
  try {
    const { body } = await snekfetch
        .get(sub)
        .query({ limit: 800 });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('Please check the name of subreddit is correct');
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const subembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .setImage(allowed[randomnumber].data.url)
    .setFooter("Provided by r/kittens")
    message.channel.send(subembed)
} catch (err) {
    return console.log(err);

}
} if (message.content.startsWith(config.prefix + "dog")) {
  var sub = "https://www.reddit.com/r/rarepuppers.json?sort=top&t=week"
  try {
    const { body } = await snekfetch
        .get(sub)
        .query({ limit: 800 });
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) return message.channel.send('Please check the name of subreddit is correct');
    const randomnumber = Math.floor(Math.random() * allowed.length)
    const subembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .setImage(allowed[randomnumber].data.url)
    .setFooter("Provided by r/rarepuppers")
    message.channel.send(subembed)
} catch (err) {
    return console.log(err);

}

//emojibig
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
            value: `${client.users.size}`,
            inline: true
          },
          {
            name: "Servers",
            value: `${client.guilds.size}`,
              inline: true
          },
          {
            name: "discord.js Version",
            value: Discord.version,
              inline: true
          },
        ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Created by cyliim#4669"
          }}});
    } if (message.content.startsWith(config.prefix + "botinfo")) {
      message.channel.send({embed: {
        color: 0x333333,
        author: {
          name: "Bot Info",
          icon_url: client.user.avatarURL
        },
        title: "Bot info",
        fields: [{
            name: "Users",
            value: `${client.users.size}`,
            inline: true
          },
          {
            name: "Servers",
            value: `${client.guild.size}`,
              inline: true
          },
          {
            name: "discord.js Version",
            value: Discord.version,
              inline: true
          },
        ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "Created by cyliim#4669"
          }}})
      
        } if (message.content.startsWith(config.prefix + "bean")) {
          let beaner = message.author.username
          let beandiscrim = message.author.discriminator
          let beanedguild = message.guild.name
          let beaned = message.mentions.members.first();
          let beanedreason = args.slice(1).join(' ');
          if (!beaned) return message.channel.send("Please mention a member to bean!");
          if (!beanedreason) return message.channel.send("Please provide a reason!")
          const beanbed = new Discord.RichEmbed()
          .setColor(0x333333)
          .setTitle("You've been beaned!")
          .setDescription("You have been beaned from " + beanedguild)
          .addField("Moderator: ", beaner + "#" + beandiscrim)
          .addField("Reason: ", beanedreason)
          .setFooter("Note: This isn't a real ban")
          beaned.send(beanbed)
          message.channel.send("User has been beaned!").then(message.delete[2])
//user info
} if  (message.content.startsWith(config.prefix + "ui")) {
  let bot = {
    "true": "<:bot:567460806766362634> Bot",
    "false": "<:user:567460858779664618> User"
  }
  let status = {
    "online": "<:online:564312732388556800> Online",
    "idle": "<:idle:564312674893299712> Idle",
    "dnd": "<:dnd:564312639753289734> Do Not Disturb",
    "offline": "<:offline:564312891159871498> Offline",
    "streaming": "<:streaming:567461197612449792> Streaming"
  };
let memberInfo = message.mentions.members.first();
if(!memberInfo){
var userinf = new Discord.RichEmbed()
.setAuthor(message.author.username, message.author.avatarURL)
.setThumbnail(message.author.avatarURL)
.setDescription("Guild: " + message.guild)
.setColor(0x333333)
.addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`, true)
.addField("ID:", message.author.id, true)
.addField('Current Nickname: ', message.author.toString(), true)
.addField("Current Status: ", status[message.author.presence.status], true)
.addField("Currently Playing: ", message.author.presence.game || "Nothing", true)
.addField("Account Type: ", bot[message.author.bot], true)
.addField("Joined On: ", newJoined, true)
.addField("Created On: ", newDate, true)
.setFooter("Created by cyliim#4669", client.user.avatarURL)

message.channel.send(userinf);
}else{
let midate = memberInfo.user.createdAt
let midateF = midate.toLocaleDateString();
let mijoined = memberInfo.joinedAt
let mijoinedF = mijoined.toLocaleDateString();
var userinfoo = new Discord.RichEmbed()
.setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
.setThumbnail(memberInfo.user.avatarURL)
.setDescription("Guild: " + message.guild)
.setColor(0x333333)
.addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`, true)
.addField("ID:", memberInfo.id, true)
.addField('Current Nickname: ', memberInfo.toString(), true)
.addField("Current Status: ", status[memberInfo.user.presence.status], true)
.addField("Currently Playing: ", memberInfo.user.presence.game || "Nothing", true)
.addField("Account Type: ", bot[memberInfo.user.bot], true)
.addField("Joined On: ", mijoinedF, true)
.addField("Created On: ", midateF ,true)
.setFooter("Created by cyliim#4669", client.user.avatarURL)
message.channel.send(userinfoo);
}
} if (message.content.startsWith(config.prefix + "userinfo")) {
  let bot = {
    "true": "Bot",
    "false": "User"
  }
let status = {
"online": "<:online:564312732388556800> Online",
"idle": "<:idle:564312674893299712> Idle",
"dnd": "<:dnd:564312639753289734> Do Not Disturb",
"offline": "<:offline:564312891159871498> Offline",
"streaming": "<:streaming:567461197612449792> Streaming"
};
let memberInfo = message.mentions.members.first();
if(!memberInfo){
var userinf = new Discord.RichEmbed()
.setAuthor(message.author.username, message.author.avatarURL)
.setThumbnail(message.author.avatarURL)
.setDescription("Guild: " + message.guild)
.setColor(0x333333)
.addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`, true)
.addField("ID:", message.author.id, true)
.addField('Current Nickname: ', message.author.toString(), true)
.addField("Current Status: ", status[message.author.presence.status], true)
.addField("Currently Playing: ", message.author.presence.game || "Nothing", true )
.addField("Account Type: ", bot[message.author.bot], true)
.addField("Joined On: ", newJoined, true)
.addField("Created On: ", newDate, true)
.setFooter("Created by cyliim#4669", client.user.avatarURL)

message.channel.send(userinf);
}else{
let midate = memberInfo.user.createdAt
let midateF = midate.toLocaleDateString();
let mijoined = memberInfo.joinedAt
let mijoinedF = mijoined.toLocaleDateString();
var userinfoo = new Discord.RichEmbed()
.setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
.setThumbnail(memberInfo.user.avatarURL)
.setDescription("Guild: " + message.guild)
.setColor(0x333333)
.addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`, true)
.addField("ID:", memberInfo.id, true)
.addField("Current Status: ", status[message.author.presence.status], true)
.addField("Currently Playing: ", message.author.presence.game || "Nothing", true)
.addField("Account Type: ", bot[memberInfo.user.bot], true)
.addField("Joined On: ", mijoinedF, true)
.addField("Created On: ", midateF, true)
.setFooter("Created by cyliim#4669", client.user.avatarURL)
message.channel.send(userinfoo);
}
//role assign
} if (message.content.startsWith(config.prefix + "addrole")) {
  let userToModify = message.mentions.members.first();
  let roleToAdd = message.mentions.roles.first();
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You do not have permission for this!")
  if (!argsrole) return message.channel.send("Please enter a mentioned user and a mentioned role to assign (e.g h.addrole @Brickman @Moderator)")
  userToModify.addRole(roleToAdd); 
  return message.channel.send("Succesfully added role " + roleToAdd + " to member " + userToModify + "!");

} if (message.content.startsWith(config.prefix + "removerole")) {
  let userToRemove = message.mentions.members.first();
  let roleToRemove = message.mentions.roles.first();
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You do not have permission for this!")
  if (!args) return message.channel.send("Please enter a mentioned user and a mentioned role to remove (e.g h.removerole @Brickman @Moderator)")
userToRemove.removeRole(roleToRemove); 
return message.channel.send("Succesfully removed role " + roleToRemove + " from member " + userToRemove + "!");


//help
 
  } if (message.content === config.prefix + "help bean") {
    var bean = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Beans someone; a fake ban", "Usage: h.bean <user> <reason> \nExample: h.bean @Brickman Get Beaned!!")
    message.channel.send(bean)
  } if (message.content === config.prefix + "help cat") {
    var cat = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Shows a cute picture of a cat", "Provided by r/kittens")
    message.channel.send(cat)
  } if (message.content === config.prefix + "help dog") {
    var dog = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Shows a cute picture of a dog", "Provided by r/rarepuppers")
    message.channel.send(dog)
  } if (message.content === config.prefix + "help addrole") {
    var roleremoveembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Adds a role to the desired member", "Requires the 'Manage Roles' permission \nUsage: h.addrole <user> <role> \nExample: h.addrole @Brickman @Moderator")
    message.channel.send(roleremoveembed)
  } if (message.content === config.prefix + "help removerole") {
    var roleaddembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Removes a role from the desired member", "Requires the 'Manage Roles' permission \nUsage: h.removerole <user> <role> \nExample: h.removerole @Brickman @Moderator")
    message.channel.send(roleaddembed)
  } if (message.content === config.prefix + "help serverinfo") {
    var serverinfo = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Shows info on the server", "Alias: si")
    message.channel.send(serverinfo)
    } if (message.content === config.prefix + "help botinfo") {
      var botinfo = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Shows info on the bot", "Alias: bi")
    message.channel.send(botinfo)
    } if (message.content === config.prefix + "help userinfo") {
      var userinfo = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Shows your user info if not prompted with a mention, otherwise displays info of the user you have mentioned.", "Alias: ui \nUsage: h.userinfo [@user] \nExample: h.userinfo @Brickman")
    message.channel.send(userinfo)
    } if (message.content === config.prefix + "help kick") {
      var kick = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Kicks a user.", "Requires the 'Kick' permission \nUsage: h.kick <@user> [reason] \n Example: h.kick @Brickman Get out!")
    message.channel.send(kick)
    } if (message.content === config.prefix + "help ban") {
      var ban = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Bans a user.", "Requires the 'Ban' permission \nUsage: h.ban <@user> [reason] \nExample: h.ban @Brickman Get out!")
    message.channel.send(ban)
    } if (message.content === config.prefix + "help purge") {
      var purge = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Deletes the number of messages you specify (between 2 and 100)", "Requires the 'Manage Messages' permission \nUsage: h.purge <amount 2-100> \nExample: h.purge 20")
    message.channel.send(purge)
    } if (message.content === config.prefix + "help 8ball") {
      var eightball = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Acts like a magic 8ball.", "Usage: h.8ball [question] \nExample: h.8ball Is Heartstring the best bot?")
    message.channel.send(eightball)
    } if (message.content === config.prefix + "help meme") {
      var meme = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Sends a random meme", "From reddit")
    message.channel.send(meme)
    } if (message.content === config.prefix + "help reddit") {
      var reddit = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Sends a random image from reddit.", "Doesn't work with gifs, text or videos. \nUsage: h.reddit <subreddit> \nExample: h.reddit pics")
    message.channel.send(reddit)
    } if (message.content === config.prefix + "help roll") {
      var roll = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Rolls a dice.", "Usage: h.roll <number> \nExample: h.roll 12")
    message.channel.send(roll)
    } if (message.content === config.prefix + "help ping") {
      var ping = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Pings the bot", "Shows Latency and API Latency")
    message.channel.send(ping)
    } if (message.content === config.prefix + "help say") {
      var helpsay = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Makes the bot say whatever you put after the command.", "Requires the `Manage Message` permission. \nUsage: h.say <text> \nExample: h.say I am the best!")
    message.channel.send(helpsay)
    } if (message.content === config.prefix + "help avatar") {
      var avatar = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Shows your avatar, unless prompted with a mention.", "Usage: h.avatar [@user] \nExample: h.avatar @Brickman")
    message.channel.send(avatar)
    } if (message.content === config.prefix + "help uptime") {
      var uptime = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Shows the uptime of the bot in Days, Hours and Minutes.")
    message.channel.send(uptime)
    } if (message.content === config.prefix + "help eval") {
      var evalembed = new Discord.RichEmbed()
      .setColor(0x333333)
      .addField("Developer only command", "runs code it's prompted with")
    message.channel.send(evalembed)
  } if (message.content === config.prefix + "help contact") {
    var contactembed = new Discord.RichEmbed()
    .setColor(0x333333)
    .addField("Contact the developer with a suggest or a bug", "Usage: h.contact <bug or suggestion>")
  message.channel.send(contactembed)
    //help
    } if (message.content === config.prefix + "help") {
      var help = new Discord.RichEmbed()
.setAuthor("Heartstring", client.user.avatarURL)
.setDescription("Use `help <command>` for more info on each command")
.setColor(0x333333)
.addField("Info Commands", "``` userinfo \n botinfo \n serverinfo```", true)
.addField("Moderation Commands", "``` kick \n ban \n purge \n addrole \n removerole```", true)
.addField("Fun Commands", "``` 8ball \n roll \n bean```", true)
.addField("General Commands", "``` help \n ping \n say \n avatar \n uptime \n contact```", true)
.addField("Reddit", "``` reddit \n meme \n dog \n cat```", true)
.addField("Developer", "``` eval```", true)
.addField("Links", "[Website](https://heartstring.brickman.me) | [DBL](https://discordbots.org/bot/562151876607344664) | [Github Repo](https://github.com/Brickmanbots/heartstring)")
.setFooter("Created by cyliim#4669", client.user.avatarURL)
      message.channel.send(help)
      
        } 
      });
  client.login(process.env.token);
