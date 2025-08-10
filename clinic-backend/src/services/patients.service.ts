import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create(createPatientDto);
    return this.patientsRepository.save(patient);
  }

  // async findAll(search?: string): Promise<Patient[]> {
  //   const query = this.patientsRepository.createQueryBuilder('patient');

  //   if (search) {
  //     query.where('patient.name LIKE :search OR patient.phone LIKE :search', { 
  //       search: `%${search}%` 
  //     });
  //   }

  //   return query.getMany();
  // }

  async findAll(search?: string): Promise<Patient[]> {
    console.log('🔍 findAll() called with search:', search);
  
    const query = this.patientsRepository.createQueryBuilder('patient');
  
    if (search) {
      console.log('📌 Applying search filter...');
      query.where(
        'patient.name LIKE :search OR patient.phone LIKE :search',
        { search: `%${search}%` }
      );
    }
  
    const patients = await query.getMany();
    console.log('📦 Patients fetched from DB:', patients);
  
    return patients;
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['appointments', 'queue_entries'],
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return patient;
  }

  async findByPhone(phone: string): Promise<Patient> {
    return this.patientsRepository.findOne({ where: { phone } });
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    await this.patientsRepository.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.patientsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
}

