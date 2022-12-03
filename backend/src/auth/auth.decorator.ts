import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles, ROLES_KEY } from "src/roles/roles.decorator";
import { RolesGuard } from "src/roles/roles.guard";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { UserRole } from "@prisma/client";

export function Protected(roles?: UserRole[]) {
  return applyDecorators(
    Roles(roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
