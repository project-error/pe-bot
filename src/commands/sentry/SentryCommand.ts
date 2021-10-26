import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import dayjs from 'dayjs';
// import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import { discordCodeBlock, makeSimpleEmbed } from '../../utils';
const SENTRY_API_BASE_URL =
  'https://sentry.projecterror.dev/api/0/projects/project-error/npwd/issues';

dayjs.extend(relativeTime);

// dayjs.updateLocale('en', {
//   relativeTime: {
//     future: 'in %s',
//     past: '%s ago',
//     s: 'a few seconds',
//     m: 'a minute',
//     mm: '%d minutes',
//     h: 'an hour',
//     hh: '%d hours',
//     d: 'a day',
//     dd: '%d days',
//     M: 'a month',
//     MM: '%d months',
//     y: 'a year',
//     yy: '%d years',
//   },
// });

type StatEvent = [number, number];

interface IssueQueryResult {
  annotations: string[];
  userCount: number;
  project: {
    name: string;
  };
  isUnhandled: boolean;
  title: string;
  status: string;
  id: string;
  count: number;
  lastSeen: string;
  firstSeen: string;
  shortId: string;
  type: string;
  culprit: string;
  permalink: string;
  metadata: {
    filename: string;
  };
  stats: {
    '24h': StatEvent[];
  };
}

const countStatsLast24hrs = (res: IssueQueryResult): number => {
  let count = 0;
  for (const bucket of res.stats['24h']) {
    if (bucket[1]) count += bucket[1];
  }
  return count;
};

export default class SentryCommand extends Command {
  private log: Logger;

  constructor(handler: CommandHandler) {
    super('sentry', {
      aliases: ['sentry'],
      category: 'Misc',
      description: {
        content: 'Search for sentry issue ',
        usage: 'sentry <search>',
        examples: ['sentry GetParentResourceName'],
      },
      channel: 'guild',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          prompt: {
            start: 'Please enter a search string',
            retry: 'Please enter a search string',
          },
          id: 'query',
          type: 'string',
          match: 'restContent',
        },
      ],
    });

    this.log = handler.client.log.getChildLogger({
      name: 'SentryCmd',
      prefix: ['[SentryCmd]'],
    });
  }

  public async exec(msg: Message, { query }: { query: string }): Promise<Message> {
    const resp = await fetch(`${SENTRY_API_BASE_URL}/?query=${encodeURI(query)}`, {
      headers: {
        Authorization: `Bearer ${process.env.SENTRY_API}`,
        'Content-Type': 'application/json',
      },
    });

    const parsedResp = await resp.json();

    const respEmbed = parsedResp[0]
      ? SentryCommand.buildIssueEmbed(parsedResp[0])
      : makeSimpleEmbed('No results found', 'RED');

    return await msg.channel.send(respEmbed);
  }

  private static buildIssueEmbed(issue: IssueQueryResult): MessageEmbed {
    return new MessageEmbed()
      .setColor('RED')
      .setURL(issue.permalink)
      .setTitle(`Sentry Error - ${issue.project.name.toUpperCase()}`)
      .setDescription(issue.title)
      .setFooter(
        issue.shortId,
        'https://sentry.projecterror.dev/_static/1635213984/sentry/images/logos/apple-touch-icon.png'
      )
      .addFields([
        {
          name: 'Total Count',
          inline: true,
          value: issue.count,
        },
        {
          name: 'User Count',
          inline: true,
          value: issue.userCount,
        },
        {
          name: 'Last 24 hours',
          inline: true,
          value: countStatsLast24hrs(issue),
        },
        {
          name: 'Status',
          inline: true,
          value: issue.status.toUpperCase(),
        },
        {
          name: 'Culprit',
          inline: false,
          value: discordCodeBlock(issue.metadata.filename),
        },
        {
          name: 'Project',
          inline: true,
          value: issue.project.name,
        },
        {
          name: 'Unhandled',
          inline: true,
          value: issue.isUnhandled ? 'Yes' : 'No',
        },
        {
          name: 'First Seen',
          value: dayjs().to(dayjs(issue.firstSeen)),
          inline: true,
        },
        {
          name: 'Last Seen',
          value: dayjs().to(dayjs(issue.lastSeen)),
          inline: true,
        },
      ])
      .setTimestamp();
  }
}
