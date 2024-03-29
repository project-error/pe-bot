import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { fetchUrl } from '../../utils/fetch';

interface JokeResp {
  setup?: string;
  joke: string;
  delivery?: string;
}

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
    const joke = await fetchUrl<JokeResp>(
      'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist'
    );

    const jokeEmbed = new MessageEmbed()
      .setTitle(`(not) Funny mey mey 😂`)
      .addField(joke.setup ?? joke.joke, joke.delivery ?? '')
      .setColor('ORANGE');

    return message.channel.send(jokeEmbed);
  }
}
