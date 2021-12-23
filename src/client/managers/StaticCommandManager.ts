import { Manager } from '../../structures/managers/Manager';
import { Logger } from 'tslog';
import fs from 'fs';
import path from 'path';
import StaticCommandBase, { StaticCommandFile } from '../../structures/StaticCommandBase';

export default class StaticCommandManager extends Manager {
  private basePath = path.join(process.cwd(), 'static', 'commands');

  private log = new Logger({
    name: 'StaticCmdManager',
    prefix: ['[StaticCmdManager]'],
  });

  constructor() {
    super('StaticCmd', {
      category: 'other',
    });
  }

  public exec(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath);
    }

    const fileNames = fs.readdirSync(this.basePath);

    for (const file of fileNames) {
      try {
        const fileWithoutExt = file.replace(/\.[^/.]+$/, '');
        const fileRawContent = fs.readFileSync(path.join(this.basePath, file), 'utf-8');
        const decodeContent: StaticCommandFile = JSON.parse(fileRawContent);
        const staticCommand = new StaticCommandBase(fileWithoutExt, decodeContent);
        this.client.commandHandler.register(staticCommand);
        this.log.debug(`Register new static command ${fileWithoutExt}`);
      } catch (e) {
        this.log.error('Registering Static Commands Failed', e);
      }
    }
  }
}
