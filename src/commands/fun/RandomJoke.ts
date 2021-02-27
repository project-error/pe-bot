import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { fetchUrl } from '../../utils/fetch';

export default class RandomJoke extends Command {
  public constructor() {
    super('randomjoke', {
      aliases: ['randomjoke', 'joke', 'jokerandom'],
      description: {
        content: 'Fetch a random joke',
        usage: 'randomjoke',
        examples: ['randomjoke'],
      },
      category: 'Fun',
    });
  }
  async exec(message: Message): Promise<Message> {
    const joke = await fetchUrl('https://official-joke-api.appspot.com/jokes/random');
    const jokeEmbed = new MessageEmbed()
      .setTitle(`So funne men 😂`)
      .addField(joke.setup, joke.punchline);
    return message.channel.send(jokeEmbed);
  }
}
