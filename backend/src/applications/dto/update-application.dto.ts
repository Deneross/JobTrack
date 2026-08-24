import {
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
    ApplicationStatus,
    ContractType,
} from '../../generated/prisma/enums';

export class UpdateApplicationDto {
    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    status?: ApplicationStatus;

    @IsOptional()
    @IsUrl()
    sourceUrl?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(ContractType)
    contractType?: ContractType;

    @IsOptional()
    @IsString()
    salary?: string;

    @IsOptional()
    @IsString()
    jobDescription?: string;

    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @IsOptional()
    @IsString()
    contactPhone?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    followUpAt?: Date;
}