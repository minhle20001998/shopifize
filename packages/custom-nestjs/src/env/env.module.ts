import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Global,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as fs from 'fs';
import * as _ from 'lodash';
import { resolve, join } from 'path';
import { EnvService } from './env.service';

interface EnvModuleOptions {
  class: ClassConstructor<object>;
  env?: string;
}

const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<EnvModuleOptions>().build();

@Global()
@Module({})
export class EnvModule extends ConfigurableModuleClass {
  public static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => this.validate(options.class, this.load(options.env))],
        }),
      ],
      providers: [EnvService],
      exports: [EnvService],
    };
  }

  private static load(env?: string) {
    let config: Record<string, unknown> = {};
    const [root, extension] = ['config', '.json'];
    const configs = [
      'global',
      env ? `global.${env}` : false,
      'local',
      env ? `local.${env}` : false,
    ];

    const configFilePaths = configs
      .filter(Boolean)
      .map(String)
      .map((name) => resolve(join(process.cwd(), root), name + extension))
      .filter((path) => fs.existsSync(path));

    const readJson = (filePath: string) => {
      return (JSON.parse(fs.readFileSync(filePath, 'utf-8')) ??
        {}) as typeof config;
    };

    for (const configFilePath of configFilePaths)
      config = _.merge(config, readJson(configFilePath));

    return config;
  }

  private static validate<T extends object>(
    klass: ClassConstructor<T>,
    config: T,
  ) {
    const validatedConfig = plainToClass(klass, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) throw new Error(errors.toString());
    return validatedConfig;
  }
}
