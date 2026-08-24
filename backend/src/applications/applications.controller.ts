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

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateApplicationDto,
    ) {
        return this.applicationsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.remove(id);
    }
}