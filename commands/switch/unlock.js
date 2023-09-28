const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "unlock",
    //  aliases: ["accountc", "acreate"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "unlock",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {

        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        let locked = db.get(`locked`);

        if (locked !== true) {
            return message.reply({
                embeds: [
                    new MessageEmbed({
                        description: "Dark Web is not locked for everyone!",
                        color: client.config.embedColour
                    })
                ]
            });
        };

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("unlock_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("NO")
                .setCustomId("unlock_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({
            embeds: [
                new MessageEmbed({
                    description: `Are you sure you want unlock Darkweb for everyone!`,
                    color: client.config.embedColour
                })
            ], components: [row]
        }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            }

            if (button.customId === "unlock_success") {
                db.delete("locked");
                return message.reply({
                    embeds: [
                        new MessageEmbed({
                            description: 'Dark Web is now unlocked for everyone now!',
                            color: client.config.embedColour
                        })
                    ]
                }) && button.message.delete();
            };

            if (button.customId === "unlock_cancel") {
                return button.message.delete();
            };

            collector.on("end", (_, reason) => {
                if (reason !== "messageDelete") {
                    button.setDisabled(true);
                    button1.setDisabled(true);
                    return msg.edit({ content: "**`[Command Timed Out]`**", components: [row] })
                        .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
                };
            });

        });
    },
};