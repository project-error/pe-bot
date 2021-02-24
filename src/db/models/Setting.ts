import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class GuildSetting {
  @PrimaryColumn()
  guildId!: string;

  @Column()
  prefix!: string;

  @Column()
  krakenLogChannel!: string;
}
