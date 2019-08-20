import { Controller, Get, Post, Res, HttpStatus, UseGuards, Param, Req, Body, Put, Delete } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('todo')
export class TodoController {

    // get all items
    @Get('')
    async getItems() {
        return [];
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
        res.status(HttpStatus.OK).json({
            success: true,
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
    async delete(@Res() res: Response, @Body() body) {
        res.status(HttpStatus.OK).json({
            success: true,
        });
    }

}
