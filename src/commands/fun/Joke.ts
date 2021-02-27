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
    const joke = await fetchUrl('https://official-joke-api.appspot.com/jokes/random');
    const jokeEmbed = new MessageEmbed()
      .setTitle(`So funne men 😂`)
      .addField(joke.setup, joke.punchline)
      .setColor('ORANGE');
    return message.channel.send(jokeEmbed);
  }
}
