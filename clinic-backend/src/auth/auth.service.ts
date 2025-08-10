// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.userRepository.findOne({ where: { username } });
  //   if (user && await bcrypt.compare(password, user.password)) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  async validateUser(username: string, password: string): Promise<any> {
    console.log('Validating:', username, password);
    const user = await this.userRepository.findOne({ where: { username } });
    console.log('DB user found:', user);
  
    // if (user && await bcrypt.compare(password, user.password)) {
    //   console.log('Password match');
    //   const { password, ...result } = user;
    //   return result;
    // }
  //TEMPORARY FIX

  if (user && (user.password === password || await bcrypt.compare(password, user.password))) {
    const { password, ...result } = user;
    return result;
  }
    console.log('Invalid username or password');
    return null;
  }
  
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }
}
