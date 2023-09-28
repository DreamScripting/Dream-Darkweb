const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

module.exports = {
    name: "help",
    // aliases: ["create"],
    description: "shows the help menu of the bot",
    category: "help",
    usage: "help",
    botPermissions: ["EMBED_LINKS"],
    userPermissions: [],

    async run(client, message, args) {

        setTimeout(() => message.delete().catch(() => null), 5000);

        let embed = new MessageEmbed()
            .setTitle(`${client.user.username} Help Menu`);

        if (message.member.roles.cache.get(client.config.adminrole)) {
            embed.addField(
                "Admin Commands",
                client.config.prefix + "block `user_tag` : to block a user form using dark web\n" +
                client.config.prefix + "unblock `user_tag` : to unblock so he/she can use darkweb\n" +
                client.config.prefix + "warn `user_tag` : to send user a warning\n" +
                client.config.prefix + "modsonly : No one will be able to use darkweb excepts admins if turned on\n" +
                client.config.prefix + "clearwarn `user_tag` : To clear warnings of a user"
            )
                .addField(
                    "Switch Commands",
                    client.config.prefix + "lock : To lock the darkweb\n" +
                    client.config.prefix + "unlock : To unlock the darkweb"
                );
        };

        embed.addField(
            'User Commands',
            client.config.prefix + "create `tag_here` : Create darkweb account using this command\n" +
            client.config.prefix + "delete `tag_here` : Delete darkweb account using this command"
        )
            .setFooter({
                text: 'DM ME TO SEND POST ON DARK WEB | Powered by : kool_damon',
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        return message.reply({ embeds: [embed] })
            .then(m => setTimeout(() => m.delete().catch(() => null), 15000));
    },
};