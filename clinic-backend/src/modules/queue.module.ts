import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from '../services/queue.service';
import { QueueController } from '../controllers/queue.controller';
import { Queue } from '../entities/queue.entity';
import { PatientsModule } from './patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), PatientsModule],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

