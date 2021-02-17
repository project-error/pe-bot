import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { RULES } from '../../config';
import { makeErrorEmbed } from '../../utils/miscUtils';

export default class SetupCommand extends Command {
  private _logger: Logger;
  constructor(handler: CommandHandler) {
    super('setup', {
      aliases: ['setup'],
      category: 'Moderation',
      description: {
        content: 'Setup Server',
        usage: 'setup [type]',
        examples: ['setup rules', 'setup role'],
      },
      userPermissions: ['KICK_MEMBERS'],
      channel: 'guild',
      args: [
        {
          id: 'type',
          type: ['rules', 'role'],
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, Please select a valid option for the \`setup\` command (\`rules\`, \`role\`)`,
            retry: (msg: Message) =>
              `${msg.author}, Please select a valid option for the \`setup\` command (\`rules\`, \`role\`)`,
          },
        },
      ],
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'SetupCmd',
      prefix: ['[SetupCmd]'],
    });
  }

  public async exec(msg: Message, { type }: { type: string }): Promise<void | Message> {
    try {
      switch (type) {
        case 'rules':
          await SetupCommand._setupRules(msg);
          break;
      }
    } catch (e) {
      this._logger.error(e);
      return msg.channel.send(makeErrorEmbed(e, true));
    }
  }

  private static async _setupRules(msg: Message): Promise<Message> {
    const roleChannel = msg.guild?.channels.cache.get(
      <string>process.env.RULE_CHANNEL
    ) as TextChannel;

    const embed = new MessageEmbed()
      .setThumbnail('https://i.tasoagc.dev/sD7h')
      .setDescription(
        '*Welcome to the Project Error Discord, please read over the following rules before you proceed!*'
      )
      .setTitle('Guild Rules')
      .setTimestamp()
      .setFooter('Project Error');

    for (const rule in RULES) {
      embed.addField(`Rule ${parseInt(rule) + 1}`, RULES[rule], false);
    }

    await roleChannel.send(embed);

    const success = SetupCommand._makeSuccessEmbed('rules');
    return msg.channel.send(success);
  }

  private static _makeSuccessEmbed(command: string): MessageEmbed {
    return new MessageEmbed()
      .setDescription(`Setup **${command}** embed successfully`)
      .setColor('GREEN');
  }
}
