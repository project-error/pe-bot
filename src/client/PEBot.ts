import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Message } from 'discord.js';
import path from 'path';
import { DEFAULT_COOLDOWN, OWNER_IDS, PREFIX } from '../config';
import { Logger } from 'tslog';
import { getLogger } from '../utils/logger';
import {Connection} from "typeorm";
import connectManager from "../db/connection";

declare module 'discord-akairo' {
  interface AkairoClient {
    db: Connection
    log: Logger;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

export default class PEBot extends AkairoClient {
  public db!: Connection;

  public log: Logger;

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: path.join(__dirname, '..', 'listeners'),
  });
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: path.join(__dirname, '..', 'commands'),
    prefix: PREFIX,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: DEFAULT_COOLDOWN,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the commmand...`,
        modifyRetry: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the commmand...`,
        timeout: 'Command timedout',
        ended: 'You reached the maximum retries, command cancelled.',
        retries: 3,
        time: 3e4,
      },
      otherwise: '',
    },
    ignorePermissions: OWNER_IDS,
  });

  public constructor() {
    super({
      ownerID: OWNER_IDS,
    });
    this.log = getLogger();
  }

  public async start(): Promise<void> {
    this.log.info('Starting Initialization Sequence');
    await this._init();
    await this.login(process.env.BOT_TOKEN);
  }

  private async _init() {
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.log.info('Loading Command Handler');
    this.commandHandler.loadAll();
    this.log.info('Loading Listener Handler');
    this.listenerHandler.loadAll();
    this.log.info('Loading Complete');

    this.db = connectManager.get()
    try {
      this.log.info('Attempting DB Connect...')
      await this.db.connect()
      await this.db.synchronize()
      this.log.info('DB Connected!')
    } catch (e) {
      this.log.error(e)
    }
  }
}
