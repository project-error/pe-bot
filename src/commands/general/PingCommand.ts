import { Message, MessageEmbed } from 'discord.js';
import { Command, CommandHandler } from 'discord-akairo';
import dayjs from 'dayjs';
import { discordCodeBlock } from '../../utils/miscUtils';
import { Logger } from 'tslog';

export default class PingCommand extends Command {
  private readonly _logger: Logger;
  constructor(handler: CommandHandler) {
    super('ping', {
      aliases: ['ping'],
      description: {
        content: "Return Bot's latency info",
        usage: 'ping',
      },
      category: 'General',
      args: [
        {
          id: 'keepData',
          flag: 'keep',
        },
      ],
      channel: 'guild',
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'PingCmd',
      prefix: ['[PingCmd]'],
    });
  }

  public async exec(msg: Message): Promise<Message | undefined> {
    try {
      const pingEmbed = new MessageEmbed()
        .setColor('#ff8f00')
        .setAuthor('Bot Latency Info')
        .setTimestamp()
        .setFooter(msg.author.tag, msg.author.displayAvatarURL());

      const sentMsg = await msg.util?.send(pingEmbed);

      const diffTime = dayjs(sentMsg?.createdAt).diff(msg.createdAt, 'ms');

      pingEmbed.addFields([
        {
          inline: true,
          name: 'RTT:',
          value: discordCodeBlock(diffTime + 'ms'),
        },
        {
          inline: true,
          name: 'HeartBeat:',
          value: discordCodeBlock(Math.round(this.client.ws.ping) + 'ms'),
        },
      ]);

      return msg.util?.send(pingEmbed);
    } catch (e) {
      this._logger.error(e);
      return msg.channel.send('');
    }
  }
}
