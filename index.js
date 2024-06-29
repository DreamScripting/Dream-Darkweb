const config = require('./config.js'),
    { QuickDB } = require("quick.db"),
    db = new QuickDB();

require('./live.js');
require('colors')

const { GatewayIntentBits, WebhookClient, Collection, Client, Partials, ButtonBuilder, AttachmentBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ActivityType } = require("discord.js"),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            // GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.MessageContent
        ],
        allowedMentions: { parse: ['users'], repliedUser: true },
        presence: {
            status: "idle",
            activities: [{
                name: "Powered By : kool_damon",
                type: ActivityType.Listening
            }]
        },
        fetchAllMembers: true,
        restTimeOffset: 0,
        shards: "auto",
        restWsBridgetimeout: 100,
        disableEveryone: true,
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.GuildMember,
            Partials.User
        ]
    }),
    Timeout = new Collection();

// loading local cache for the commands and its aliases
client.commands = new Collection();
client.aliases = new Collection();
client.config = config;
client.errweb = new WebhookClient({
    id: process.env.errid || config.errid,
    token: process.env.errtoken || config.errtoken
});

client.bitfieldToName = function (bitfield) {
    const permissions = new PermissionsBitField(bitfield);
    return permissions.toArray();
};

["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

let godfather = new WebhookClient({
    id: process.env.webid || config.webid,
    token: process.env.webtoken || config.webtoken
});

let midnight = new WebhookClient({
    id: process.env.midid || config.mid.id,
    token: process.env.midtoken || config.mid.token
});

require("./events2/dmFunction.js")(client);


client.login(config.TOKEN).catch(e => console.log(e.stack))

process.on("unhandledRejection", (error) => {
    client.errweb.send(`\`\`\`js\n${error.stack}\`\`\``);
});
process.on("uncaughtException", (err, origin) => {
    client.errweb.send(`\`\`\`js\n${err.stack}\`\`\``);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    client.errweb.send(`\`\`\`js\n${err.stack}\`\`\``);
});
process.on("beforeExit", (code) => {
    client.errweb.send(`\`\`\`js\n${code}\`\`\``);
});
process.on("exit", (code) => {
    client.errweb.send(`\`\`\`js\n${code}\`\`\``);
});
