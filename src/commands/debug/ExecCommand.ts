import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import { exec, ChildProcess } from 'child_process';

export default class ExecCommand extends Command {
  public constructor() {
    super('exec', {
      aliases: ['exec'],
      description: {
        content: 'Runs shell commands for debug and the meme',
        usage: 'exec <command> [...args]',
        examples: ['exec pwd', 'exec curl https://tasoagc.dev'],
      },
      category: 'Debug',
      ownerOnly: true,
      args: [
        {
          id: 'content',
          match: 'rest',
          prompt: {
            start: (message: Message) =>
              `${message.author}, what commands do you want to exec?`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { content }: { content: string }
  ): Promise<ChildProcess> {
    return exec(
      content,
      async (error, stdout): Promise<void> => {
        let output = (error || stdout) as string | string[];
        output = Util.splitMessage(`\`\`\`javascript\n${output}\`\`\``);
        for (const o of output) message.util!.send(o);
      }
    );
  }
}
