import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { AdminModule } from './admin/admin.module';
import { NinModule } from './nin/nin.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FormfieldModule } from './formfield/formfield.module';
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
        'src/config/.env.development.local',
        'src/config/.env.production.local',
      ],
      load: [configuration],
    }),
    FormfieldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
