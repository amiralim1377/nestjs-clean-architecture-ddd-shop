import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './shared/infrastructure/database/mongodb/mongodb.module.js';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module.js';
import { ProductController } from './product/presentation/product.controller.js';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    DrizzleModule,
  ],
  controllers: [ProductController],
  providers: [],
})
export class AppModule {}
