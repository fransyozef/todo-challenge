import { Controller, Get, Post, Res, HttpStatus, UseGuards, Param, Req, Body, Put, Delete } from '@nestjs/common';
import { Response, Request } from 'express';
import { prisma, TodoItem } from '../__generated/prisma-client';
import { Logger } from '@nestjs/common';

@Controller('todo')
export class TodoController {

    // get all items
    @Get('')
    async getItems() {
        const items: TodoItem[] = await prisma.todoItems();
        return items;
    }

    // get one item
    @Get(':id')
    async get(@Res() res: Response, @Body() body) {
        res.status(HttpStatus.OK).json({
            success: true,
            body,
        });
    }

    // add an item
    @Post('')
    async add(@Res() res: Response, @Body() body) {

        const newItem: TodoItem = await prisma.createTodoItem({
            title: body.title,
            completed: body.completed,
        });

        res.status(HttpStatus.OK).json({
            success: true,
            result: newItem,
        });
    }

    // update an item
    @Put(':id')
    async update(@Res() res: Response, @Body() body) {
        res.status(HttpStatus.OK).json({
            success: true,
        });
    }

    // delete an item
    @Delete(':id')
    async delete(@Res() res: Response, @Body() body, @Param() params) {
        let success    = true;

        try {
            const deletedItem: TodoItem    = await prisma.deleteTodoItem({ id : params.id });
        } catch (e) {
            success    = false;
        }

        res.status(HttpStatus.OK).json({
            success,
        });
    }

}
