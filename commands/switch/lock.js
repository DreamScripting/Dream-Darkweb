const { ButtonBuilder, MessageActionRow, EmbedBuilder, ButtonStyle, PermissionsBitField } = require('discord.js'),
    { QuickDB } = require("quick.db"),
    db = new QuickDB();

module.exports = {
    name: "lock",
    //  aliases: ["accountc", "acreate"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "lock",
    botPermissions: [PermissionsBitField.Flags.EmbedLinks],
    userPermissions: [],

    async run(client, message, args) {

        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        let locked = db.get(`locked`);

        if (locked === true) {
            return message.reply({
                embeds: [
                    new EmbedBuilder({
                        description: "Dark Web is already locked for everyone!",
                        color: client.config.embedColour
                    })
                ]
            });
        };

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("YES")
            .setCustomId("lock_success")
            .setDisabled(false),
            button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("NO")
                .setCustomId("lock_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({
            embeds: [
                new EmbedBuilder({
                    description: `Are you sure you want to lock darkweb for everyone!`,
                    color: client.config.embedColour
                })
            ], components: [row]
        }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            }

            if (button.customId === "lock_success") {
                db.set("locked", true);
                return message.reply({
                    embeds: [
                        new EmbedBuilder({
                            description: 'Dark Web is now locked for everyone now!',
                            color: client.config.embedColour
                        })
                    ]
                }) && button.message.delete();
            };

            if (button.customId === "lock_cancel") {
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