import { AkairoModule } from 'discord-akairo';
import { noop } from '../../utils';

interface IManagerOptions {
  category?: string;
  categoryId?: string;
}

export class Manager extends AkairoModule {
  constructor(id: string, options: IManagerOptions = {}) {
    super(id, options);
  }

  public exec(): void {
    this.client.log.error('EXEC NOT IMPLEMENTED IN MANAGER');
  }

  /**
   * Fired when the client is ready for the first time
   */
  public onReady(): void {
    noop();
  }
}
