import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 15432,
  username: 'postgres',
  password: 'password',
  database: 'docker',
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: true,
  entities: ["src/entity/*{.ts,.js}"],
  migrations: ["src/migrations/*.ts"],
});
