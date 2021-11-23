import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message } from 'discord.js';
import axios from 'axios';

interface XkcdResp {
  month: string;
  num: number;
  link: string;
  img: string;
  year: string;
  news: string;
  safe_title: string;
}

export default class XkcdCommand extends Command {
  private log: Logger;
  private xkcdClient = axios.create({
    baseURL: 'https://xkcd.com/',
  });

  constructor(handler: CommandHandler) {
    super('xkcd', {
      category: 'Fun',
      aliases: ['xkcd'],
      description: {
        content: 'Returns XKCD comic of given number',
        usage: 'xkcd <number> [--image]',
        examples: ['xkcd 440 --image', 'xkcd 220'],
      },
      channel: 'guild',
      args: [
        {
          id: 'comicNumber',
          type: 'number',
          prompt: {
            start: 'Please provide a xkcd comic number',
            retry: 'Please provide a xkcd comic number',
          },
        },
        {
          id: 'imageFlag',
          match: 'flag',
          flag: '--image',
        },
      ],
    });

    this.log = handler.client.log.getChildLogger({
      name: 'xkcdCmd',
      prefix: ['[xkcdCmd]'],
    });
  }

  public async exec(
    msg: Message,
    { comicNumber, imageFlag }: { comicNumber: number; imageFlag: boolean }
  ): Promise<Message> {
    const comicNumberStr = comicNumber.toString();

    const xkcdInfo = await this.xkcdClient.get<XkcdResp>(`${comicNumberStr}/info.0.json`);

    if (imageFlag) {
      return await msg.channel.send(xkcdInfo.data.img);
    }

    return await msg.channel.send(`https://xkcd.com/${comicNumberStr}`);
  }
}
