import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { fetchUrl } from '../../utils/fetch';

export default class Joke extends Command {
  public constructor() {
    super('joke', {
      aliases: ['joke', 'randomjoke', 'jokerandom'],
      description: {
        content: 'Fetch a random joke',
        usage: 'joke',
        examples: ['joke'],
      },
      category: 'Fun',
    });
  }
  async exec(message: Message): Promise<Message> {
    const joke = await fetchUrl('https://v2.jokeapi.dev/joke/Miscellaneous,Dark?blacklistFlags=religious,political,racist,sexist&type=twopart');
    const jokeEmbed = new MessageEmbed()
      .setTitle(`Funny mey mey 😂`)
      .addField(joke.setup, joke.delivery)
      .setColor('ORANGE');
    return message.channel.send(jokeEmbed);
  }
}
