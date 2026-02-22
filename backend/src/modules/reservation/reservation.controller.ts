import { Controller, Post, Body, Delete, Param, Get, Req, UseGuards } from '@nestjs/common';
import { ReservationHandler, ReserveSeatDto } from './reservation.handler';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class ReservationController {
    constructor(private readonly reservationHandler: ReservationHandler) { }

    // User endpoints
    @Post('user/reservations')
    @Roles('user')
    async reserveSeat(
        @Req() req: any,
        @Body() reserveSeatDto: ReserveSeatDto,
    ) {
        return this.reservationHandler.handleReserveSeat(req.user.id, reserveSeatDto);
    }

    @Delete('user/reservations/:id')
    @Roles('user')
    async cancelSeat(
        @Req() req: any,
        @Param('id') reservationId: string,
    ) {
        return this.reservationHandler.handleCancelSeat(req.user.id, reservationId);
    }

    @Get('user/reservations')
    @Roles('user')
    async getOwnReservations(
        @Req() req: any,
    ) {
        return this.reservationHandler.handleGetUserReservations(req.user.id);
    }

    // Admin endpoints
    @Get('admin/reservations/users/:userId')
    @Roles('admin')
    async getUsersReservations(
        @Param('userId') userId: string,
    ) {
        return this.reservationHandler.handleGetUserReservations(userId);
    }
}
