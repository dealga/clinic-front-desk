import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from '../services/appointments.service';
import { AppointmentsController } from '../controllers/appointments.controller';
import { Appointment } from '../entities/appointment.entity';
import { PatientsModule } from './patients.module';
import { DoctorsModule } from './doctors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), PatientsModule, DoctorsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

