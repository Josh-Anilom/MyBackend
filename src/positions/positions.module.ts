import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}