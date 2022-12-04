import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HistoryModule } from "src/history/history.module";
import { AuthModule } from "../auth/auth.module";
import { ListingModule } from "../listing/listing.module";
import { UserModule } from "../user/user.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ListingModule,
    UserModule,
    HistoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
