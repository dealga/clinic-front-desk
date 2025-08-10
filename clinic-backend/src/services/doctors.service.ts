import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto } from '../dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(search?: string, specialization?: string, location?: string): Promise<Doctor[]> {
    const query = this.doctorsRepository.createQueryBuilder('doctor')
      .where('doctor.is_active = :isActive', { isActive: true });

    if (search) {
      query.andWhere('doctor.name LIKE :search', { search: `%${search}%` });
    }

    if (specialization) {
      query.andWhere('doctor.specialization = :specialization', { specialization });
    }

    if (location) {
      query.andWhere('doctor.location LIKE :location', { location: `%${location}%` });
    }

    const doctor =  await query.getMany();
    console.log('📦 doctors fetched from DB:', doctor);

    return doctor;
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['appointments', 'queue_entries'],
    });
    
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    await this.doctorsRepository.update(id, updateDoctorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.doctorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async getSpecializations(): Promise<string[]> {
    const result = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .select('DISTINCT doctor.specialization', 'specialization')
      .where('doctor.is_active = :isActive', { isActive: true })
      .getRawMany();
    
    return result.map(item => item.specialization);
  }

  async getLocations(): Promise<string[]> {
    const result = await this.doctorsRepository
      .createQueryBuilder('doctor')
      .select('DISTINCT doctor.location', 'location')
      .where('doctor.is_active = :isActive', { isActive: true })
      .getRawMany();
    
    return result.map(item => item.location);
  }
}

