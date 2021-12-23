import { Command } from 'discord-akairo';
import { GuildMember, Message } from 'discord.js';

export interface StaticCommandFile {
  aliases: string[];
  replyMsg: string;
  description: string;
}

export default class StaticCommandBase extends Command {
  private staticCommand: StaticCommandFile;

  constructor(id: string, commandFile: StaticCommandFile) {
    super(id, {
      category: 'Static',
      aliases: [id, ...commandFile?.aliases],
      description: {
        content: commandFile.description,
        usage: `${id} [user]`,
        examples: [`${id} @Taso`, id],
      },
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          default: null,
        },
      ],
    });

    this.staticCommand = commandFile;
  }

  public async exec(msg: Message, { member }: { member: GuildMember }): Promise<Message> {
    if (member) {
      return await msg.channel.send(`${member}, ${this.staticCommand.replyMsg}`);
    }

    return await msg.channel.send(this.staticCommand.replyMsg);
  }
}
