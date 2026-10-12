import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './shared/infrastructure/database/mongodb/mongodb.module.js';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './product/presentation/product.controller.js';
import { ProductModule } from './product/product.module.js';
import { CustomersModule } from './customers/customers.module.js';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    DrizzleModule,
    ProductModule,
    CustomersModule,
  ],
  controllers: [ProductsController],
  providers: [],
})
export class AppModule {}
