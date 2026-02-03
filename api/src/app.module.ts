import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      connectionFactory: (connection) => {
        console.log('✅ MongoDB connected:', connection.name);
        return connection;
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController], // ✅ UNIQUEMENT
  providers: [AppService],       // ✅ UNIQUEMENT
})
export class AppModule {}
