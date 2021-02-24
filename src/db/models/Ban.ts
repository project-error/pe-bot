import { Infraction } from './Infraction';
import { Column, Entity } from 'typeorm';

@Entity()
export class Ban extends Infraction {
  @Column()
  type = 'ban';

  @Column({
    type: 'date',
    nullable: true,
  })
  unbanDate!: Date | null;

  @Column({
    default: false,
  })
  perma!: boolean;
}
