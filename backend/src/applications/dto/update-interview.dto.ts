import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';

import {
    InterviewOutcome,
    InterviewType,
} from '../../generated/prisma/enums';

export class UpdateInterviewDto {
    @IsOptional()
    @IsEnum(InterviewType)
    type?: InterviewType;

    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(InterviewOutcome)
    outcome?: InterviewOutcome;
}