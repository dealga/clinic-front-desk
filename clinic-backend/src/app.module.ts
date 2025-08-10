// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './modules/doctors.module';
import { PatientsModule } from './modules/patients.module';
import { QueueModule } from './modules/queue.module';
import { AppointmentsModule } from './modules/appointments.module';

import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { Queue } from './entities/queue.entity';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'clinic_frontend_system',
      entities: [User, Doctor, Patient, Queue, Appointment],
      synchronize: process.env.NODE_ENV !== 'production', // Only in development
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    DoctorsModule,
    PatientsModule,
    QueueModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

