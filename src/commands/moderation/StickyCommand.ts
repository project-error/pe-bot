import { Command, CommandHandler } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { makeErrorEmbed, makeSimpleEmbed, makeUserErrorEmbed } from '../../utils';

interface StickyCmdArgs {
  stickyMsg: string;
  subCmd: string;
}

export default class StickyCommand extends Command {
  private _log;

  constructor(handler: CommandHandler) {
    super('sticky', {
      aliases: ['sticky', 'stickymanage'],
      channel: 'guild',
      userPermissions: 'BAN_MEMBERS',
      category: 'Moderation',
      description: {
        content: 'Add a sticky message to a specific channel',
        usage: 'sticky [add/remove] [content]',
        examples: ['sticky add you suck', 'sticky remove'],
      },
      args: [
        {
          id: 'subCmd',
          type: ['remove', 'add'],
          prompt: {
            start: (msg: Message) => `${msg.author}, please provide valid subcommand`,
            retry: (msg: Message) => `${msg.author}, please provide valid subcommand`,
          },
        },
        {
          id: 'stickyMsg',
          match: 'rest',
        },
      ],
    });
    this._log = handler.client.log.getChildLogger({
      name: 'StickyCmd',
      prefix: ['[StickyCmd]'],
    });
  }

  public async exec(
    msg: Message,
    { stickyMsg, subCmd }: StickyCmdArgs
  ): Promise<Message | void> {
    this._log.debug(stickyMsg, subCmd);
    if (!stickyMsg && subCmd !== 'remove')
      return msg.channel.send(
        makeUserErrorEmbed('Please provide a valid message to sticky')
      );
    if (subCmd === 'add') return await this._addSticky(msg, stickyMsg);
    await this._removeSticky(msg);
  }

  private async _addSticky(msg: Message, stickyMsg: string): Promise<void> {
    const curChannel = msg.channel.id;
    const embed = makeSimpleEmbed(`**Sticky Sucesfully Added!**`);
    const newMsg = await msg.channel.send(stickyMsg);
    this.client.StickyService.setStickyMsg(curChannel, {
      msgID: newMsg.id,
      content: stickyMsg,
    });
    msg.channel.send(embed).then((msg) => msg.delete({ timeout: 2000 }));
  }

  private async _removeSticky(msg: Message): Promise<Message> {
    const curChannel = msg.channel.id;
    if (this.client.StickyService.channelHasStickyMsg(curChannel)) {
      this.client.StickyService.removeStickyMsg(curChannel);

      return await msg.channel
        .send(makeSimpleEmbed(`Sticky removed!`))
        .then((msg) => msg.delete({ timeout: 3000 }));
    }
    const embed = makeUserErrorEmbed('This channel does not have a sticky!');
    return await msg.channel.send(embed);
  }
}
