import { Listener, ListenerHandler } from 'discord-akairo';
import { Logger } from 'tslog';

export default class UnhandledRejectionListener extends Listener {
  private _log: Logger;

  public constructor(handler: ListenerHandler) {
    super('unhandledRejection', {
      event: 'unhandledRejection',
      emitter: 'process',
    });
    this._log = handler.client.log.getChildLogger({
      prefix: ['[UncaughtException]'],
    });
  }

  public exec(e: Error): void {
    this._log.error(e);
  }
}
