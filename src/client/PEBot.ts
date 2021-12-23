import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Message, MessageEmbed, MessageOptions } from 'discord.js';
import path from 'path';
import { DEFAULT_COOLDOWN, OWNER_IDS, PREFIX } from '../config';
import { Logger } from 'tslog';
import { getLogger } from '../utils/logger';
import { Connection } from 'typeorm';
import connectManager from '../db/connection';
import { gitKrakenEmitter, kofiEmitter } from '../express/processRequest';
import StickyMessageService from '../services/StickyMessageService';
import { makeSimpleEmbed } from '../utils';
import { ManagerHandler } from '../structures/managers/ManagerHandler';

declare module 'discord-akairo' {
  interface AkairoClient {
    db: Connection;
    log: Logger;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    StickyService: StickyMessageService;
  }
}

export default class PEBot extends AkairoClient {
  public db!: Connection;

  public log: Logger;

  public StickyService: StickyMessageService;

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
        modifyStart: (msg: Message, str: string): MessageOptions => {
          const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(str)
            .setFooter(
              `Type \`cancel\` to cancel the command or ${this.commandHandler.prefix}help [command]`,
              msg.author.displayAvatarURL()
            );
          return { embed };
        },
        modifyRetry: (msg: Message, str: string): MessageOptions => {
          const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(str)
            .setFooter(
              `Type \`cancel\` to cancel the command or ${this.commandHandler.prefix}help [command]`,
              msg.author.displayAvatarURL()
            );
          return { embed };
        },
        timeout: () => makeSimpleEmbed(`Timed out!`),
        ended: (msg: Message) => {
          const embed = new MessageEmbed()
            .setDescription('You have reached the maximum retries')
            .setColor('RED')
            .setFooter('Project Error', msg.author.displayAvatarURL());
          return { embed };
        },
        retries: 3,
        time: 3e4,
      },
      otherwise: '',
    },
    ignorePermissions: OWNER_IDS,
  });

  public managerHandler = new ManagerHandler(this, {
    directory: path.join(__dirname, 'managers'),
  });

  public constructor() {
    super({
      ownerID: OWNER_IDS,
    });
    this.log = getLogger();
    this.StickyService = new StickyMessageService(this.log);
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
      gitKrakenEmitter,
      process,
    });

    this.log.info('Loading Command Handler');
    this.commandHandler.loadAll();
    this.log.info('Loading Listener Handler');
    this.listenerHandler.loadAll();
    this.log.info('Loading Manager Handler');
    this.managerHandler.loadAll();
    this.log.info('Loading Complete');

    this.db = connectManager.get();
    try {
      this.log.info('Attempting DB Connect...');
      await this.db.connect();
      await this.db.synchronize();
      this.log.info('DB Connected!');
    } catch (e) {
      this.log.error(e);
    }
  }
}
