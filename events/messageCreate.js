const config = require("../config"),
    details = require('../package.json');

const { EmbedBuilder, Collection, PermissionsBitField, ButtonBuilder } = require("discord.js"),
    { QuickDB } = require("quick.db"),
    db = new QuickDB(),
    Timeout = new Collection(),
    ms = require("ms");

module.exports.run = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    let prefix = client.config.prefix;
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        let mention = new EmbedBuilder({
            description: `Hey, ${client.user.username} here!\n\nPrefix for this server is \`${prefix}\`\n${details.svdetails}\n${details.devDepend}`,
            color: config.embedColour
        });
        const link1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Github Repository")
            .setURL(details.gr)
            .setDisabled(false),

            row = new ActionRowBuilder()
                .addComponents(link1);

        let p1 = ["SEND_MESSAGES", "EMBED_LINKS"];
        if (!message.guild.members.me.permissionsIn(message.channel).has([PermissionsBitField.Flags.SendMessages | PermissionsBitField.Flags.EmbedLinks])) {
            return message.author.send({
                embeds: [
                    new EmbedBuilder({
                        description: `I need \`${p1.join(", ")}\` permissions in **\`${message.guild.name}\`**`,
                        color: client.config.embedColor,
                        thumbnail: message.guild.iconURL({ dynamic: true })
                    })
                ]
            }).catch(() => null);
        };
        return message.reply({ embeds: [mention] })
            .then(m => setTimeout(() => m.delete().catch(() => null), 10000));
    };

    // For user with prefix  
    // normal users
    const marvelMention = new RegExp(`^<@!?${client.user.id}>`),
        marvel = message.content.match(marvelMention) ? message.content.match(marvelMention)[0] : prefix;

    if (message.content.startsWith(marvel)) {
        try {
            const modOnly = await db.get(`modOnly${message.guild.id}`);
            if (!message.member)
                message.member = await message.guild.fetchMember(message);
            let m = message.content.toLowerCase(),
                args = message.content.slice(marvel.length).trim().split(/ +/g),
                arg = m.slice(marvel.length).trim().split(/ +/g),
                cmd = args.shift().toLowerCase();
            if (cmd.length === 0) return;
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.get(client.aliases.get(cmd));
            if (command) {

                let p1 = ["SEND_MESSAGES", "EMBED_LINKS"]
                if (!message.guild.members.me.permissionsIn(message.channel).has(p1)) {
                    return message.author.send({
                        embeds: [
                            new EmbedBuilder({
                                description: `I need \`${p1.join(", ")}\` permissions in ${message.guild.name}`,
                                color: client.config.embedColor,
                                thumbnail: message.guild.iconURL({ dynamic: true })
                            })
                        ]
                    }).catch(() => null);
                };

                let cooldown = 5000;
                if (Timeout.has(`cooldown${message.author.id}`)) {
                    return message.reply(
                        `You are on a \`${ms(
                            Timeout.get(`cooldown${message.author.id}`) - Date.now(),
                            { long: true }
                        )}\` cooldown.`
                    ).then((m) => setTimeout(() => m.delete().catch(() => null), 3000));
                };

                let r = false;
                if (!client.config.bowner.includes(message.member.id)) {
                    if (modOnly === true) {
                        if (!message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.Administrator)) {
                            return message.reply(
                                `${client.emoji.fail}| Bot is mod only in this guild that means you need \`ADMINISTRATOR\``
                            ).then((m) => setTimeout(() => m.delete().catch(() => null), 3000));
                        };
                    };

                    command.userPermissions.forEach((permission) => {
                        if (r === true) return;
                        if (!message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.permission)) {
                            r = true;
                            return message.reply(
                                `${client.emoji.fail}| YOU NEED **\`${client.bitfieldToName(permission)}\`** PERMISSION FIRST TO EXECUTE THIS COMMAND!!`
                            ).then((m) => setTimeout(() => m.delete().catch(() => null), 3000));
                        }
                    });
                };

                command.botPermissions.forEach((permission) => {
                    if (r === true) return;
                    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.permission)) {
                        r = true;
                        return message.reply(
                            `${client.emoji.fail}| I NEED **\`${client.bitfieldToName(permission)}\`** PERMISSION FIRST TO EXECUTE THIS COMMAND!!`
                        ).then((m) => setTimeout(() => m.delete().catch(() => null), 3000));
                    };
                });

                if (r === false) {
                    try {
                        await command.run(client, message, args, arg) &&
                            Timeout.set(`cooldown${message.author.id}`, Date.now() + cooldown) &&
                            setTimeout(() => {
                                Timeout.delete(`cooldown${message.author.id}`);
                            }, cooldown);
                    } catch (e) {
                        return client.errweb.send(`\`\`\`js\nCOMMAND : ${command.name}\n${e.stack}\n\`\`\``);
                    }
                };
            };
        } catch (e) {
            return client.errweb.send(`\`\`\`js\nmessageCreate.js : \n${e.stack}\n\`\`\``);
        };
    };
};