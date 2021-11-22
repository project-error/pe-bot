import { Command, CommandHandler } from 'discord-akairo';
import { Logger } from 'tslog';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';
import { makeSimpleEmbed } from '../../utils';
import { stripIndents } from 'common-tags';
import { Branch, GHCommit, GHRepoResp } from '../../types/github.types';

export default class GHRepoCommand extends Command {
  private log: Logger;

  private ghClient = axios.create({
    headers: {
      Authorization: `token ${process.env.GH_TOKEN}`,
    },
    baseURL: 'https://api.github.com',
  });

  constructor(handler: CommandHandler) {
    super('gh-repo', {
      category: 'Github',
      channel: 'guild',
      args: [
        {
          id: 'query',
          match: 'restContent',
          prompt: {
            start: 'You must provide a repo name',
            retry: 'You must provide a repo name',
          },
        },
      ],
    });

    this.log = handler.client.log.getChildLogger({
      name: 'gh-repo-cmd',
      prefix: ['[gh-repo-cmd]'],
    });
  }

  private findRepoWithName(name: string, repos: GHRepoResp[]): GHRepoResp | null {
    const lowerCaseName = name.toLowerCase();

    for (const repo of repos) {
      if (repo.name.toLowerCase() === lowerCaseName) {
        return repo;
      }
    }

    return null;
  }

  private async makeRespEmbed(tgtRepo: GHRepoResp): Promise<MessageEmbed> {
    const repoStats = await this.ghClient.get<Branch>(
      `repos/${tgtRepo.full_name}/branches/master`
    );

    this.log.debug(repoStats.data);

    const embedDesc = stripIndents`
      ⭐️ Stars: ${tgtRepo.stargazers_count}
      
      [**Pull Requests**](https://github.com/${tgtRepo.full_name}/pulls)
      [**Issues**](https://github.com/${tgtRepo.full_name}/issues)
      
      **Description**:
      ${tgtRepo.description}
      
      **[Latest Commit](${repoStats.data.commit.html_url})
       \`${repoStats.data.commit.commit.message}\`**
    `;

    return new MessageEmbed()
      .setTitle(`Project Error - ${tgtRepo.name}`)
      .setDescription(embedDesc)
      .setURL(tgtRepo.html_url)
      .setThumbnail(tgtRepo.owner.avatar_url)
      .setFooter('Repository was last updated')
      .setTimestamp(tgtRepo.updated_at);
  }

  public async exec(msg: Message, { query }: { query: string }): Promise<Message> {
    await msg.util!.send(makeSimpleEmbed(`🕓 Loading data for "${query}"`, 'GREEN'));

    const respData = await this.ghClient.get<GHRepoResp[]>(
      '/orgs/project-error/repos?type=public'
    );

    const tgtRepo = this.findRepoWithName(query, respData.data);

    if (!tgtRepo) {
      return msg.util!.send(
        makeSimpleEmbed(`Unable to find a repo with name "${query}"`, 'RED')
      );
    }

    const respEmbed = await this.makeRespEmbed(tgtRepo);
    return await msg.util!.send(respEmbed);
  }
}
