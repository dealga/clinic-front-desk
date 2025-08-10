// src/entities/doctor.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from './appointment.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  availability: string; // JSON string

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Queue, queue => queue.doctor)
  queue_entries: Queue[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
}

