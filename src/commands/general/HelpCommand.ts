import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help', 'commands'],
      category: 'General',
      description: {
        content: 'View available commands',
        usage: 'help [command]',
        examples: ['help', 'help ping'],
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          default: null,
        },
      ],
    });
  }

  public exec(
    message: Message,
    { command }: { command: Command }
  ): Promise<Message> | void {
    if (command) {
      if (
        command.category.id === 'Debug' &&
        !this.client.ownerID.includes(message.author.id)
      ) {
        this.client.commandHandler.emit(
          'missingPermissions',
          message,
          command,
          'user',
          'DebugView'
        );
        return;
      }

      return message.channel.send(
        new MessageEmbed()
          .setAuthor(`Command Help | For '${command}'`, message.author.displayAvatarURL())
          .setColor('#ff8f00')
          .setTimestamp()
          .setFooter(message.author.tag, message.author.displayAvatarURL())
          .addFields([
            {
              name: '**Description**',
              value: `${command.description.content || 'No description provided'}`,
            },
            {
              name: '**Aliases**',
              value: command.aliases
                ? command.aliases.map((e) => `\`${e}\``).join(', ')
                : 'No aliases',
            },
            {
              name: '**Usage**',
              value: `\`${command.description.usage || 'No usage info'}\``,
            },
            {
              name: '**Examples**',
              value: command.description.examples
                ? command.description.examples.map(
                    (e: unknown) => `\`${this.client.commandHandler.prefix}${e}\``
                  )
                : 'No examples',
            },
          ])
      );
    }

    const embed = new MessageEmbed()
      .setAuthor(`Command Help`)
      .setColor('#ff8f00')
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `*For further info on a command do \`${this.client.commandHandler.prefix}help [command]\`*`
      )
      .setTimestamp();

    for (const category of this.handler.categories.values()) {
      if (['default'].includes(category.id)) continue;

      if (category.id === 'Debug' && !this.client.ownerID.includes(message.author.id))
        continue;

      if (
        category.id === 'Admin' &&
        !message.member?.roles.cache.has(<string>process.env.ADMIN_ROLE)
      )
        continue;

      embed.addField(
        category.id,
        category
          .filter((cmd) => cmd.aliases.length > 0)
          .map((cmd) => `**\`${cmd}\`**`)
          .join(', ') || 'No commands for this category'
      );
    }

    return message.channel.send(embed);
  }
}
