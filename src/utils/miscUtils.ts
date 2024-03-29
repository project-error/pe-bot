// FIXME: Types suck here, will improve after functionality
import { ColorResolvable, MessageEmbed } from 'discord.js';
import dayjs, { Dayjs } from 'dayjs';

const homeDir = process.cwd().replace(/\\/g, '\\\\');

/**
 * Clean/prettify an error stack
 * @param stack Error stack to handle
 **/
export const cleanStack = (stack: string): string => {
  //const basePathRegex = basePath && new RegExp(`(at | \\()${escapeStringRegexp(basePath)}`, 'g');
  return stack.replace(new RegExp(homeDir, 'g'), '~').replace(/\\/g, '/');
};

export const discordCodeBlock = (str: string | number): string => {
  return `\`\`\`\n${str}\n\`\`\``;
};

// Rounded to 3 decimals
export const byteToGB = (bytes: number): string => {
  return (bytes / 1e9).toFixed(2);
};

export const msToFormatted = (ms: number): string => {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
};

export const makeUserErrorEmbed = (err: string): MessageEmbed => {
  return new MessageEmbed()
    .setColor('RED')
    .setTimestamp()
    .setTitle('❌ Error Encountered ❌')
    .setDescription(discordCodeBlock(err))
    .setFooter('Project Error Team');
};

export const makeErrorEmbed = (err: Error, showStack?: boolean): MessageEmbed => {
  const embed = new MessageEmbed()
    .setColor('RED')
    .setTitle('❌ Internal Error Encountered ❌')
    .setTimestamp()
    .setFooter('If this is a consistent error, please contact the staff team');

  if (showStack) {
    const formatStack = discordCodeBlock(cleanStack(<string>err.stack));
    embed.setDescription(formatStack);
  } else {
    embed.setDescription(discordCodeBlock(err.message));
  }

  return embed;
};

// eslint-disable-next-line
export const noop = () => {};

export const makeSimpleEmbed = (
  message: string,
  color: ColorResolvable = 'RANDOM'
): MessageEmbed => {
  return new MessageEmbed().setColor(color).setDescription(message);
};

export const convertNanoToMs = (nanoSecs: bigint): number => Number(nanoSecs) / 1e6;

export const parseDateFromStr = (str: string): Dayjs | null => {
  const type = str[str.length - 1];
  const number = parseInt(str.slice(0, -1));
  switch (type) {
    case 'h':
      return dayjs().add(number, 'hours');
    case 'd':
      return dayjs().add(number, 'days');
    case 'm':
      return dayjs().add(number, 'months');
    case 'y':
      return dayjs().add(number, 'years');
  }
  return null;
};
