import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { FingersService } from './fingers.service';
import { CreateFingerDto } from './dto/create-finger.entity';
import { ClientProxy } from '@nestjs/microservices';

@Controller('fingers')
export class FingersController {
  constructor(
    private readonly fingersService: FingersService,
    @Inject('MQ_CLIENT') private client: ClientProxy,
  ) {
    client.connect();
  }

  @Get('fingerSessionExpireTime/:timeInMinutes')
  createFingerSessionExpireTime(@Param('timeInMinutes') timeInMinutes: string) {
    // Is reseted when backend is restarted
    process.env.CREATE_FINGER_SESSION_EXPIRES = timeInMinutes;
  }

  @Post()
  async create(@Body() createFingerDto: CreateFingerDto) {
    const sessionId = await this.fingersService.create(createFingerDto); // returns sessionId from finger

    this.client.emit('ENROLL', {
      run: true,
    }); // enroll: true - start enroll mode (=scan)

    return sessionId;
  }

  @Get('status/:sessionId')
  async getCreateFingerStatus(@Param('sessionId') sessionId: string) {
    const status = await this.fingersService.getCreateStatus(sessionId);

    if (status === 'expired') {
      this.client.emit('ENROLL', { run: false }); // enroll: false - stop enroll mode (=scan)
    }

    return {
      status: status,
    };
  }

  // Cancel finger scan
  @Get('stop/:sessionId')
  async stopCreateFinger(@Param('sessionId') sessionId: string) {
    this.client.emit('ENROLL', { run: false });
    return this.fingersService.removeBySessionId(sessionId);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    const finger = await this.fingersService.removeForUser(userId);
    this.client.emit('DELETE', { externalFingerId: finger.externalFingerId });
    return finger.removed;
  }
}
