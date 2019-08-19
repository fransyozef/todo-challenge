import { Controller, Get } from '@nestjs/common';
import { prisma } from './__generated/prisma-client';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '';
  }

}
