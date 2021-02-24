import { Infraction } from './Infraction';
import { Column, Entity } from 'typeorm';

@Entity()
export class Warning extends Infraction {
  @Column()
  type = 'warning';
}
