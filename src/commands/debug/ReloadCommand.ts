import { Command, CommandHandler } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { Logger } from 'tslog';
import { convertNanoToMs, discordCodeBlock } from '../../utils';

export default class ReloadCommand extends Command {
  private _logger: Logger;
  public constructor(handler: CommandHandler) {
    super('reload', {
      aliases: ['reload'],
      description: {
        content: 'Reloads all commands, inhibitors, listeners, and settings.',
        ownerOnly: true,
      },
      category: 'Debug',
      ownerOnly: true,
    });
    this._logger = handler.client.log.getChildLogger({
      name: 'ReloadCmd',
      prefix: ['[ReloadCmd]'],
    });
  }
  public async exec(message: Message): Promise<Message> {
    const hrStartCmd = process.hrtime.bigint();
    this.client.commandHandler.reloadAll();
    const hrDiffCmd = convertNanoToMs(process.hrtime.bigint() - hrStartCmd);
    const hrListen = process.hrtime.bigint();
    this.client.listenerHandler.reloadAll();
    const hrDiffListen = convertNanoToMs(process.hrtime.bigint() - hrListen);
    const hrDiffTotal = convertNanoToMs(process.hrtime.bigint() - hrStartCmd);
    const cmdSize = this.client.commandHandler.modules.size;
    const listenerSize = this.client.listenerHandler.modules.size;
    this._logger.info(`${cmdSize} Commands reloaded in ${hrDiffCmd}`);
    this._logger.info(`${listenerSize} Listeners reloaded in ${hrDiffListen}`);

    const embed = new MessageEmbed()
      .setDescription(`Sucessfully reloaded all modules in **${hrDiffTotal} ms**`)
      .setColor('GREEN')
      .setTimestamp()
      .addFields([
        {
          name: 'Commands',
          value: discordCodeBlock(`${cmdSize} reloaded in ${hrDiffCmd} ms`),
        },
        {
          name: 'Listener',
          value: discordCodeBlock(`${listenerSize} reloaded in ${hrDiffListen} ms`),
        },
      ]);

    return message.channel.send(embed);
  }
}
