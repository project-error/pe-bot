import { Command, Flag } from 'discord-akairo';

export default class GHParentCommand extends Command {
  constructor() {
    super('github', {
      description: {
        content: 'Github subcommands',
        usage: 'gh [repo/issue/pr]',
        example: 'gh repo npwd',
      },
      aliases: ['github', 'gh'],
      channel: 'guild',
    });
  }

  *args() {
    const command = yield {
      type: [
        ['gh-repo', 'repo'],
        // ['gh-issue', 'issue'],
        // ['gh-pr', 'pr'],
      ],
      prompt: {
        start: () => `Please use a valid command (repo/issue/pr)`,
        retry: () => `Please use a valid command (repo/issue/pr)`,
      },
    };

    if (command) return Flag.continue(command);
  }
}
