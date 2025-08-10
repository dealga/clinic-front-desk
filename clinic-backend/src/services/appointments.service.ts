import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { PatientsService } from './patients.service';
import { DoctorsService } from './doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Verify patient and doctor exist
    await this.patientsService.findOne(createAppointmentDto.patient_id);
    await this.doctorsService.findOne(createAppointmentDto.doctor_id);

    // Check if slot is available
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctor_id: createAppointmentDto.doctor_id,
        appointment_date: new Date(createAppointmentDto.appointment_date),
        appointment_time: createAppointmentDto.appointment_time,
        status: 'booked',
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('This time slot is already booked');
    }

    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(
    doctorId?: number,
    patientId?: number,
    date?: string,
    status?: string,
  ): Promise<Appointment[]> {
    const query = this.appointmentsRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .orderBy('appointment.appointment_date', 'ASC')
      .addOrderBy('appointment.appointment_time', 'ASC');

    if (doctorId) {
      query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
    }

    if (patientId) {
      query.andWhere('appointment.patient_id = :patientId', { patientId });
    }

    if (date) {
      query.andWhere('appointment.appointment_date = :date', { date });
    }

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // If rescheduling, check new slot availability
    if (updateAppointmentDto.appointment_date || updateAppointmentDto.appointment_time) {
      const newDate = updateAppointmentDto.appointment_date || appointment.appointment_date;
      const newTime = updateAppointmentDto.appointment_time || appointment.appointment_time;

      const existingAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctor_id: appointment.doctor_id,
          appointment_date: new Date(newDate),
          appointment_time: newTime,
          status: 'booked',
        },
      });

      if (existingAppointment && existingAppointment.id !== id) {
        throw new BadRequestException('This time slot is already booked');
      }
    }

    await this.appointmentsRepository.update(id, updateAppointmentDto);
    return this.findOne(id);
  }

  async cancel(id: number): Promise<Appointment> {
    return this.update(id, { status: 'cancelled' });
  }

  async reschedule(id: number, newDate: string, newTime: string): Promise<Appointment> {
    return this.update(id, { 
      appointment_date: newDate, 
      appointment_time: newTime,
      status: 'rescheduled'
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  async getAvailableSlots(doctorId: number, date: string): Promise<string[]> {
    const doctor = await this.doctorsService.findOne(doctorId);
    
    // Parse doctor availability (simplified - assumes JSON format)
    let availability;
    try {
      availability = JSON.parse(doctor.availability || '{}');
    } catch {
      availability = {};
    }

    // const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayOfWeek = new Date(date)
  .toLocaleDateString('en-US', { weekday: 'long' }) // valid values: long, short, narrow
  .toLowerCase(); // convert result to lowercase

    const daySlots = availability[dayOfWeek] || [];

    if (daySlots.length === 0) {
      return [];
    }

    // Get booked appointments for the day
    const bookedAppointments = await this.appointmentsRepository.find({
      where: {
        doctor_id: doctorId,
        appointment_date: new Date(date),
        status: 'booked',
      },
    });

    const bookedTimes = bookedAppointments.map(apt => apt.appointment_time);

    // Generate available slots (simplified - 30-minute slots)
    const availableSlots = [];
    for (const timeRange of daySlots) {
      const [start, end] = timeRange.split('-');
      const startTime = new Date(`2000-01-01T${start}:00`);
      const endTime = new Date(`2000-01-01T${end}:00`);

      let currentTime = new Date(startTime);
      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().substr(0, 5);
        if (!bookedTimes.includes(timeString)) {
          availableSlots.push(timeString);
        }
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    }

    return availableSlots;
  }
}