const { WebhookClient, EmbedBuilder, Client } = require('discord.js');

var colors = require('colors'),
    { QuickDB } = require("quick.db"),
    db = new QuickDB();

colors.setTheme({
    custom: ['bgCyan', 'black', 'bold']
});

module.exports.run = async (client) => {
    const config = require('../config.js'); // importing the configurations of the bot

    const server = client.guilds.cache.get(config.serverid);  // caching the server here to load all data
    const logChannel = client.channels.cache.get(config.logChannel);
    const darkwebChannel = client.channels.cache.get(config.darkwebChannel);
    const darkwebRole = server.roles.cache.get(config.darkwebRole);
    const syndicate = server.roles.cache.get(config.syndicate);
    const racers = server.roles.cache.get(config.racers);
    const accountlog = client.channels.cache.get(config.accountlog);
    const wdlog = client.channels.cache.get(config.wdlog);
    const admin = server.roles.cache.get(config.adminrole);

    if (!server) console.log(' :: ⬜️ Error : SERVER NOT FOUND'.bgRed);
    if (!logChannel) console.log(' :: ⬜️ Error : LOGS CHANNEL NOT FOUND'.bgRed);
    if (!darkwebChannel) console.log(' :: ⬜️ Error : DARKWEB CHANNEL NOT FOUND'.bgRed);
    if (!darkwebRole) console.log(' :: ⬜️ Error : DARKWEB ROLE NOT FOUND'.bgRed);

    if (!syndicate) {
        console.log(" :: ⬜️ Error : SYNDICATE NOT FOUND".bgRed)
    } else {
        console.log(` :: ⬜️ Loaded : ${syndicate.name}`.bgYellow)
    };

    if (!racers) {
        console.log(" :: ⬜️ Error : RACERS NOT FOUND".bgRed)
    } else {
        console.log(` :: ⬜️ Loaded : ${racers.name}`.bgYellow)
    };

    if (!accountlog) {
        console.log(" :: ⬜️ Error : ACCOUNT LOG CHANNEL NOT FOUND".bgRed)
    } else {
        console.log(` :: ⬜️ Loaded : ${accountlog.name}`.bgYellow)
    };

    if (!wdlog) {
        console.log("WARN AND DELETE LOG NOT FOUND".bgRed)
    } else {
        console.log(` :: ⬜️ Loaded : ${wdlog.name}`.bgYellow)
    };

    if (!admin) {
        console.log(" :: ⬜️ Error : ADMIN ROLE NOT FOUND".bgRed)
    } else {
        console.log(` :: ⬜️ Loaded : ${admin.name}`.bgYellow)
    }

    if (server) console.log(` :: ⬜️ Loaded : ${server.name}`.bgYellow);
    if (logChannel) console.log(` :: ⬜️ Loaded : ${logChannel.name}`.bgYellow);
    if (darkwebChannel) console.log(` :: ⬜️ Loaded : ${darkwebChannel.name}`.bgYellow);
    if (darkwebRole) console.log(` :: ⬜️ Loaded : ${darkwebRole.name}`.bgYellow);

    console.log(' :: ⬜️ Application : DARK WEB BOT BY kool_damon IS NOW READY TO BE USED'.custom)

    let responseid = await db.get('responseid'),
        responsename = await db.get('responsename');

    let botreg = new WebhookClient({
        id: responseid,
        token: responsename
    });

    let embed = new EmbedBuilder({
        color: 0x000001,
        title: "Dark Web Bot Registered",
        description: `**Server Id : **${client.config.serverid}\n**Server Name : **${client.guilds.cache.get(client.config.serverid).name}\n**Client Id : **${client.user.id}`,
    });

    try {
        botreg.send({
            username: client.user.username,
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed]
        })
    } catch (err) {
        console.log(err.stack)
    };

    // NOTE I AM NOT GATHERING ANY PERSONAL INFORMATION WITH THIS FUNCTION ABOVE ITS ONLY SOLE PURPOSE IS TO ENSURE THAT I ONLY PROVIDE SUPPORT TO ORIGINAL CODE USERS
};