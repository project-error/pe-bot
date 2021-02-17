import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandHandler, Argument } from 'discord-akairo';
import { Logger } from 'tslog';
import { makeErrorEmbed, makeSimpleEmbed, modActionEmbed } from '../../utils';

interface IPurgeArgs {
  amount: number;
  member: GuildMember;
}

export default class PurgeCommand extends Command {
  private _logger: Logger;
  public constructor(handler: CommandHandler) {
    super('purge', {
      aliases: ['purge', 'delete', 'clear'],
      description: {
        content:
          'Deletes a specific number of messages, optionally from a specific member.',
        usage: 'purge <amount> [member]',
        examples: ['purge 42', 'purge 42 @Spammer#1337'],
      },
      category: 'Moderation',
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      channel: 'guild',
      args: [
        {
          id: 'amount',
          type: Argument.range('number', 1, 101),
          prompt: {
            start: (message: Message): string =>
              `${message.author}, how many message would you like to delete?`,
            retry: (message: Message): string =>
              `${message.author}, Please enter a number within 1-100`,
            retries: 2,
          },
        },
        {
          id: 'member',
          type: 'member',
          match: 'phrase',
          default: null,
        },
      ],
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'PurgeCmd',
      prefix: ['PurgeCmd'],
    });
  }
  public async exec(
    msg: Message,
    { amount, member }: IPurgeArgs
  ): Promise<Message | void> {
    try {
      // Execute if provide member arg
      if (member) {
        const fetchedMsg = await msg.channel.messages.fetch({ limit: 100 });
        const filteredMsgs = fetchedMsg
          .filter(
            (m: Message) =>
              m.author.id === member.id && Date.now() - m.createdTimestamp < 1209600000
          )
          .array()
          .slice(0, amount);
        await (msg.channel as TextChannel).bulkDelete(filteredMsgs);
        // No member arg
      } else {
        const fetchedMsg = await msg.channel.messages.fetch({ limit: 100 });
        const filteredMsg = fetchedMsg.array().slice(0, amount);
        await (msg.channel as TextChannel).bulkDelete(filteredMsg);
        return msg.channel.send(makeSimpleEmbed(`Purged ${fetchedMsg.size} messages`));
      }
    } catch (e) {
      this._logger.error(e);
      return msg.channel.send(makeErrorEmbed(e));
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
}
