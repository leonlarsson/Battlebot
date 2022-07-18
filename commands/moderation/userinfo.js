import { PermissionFlagsBits } from "discord.js";
import HumanizeDuration from "humanize-duration";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
dayjs.extend(utc);

export const name = "userinfo";
export const permissions = PermissionFlagsBits.ManageMessages;
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    const member = interaction.options.getMember("user");
    const user = interaction.options.getUser("user");

    let userInfoEmbed;
    if (!member) {

        userInfoEmbed = {
            author: { name: `User: ${user.tag}`, iconURL: user.displayAvatarURL() },
            fields: [
                { name: "User information (User not on server)", value: `Bot: **${user.bot ? "Yes" : "No"}** | System: **${user.system ? "Yes" : "No"}**\nName: **${user.tag}** (<@${user.id}>)\nID: \`${user.id}\`\nCreated **${HumanizeDuration(new Date() - user.createdTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${dayjs.utc(user.createdTimestamp).format("D MMM YYYY, HH:mm UTC")}\`)\nFlags: \`${user.flags.toArray().join("`, `") || "None"}\`` }
            ]
        };

    } else {
        userInfoEmbed = {
            author: { name: `User: ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) },
            fields: [
                { name: "User information", value: `\nBot: **${member.user.bot ? "Yes" : "No"}** | System: **${member.user.system ? "Yes" : "No"}**\nName: **${member.user.tag}** (<@${member.user.id}>)\nID: \`${member.user.id}\`\nCreated **${HumanizeDuration(new Date() - member.user.createdTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${dayjs.utc(member.user.createdTimestamp).format("D MMM YYYY, HH:mm UTC")}\`)\nFlags: \`${member.user.flags.toArray().join("`, `") || "None"}\`\n\u200B` },
                {
                    name: "Member information", value: `\nNickname: ${member.nickname ? `**${member.nickname}**` : "`No nickname set`"}\nJoined: **${HumanizeDuration(new Date() - member.joinedTimestamp, { units: ["y", "mo", "d"], round: true })} ago** (\`${dayjs.utc(member.user.joinedTimestamp).format("D MMM YYYY, HH:mm UTC")}\`)\nRoles: ${member.roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(", ") || "`None`"}\nCurrent voice: ${member.voice.channelId ? `<#${member.voice.channelId}>\n> Server deaf: ${member.voice.serverDeaf ? "`Yes`" : "`No`"} | Server mute: ${member.voice.serverMute ? "`Yes`" : "`No`"}\n> Self deaf: ${member.voice.selfDeaf ? "`Yes`" : "`No`"} | Self mute: ${member.voice.selfMute ? "`Yes`" : "`No`"}` : "`None`"}
` }
            ]
        };
    }

    interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });

}