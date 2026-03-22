import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { DateUtil } from '../../common/utils/date.utils';

export abstract class BaseEntity {
  @Column({ type: 'bigint' })
  createdOn: number;

  @Column({ type: 'bigint' })
  updatedOn: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @BeforeInsert()
  setCreatedOn() {
    this.createdOn = DateUtil.now();
    this.updatedOn = DateUtil.now();
  }

  @BeforeUpdate()
  setUpdatedOn() {
    this.updatedOn = DateUtil.now();
  }
}
