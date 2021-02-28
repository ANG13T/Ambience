
const { Client, Collection } = require('discord.js');

class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;
    }
}

module.exports = Client;