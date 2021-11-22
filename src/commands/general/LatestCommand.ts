import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message, MessageEmbed } from 'discord.js';
import dayjs, { Dayjs } from 'dayjs';
import { LatestCommandInterval } from '../../config';
import { discordCodeBlock } from '../../utils';
import axios from 'axios';

const now = () => Math.round(Date.now() / 1000);

interface LatestCommandArgs {
  full: boolean;
}

interface LatestVersionData {
  windows: ChangelogResp | null;
  linux: ChangelogResp | null;
  updatedLast: Dayjs | null;
}

interface ChangelogResp {
  recommended: number;
  optional: number;
  latest: number;
  critical: number;
  recommended_download: string;
  optional_download: string;
  latest_download: string;
  critical_download: string;
  support_policy_eol?: Record<string, string>;
  support_policy?: Record<string, string>;
}

type ChangeLogRespFormatted = Omit<
  ChangelogResp,
  'support_policy_eol' | 'support_policy'
>;

export default class LatestCommand extends Command {
  private log: Logger;

  private versionData: LatestVersionData = {
    windows: null,
    linux: null,
    updatedLast: null,
  };

  constructor(handler: CommandHandler) {
    super('latest', {
      category: 'General',
      aliases: ['latest'],
      description: {
        content: 'Returns the latest fxVersion',
        usage: 'latest',
        examples: ['latest'],
      },
      channel: 'guild',
      args: [
        {
          id: 'full',
          match: 'flag',
          flag: '--full',
        },
      ],
    });

    this.log = handler.client.log.getChildLogger({
      name: 'LatestCmd',
      prefix: ['[LatestCmd]'],
    });

    setInterval(async () => {
      await this.fetchAndSet();
    }, LatestCommandInterval);

    this.fetchAndSet().catch((e) => this.log.error('Failed to fetch & set', e));
  }

  public async exec(msg: Message, { full }: LatestCommandArgs): Promise<Message> {
    if (full) {
      const fullEmbed = this.makeFullEmbed();
      return await msg.channel.send(fullEmbed);
    }

    const embed = this.makeRegularEmbed();

    return await msg.channel.send(embed);
  }

  private async fetchAndSet(): Promise<void> {
    this.log.silly('Fetching latest data');

    const cacheBuster = Math.floor(now() / 2e3) % 1000;

    const createLink = (windows = true) =>
      `https://changelogs-live.fivem.net/api/changelog/versions/${
        windows ? 'win32' : 'linux'
      }/server?${cacheBuster}`;

    const winResp = await axios.get<ChangelogResp>(createLink(true));
    const linuxResp = await axios.get<ChangelogResp>(createLink(false));

    if (winResp && linuxResp) {
      this.versionData = {
        windows: winResp.data,
        linux: linuxResp.data,
        updatedLast: dayjs(),
      };
    }
  }

  transformFullData = (data: ChangelogResp): ChangeLogRespFormatted => {
    const formattedData = { ...data };

    formattedData.support_policy_eol = undefined;
    formattedData.support_policy = undefined;

    return formattedData;
  };

  private makeFullEmbed(): MessageEmbed {
    const { windows: winData, linux: linuxData } = this.versionData;

    const codeBlockWindows = winData
      ? discordCodeBlock(JSON.stringify(this.transformFullData(winData), null, 2))
      : 'Unknown :(';

    const codeBlockLinux = linuxData
      ? discordCodeBlock(JSON.stringify(this.transformFullData(linuxData), null, 2))
      : 'Unknown :(';

    this.log.debug(linuxData);

    return new MessageEmbed()
      .setColor('GOLD')
      .addFields([
        {
          name: 'Windows',
          value: codeBlockWindows,
        },
        {
          name: 'Linux',
          value: codeBlockLinux,
        },
      ])
      .setFooter(`Last updated`)
      .setTimestamp(this.versionData.updatedLast?.toDate());
  }

  private makeRegularEmbed() {
    return new MessageEmbed()
      .setColor('GOLD')
      .setDescription(
        `The latest FXServer version is **${
          this.versionData.windows?.latest || 'Unknown'
        }**. You can find the direct download links for this version below. \n\n*This data refreshes every 10 minutes*`
      )
      .addFields([
        {
          name: 'Windows',
          value: this.versionData.windows?.latest_download ?? 'Not found :(',
        },
        {
          name: 'Linux',
          value: this.versionData.linux?.latest_download ?? 'Not found :(',
        },
      ])
      .setAuthor('Latest FXServer Build')
      .setFooter(`Last updated`)
      .setTimestamp(this.versionData.updatedLast?.toDate());
  }
}
