import { Listener, ListenerHandler } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { Logger } from 'tslog';
import { discordCodeBlock } from '../../utils/miscUtils';

export default class MessageDeleteListener extends Listener {
  private _logger: Logger;

  public constructor(handler: ListenerHandler) {
    super('messageUpdate', {
      event: 'messageUpdate',
      emitter: 'client',
      category: 'client',
    });
    this._logger = handler.client.log.getChildLogger({
      name: 'messageUpdate',
    });
  }

  public async exec(oldMsg: Message, newMsg: Message): Promise<Message | void> {
    if (newMsg.partial || newMsg.author.bot || newMsg.author.id === this.client.user?.id)
      return;

    this._logger.info(
      `Edit Event: ${oldMsg.author.tag} (${oldMsg.author.id}), Original: ${oldMsg.content}, New: ${newMsg.content}, Channel: ${oldMsg.channel}`
    );

    const embed = MessageDeleteListener._createMessageEmbed(oldMsg, newMsg);
    return await this._sendToChannel(embed);
  }

  private static _createMessageEmbed(oldMsg: Message, newMsg: Message): MessageEmbed {
    return new MessageEmbed()
      .setTimestamp()
      .setTitle('Edit Event Occured')
      .setThumbnail(oldMsg.author.displayAvatarURL())
      .addFields([
        {
          name: 'Author Tag',
          value: oldMsg.author.tag,
          inline: true,
        },
        {
          name: 'Author ID',
          value: oldMsg.author.id,
          inline: true,
        },
        {
          name: 'Original Contents',
          value: discordCodeBlock(oldMsg.content),
        },
        {
          name: 'New Contents',
          value: discordCodeBlock(newMsg.content),
        },
        {
          name: 'Channel',
          value: oldMsg.channel,
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
