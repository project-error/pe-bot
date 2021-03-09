import {Collection} from "discord.js";
import {Logger} from "tslog";

interface StickyMessage {
  msgID: string
  content: string
}

export default class StickyMessageService {
  private _channelsHandling = new Collection<string, StickyMessage>()
  private readonly _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger.getChildLogger({
      name: 'StickyMessageService',
      prefix: ['[StickyMessageService]']
    })
    this._logger.info('Initializing StickyMessageService')
  }

  public getStickyMsg(channelId: string) {
    return this._channelsHandling.get(channelId)
  }

  public channelHasStickyMsg(channelId: string): boolean {
    return this._channelsHandling.has(channelId)
  }

  public setStickyMsg(channelId: string, stickyMsg: StickyMessage): void {
    this._logger.debug(`Add sticky message to ${channelId}`, stickyMsg)
    this._channelsHandling.set(channelId, stickyMsg)
  }

  public removeStickyMsg(channelId: string): boolean {
    this._logger.debug(`Removing sticky message from ${channelId}`)
    return this._channelsHandling.delete(channelId)
  }

  public restartService(): void {
    this._logger.info('Restarting Sticky Message Service')
    this._channelsHandling.clear()
  }

  public getMessageServiceMap(): Collection<string, StickyMessage> {
    return this._channelsHandling
  }
}