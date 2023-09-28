const discord = require("discord.js"),
    { MessageButton, MessageActionRow } = require('discord.js'),
    db = require(`quick.db`);

module.exports = {
    name: "unblock",
    //  aliases: ["accountc", "acreate"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "acreate `tag_here`",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {
        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!");
        }
        if (!args[0]) {
            return message.reply("You forgot to mention the tag");
        }

        let tag_use = db.get(args[0]),
            tag_block = db.get(`block${args[0]}`);

        if (tag_use !== true) {
            return message.reply("This Tag Is Not In Use");
        };
        if (tag_block === false) {
            return message.reply(`This user is not blocked`);
        };

        const button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("YES")
            .setCustomId("unblock_success")
            .setDisabled(false),
            button1 = new MessageButton()
                .setStyle("DANGER")
                .setLabel("NO")
                .setCustomId("unblock_cancel")
                .setDisabled(false),
            row = new MessageActionRow()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to block ${args[0]} !`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            };

            if (button.customId === "unblock_success") {

                // database update
                db.delete(`block${args[0]}`);
                let acc_user = db.get(`acc_user${args[0]}`);
                let owner = await message.guild.members.fetch(acc_user);
                let log = client.channels.cache.get(client.config.accountlog);
                log.send({
                    embeds: [
                        new discord.MessageEmbed({
                            description: `Account Unblocked ${args[0]} By <@${message.author}> - \`${message.author.tag}\` which is owned by <@${owner}> - \`${owner.user.tag}\``,
                            color: client.config.embedColour
                        })
                    ]
                });

                return message.reply({ content: `Account Unblocked ${args[0]}` }) &&
                    setTimeout(() => button.message.delete().catch(() => null), 100);
            };

            if (button.customId === 'unblock_cancel') {
                return button.message.delete() && message.delete();
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
