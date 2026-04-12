import { DateUtil } from 'service_reminder_common';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

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
    this.createdOn = DateUtil.toEpoch(new Date());
    this.updatedOn = DateUtil.toEpoch(new Date());
  }

  @BeforeUpdate()
  setUpdatedOn() {
    this.updatedOn = DateUtil.toEpoch(new Date());
  }
}
