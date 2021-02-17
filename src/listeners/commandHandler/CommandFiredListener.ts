import { Listener, Command, ListenerHandler } from 'discord-akairo';
import { Message } from 'discord.js';
import { Logger } from 'tslog';

export default class CommandListener extends Listener {
  private readonly _logger: Logger;

  public constructor(handler: ListenerHandler) {
    super('commandStarted', {
      event: 'commandStarted',
      emitter: 'commandHandler',
    });

    this._logger = handler.client.log.getChildLogger({
      prefix: ['[CmdFiredListener]'],
    });
  }
  public exec(msg: Message, cmd: Command): void {
    this._logger.info(`Command: \`${cmd}\` triggered by ${msg.author.tag}. RAW: ${msg}`);
  }
}
