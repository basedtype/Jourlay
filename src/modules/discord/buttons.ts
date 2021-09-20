import { MessageActionRow, MessageButton } from 'discord.js';

export class buttons {
    /**
     * 
     * @param label Title of button
     * @param style PRIMARY | SECONDARY | SUCCESS | DANGER | LINK
     * @param id custom ID
     */
    constructor(label: string, style: string, id: string) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(id)
                    .setLabel(label)
            );
        return row
    }
}