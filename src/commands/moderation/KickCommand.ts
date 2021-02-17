import { Command, CommandHandler } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { Logger } from 'tslog';
import { actionMessageEmbed, modActionEmbed } from '../../utils/moderationUtils';
import { makeErrorEmbed, makeSimpleEmbed } from '../../utils';

export default class KickCommand extends Command {
  private readonly _logger: Logger;

  constructor(handler: CommandHandler) {
    super('kick', {
      aliases: ['boot', 'kick'],
      category: 'Moderation',
      description: {
        content: 'Kick a member',
        usage: 'kick [member] <reason>',
        examples: ['kick @Taso disruptive', 'kick 188181246600282113 Bad coder'],
      },
      userPermissions: ['KICK_MEMBERS'],
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (msg: Message) => `${msg.author}, provide a valid member to kick`,
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
      name: 'KickCommand',
    });
  }

  public async exec(
    msg: Message,
    { member, reason }: { member: GuildMember; reason: string }
  ): Promise<Message> {
    // TODO: Hierachal permission structure
    // eslint-disable-next-line
    const msgAuthor = await msg.guild!.members.fetch(msg.author.id);

    if (member.roles.highest.position >= msgAuthor.roles.highest.position)
      return KickCommand._sendErrorMessage(
        msg,
        'This was not allowed due to role hierachy'
      );

    try {
      // const infractionsRepo: Repository<Infractions> = this.client.db.getRepository(
      //   Infractions
      // );
      //
      // await infractionsRepo.insert({
      //   user: member.id,
      //   staffMember: msg.author.id,
      //   reason: reason,
      //   infractionType: 'kick',
      // });

      this._logger.debug(`Member resolved: ${member.id}`);

      const modEmbed = modActionEmbed({
        member: member,
        staffMember: msg.author,
        action: 'kick',
        reason,
        logger: this._logger,
      });

      await this._sendToModLog(modEmbed);

      const dmEmbed = actionMessageEmbed({
        action: 'kick',
        reason,
        logger: this._logger,
        member: member,
        staffMember: msg.author,
      });

      try {
        // Send DM before kick
        await member.send(dmEmbed);
        await member.kick(reason);
      } catch (e) {
        this._logger.error(
          `Could not send direct message to ${member.user.tag} or could not kick`
        );
      }

      return msg.channel.send(
        makeSimpleEmbed(`**${member.user.tag}** was kicked for \`${reason}\``)
      );
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

  private static async _sendErrorMessage(msg: Message, reason: string): Promise<Message> {
    return msg.channel.send(makeSimpleEmbed(`**Error:** \`${reason}\``));
  }
}
