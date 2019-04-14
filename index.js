// Get bot configuration
const config = require("./config.json");

// Import Discord.js as discord
const Discord = require("discord.js");
// New client
const client = new Discord.Client();

// Ready event
client.on("ready", () => {
	client.user.setActivity(`h.help || ${client.guilds.size} servers`);
});

// Message event, disable eslint line complexity
// eslint-disable-next-line complexity
client.on("message", async (message) => {

	// Ignore bots.
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;


	const date = message.author.createdAt;
	const newDate = date.toLocaleDateString();

	// Get arguments.
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

	// Ping command
	if (message.content.startsWith(`${config.prefix}ping`)) {
		const m = await message.channel.send("Pinging...");
		m.edit({
			embed: {
				color: 0x333333,
				description: `Latency: **${m.createdTimestamp - message.createdTimestamp}**ms. API Latency: **${Math.round(client.ping)}**ms`

			}
		});
		// 8ball
	} else if (message.content.startsWith(`${config.prefix}8ball`)) {
		// Possible responses.
		const ball = [
			"It is certain.",
			"It is decidedly so.",
			"Without a doubt.",
			"Yes - definitely.",
			"You may rely on it.",
			"As I see it, yes.",
			"Most likely.",
			"Outlook good.",
			"Yes.",
			"Signs point to yes.",
			"Reply hazy, try again.",
			"Ask again later.",
			"Better not tell you now.",
			"Cannot predict now.",
			"Concentrate and ask again.",
			" Don't count on it.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good.",
			"Very doubtful."
		];
		message.channel.send(ball[Math.floor(Math.random() * ball.length)]);

		// Suggestion command
	} else if (message.content.startsWith(`${config.prefix}suggest`)) {
		if (!args.length) return message.channel.send(`You need to provide a suggestion`);


		client.channels.get("563804889268879390").send(`New Suggestion: **${args.join(" ")}** From: ${message.author.username}#${message.author.discriminator}`);
		message.channel.send("The suggestion has been sent - thank you for your suggestion.");

		// say
	} else if (message.content.startsWith(`${config.prefix}say`)) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have permissions to use this!");
		if (!args.length) return message.channel.send(`You need to provide something to say`);

		message.delete().catch(e => { });
		message.channel.send(args.join(" "));

	} else if (message.content.startsWith(`${config.prefix}uptime`)) {
		let totalSeconds = client.uptime / 1000;
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const uptime = `**${days}** days, **${hours}** hours and **${minutes}** minutes`;

		message.channel.send({
			embed: {
				color: 0x333333,
				description: uptime
			}
		});

		// kick
	} else if (message.content.startsWith(`${config.prefix}kick`)) {
		if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");
		const member = message.mentions.members.first() || message.guild.members.get(args[0]);

		if (!member) return message.reply("Please mention a valid member of this server");
		if (!member.kickable) return message.reply("I cannot kick this user!");

		let reason = args.slice(1).join(" ");
		if (!reason) reason = "No reason provided";

		await member.kick(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
		message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);


		// ban

	} else if (message.content.startsWith(`${config.prefix}ban`)) {
		if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");

		const member = message.mentions.members.first();
		if (!member) return message.reply("Please mention a valid member of this server");
		if (!member.bannable) return message.reply("I cannot ban this user!");

		let reason = args.slice(1).join(" ");
		if (!reason) reason = "No reason provided";

		await member.ban(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
		message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);

		// roll
	} else if (message.content.startsWith(`${config.prefix}roll`)) {
		if (!args.length) return message.channel.send(`You need to provide a number`);

		message.channel.send(`You rolled ${Math.floor(Math.random() * args.join(" ")) + 1}`);
		// purge
	} else if (message.content.startsWith(`${config.prefix}purge`)) {
		const deleteCount = parseInt(args[0], 10);
		if (!deleteCount || deleteCount < 2 || deleteCount > 100) { return message.reply("Please provide a number between 2 and 100 for the number of messages to delete"); }
		const fetched = await message.channel.fetchMessages({ limit: deleteCount });
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

		// avatar

	} else if (message.content.startsWith(`${config.prefix}avatar`)) {
		if (!message.mentions.users.size) {
			const avatarAuthor = new Discord.RichEmbed()
				.setColor(0x333333)
				.setAuthor(message.author.username)
				.setImage(message.author.avatarURL);
			message.channel.send(avatarAuthor);
		} else {
			const user = message.mentions.users.first();
			const avatarEmbed = new Discord.RichEmbed()
				.setColor(0x333333)
				.setAuthor(user.username)
				.setImage(user.avatarURL);
			message.channel.send(avatarEmbed);
		}
		// eval

	} if (message.content.startsWith(`${config.prefix}eval`)) {
		if (message.author.id !== config.ownerID) return;
		function clean(text) {
			if (typeof text === "string") { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); } else { return text; }
		}
		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") { evaled = require("util").inspect(evaled); }

			message.channel.send(clean(evaled), { code: "xl" });
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}


		// serverinfo

	} else if (message.content.startsWith(`${config.prefix}serverinfo`)) {
		function checkDays(date) {
			const now = new Date();
			const diff = now.getTime() - date.getTime();
			const days = Math.floor(diff / 86400000);
			return `${days + (days == 1 ? " day" : " days")} ago`;
		}
		const verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
		const region = {
			brazil: ":flag_br: Brazil",
			"eu-central": ":flag_eu: Central Europe",
			singapore: ":flag_sg: Singapore",
			"us-central": ":flag_us: U.S. Central",
			sydney: ":flag_au: Sydney",
			"us-east": ":flag_us: U.S. East",
			"us-south": ":flag_us: U.S. South",
			"us-west": ":flag_us: U.S. West",
			"eu-west": ":flag_eu: Western Europe",
			"vip-us-east": ":flag_us: VIP U.S. East",
			london: ":flag_gb: London",
			amsterdam: ":flag_nl: Amsterdam",
			hongkong: ":flag_hk: Hong Kong",
			russia: ":flag_ru: Russia",
			southafrica: ":flag_za:  South Africa"
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
			.setThumbnail(message.guild.iconURL);
		message.channel.send({ embed });
	} else if (message.content.startsWith(`${config.prefix}si`)) {
		function checkDays(date) {
			const now = new Date();
			const diff = now.getTime() - date.getTime();
			const days = Math.floor(diff / 86400000);
			return `${days + (days == 1 ? " day" : " days")} ago`;
		}
		const verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
		const region = {
			brazil: ":flag_br: Brazil",
			"eu-central": ":flag_eu: Central Europe",
			singapore: ":flag_sg: Singapore",
			"us-central": ":flag_us: U.S. Central",
			sydney: ":flag_au: Sydney",
			"us-east": ":flag_us: U.S. East",
			"us-south": ":flag_us: U.S. South",
			"us-west": ":flag_us: U.S. West",
			"eu-west": ":flag_eu: Western Europe",
			"vip-us-east": ":flag_us: VIP U.S. East",
			london: ":flag_gb: London",
			amsterdam: ":flag_nl: Amsterdam",
			hongkong: ":flag_hk: Hong Kong",
			russia: ":flag_ru: Russia",
			southafrica: ":flag_za:  South Africa"
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
			.setThumbnail(message.guild.iconURL);
		message.channel.send({ embed });

		// botinfo

	} else if (message.content.startsWith(`${config.prefix}bi`)) {
		message.channel.send({
			embed: {
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
					name: "Version",
					value: "Alpha InDev",
					inline: true
				},
				{
					name: "discord.js Version",
					value: Discord.version,
					inline: true
				},
				{
					name: "Commands",
					value: "15 Commands",
					inline: true
				}
				],
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "Created by Brickman#4669"
				}
			}
		});
	} else if (message.content.startsWith(`${config.prefix}botinfo`)) {
		message.channel.send({
			embed: {
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
					name: "Version",
					value: "Alpha InDev",
					inline: true
				},
				{
					name: "discord.js Version",
					value: Discord.version,
					inline: true
				},
				{
					name: "Commands:",
					value: "15 Commands",
					inline: true
				}
				],
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "Created by Brickman#4669"
				}
			}
		});


		// user info
	} else if (message.content.startsWith(`${config.prefix}ui`)) {
		const status = {
			online: "<:online:564312732388556800> Online",
			idle: "<:idle:564312674893299712> Idle",
			dnd: "<:dnd:564312639753289734> Do Not Disturb",
			offline: "<:offline:564312891159871498> Offline"
		};
		const memberInfo = message.mentions.members.first();
		if (!memberInfo) {
			var userinf = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.avatarURL)
				.setThumbnail(message.author.avatarURL)
				.setDescription(`Guild: ${message.guild}`)
				.setColor(0x333333)
				.addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`, true)
				.addField("ID:", message.author.id, true)
				.addField("Current Nickname: ", message.author.toString(), true)
				.addField("Current Status: ", status[message.author.presence.status], true)
				.addField("Currently Playing: ", message.author.presence.game || "Nothing", true)
				.addField("Created On: ", newDate, true)
				.setFooter("Created by Brickman#4669", client.user.avatarURL);

			message.channel.send(userinf);
		} else {
			const midate = memberInfo.user.createdAt;
			const midateF = midate.toLocaleDateString();
			var userinfoo = new Discord.RichEmbed()
				.setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
				.setThumbnail(memberInfo.user.avatarURL)
				.setDescription(`Guild: ${message.guild}`)
				.setColor(0x333333)
				.addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`, true)
				.addField("ID:", memberInfo.id, true)
				.addField("Current Nickname: ", memberInfo.toString(), true)
				.addField("Current Status: ", status[memberInfo.user.presence.status], true)
				.addField("Currently Playing: ", memberInfo.user.presence.game || "Nothing", true)
				.addField("Created On: ", midateF, true)
				.setFooter("Created by Brickman#4669", client.user.avatarURL);
			message.channel.send(userinfoo);
		}
	} else if (message.content.startsWith(`${config.prefix}userinfo`)) {
		const status = {
			online: "<:online:564312732388556800> Online",
			idle: "<:idle:564312674893299712> Idle",
			dnd: "<:dnd:564312639753289734> Do Not Disturb",
			offline: "<:offline:564312891159871498> Offline"
		};
		const memberInfo = message.mentions.members.first();
		if (!memberInfo) {
			var userinf = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.avatarURL)
				.setThumbnail(message.author.avatarURL)
				.setDescription(`Guild: ${message.guild}`)
				.setColor(0x333333)
				.addField("Full Username: ", `${message.author.username}#${message.author.discriminator}`, true)
				.addField("ID:", message.author.id, true)
				.addField("Current Nickname: ", message.author.toString(), true)
				.addField("Current Status: ", status[message.author.presence.status], true)
				.addField("Currently Playing: ", message.author.presence.game || "Nothing", true)
				.addField("Created On: ", newDate, true)
				.setFooter("Created by Brickman#4669", client.user.avatarURL);

			message.channel.send(userinf);
		} else {
			const midate = memberInfo.user.createdAt;
			const midateF = midate.toLocaleDateString();
			var userinfoo = new Discord.RichEmbed()
				.setAuthor(memberInfo.displayName, memberInfo.user.avatarURL)
				.setThumbnail(memberInfo.user.avatarURL)
				.setDescription(`Guild: ${message.guild}`)
				.setColor(0x333333)
				.addField("Full Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`, true)
				.addField("ID:", memberInfo.id, true)
				.addField("Current Status: ", status[message.author.presence.status], true)
				.addField("Currently Playing: ", message.author.presence.game || "Nothing", true)
				.addField("Created On: ", midateF, true)
				.setFooter("Created by Brickman#4669", client.user.avatarURL);
			message.channel.send(userinfoo);
		}

		// warn


		// help
	} else if (message.content.startsWith(`${config.prefix}help`)) {
		message.channel.send({
			embed: {
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
					value: "Makes the bot say whatever you put after the command. `Requires the 'Manage Messages' permission`. Usage: h.say **<text>**"
				},
				{
					name: "Roll",
					value: "Rolls a dice. Usage: h.roll **<number>**"
				},
				{
					name: "Avatar",
					value: "Shows your avatar, unless prompted with a mention. Usage: h.avatar **[@user]**"
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
					name: "Suggest",
					value: "Sends a suggestion to the developer."
				},
				{
					name: "Userinfo",
					value: "Shows your user info if not prompted with mention, otherwise displays info of the user you have mentioned. Alias: `ui`. Usage: h.userinfo **[user]**"
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
					value: "Deletes the number of messages you specify (between 2 and 100) `Requires the 'Manage Messages' permission`. Usage: h.purge **<amount>**"
				},
				{
					name: "Kick",
					value: "Kicks a user. `Requires the 'Kick' permission`. Usage: h.kick **<user> [reason]**"
				},
				{
					name: "Ban",
					value: "Bans a member. `Requires the 'Ban' permission`. Usage: h.ban **<user> [reason]**"
				},
				{
					name: "Eval",
					value: "Developer only command; runs code that it's prompted with"
				},
				{
					name: "Links",
					value: "[Website](https://brickman.glitch.me/heartstring.html) | [DBL](https://discordbots.org/bot/562151876607344664) | [Github Repo](https://github.com/Brickmanbots/heartstring)"
				}
				],
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "Created by Brickman#4669"
				}
			}
		});
	}
});


client.login(process.env.token);
