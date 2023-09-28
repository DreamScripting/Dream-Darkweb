const discord = require("discord.js"),
    { MessageButton, MessageActionRow } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "clearwarn",
    aliases: ["cwarns", "cwarn"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "acreate `tag_here`",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {
        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        if (!args[0]) {
            return message.reply("You forgot to mention the tag");
        };

        let tag_use = db.get(args[0]);

        if (tag_use !== true) {
            return message.reply("This Tag Is Not In Use");
        };

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("cwarn_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("NO")
                .setCustomId("cwarn_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to clear warns of ${args[0]}!`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            };

            if (button.customId === "cwarn_success") {
                let warns = db.get(`warns${args[0]}`),
                    tag_block = db.get(`block${args[0]}`);

                if (!warns) {
                    warns = "0"
                };

                db.delete(`warns${args[0]}`);

                if (tag_block === true) {
                    db.delete(`block${args[0]}`);
                };

                let log = client.channels.cache.get(client.config.wdlog);
                let acc_user = db.get(`acc_user${args[0]}`);
                let owner = await message.guild.members.fetch(acc_user);

                log.send({
                    embeds: [
                        new discord.MessageEmbed({
                            description: `Warnings cleared of ${args[0]} By ${message.author} - \`${message.author.tag}\` which is owned by ${owner} - \`${owner.user.tag}\`\n${warns}/3 Warnings`,
                            color: client.config.embedColour
                        })
                    ]
                });
                return message.reply(`Cleard all warns of ${args[0]}\nThis user had ${warns}/3 warnings!`) &&
                    button.message.delete();
            };

            if (button.customId === "cwarn_cancel") {
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