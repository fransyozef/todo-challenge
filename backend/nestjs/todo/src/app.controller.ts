import { Controller, Get } from '@nestjs/common';
import { prisma } from 'generated/prisma-client';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('todo/create')
  async getItems() {

    const newTodoItem = await prisma.createTodoItem({
      title : 'test',
    });
    // tslint:disable-next-line:no-console
    console.log(`Created a new todo item: `, newTodoItem);

    return newTodoItem;
  }

}
