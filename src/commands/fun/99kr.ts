import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import getImg from '../../utils/getImg';
import { loadImage, createCanvas } from 'canvas'
import fs from 'fs'

export default class NinetyNineKr extends Command {
  public constructor() {
    super('99kr', {
      aliases: ['99kr', '99commits', '99krcommits'],
      description: {
        content: 'Looking for 99kr commits...',
        usage: '99kr',
        examples: ['99kr'],
      },
      category: 'Fun',
    });
  }

  async exec(message: Message): Promise<Message> {
    const canvas = createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')
    const img = await loadImage(await getImg())
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.font = '64px Impact'
    const width = ctx.measureText('Looking for 99kr commits').width;
    ctx.fillStyle = 'black';
    ctx.fillRect(165, 50, width, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('Looking for 99kr commits',500, 100)
    fs.writeFileSync('image.png', canvas.toBuffer())
    const picEmbed = new MessageEmbed()
      .setTitle('Picture from Mars... 🚀')
      .attachFiles(['./image.png'])
      .setImage('attachment://image.png')
      .setColor('RED');
    return message.channel.send(picEmbed);
  }
}
