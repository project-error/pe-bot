import { EmbedField, GuildMember, MessageEmbed, User } from 'discord.js';
import { Logger } from 'tslog';
import { discordCodeBlock } from './miscUtils';

interface IModLogEmbed {
  action: string;
  reason?: string;
  member: GuildMember;
  staffMember?: User;
  fields?: EmbedField[];
  logger: Logger;
}

interface IActionEmbed {
  action: string;
  reason: string;
  member: GuildMember;
  staffMember: User;
  logger: Logger;
  fields?: EmbedField[];
}

export const modActionEmbed = ({
  action,
  reason,
  member,
  staffMember,
  fields,
  logger,
}: IModLogEmbed): MessageEmbed => {
  const adminEventLog = logger.getChildLogger({
    prefix: ['[AdminLogEvent]'],
    name: 'AdminLog',
  });

  adminEventLog.debug(`${action} embed created`);

  const embed = new MessageEmbed()
    .setTimestamp()
    .setTitle(`${action.toUpperCase()} Event`)
    .setThumbnail(member.user.displayAvatarURL());

  if (member)
    embed.addFields([
      {
        name: 'User',
        value: discordCodeBlock(member.user.tag),
        inline: true,
      },
      {
        name: 'User ID',
        value: discordCodeBlock(member.user.id),
        inline: true,
      },
    ]);

  if (staffMember) embed.addField('Staff', discordCodeBlock(staffMember.tag));

  if (reason) embed.addField('Reason', discordCodeBlock(reason));

  if (fields) embed.addFields(fields);

  return embed;
};

export const actionMessageEmbed = ({
  action,
  reason,
  staffMember,
  member,
  logger,
  fields,
}: IActionEmbed): MessageEmbed => {
  const dmLog = logger.getChildLogger({
    name: 'ActionDM',
    prefix: ['[ActionDM]'],
  });

  dmLog.debug(`Sending action (${action}) DM to ${member.user.tag}`);

  const embed = new MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL())
    .setTitle('Received Mod Action')
    .setTimestamp()
    .setDescription('You have received a moderator action from the Project Error')
    .addFields([
      {
        name: 'Action',
        value: discordCodeBlock(action),
      },
      {
        name: 'Staff Member',
        value: discordCodeBlock(staffMember.tag),
      },
      {
        name: 'Reason',
        value: discordCodeBlock(reason),
      },
    ]);

  if (fields) embed.addFields(fields);

  return embed;
};
