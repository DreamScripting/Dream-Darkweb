const { readdirSync } = require("fs"),
    ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");
module.exports = client => {
    readdirSync("./commands/").forEach(async dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            try {
                let pull = require(`../commands/${dir}/${file}`);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    console.log(` :: ⬜️ Loaded Command : ${file} ♻️  => no error.!`.bgWhite);
                } else {
                    console.log(` :: ⬜️ Failed To Load : ${file} ☠️ error.`.bgRed);
                    continue;
                }
            } catch (err) {
                console.log(err.stack);
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
};