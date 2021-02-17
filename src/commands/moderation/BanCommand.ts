import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import {
  discordCodeBlock,
  actionMessageEmbed,
  modActionEmbed,
  makeErrorEmbed,
  makeSimpleEmbed,
} from '../../utils';

interface IBanAction {
  member: GuildMember;
  reason: string;
  duration: number | 'perma' | null;
}

export default class BanCommand extends Command {
  private readonly _logger: Logger;

  constructor(handler: CommandHandler) {
    super('ban', {
      channel: 'guild',
      aliases: ['ban'],
      description: {
        content: 'Ban a guild member',
        usage: 'ban <user> [reason]',
        examples: ['ban @Taso noob', 'ban 188181246600282113 noob'],
      },
      category: 'Moderation',
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (msg: Message) => `${msg.author}, provide a valid member to ban`,
            retry: (msg: Message) =>
              `${msg.author}, that member was not resolved. Please try again`,
          },
        },
        {
          id: 'reason',
          match: 'rest',
          default: 'No reason provided',
        },
      ],
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'BanCommand',
      prefix: ['[BanCommand]'],
    });
  }
  // TODO: Cleanup filth
  public async exec(
    msg: Message,
    { member, duration, reason }: IBanAction
  ): Promise<Message> {
    try {
      // if (duration === 'perma') {
      const [dmEmbed, logEmbed] = this._buildEmbeds(
        msg,
        member,
        reason,
        'Permanently Banned'
      );

      try {
        member.send(dmEmbed);
      } catch (e) {
        this._logger.error(`Unable to send DM to ${member.user.username}`);
      }
      await this._sendToModLog(logEmbed);

      await member.ban({
        days: 1,
        reason,
      });

      return msg.channel.send(
        makeSimpleEmbed(`**${member.user.tag}** was banned for **${reason}**`)
      );
      // }

      //   if (!duration) return msg.reply('Incorrect date format');
      //
      //   const unbanDate = dayjs().add(duration as number, 'ms');
      //
      //   const [dmEmbed, logEmbed] = this._buildEmbeds(
      //     msg,
      //     member,
      //     reason,
      //     unbanDate.format('MM/DD/YY')
      //   );
      //
      //   try {
      //     await member.send(dmEmbed);
      //   } catch (e) {
      //     this._logger.error(`Unable to send direct message to ${member.user.username}`);
      //   }
      //
      //   await this._sendToModLog(logEmbed);
      //
      //   await member.ban({
      //     days: 1,
      //     reason,
      //   });
      //
      //   return msg.channel.send(unbanDate.format('MM/DD/YY') || 'Perma');
    } catch (e) {
      this._logger.error(e);
      const errEmbed = makeErrorEmbed(e, false);
      return msg.channel.send(errEmbed);
    }
  }

  private async _sendToModLog(embed: MessageEmbed) {
    if (!process.env.ADMIN_LOG_CHANNEL_ID)
      throw new Error('ADMIN_LOG_CHANNEL_ID Env variable not defined');

    const channel = this.client.channels.cache.get(
      <string>process.env.ADMIN_LOG_CHANNEL_ID
    ) as TextChannel;
    try {
      await channel.send(embed);
    } catch (e) {
      this._logger.error(e);
    }
  }

  private _buildEmbeds(
    msg: Message,
    member: GuildMember,
    reason: string,
    unbanDate: string
  ): [MessageEmbed, MessageEmbed] {
    const dmEmbed = actionMessageEmbed({
      action: 'ban',
      staffMember: msg.author,
      logger: this._logger,
      member,
      reason,
      fields: [
        {
          name: 'Unban Date:',
          // value: `${discordCodeBlock(unbanDate.format('MM/DD/YY') || 'Perma')}`,
          value: `${discordCodeBlock(unbanDate)}`,
          inline: false,
        },
      ],
    });

    const logEmbed = modActionEmbed({
      action: 'ban',
      staffMember: msg.author,
      reason,
      member,
      logger: this._logger,
      fields: [
        {
          name: 'Unban Date:',
          value: `${discordCodeBlock(unbanDate)}`,
          inline: false,
        },
      ],
    });
    return [dmEmbed, logEmbed];
  }
}
