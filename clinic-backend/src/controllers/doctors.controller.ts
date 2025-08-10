import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DoctorsService } from '../services/doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from '../dto/doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('specialization') specialization?: string,
    @Query('location') location?: string,
  ) {
    return this.doctorsService.findAll(search, specialization, location);
  }

  @Get('specializations')
  getSpecializations() {
    return this.doctorsService.getSpecializations();
  }

  @Get('locations')
  getLocations() {
    return this.doctorsService.getLocations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}

