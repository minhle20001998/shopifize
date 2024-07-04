import * as dotenv from "dotenv";
import path from "path";
import { DataSourceOptions, MixedList } from "typeorm";
import fs from "fs";
import { Profile, Role, User, Address, Product, Category, ProductStatus, ProductVariant, Comment, Ranking, Cart, CartItem } from "./entity";
import { SubCategory } from "./entity/SubCategory";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
import { Payment } from "./entity/Payment";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const migrationPath = path.join(__dirname, "/migration");

const migrationFiles = fs
  .readdirSync(migrationPath)
  // .filter((file) => file.endsWith(isThisBuilt ? ".js" : ".ts"))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => {
    return Object.values(require(path.join(migrationPath, file)))[0];
  });

const config: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRESQL_ROOT_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DB,
  synchronize: false,
  logging: true,
  entities:
    [Profile, User, Role,
      Address, Product, ProductStatus,
      ProductVariant, Category, SubCategory,
      Ranking, Comment, Cart, CartItem, Order, OrderItem, Payment
    ],
  migrations: [...migrationFiles] as MixedList<string | Function>,
  migrationsTableName: "custom_migration_table",
  subscribers: ["dist/subscriber/**/*.ts"],
};

export default config;
