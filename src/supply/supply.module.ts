import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}