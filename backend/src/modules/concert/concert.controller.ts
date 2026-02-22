import { Controller, Post, Body, Delete, Param, Get, UseGuards } from '@nestjs/common';
import { ConcertHandler, CreateConcertDto } from './concert.handler';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class ConcertController {
    constructor(private readonly concertHandler: ConcertHandler) { }

    // Admin endpoints
    @Post('admin/concerts')
    @Roles('admin')
    async createConcert(@Body() createConcertDto: CreateConcertDto) {
        return this.concertHandler.handleCreateConcert(createConcertDto);
    }

    @Delete('admin/concerts/:id')
    @Roles('admin')
    async deleteConcert(@Param('id') id: string) {
        return this.concertHandler.handleDeleteConcert(id);
    }

    // User endpoints
    @Get('user/concerts')
    @Roles('admin', 'user')
    async getAllConcerts() {
        return this.concertHandler.handleGetAllConcerts();
    }
}
