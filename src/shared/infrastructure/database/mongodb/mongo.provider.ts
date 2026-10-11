import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

export const MONGO_DB = Symbol('MONGO_DB');

export const MongoProvider = {
  provide: MONGO_DB,
  inject: [ConfigService],

  useFactory: async (configService: ConfigService): Promise<Db> => {
    const url = configService.getOrThrow<string>('MONGODB_URL');
    const dbName = configService.getOrThrow<string>(
      'MONGO_DB_NAME',
      'clean_shop',
    );

    const client = new MongoClient(url);

    await client.connect();

    return client.db(dbName);
  },
};
