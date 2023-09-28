const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "modsonly",
     aliases: ["modonly"],
    description: "helps you see the last message which got deleted",
    category: "admins",
    usage: "modonly",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {

        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        let locked = db.get(`modOnly${message.guild.id}`);

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("ON")
            .setCustomId("mod_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("OFF")
                .setCustomId("mod_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to turn on mods only feature..?`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            }

            if (button.customId === "mod_success") {
                if (locked === true) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed({
                                description: "Mods Only is already on!",
                                color: client.config.embedColour
                            })
                        ]
                    });
                };

                db.set(`modOnly${message.guild.id}`, true);
                return message.reply({
                    embeds: [
                        new MessageEmbed({
                            description: 'Turned on modsonly! Only users with admin access in the server will be able to use the bot',
                            color: client.config.embedColour
                        })
                    ]
                }) && button.message.delete();
            };

            if (button.customId === "mod_cancel") {
                if (locked === true) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed({
                                description: "Mods Only is already off!",
                                color: client.config.embedColour
                            })
                        ]
                    });
                };
                
                db.delete(`modOnly${message.guild.id}`);
                return message.reply({
                    embeds: [
                        new MessageEmbed({
                            description: 'Turned Off modsonly! Everyone in the server will be able to use the bot',
                            color: client.config.embedColour
                        })
                    ]
                }) && button.message.delete();
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