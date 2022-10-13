import { Injectable } from '@nestjs/common';
const addon = require('../../build/Release/addon.node');

@Injectable()
export class AppService {
  getHello(): string {
    console.log(addon.hello());
    return 'Hello World!';
  }
}
