const { readdirSync } = require("fs");

module.exports = client => {
    readdirSync("./commands/").forEach(async dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {

            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                console.log(` :: ⬜️ Loaded Command : ${file} ♻️  => no error.!`.bgWhite);
            } else {
                console.log(` :: ⬜️ Failed To Load : ${file} ☠️ error.`.bgRed);
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
};