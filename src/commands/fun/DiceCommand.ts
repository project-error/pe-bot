import { Argument, Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class DiceCommand extends Command {
  public constructor() {
    super('dice', {
      aliases: ['dice', 'dices', 'diceroll', 'rolldice'],
      category: 'Fun',
      description: {
        content: 'Roll a dice according to your options',
        usage: 'dice <# of dice> <# of sides>',
        examples: ['dice 2 6', 'dices 3 4', 'dices 1 2'],
      },
      args: [
        {
          id: 'diceNumber',
          type: Argument.range('number', 0, 15),
          match: 'phrase',
          prompt: {
            start: (msg: Message) => `${msg.author}, pick the number of dice (0-15)`,
            retry: (message: Message) =>
              `${message.author} not within the valid number of dice (0-15) `,
          },
        },
        {
          id: 'sideNumber',
          default: 6,
          type: Argument.range('number', 0, 30),
          match: 'phrase',
          prompt: {
            start: (msg: Message) =>
              `${msg.author}, pick the number of sides for your dice (0-30)`,
            retry: (message: Message) =>
              `${message.author} not within the valid number of sides for dice (0-30) `,
          },
        },
      ],
    });
  }

  public exec(
    msg: Message,
    { diceNumber, sideNumber }: { diceNumber: number; sideNumber: number }
  ): Promise<Message> {
    const rolledValues: string[] = [];
    let total = 0;

    for (let i = 0; i < diceNumber; i++) {
      const value = Math.floor(Math.random() * sideNumber) + 1;
      total = total + value;
      rolledValues.push(`**Dice ${i + 1}:** ${value}/${sideNumber}\n`);
    }

    const joinedDiced = rolledValues.join('\n');

    const embed = new MessageEmbed()
      .setColor('GOLD')
      .setAuthor(
        `Dice Rolled 🎲 | ${msg.author.tag}`,
        msg.author.avatarURL() ?? undefined
      )
      .setDescription(`${joinedDiced} \n**Total Value:** ${total}`);

    return msg.channel.send(embed);
  }
}
