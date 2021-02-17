import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { Command, CommandHandler } from 'discord-akairo';

export default class AvatarCommand extends Command {
  public constructor(handler: CommandHandler) {
    super('avatar', {
      aliases: ['avatar'],
      category: 'Fun',
      description: {
        content: 'Returns the profile picture of a given member in the size specified',
        usage: 'avatar [member] <size: xs, s, m, l, xl, xxl>.',
        examples: [
          'avatar @Taso#0001',
          'avatar @Taso#0001 lg',
          'avatar 188181246600282113 xs',
        ],
      },
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, please provide a member in to be able to return their avatar`,
            retry: (msg: Message) => `${msg.author}, invalid member, please try again.`,
          },
        },
        {
          id: 'size',
          type: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
          match: 'phrase',
          default: 'm',
          otherwise: (msg: Message) =>
            `${msg.author}, Invalid size entered, use \`${handler.prefix}help avatar\` for more info`,
        },
      ],
    });
  }

  public async exec(
    msg: Message,
    { member, size }: { member: GuildMember; size: string }
  ): Promise<Message> {
    const imageSize = size.toLocaleLowerCase();

    const avatarURL = AvatarCommand.getAvatar(member, imageSize);

    const embed = new MessageEmbed()
      .setAuthor(
        `Avatar Returned for ${member.user.tag}`,
        msg.member?.user.displayAvatarURL()
      )
      .setColor('DARK_GOLD')
      .setTimestamp()
      .setImage(avatarURL)
      .setDescription(`**Size:** \`${imageSize}\`\n**Direct URL: **\`${avatarURL}\``);

    return msg.channel.send(embed);
  }

  private static getAvatar(member: GuildMember, imageSize: string): string {
    let avatarURL: string;

    switch (imageSize) {
      case 'xs':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 128,
        });
        break;
      case 's':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 256,
        });
        break;
      case 'm':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 512,
        });
        break;
      case 'l':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 1024,
        });
        break;
      case 'xl':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 2048,
        });
        break;
      case 'xxl':
        avatarURL = member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 4096,
        });
        break;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return avatarURL;
  }
}
