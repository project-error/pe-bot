import { Connection, Repository } from 'typeorm';

export interface NewInfraction {
  modId: string;
  userId: string;
  type?: string;
  reason: string;
}

export abstract class InfractionsRepo<T> extends Repository<T> {
  async getInfractionsForId(userId: string): Promise<T[] | null> {
    return (await this.find({ where: { userId } })) ?? null;
  }

  async getInfractionsByMod(modId: string): Promise<T[] | null> {
    return (await this.find({ where: { modId } })) ?? null;
  }
}
