import { Command, Listener, ListenerHandler } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { Logger } from 'tslog';
import { modActionEmbed } from '../../utils/moderationUtils';
import { discordCodeBlock } from '../../utils/miscUtils';

export default class MissingPermListener extends Listener {
  private readonly _logger: Logger;
  constructor(handler: ListenerHandler) {
    super('MissingPerm', {
      event: 'missingPermissions',
      emitter: 'commandHandler',
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'MissingPerm',
      prefix: ['[MissingPerm]'],
    });
  }

  public async exec(
    msg: Message,
    cmd: Command,
    type: string,
    perm: unknown
  ): Promise<Message> {
    this._logger.debug(`Missing permission event fired by ${msg.author} for ${perm}`);

    const embed = modActionEmbed({
      action: 'Failed Permissions',
      logger: this._logger,
      member: <GuildMember>msg.guild?.member(msg.author),
      fields: [
        {
          name: 'Command',
          value: `${discordCodeBlock(msg.content)}`,
          inline: false,
        },
      ],
    });

    await this._sendToModLog(embed);

    return msg.channel.send(
      `**Missing Permission**: You do not have the correct permissions for **${cmd}**`
    );
  }

  private async _sendToModLog(embed: MessageEmbed) {
    if (!process.env.ADMIN_LOG_CHANNEL_ID)
      throw new Error('LOG_CHANNEL Env variable not defined');

    const channel = this.client.channels.cache.get(
      <string>process.env.ADMIN_LOG_CHANNEL_ID
    ) as TextChannel;
    return await channel.send(embed);
  }
}
