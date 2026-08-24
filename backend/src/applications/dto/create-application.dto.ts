import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

import {
    ApplicationStatus,
    ContractType,
} from '../../generated/prisma/enums';

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    position: string;

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
}