const { readdirSync } = require("fs"),
    ascii = require("ascii-table");

let table = new ascii("Events");

table.setHeading("Event Name", "Loaded Status");
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
            console.log("");
            console.log(err);
            console.log(` :: ⬜️ Failed To Load : ${file} ☠️ error.`.bgRed);
        }
    }
    // console.log(table.toString().green);
};