import path from 'path';

export const PREFIX = '$';
export const DEFAULT_COOLDOWN = 9000;
export const OWNER_IDS = ['188181246600282113'];
export const LOG_OUTPUT_PATH = path.resolve('logs');

export const RULES = [
  'Do not be rude to people.',
  "Do not insult or compare people's work to others.",
  'Do not ping devs, nor dm them.',
  'Do not spam your server in any channel nor DM.',
  'Do not post any NSFW content.',
  "Do not use or post stolen work without the creator's permission",
  'Use the specific channels accordingly.',
  'If you have a question, wait patiently. Everyone has something to do in their life.',
  'We are a community, not everyone might have the same level of coding so do not be embarrassed of your work or level. Ask questions.',
];

export const FILTER_WHITELIST_ROLES = [
  '758509456920281088',
  '791854853327814718',
  '795414418099535912',
  '795404623548121098',
];

export const EightBallResponses = [
  "Don't count on it",
  'As I see it, yes',
  'Ask again later.',
  'Better not tell you now',
  'Cannot predict at this moment',
  'Concentrate and ask again',
  'It is certain',
  'It is decidely so',
  'Most likely',
  'My reply is no',
  'My sources say no',
  "Outlook isn't good",
  'Outlook is good',
  'Reply hazy, try again',
  'All signs point to yes',
  'Very doubtful',
  'Without a doubt',
  'Yes',
  'Yes - definitely',
  'You may rely on it',
];

export const LatestCommandInterval = 10 * 60000;