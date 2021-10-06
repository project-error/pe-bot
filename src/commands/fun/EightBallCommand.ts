import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { EightBallResponses } from '../../config';
import { stripIndents } from 'common-tags';

export default class EightBallCommand extends Command {
  public constructor() {
    super('8ball', {
      aliases: ['8ball', 'eight-ball', 'eightball'],
      description: {
        content: 'Roll an 8-Ball',
        usage: '8ball <Message>',
        examples: ['8ball Will I lay down the pipe tomorrow'],
      },
      category: 'Fun',
      args: [
        {
          id: 'question',
          match: 'restContent',
          prompt: {
            start: (msg: Message) => `${msg.author}, you must ask a question!`,
          },
        },
      ],
    });
  }

  public exec(msg: Message, { question }: { question: string }): Promise<Message> {
    const randResponse =
      EightBallResponses[Math.floor(Math.random() * EightBallResponses.length)];

    const embed = new MessageEmbed().setColor('ORANGE').setDescription(stripIndents`
        **❓ You asked**: \`${question}\`
        
        **🎱 Eight Ball Says:** ${randResponse}
      `);

    return msg.channel.send(embed);
  }
}
