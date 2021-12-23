import { Command } from 'discord-akairo';
import { ActivityType, Message } from 'discord.js';
import { makeSimpleEmbed } from '../../utils';

interface SetPresenceCommandArgs {
  type: ActivityType;
  status_msg: string;
}

export default class SetPresenceCommand extends Command {
  constructor() {
    super('set-presence', {
      aliases: ['set-presence'],
      category: 'Admin',
      description: {
        content: 'Set the bot presence.',
        usage: 'set-presence <text> --type [WATCHING | LISTENING | STREAMING | PLAYING]',
        examples: [
          'set-presence New presence!',
          'set-presence "my friends" --type WATCHING',
        ],
      },
      channel: 'guild',
      args: [
        {
          id: 'status_msg',
          match: 'text',
          prompt: {
            start: 'What would you like the bot status message to be?',
          },
        },
        {
          id: 'type',
          type: ['LISTENING', 'WATCHING', 'PLAYING', 'STREAMING'],
          default: 'WATCHING',
          match: 'option',
          flag: ['--type', '-t'],
          prompt: {
            retry:
              'Invalid activity type. Please use one of the following: WATCHING, LISTENING, PLAYING, STREAMING',
          },
        },
      ],
      ownerOnly: true,
    });
  }

  public async exec(
    msg: Message,
    { status_msg, type }: SetPresenceCommandArgs
  ): Promise<Message> {
    this.client.user?.setPresence({
      status: 'online',
      activity: {
        name: status_msg,
        type,
      },
    });

    return msg.channel.send(
      makeSimpleEmbed(`Set the bot's status message to \`${status_msg}\``, 'GREEN')
    );
  }
}
