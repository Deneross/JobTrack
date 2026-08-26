import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';

import { InterviewType } from '../../generated/prisma/enums';

export class CreateInterviewDto {
    @IsEnum(InterviewType)
    type: InterviewType;

    @IsDateString()
    scheduledAt: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}