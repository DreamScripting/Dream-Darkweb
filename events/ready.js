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

    if (!server) console.log('SERVER NOT FOUND'.red);
    if (!logChannel) console.log('LOGS CHANNEL NOT FOUND'.red);
    if (!darkwebChannel) console.log('DARKWEB CHANNEL NOT FOUND'.red);
    if (!darkwebRole) console.log('DARKWEB ROLE NOT FOUND'.red);

    if (!syndicate) {
        console.log("SYNDICATE NOT FOUND".red)
    } else {
        console.log(`${syndicate.name}`.green)
    };

    if (!racers) {
        console.log("RACERS NOT FOUND".red)
    } else {
        console.log(`${racers.name}`.green)
    };

    if (!accountlog) {
        console.log("ACCOUNT LOG CHANNEL NOT FOUND".red)
    } else {
        console.log(`${accountlog.name}`.green)
    };

    if (!wdlog) {
        console.log("WARN AND DELETE LOG NOT FOUND".red)
    } else {
        console.log(`${wdlog.name}`.green)
    };

    if (!admin) {
        console.log("ADMIN ROLE NOT FOUND".red)
    } else {
        console.log(`${admin.name}`.green)
    }

    if (server) console.log(`${server.name}`.green);
    if (logChannel) console.log(`${logChannel.name}`.green);
    if (darkwebChannel) console.log(`${darkwebChannel.name}`.green);
    if (darkwebRole) console.log(`${darkwebRole.name}`.green);

    console.log('DARK WEB BOT BY kool_damon IS NOW READY TO BE USED'.bgRed)
};