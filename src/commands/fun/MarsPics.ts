import { Command, CommandHandler } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { Logger } from 'tslog';
import fetch from 'node-fetch';

export default class MarsPics extends Command {
  private readonly _logger: Logger;

  public constructor(handler: CommandHandler) {
    super('marspics', {
      aliases: ['marspics', 'marspic', 'picmars'],
      description: {
        content: 'Fetch a random Mars image from NASA api',
        usage: 'marspics',
        examples: ['marspics'],
      },
      category: 'Fun',
    });
    this._logger = handler.client.log.getChildLogger({
      name: 'NASA Mars',
      prefix: ['[NASAMars]'],
    });
  }
  async exec(message: Message): Promise<Message> {
    const parse = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${
        process.env.NASAKEY
      }&sol=${Math.floor(Math.random() * 999)}`
    );
    this._logger.debug(`Fetched info from NASA API`);
    const parsedJSON = await parse.json();
    this._logger.debug(`Parsed the fetched info into a JSON object`);
    const picEmbed = new MessageEmbed()
      .setTitle('Picture from Mars... 🚀')
      .setImage(parsedJSON.photos[0].img_src)
      .setColor('RED');
    return message.channel.send(picEmbed);
  }
}