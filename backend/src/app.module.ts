import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { DocumentsModule } from './documents/documents.module';
import { VerificationModule } from './verification/verification.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { PurchaseModule } from './purchase/purchase.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { LeasesModule } from './leases/leases.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    UsersModule, 
    PropertiesModule, 
    DocumentsModule, 
    VerificationModule, 
    AssignmentsModule, 
    PurchaseModule, 
    MaintenanceModule, 
    LeasesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
