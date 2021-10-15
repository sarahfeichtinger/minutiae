import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finger } from '../fingers/entities/finger.entity';
import { FingersService } from '../fingers/fingers.service';
import { User } from '../users/entities/user.entity';
import { Door } from '../doors/entities/door.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [MqttController],
  imports: [
    TypeOrmModule.forFeature([Finger, User, Door]),
    ClientsModule.register([
      {
        name: 'MQ_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
    UsersModule,
  ],
  providers: [FingersService],
})
export class MqttModule {}
