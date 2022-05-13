// eslint-disable-next-line no-unused-vars
import { ModalSubmitInteraction, Modal, MessageActionRow, TextInputComponent } from "discord.js";
import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "portal_post";
export const allowed_channels = ["908101543646089236"];
export const wrong_channel_message = "This is only available in <#908101543646089236>";
export const cooldown = 43_200_000; // ms: 12 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    // Build the text inputs
    const portalExperienceCodeInput = new TextInputComponent()
        .setCustomId("portalExperienceCodeInput")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(10)
        .setStyle("SHORT")
        .setLabel("Experience Code:")
        .setPlaceholder("AATCVC");

    const portalNameInput = new TextInputComponent()
        .setCustomId("portalNameInput")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(100)
        .setStyle("SHORT")
        .setLabel("Experience Name:")
        .setPlaceholder("Mozzy's 24/7 Nosehair Canals TDM");

    const portalDescriptionInput = new TextInputComponent()
        .setCustomId("portalDescriptionInput")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(400)
        .setStyle("PARAGRAPH")
        .setLabel("Experience Description (NO LINEBREAKS):")
        .setPlaceholder("This is an absolutely amazing experience. No linebreaks allowed.");

    // Create action rows
    const portalModalActionRow1 = new MessageActionRow().addComponents(portalExperienceCodeInput);
    const portalModalActionRow2 = new MessageActionRow().addComponents(portalNameInput);
    const portalModalActionRow3 = new MessageActionRow().addComponents(portalDescriptionInput);

    // Build modal
    const portalModal = new Modal()
        .setCustomId("portalModal")
        .setTitle("Share Your Portal Experience")
        .addComponents(portalModalActionRow1, portalModalActionRow2, portalModalActionRow3);

    // Show modal
    interaction.showModal(portalModal);
}

/**
 * Handles the Portal modal submission.
 * @param {ModalSubmitInteraction} interaction The modal submit interaction.
 */
export const handlePortalModal = async interaction => {

    // Removing embeds on links and censor invite links
    const experienceCode = cleanMessage(interaction.fields.getTextInputValue("portalExperienceCodeInput"));
    const experienceName = cleanMessage(interaction.fields.getTextInputValue("portalNameInput"));
    const experienceDescription = cleanMessage(interaction.fields.getTextInputValue("portalDescriptionInput"));

    // Check newlines, and inform the user if there are newlines
    if (experienceName.includes("\n") || experienceCode.includes("\n") || experienceDescription.includes("\n"))
        return interaction.reply({ content: `Your message cannot contain any linebreaks.\n\n**Experience Code**: ${interaction.fields.getTextInputValue("portalExperienceCodeInput")}\n**Name**: ${interaction.fields.getTextInputValue("portalNameInput")}\n**Description**: ${interaction.fields.getTextInputValue("portalDescriptionInput")}`, ephemeral: true });

    const msg = await interaction.reply({ content: `*Portal Experience sharing post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Experience Code**: ${experienceCode}\n**Experience Name**: ${experienceName}\n**Experience Description**: ${experienceDescription}`, allowedMentions: { users: [interaction.user.id] }, fetchReply: true });

    // Currently set to "<:UpVote:718281782813786154>" on BFD
    const reaction = interaction.guild.emojis.cache.get("718281782813786154");
    if (reaction) msg.react(reaction);

    msg.startThread({
        name: experienceName,
        autoArchiveDuration: 1440,
        reason: "Auto-created thread for Portal Experience sharing post."
    });

    updateOrAddCooldown(interaction, { name, cooldown });
};