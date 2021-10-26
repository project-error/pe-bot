import { GuildMember, Message, TextChannel } from 'discord.js';
import { Command, CommandHandler, Argument } from 'discord-akairo';
import { Logger } from 'tslog';
import { makeSimpleEmbed } from '../../utils';
import dayjs from 'dayjs';

interface IPurgeArgs {
  amount: number;
  member: GuildMember;
}

export default class PurgeCommand extends Command {
  private log: Logger;
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

    this.log = handler.client.log.getChildLogger({
      name: 'PurgeCmd',
      prefix: ['PurgeCmd'],
    });
  }
  public async exec(
    msg: Message,
    { amount, member }: IPurgeArgs
  ): Promise<Message | void> {
    // Execute if provide member arg
    if (member) {
      const fetchedMsgs = await msg.channel.messages.fetch({ limit: 100 });

      fetchedMsgs.delete(msg.id);

      const filteredMsgs = fetchedMsgs
        .filter(
          (m: Message) =>
            m.author.id === member.id &&
            m.createdTimestamp > dayjs().subtract(14, 'd').unix()
        )
        .array()
        .slice(0, amount);

      await (msg.channel as TextChannel).bulkDelete(filteredMsgs);

      const sentReply = await msg.channel.send(
        makeSimpleEmbed(`Purged ${filteredMsgs.length} messages`)
      );
      await sentReply.delete({ timeout: 5000 }).catch();

      return await msg.delete().catch();
    }
    const fetchedMsgs = await msg.channel.messages.fetch({ limit: 100 });

    fetchedMsgs.delete(msg.id);

    const filteredMsgs = fetchedMsgs
      .filter((m) => m.createdTimestamp > dayjs().subtract(14, 'd').unix())
      .array()
      .slice(0, amount);

    await (msg.channel as TextChannel).bulkDelete(filteredMsgs);

    const sentReply = await msg.channel.send(
      makeSimpleEmbed(`Purged ${filteredMsgs.length} messages`)
    );

    await sentReply.delete({ timeout: 5000 }).catch();

    return await msg.delete().catch();
  }
}
