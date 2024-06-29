const { QuickDB } = require("quick.db"),
    db = new QuickDB(),
    { ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = function (client, options) {
    const description = {
        name: "DM Functions",
        filename: "dmFunction.js",
        version: "1.0",
    };
    console.log(
        ` :: ⬜️ Loaded Extra Event : ${description.name} from ("${description.filename}")`.bgMagenta
    );


    client.on("messageCreate", async (message) => { // main message data

        // if message author is a bot user acction will be null
        if (message.author.bot) return;

        // if message is recieved in the dm then trigger this event
        if (!message.guild && message.author.id !== client.user.id) {

            // loading all necassory data
            const server = client.guilds.cache.get(config.serverid);
            const logChannel = client.channels.cache.get(config.logChannel);
            const darkwebChannel = client.channels.cache.get(config.darkwebChannel);
            const darkwebRole = server.roles.cache.get(config.darkwebRole);
            const syndicate = server.roles.cache.get(config.syndicate);
            const racers = server.roles.cache.get(config.racers);

            let embed = new EmbedBuilder();

            await server.members.fetch(); // caching all members for the bot to fetch all members.

            const serverUser = server.members.cache.get(message.author.id);
            // to check if user is in the server 
            if (!serverUser) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder({
                            description: "You are not in server server!",
                            color: client.config.embedColor,
                        })
                    ]
                })
            };

            // to check if user have access to dark web
            if (!serverUser.roles.cache.has(darkwebRole.id)) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder({
                            description: "You don't have access to server DARK WEB!",
                            color: client.config.embedColor,
                        })
                    ]
                })
            };

            // checking if the bot is in locked phase or not 
            let locked = await db.get('locked');

            if (locked === true) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder({
                            description: "Darkweb is currently locked for everyone by GODFATHER!",
                            color: client.config.embedColor,
                        })
                    ]
                })
            };

            // function for the godfather message and normal user message to make a difference
            if (!serverUser.roles.cache.has(syndicate.id) || !serverUser.roles.cache.has(racers.id)) {
                var sign = await db.get(`anon_code${message.author.id}`);
                let blocked = await db.get(`block${sign}`);

                // checking if the user is blocked or not!!!
                if (blocked === true) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder({
                                description: "You have been blocked by the GODFATHER from using darkweb",
                                color: client.config.embedColor,
                            })
                        ]
                    })
                };

                // checking if the user have any tag registered or not
                if (!sign) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder({
                                description: "You don't have a tag registered go to the server and use create command to get yourself a tag.",
                                color: client.config.embedColor,
                            })
                        ]
                    })
                };

                // adding the content of the message in the embed
                var content = `${message.content}`;
                embed.setAuthor({
                    name: 'DarkWeb',
                    iconURL: 'https://cdn.discordapp.com/attachments/993893179319386223/1006640228901077173/unknown_7.png'
                })
            } else {
                var content = message.content;
            }

            let nest = await db.get("nest");

            // here are the log channels fetch and embed builder
            let dwchannel = darkwebChannel,
                log = logChannel;
            embed.setColor(config.embedColour)
                .setTimestamp()
                // .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter({ text: nest, iconURL: server.iconURL({ dynamic: true }) });

            if (!serverUser.roles.cache.has(syndicate.id)) {
                if (message.content) {
                    embed.setDescription(`${content}`);
                };
            } else {
                if (message.content) {
                    embed.setDescription(`${content}`);
                };
            }

            if (message.attachments.first()) {
                embed.setImage(message.attachments.first().proxyURL);
            };

            Timeout.set(`cooldown${message.author.id}`, Date.now() + config.cooldown) &&
                setTimeout(() => {
                    Timeout.delete(`cooldown${message.author.id}`);
                }, config.cooldown);

            // if (Timeout.has(`cooldown${message.author.id}`)) {
            //     return message.reply({
            //         embeds: [
            //             new EmbedBuilder({
            //                 description: `You are on a \`${ms(Timeout.get(`cooldown${message.author.id}`) - Date.now(), { long: true })}\` cooldown.`,
            //                 color: config.embedColour
            //             })
            //         ]
            //     }).then((m) => setTimeout(() => m.delete().catch(() => null), 3000));
            // };

            const button = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("Send Post")
                .setCustomId("send_post")
                .setDisabled(false),
                button1 = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Cancel Post")
                    .setCustomId("cancel_post")
                    .setDisabled(false),
                button2 = new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Send Post @Everyone")
                    .setCustomId("send_post_")
                    .setDisabled(false),
                button3 = new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Send Post @Everyone #MIDNIGHT")
                    .setCustomId("send_post_2")
                    .setDisabled(false),
                button4 = new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Send Post Normally #MIDNIGHT")
                    .setCustomId("send_post_3")
                    .setDisabled(false),
                row = new ActionRowBuilder()
                    .addComponents(button, button1);

            if (serverUser.roles.cache.has(syndicate.id)) {
                row.addComponents(button2);
            };

            if (serverUser.roles.cache.has(racers.id)) {
                row.addComponents(button3);
                row.addComponents(button4);
            };

            let msg = await message.author.send({ embeds: [embed], components: [row] }),
                collector = msg.createMessageComponentCollector({ time: 30000 });

            collector.on("collect", async (button) => {
                if (button.customId === "send_post_") {
                    godfather.send({ embeds: [embed], content: "@everyone" }) &&
                        message.reply({ content: "Sent Your Post Successfully!" }) &&
                        button.message.delete();
                };
                if (button.customId === "send_post_2") {
                    midnight.send({ embeds: [embed], content: "@everyone" }) &&
                        message.reply({ content: "Sent Your Post Successfully!" }) &&
                        button.message.delete();
                };
                if (button.customId === "send_post_3") {
                    midnight.send({ embeds: [embed] }) &&
                        message.reply({ content: "Sent Your Post Successfully!" }) &&
                        button.message.delete();
                };
                if (button.customId === "send_post") {
                    if (!serverUser.roles.cache.has(syndicate.id) || !serverUser.roles.cache.has(racers.id)) {
                        // dwchannel.send({ embeds: [embed] });
                        try {
                            try {
                                let wh = await dwchannel.fetchWebhooks(),
                                    webhook = wh.find(wh => wh.token);
                                webhook.send({
                                    username: `Anon ${sign}`,
                                    avatarURL: config.dwpic,
                                    embeds: [embed]
                                });
                            } catch (e) {
                                dwchannel.createWebhook(client.user.username, {
                                    avatar: client.user.displayAvatarURL(),
                                }).then(webhook => {
                                    webhook.send({
                                        username: `Anon ${sign}`,
                                        avatarURL: config.dwpic,
                                        embeds: [embed]
                                    });
                                });
                            };
                        } catch (e) {
                            message.reply({
                                embeds: [
                                    new EmbedBuilder({
                                        color: config.embedColour,
                                        description: `\`\`\`js\n${e.stack}!\`\`\``
                                    })
                                ]
                            })
                        }
                    } else if (serverUser.roles.cache.has(syndicate.id)) {
                        godfather.send({ embeds: [embed] });
                    }
                    let nest = await db.get("nest");

                    embed.addFields({
                        name: `Posted By - **__${sign}__**`,
                        value: `${message.author}\n\`${message.author.tag}\`\n${message.author.id}`,
                        inline: true
                    })
                        .setFooter({
                            text: nest, iconURL: server.iconURL({ dynamic: true })
                        })
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                    return log.send({ embeds: [embed] }) &&
                        message.reply({ content: "Sent Your Post Successfully!" }) &&
                        button.message.delete();
                } else if (button.customId === "cancel_post") {
                    return message.author.send({ content: "Post Cancelled!" }) && button.message.delete();
                };
            });

            collector.on("end", (_, reason) => {
                if (reason !== "messageDelete") {
                    return message.author.send({ content: "Post Cancelled **`[Timed Out]`**" }) && msg.delete();
                };
            });
        };
    });
}