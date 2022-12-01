import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" }, // e.g. 7d, 24h
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
