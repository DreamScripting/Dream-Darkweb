const discord = require("discord.js"),
    { MessageButton, MessageActionRow } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "accountdelete",
    aliases: ["delete"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "delete `tag_here`",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {
        setTimeout(() => message.delete().catch(() => null), 5000);
        if (!message.member.roles.cache.has(client.config.darkwebRole)) {
            return message.author.send("You don't have access to server DARK WEB");
        };

        if (!args[0]) {
            return message.reply("You forgot to mention youR tag!")
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        };

        let tag = db.get(`anon_code${message.author.id}`);
        let blocked = db.get(`block${args[0]}`);

        if (blocked === true) {
            return message.reply(`**Don't try to be oversmart i know that you \`${args[0]}\` have been blocked by GODFATHER \`KAL ANA KAL\`**`);
        };

        if (tag !== args[0]) {
            return message.reply(`This is not your tag!`)
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        };

        if (!tag) {
            return message.reply(`You Do Not Have A Tag Registered!`)
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        };

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("delete_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("NO")
                .setCustomId("delete_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to delete your account!`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            }

            if (button.customId === "delete_success") {

                // deleting the data of the user from the database
                db.delete(`anon_code${message.author.id}`);
                db.delete(args[0]);
                db.delete(`acc_user${args[0]}`);

                let log = client.channels.cache.get(client.config.accountlog);
                log.send({
                    embeds: [
                        new discord.MessageEmbed({
                            description: `Account Deleted ${args[0]} By <@${message.author}>\n${message.author.id}\n${message.author.tag}`,
                            color: client.config.embedColour
                        })
                    ]
                });

                return button.reply({ content: `Account Deleted ${args[0]}`, ephemeral: true }) &&
                    setTimeout(() => button.message.delete().catch(() => null), 100);
            };
            if (button.customId === 'delete_cancel') {
                return button.message.delete();
            };

        });
        collector.on("end", (_, reason) => {
            if (reason !== "messageDelete") {
                button.setDisabled(true);
                button1.setDisabled(true);
                return msg.edit({ content: "**`[Command Timed Out]`**", components: [row] })
                    .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
            };
        });
    }
};
