const discord = require("discord.js"),
    { MessageButton, MessageActionRow } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "accountcreate",
    aliases: ["create"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "acreate `tag_here`",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {
        setTimeout(() => message.delete().catch(() => null), 5000);

        if (!message.member.roles.cache.has(client.config.darkwebRole)) {
            return message.author.send("You don't have access to server DARK WEB");
        };

        if (!args[0]) {
            return message.reply("You forgot to mention you tag that you want for you dark web account")
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        };

        if (isNaN(args[0])) {
            return message.reply("You can only use numbers as your tag!")
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        }

        let tag = db.get(`anon_code${message.author.id}`),
            tag_use = db.get(args[0]);

        if (tag) {
            return message.reply(`You ALready Have A Tag Registered That Is - ${tag}`)
                .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
        };

        if (tag_use === true) {
            return message.reply("This Tag Is Already Registered By Someone Else");
        };

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("create_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("NO")
                .setCustomId("create_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to create ${args[0]} as your account!`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            }

            if (button.customId === "create_success") {

                // saving the data in the data base
                db.set(`anon_code${message.author.id}`, args[0]);
                db.set(args[0], true);
                db.set(`acc_user${args[0]}`, message.author.id);

                // sending logs and repllying the user that all the data is saved and his account is created
                let log = client.channels.cache.get(client.config.accountlog);
                log.send({
                    embeds: [
                        new discord.MessageEmbed({
                            description: `Account Created ${args[0]} By <@${message.author}>\n${message.author.id}\n${message.author.tag}`,
                            color: client.config.embedColour
                        })
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    ]
                });

                return button.reply({ content: `Account Created ${args[0]}`, ephemeral: true }) &&
                    setTimeout(() => button.message.delete().catch(() => null), 100);
            };
            if (button.customId === 'create_cancel') {
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
    },
};
