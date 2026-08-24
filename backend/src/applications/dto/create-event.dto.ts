import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventType } from '../../generated/prisma/enums';

export class CreateEventDto {
    @IsEnum(EventType)
    type: EventType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;
}