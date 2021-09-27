import { MessageActionRow, MessageButton } from 'discord.js';
import * as ds from 'discord.js';

export class buttons {
    /**
     * Create simple button
     */
    public static createButton(label: string, style: ds.MessageButtonStyleResolvable, id: string): MessageActionRow {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(id)
                    .setLabel(label)
                    .setStyle(style)
            );
        return row
    }

    /**
     * Create simple button
     */
    public static createURLButton(label: string, style: ds.MessageButtonStyleResolvable, url: string): MessageActionRow {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(label)
                    .setStyle(style)
                    .setURL(url)
            );
        return row
    }
}