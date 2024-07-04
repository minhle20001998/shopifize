import { DataSource } from "typeorm";
import config from "./config";
const Database = new DataSource(config);

export * from "reflect-metadata";
export * from "typeorm";
export * from "./entity";
export * from './helpers'
export default Database;
