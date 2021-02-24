import { EntityRepository } from 'typeorm';
import { InfractionsRepo, NewInfraction } from './InfractionsRepo';
import { Kick } from '../models/Kick';

@EntityRepository(Kick)
export default class KicksRepo extends InfractionsRepo<Kick> {
  async createNewKick({ reason, userId, modId }: NewInfraction): Promise<Kick> {
    const newKick = new Kick();
    newKick.reason = reason;
    newKick.userId = userId;
    newKick.modId = modId;
    return await this.save(newKick);
  }
}
