import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { PositionsModule } from './positions/positions.module';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './product/product.module';
import { SupplyModule } from './supply/supply.module';

@Module({
    imports: [DatabaseModule, UsersModule, AuthModule, ManufacturerModule, OrdersModule, ProductModule, SupplyModule, PositionsModule],
})

export class AppModule {}