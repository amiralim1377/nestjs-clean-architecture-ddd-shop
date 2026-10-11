import { Global, Module } from '@nestjs/common';
import { MongoProvider } from './mongo.provider.js';

@Global()
@Module({
  providers: [MongoProvider],
  exports: [MongoProvider],
})
export class MongodbModule {}
