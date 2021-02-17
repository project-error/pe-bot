import { Listener, ListenerHandler } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { Logger } from 'tslog';
import { discordCodeBlock } from '../../utils/miscUtils';

export default class MessageDeleteListener extends Listener {
  private _logger: Logger;

  public constructor(handler: ListenerHandler) {
    super('messageDelete', {
      event: 'messageDelete',
      emitter: 'client',
      category: 'client',
    });
    this._logger = handler.client.log.getChildLogger({
      name: 'MessageDeleteLog',
    });
  }

  public async exec(msg: Message): Promise<Message | void> {
    if (msg.partial || msg.author.bot || msg.author.id === this.client.user?.id) return;

    this._logger.info(
      `Delete Event: ${msg.author.tag} (${msg.author.id}), Content: ${msg.content}, Channel: ${msg.channel}`
    );

    const embed = MessageDeleteListener._createMessageEmbed(msg);
    return await this._sendToChannel(embed);
  }

  private static _createMessageEmbed(msg: Message): MessageEmbed {
    return new MessageEmbed()
      .setTimestamp()
      .setTitle('Deletion Event Occured')
      .setThumbnail(msg.author.displayAvatarURL())
      .addFields([
        {
          name: 'Author Tag',
          value: msg.author.tag,
          inline: true,
        },
        {
          name: 'Author ID',
          value: msg.author.id,
          inline: true,
        },
        {
          name: 'Message Contents',
          value: discordCodeBlock(msg.content),
        },
        {
          name: 'Channel',
          value: msg.channel,
        },
      ]);
  }

  private async _sendToChannel(embed: MessageEmbed) {
    if (!process.env.LOG_CHANNEL_ID)
      throw new Error('LOG_CHANNEL_ID Env variable not defined');

    const channel = this.client.channels.cache.get(
      <string>process.env.LOG_CHANNEL_ID
    ) as TextChannel;
    try {
      await channel.send(embed);
    } catch (e) {
      this._logger.error(e);
    }
  }
}
