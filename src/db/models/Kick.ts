import { Infraction } from './Infraction';
import { Column, Entity } from 'typeorm';

@Entity()
export class Kick extends Infraction {
  @Column()
  type = 'kick';
}
