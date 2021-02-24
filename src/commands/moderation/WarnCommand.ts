import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message, MessageEmbed } from 'discord.js';
import { GuildMember } from 'discord.js';
import { getWarnsRepo } from '../../db/repository/WarningsRepo'
import { actionMessageEmbed, makeErrorEmbed, makeSimpleEmbed, modActionEmbed } from '../../utils';
import { TextChannel } from 'discord.js';

export default class WarnCommand extends Command {
    private readonly _logger: Logger;
    constructor(handler: CommandHandler) {
        super('warn', {
            channel: 'guild',
            aliases: ['warn'],
            description: {
              content: 'Warn a guild member',
              usage: 'warn <user> [reason]',
              examples: ['warn @Taso noob', 'warn 188181246600282113 noob'],
            },
            category: 'Moderation',
            userPermissions: ['KICK_MEMBERS'],
            args: [
                {
                id: 'member',
                type: 'member',
                prompt: {
                  start: (msg: Message) => `${msg.author}, provide a valid member to warn`,
                  retry: (msg: Message) =>
                    `${msg.author}, that member was not resolved. Please try again`,
                },
              },
              {
                id: 'reason',
                match: 'rest',
                default: 'No reason provided',
              }
            ]
        })
        this._logger = handler.client.log.getChildLogger({
            name: 'WarnCommand',
            prefix: ['[WarnCommand]'],
          });
    }
    async exec(msg: Message, {member, reason}: {member: GuildMember, reason: string}) {
        const msgAuthor = await msg.guild!.members.fetch(msg.author.id);

        if (member.roles.highest.position >= msgAuthor.roles.highest.position)
          return WarnCommand._sendErrorMessage(
            msg,
            'This was not allowed due to role hierachy'
          );

          if(member.id === msg.author.id)
            return WarnCommand._sendErrorMessage(msg, 'You cannot warn yourself.')

        try {
            const warnsRepo = getWarnsRepo(this.client.db);
            warnsRepo.createNewWarning({
                reason: reason,
                userId: member.id,
                modId: msg.author.id
            })
            const [dmEmbed, modEmbed] = this._buildEmbeds(
                msg,
                member,
                reason,
                'User Warned'
              );
              try {
                member.send(dmEmbed);
              } catch (e) {
                this._logger.error(`Unable to send DM to ${member.user.username}`);
              }
              msg.channel.send(makeSimpleEmbed(`**User Warned:** \`${member.user.username} \n Reason: ${reason}\``))
            this._sendToModLog(modEmbed)
        } catch(e) {
            msg.channel.send(makeErrorEmbed(e));
            this._logger.error(e)
        }
    }
    private static async _sendErrorMessage(msg: Message, reason: string): Promise<Message> {
        return msg.channel.send(makeSimpleEmbed(`**Error:** \`${reason}\``));
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
          action: 'warn',
          staffMember: msg.author,
          logger: this._logger,
          member,
          reason
        });
    
        const logEmbed = modActionEmbed({
          action: 'warn',
          staffMember: msg.author,
          reason,
          member,
          logger: this._logger,
        });
        return [dmEmbed, logEmbed];
      }
}