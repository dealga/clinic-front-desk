import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from '../entities/queue.entity';
import { CreateQueueDto, UpdateQueueDto } from '../dto/queue.dto';
import { PatientsService } from './patients.service';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private patientsService: PatientsService,
  ) {}

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    // Check if patient exists
    await this.patientsService.findOne(createQueueDto.patient_id);

    // Get next queue number
    const lastQueue = await this.queueRepository
      .createQueryBuilder('queue')
      .where('DATE(queue.created_at) = CURDATE()')
      .orderBy('queue.queue_number', 'DESC')
      .getOne();

    const queueNumber = lastQueue ? lastQueue.queue_number + 1 : 1;

    const queue = this.queueRepository.create({
      ...createQueueDto,
      queue_number: queueNumber,
    });

    return this.queueRepository.save(queue);
  }

  async findAll(status?: string, priority?: string): Promise<Queue[]> {
    const query = this.queueRepository.createQueryBuilder('queue')
      .leftJoinAndSelect('queue.patient', 'patient')
      .leftJoinAndSelect('queue.doctor', 'doctor')
      .where('DATE(queue.created_at) = CURDATE()')
      .orderBy('queue.priority', 'DESC')
      .addOrderBy('queue.queue_number', 'ASC');

    if (status) {
      query.andWhere('queue.status = :status', { status });
    }

    if (priority) {
      query.andWhere('queue.priority = :priority', { priority });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Queue> {
    const queue = await this.queueRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    
    if (!queue) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }
    
    return queue;
  }

  async update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue> {
    const queue = await this.findOne(id);
    
    // Prevent updating completed or cancelled entries
    if (queue.status === 'completed' || queue.status === 'cancelled') {
      throw new BadRequestException('Cannot update completed or cancelled queue entries');
    }

    await this.queueRepository.update(id, updateQueueDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.queueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }
  }

  async getQueueStats(): Promise<any> {
    const stats = await this.queueRepository
      .createQueryBuilder('queue')
      .select('queue.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('DATE(queue.created_at) = CURDATE()')
      .groupBy('queue.status')
      .getRawMany();

    return stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});
  }
}

