import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { AdminModule } from './admin/admin.module';
import { NinModule } from './nin/nin.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    UsersModule,
    ProgrammesModule,
    AdminModule,
    NinModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.development.local.local',
        '.env.production.local.local',
      ],
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
