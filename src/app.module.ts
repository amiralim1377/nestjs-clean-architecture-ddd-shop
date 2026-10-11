import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './shared/infrastructure/database/mongodb/mongodb.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
