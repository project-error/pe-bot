import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import getImg from '../../utils/getImg';

export default class MarsPics extends Command {
  public constructor() {
    super('marspics', {
      aliases: ['marspics', 'marspic', 'picmars'],
      description: {
        content: 'Fetch a random Mars image from NASA api',
        usage: 'marspics',
        examples: ['marspics'],
      },
      category: 'Fun',
    });
  }
  async exec(message: Message): Promise<Message> {
    const picEmbed = new MessageEmbed()
      .setTitle('Picture from Mars... 🚀')
      .setImage(await getImg())
      .setColor('RED');
    return message.channel.send(picEmbed);
  }
}
