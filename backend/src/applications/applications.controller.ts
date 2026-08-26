import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { CompleteInterviewDto } from './dto/complete-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';


@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService,
    ) {}

    @Get()
    findAll() {
        return this.applicationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.findOne(id);
    }

    @Get('follow-ups/due')
    findDueFollowUps() {
        return this.applicationsService.findDueFollowUps();
    }

    @Get('dashboard/stats')
    getDashboardStats() {
        return this.applicationsService.getDashboardStats();
    }

    @Post()
    create(@Body() data: CreateApplicationDto) {
        return this.applicationsService.create(data);
    }

    @Post(':id/events')
    addEvent(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: CreateEventDto,
    ) {
        return this.applicationsService.addEvent(id, data);
    }

    @Post(':id/interviews')
    addInterview(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: CreateInterviewDto,
    ) {
        return this.applicationsService.addInterview(id, data);
    }

    @Post(':applicationId/interviews/:interviewId/complete')
    completeInterview(
        @Param('applicationId', ParseIntPipe) applicationId: number,
        @Param('interviewId', ParseIntPipe) interviewId: number,
        @Body() data: CompleteInterviewDto,
    ) {
        return this.applicationsService.completeInterview(
            applicationId,
            interviewId,
            data,
        );
    }

    @Patch(':applicationId/interviews/:interviewId')
    updateInterview(
        @Param('applicationId', ParseIntPipe) applicationId: number,
        @Param('interviewId', ParseIntPipe) interviewId: number,
        @Body() data: UpdateInterviewDto,
    ) {
        return this.applicationsService.updateInterview(
            applicationId,
            interviewId,
            data,
        );
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateApplicationDto,
    ) {
        return this.applicationsService.update(id, data);
    }

    @Delete(':applicationId/interviews/:interviewId')
    removeInterview(
        @Param('applicationId', ParseIntPipe) applicationId: number,
        @Param('interviewId', ParseIntPipe) interviewId: number,
    ) {
        return this.applicationsService.removeInterview(
            applicationId,
            interviewId,
        );
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.remove(id);
    }

    @Delete(':applicationId/events/:eventId')
    removeEvent(
        @Param('applicationId', ParseIntPipe) applicationId: number,
        @Param('eventId', ParseIntPipe) eventId: number,
    ) {
        return this.applicationsService.removeEvent(
            applicationId,
            eventId,
        );
    }
}