const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const querystring = require('querystring');

global.Headers = global.Headers || require("fetch-headers");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const prefix = '!';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
    client.user.setActivity('!dbtstats // Crunching Eggbots and Their Stats');

    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (commandName === 'stats') {
        client.commands.get('dbtstats').execute(message, args);
	}
});

client.login(config.token)