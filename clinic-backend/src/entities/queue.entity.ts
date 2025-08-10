
// src/entities/queue.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

@Entity('queue')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column({ nullable: true })
  doctor_id: number;

  @Column()
  queue_number: number;

  @Column({ type: 'enum', enum: ['normal', 'urgent', 'emergency'], default: 'normal' })
  priority: string;

  @Column({ type: 'enum', enum: ['waiting', 'with_doctor', 'completed', 'cancelled'], default: 'waiting' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, patient => patient.queue_entries)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctor, doctor => doctor.queue_entries)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
