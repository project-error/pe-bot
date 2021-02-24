import { InfractionsRepo, NewInfraction } from './InfractionsRepo';
import { Connection, EntityRepository } from 'typeorm';
import { Ban } from '../models/Ban';

interface NewBan extends NewInfraction {
  perma: boolean;
  unbanDate: Date | null;
}

@EntityRepository(Ban)
export default class BansRepo extends InfractionsRepo<Ban> {
  async createNewBan({ perma, unbanDate, reason, userId, modId }: NewBan): Promise<Ban> {
    const ban = new Ban();
    ban.perma = perma;
    ban.unbanDate = unbanDate;
    ban.reason = reason;
    ban.userId = userId;
    ban.modId = modId;
    return await this.save(ban);
  }
}

export const getBansRepo = (connection: Connection): BansRepo =>
  connection.getCustomRepository(BansRepo);
