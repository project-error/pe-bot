import { Listener, ListenerHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message } from 'discord.js';

export default class StickyMessageListener extends Listener {
  private _logger: Logger;
  constructor(handler: ListenerHandler) {
    super('stickyMsgListener', {
      event: 'message',
      emitter: 'client',
    });
    this._logger = handler.client.log.getChildLogger({
      name: 'StickyMsgListener',
      prefix: ['[StickyMsgListener]'],
    });
  }
  public async exec(msg: Message): Promise<void> {
    const curChannel = msg.channel.id;
    const curPrefix = <string>this.client.commandHandler.prefix;
    if (msg.content.startsWith(curPrefix)) return;
    // Check if we have stickys for this channel
    if (this.client.StickyService.channelHasStickyMsg(curChannel)) {
      if (msg.author.bot) return;

      const oldMsgMap = this.client.StickyService.getStickyMsg(curChannel);

      if (oldMsgMap) {
        const oldMsg = msg.channel.messages.cache.get(oldMsgMap.msgID);
        // Remove old message
        oldMsg?.delete().catch((e) => this._logger.error(e));

        const newMsg = await msg.channel.send(oldMsgMap.content);

        this.client.StickyService.setStickyMsg(msg.channel.id, {
          content: oldMsgMap.content,
          msgID: newMsg.id,
        });
        //
        // .delete().catch(e => this._logger.error(e))
      }
    }
  }
}
