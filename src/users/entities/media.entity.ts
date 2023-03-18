import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'media' })
export class Media extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', unique:true, length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 100 })
  status: string;

  @Column({ type: 'boolean', default: false, select: false })
  isDeleted: boolean;
}
