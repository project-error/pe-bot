import { Listener, ListenerHandler } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { Logger } from 'tslog';
import { stripIndents } from 'common-tags';

export interface KofiData {
  message_id: string;
  is_public: boolean;
  kofi_transaction_id: string;
  timestamp: string;
  type: string;
  from_name: string;
  message: string;
  amount: number;
  currency: string;
  url: string;
  is_subscription_payment: boolean;
  is_first_subscription_payment: boolean;
}

export default class DonationListener extends Listener {
  private log: Logger;
  private messageChannel: TextChannel | null = null;

  constructor(handler: ListenerHandler) {
    super('donation', {
      emitter: 'kofiEmitter',
      event: 'donation',
    });

    this.log = handler.client.log.getChildLogger({
      prefix: ['[DonationListener]'],
      name: 'DonationListener',
    });
  }

  public async exec(kofiData: KofiData): Promise<Message | void> {
    this.log.debug('Handling Kofi Webhook', kofiData);

    // Make sure we don't push private donos
    if (!kofiData.is_public) return;

    if (!this.messageChannel) {
      this.messageChannel = (await this.client.channels.fetch(
        <string>process.env.DONATION_CHANNEL_ID
      )) as TextChannel;
    }

    const msgContent = stripIndents`
      ❤ A big thank you to **${kofiData.from_name}** for donating **${kofiData.amount} ${kofiData.currency}** to support Project Error! ❤ 
       
      ${kofiData.url}
      `;

    return await this.messageChannel.send(msgContent);
  }
}
