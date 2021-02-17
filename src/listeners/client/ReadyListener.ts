import { Listener, ListenerHandler } from 'discord-akairo';
import { Logger } from 'tslog';

export default class ReadyListener extends Listener {
  private _log: Logger;

  public constructor(handler: ListenerHandler) {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client',
    });
    this._log = handler.client.log.getChildLogger({
      prefix: ['[ReadyListener]'],
    });
  }

  public async exec(): Promise<void> {
    this._log.info(`${this.client.user?.tag} is now online!`);
    //Sets Presence
    this.client.user?.setPresence({
      activity: { type: 'WATCHING', name: 'for Spicy Memes' },
    });
  }
}
