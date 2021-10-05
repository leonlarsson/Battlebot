const moment = require("moment");
const HumanizeDuration = require("humanize-duration");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    permissions: ["BAN_MEMBERS"],
    public: true,
    enabled: true,
    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");

        let userInfoEmbed;
        if (!member) {

            userInfoEmbed = new MessageEmbed()
                .setAuthor(`User: ${user.tag}`, user.displayAvatarURL({ dynamic: true }))
                .addField("User information (User not on server)", `
Bot: **${user.bot ? "Yes" : "No"}** | System: **${user.system ? "Yes" : "No"}**
Name: **${user.tag}** (<@${user.id}>)
ID: \`${user.id}\`
Created **${HumanizeDuration(new Date() - user.createdTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${moment.utc(user.createdTimestamp).format("D MMM Y, hh:mm UTC")}\`)
Flags: \`${user.flags.toArray().join("`, `") || "None"}\`
`)

        } else {

            userInfoEmbed = new MessageEmbed()
                .setAuthor(`User: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                .addField("User information", `
Bot: **${member.user.bot ? "Yes" : "No"}** | System: **${member.user.system ? "Yes" : "No"}**
Name: **${member.user.tag}** (<@${member.user.id}>)
ID: \`${member.user.id}\`
Created **${HumanizeDuration(new Date() - member.user.createdTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${moment.utc(member.user.createdTimestamp).format("D MMM Y, hh:mm UTC")}\`)
Flags: \`${member.user.flags.toArray().join("`, `") || "None"}\`
\u200B`)
                .addField("Member information", `
Nickname: ${member.nickname ? `**${member.nickname}**` : "`No nickname set`"}
Joined: **${HumanizeDuration(new Date() - member.joinedTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${moment.utc(member.user.joinedTimestamp).format("D MMM Y, hh:mm UTC")}\`)
Roles: ${member.roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(", ") || "`None`"}
Current voice: ${member.voice.channelId ? `<#${member.voice.channelId}>
    > Server deaf: ${member.voice.serverDeaf ? "`Yes`" : "`No`"} | Server mute: ${member.voice.serverMute ? "`Yes`" : "`No`"}
    > Self deaf: ${member.voice.selfDeaf ? "`Yes`" : "`No`"} | Self mute: ${member.voice.selfMute ? "`Yes`" : "`No`"}` : "`None`"}
`)
        }

        interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });

    }
};