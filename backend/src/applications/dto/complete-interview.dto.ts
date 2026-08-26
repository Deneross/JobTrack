import { IsEnum } from 'class-validator';
import { InterviewOutcome } from '../../generated/prisma/enums';

export class CompleteInterviewDto {
    @IsEnum(InterviewOutcome)
    outcome: InterviewOutcome;
}