import { Listener, ListenerHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { CardAdded, CardReordered } from '../../utils/gitkraken/types';
import { MessageEmbed, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class MessageDeleteListener extends Listener {
  private _logger: Logger;

  constructor(handler: ListenerHandler) {
    super('gitKrakenUpdate', {
      event: 'cardAdded',
      emitter: 'gitKrakenEmitter',
    });

    this._logger = handler.client.log.getChildLogger({
      name: 'cardAddedListener',
      prefix: ['[cardAddedListener]'],
    });
  }

  public exec(data: CardAdded) {
    this._logger.debug(data);
    const embed = new MessageEmbed()
      .setTitle(`New Card Added to ${data.board.name}`)
      .setURL(`https://app.gitkraken.com/glo/card/${data.card.permanent_id}`)
      .setColor('DARK_AQUA')
      .setDescription(
        stripIndents`
        **${data.sender.username}** created **${data.card.name}
      `
      )
      .setTimestamp()
      .setFooter(`Project Error`, this.client.user?.displayAvatarURL());
    const chan = this.client.channels.cache.get('758120138976657421');

    return (chan as TextChannel).send(embed);
  }
}
