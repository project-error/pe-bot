import {InfractionsRepo, NewInfraction} from "./InfractionsRepo";
import {Connection, EntityRepository} from "typeorm";
import {Warning} from "../models/Warning";


@EntityRepository(Warning)
export default class WarningsRepo extends InfractionsRepo<Warning> {
  async createNewWarning({ reason, userId, modId}: NewInfraction): Promise<Warning> {
    const warning = new Warning()
    warning.reason = reason
    warning.userId = userId
    warning.modId = modId
    return await this.save(warning)
  }
}

export const getBansRepo = (connection: Connection): WarningsRepo => connection.getCustomRepository(WarningsRepo)

