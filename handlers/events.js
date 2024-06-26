const { readdirSync } = require("fs");

module.exports = client => {
    const events = readdirSync(`./events/`).filter(file => file.endsWith(".js"));

    for (let file of events) {
        try {
            let pull = require(`../events/${file}`);
            if (pull.event && typeof pull.event !== "string") {
                console.log(` :: ⬜️ Failed To Load : ${file} ❌ Property event should be string.`.bgRed);
                continue;
            }
            pull.event = pull.event || file.replace(".js", "");
            client.on(pull.event, pull.run.bind(null, client));
            console.log(` :: ⬜️ Loaded Event : ${file} ♻️  => no error.!`.bgGreen);
        } catch (err) {
            console.log(err.stack);
            console.log(` :: ⬜️ Failed To Load : ${file} ☠️ error.`.bgRed);
        }
    }
};