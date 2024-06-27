import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entity/users.entity';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewsModel } from './reviews/entity/reviews.entity';
import { StoresModule } from './stores/stores.module';
import { ThemesModule } from './stores/themes/themes.module';
import { ThemesModel } from './stores/themes/entity/themes.entity';
import { StoresModel } from './stores/entity/stores.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(ENV_DB_HOST_KEY),
        port: parseInt(configService.get<string>(ENV_DB_PORT_KEY), 10),
        username: configService.get<string>(ENV_DB_USERNAME_KEY),
        password: configService.get<string>(ENV_DB_PASSWORD_KEY),
        database: configService.get<string>(ENV_DB_DATABASE_KEY),
        entities: [UsersModel, ReviewsModel, StoresModel, ThemesModel],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    ReviewsModule,
    StoresModule,
    ThemesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
