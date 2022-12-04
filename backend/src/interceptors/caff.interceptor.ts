import { applyDecorators, BadRequestException, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { User } from "@prisma/client";

export function CaffInterceptor() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor("file", {
        dest: "./uploads",
        limits: {
          fileSize: +process.env.MAX_FILE_SIZE ?? 25000000,
        },
        fileFilter: (_, file, cb) => {
          const fileType = file.originalname.slice(-5);
          const allowedFileTypes = [".ciff", ".caff"];

          if (allowedFileTypes.includes(fileType)) {
            return cb(null, true);
          }

          cb(new BadRequestException("File must be a ciff or caff file"), false);
        },
        storage: diskStorage({
          destination: (req, file, cb) => {
            const baseDirectory = "./uploads";
            const pathName = `${baseDirectory}/${(req.user as User).id}`;

            if (!existsSync(baseDirectory)) {
              mkdirSync(baseDirectory);
            }

            if (!existsSync(pathName)) {
              mkdirSync(pathName);
            }

            cb(null, pathName);
          },
          filename: (_, file, cb) => {
            const fileType = file.originalname.slice(-5);
            const fileName = file.originalname.slice(0, -5);
            fileName.replace(/;|&/g, "_");
            fileType.replace(/;|&/g, "");

            const savedFileName = `${Date.now()}_${fileName}${fileType}`;
            cb(null, savedFileName);
          },
        }),
      }),
    ),
  );
}
