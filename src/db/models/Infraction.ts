import { Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

export abstract class Infraction {
  @PrimaryGeneratedColumn()
  infractionID!: number

  @Column()
  type!: string

  @Column()
  userId!: string

  @Column()
  modId!: string

  @Column()
  reason!: string

  @CreateDateColumn()
  date!: string
}