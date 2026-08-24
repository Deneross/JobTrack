import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateEventDto } from './dto/create-event.dto';
import {    addDaysToToday, todayUtc,} from '../common/utils/date.utils';

@Injectable()
export class ApplicationsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.application.findMany();
    }

    async findOne(id: number) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                events: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!application) {
            throw new NotFoundException(`Application ${id} introuvable`);
        }

        return application;
    }

    async addEvent(id: number, data: CreateEventDto) {
        await this.findOne(id);

        if (data.type === 'CREATED' || data.type === 'STATUS_CHANGED') {
            throw new BadRequestException(
                'Ce type d’événement est généré automatiquement',
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const event = await tx.event.create({
                data: {
                    ...data,
                    applicationId: id,
                },
            });

            if (data.type === 'FOLLOW_UP') {
                const nextFollowUp = addDaysToToday(7);

                await tx.application.update({
                    where: { id },
                    data: {
                        followUpAt: nextFollowUp,
                    },
                });
            }

            return event;
        });
    }

    findDueFollowUps() {
        const today = todayUtc();

        return this.prisma.application.findMany({
            where: {
                followUpAt: {
                    lte: today,
                },
                status: {
                    notIn: ['REJECTED', 'OFFER', 'ABANDONED'],
                },
            },
            orderBy: {
                followUpAt: 'asc',
            },
        });
    }

    async create(data: CreateApplicationDto) {
        const appliedAt = todayUtc();
        const followUpAt = addDaysToToday(10);

        return this.prisma.$transaction(async (tx) => {
            const application = await tx.application.create({
                data: {
                    ...data,
                    appliedAt,
                    followUpAt,
                },
            });

            await tx.event.create({
                data: {
                    type: 'CREATED',
                    title: 'Candidature créée',
                    applicationId: application.id,
                },
            });

            return application;
        });
    }

    async update(id: number, data: UpdateApplicationDto) {
        const currentApplication = await this.findOne(id);

        return this.prisma.$transaction(async (tx) => {
            const updatedApplication = await tx.application.update({
                where: { id },
                data,
            });

            if (
                data.status &&
                data.status !== currentApplication.status
            ) {
                await tx.event.create({
                    data: {
                        type: 'STATUS_CHANGED',
                        title: 'Statut modifié',
                        description: `${currentApplication.status} → ${data.status}`,
                        applicationId: id,
                    },
                });
            }

            return updatedApplication;
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.application.delete({
            where: { id },
        });
    }

    async getDashboardStats() {
        const today = todayUtc();

        const [
            total,
            active,
            dueFollowUps,
            interviews,
            statusGroups,
        ] = await this.prisma.$transaction([
            this.prisma.application.count(),

            this.prisma.application.count({
                where: {
                    status: {
                        notIn: ['REJECTED', 'OFFER', 'ABANDONED'],
                    },
                },
            }),

            this.prisma.application.count({
                where: {
                    followUpAt: {
                        lte: today,
                    },
                    status: {
                        notIn: ['REJECTED', 'OFFER', 'ABANDONED'],
                    },
                },
            }),

            this.prisma.application.count({
                where: {
                    status: 'INTERVIEW',
                },
            }),

            this.prisma.application.groupBy({
                by: ['status'],
                orderBy: {
                    status: 'asc',
                },
                _count: true,
            }),
        ]);

        const byStatus = Object.fromEntries(
            statusGroups.map((group) => [
                group.status,
                group._count,
            ]),
        );

        return {
            total,
            active,
            dueFollowUps,
            interviews,
            byStatus,
        };
    }

    async removeEvent(applicationId: number, eventId: number) {
        // Vérifie que la candidature existe
        await this.findOne(applicationId);

        const event = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });

        if (!event || event.applicationId !== applicationId) {
            throw new NotFoundException(`Événement ${eventId} introuvable`);
        }

        // Ces événements appartiennent au système
        if (event.type === 'CREATED' || event.type === 'STATUS_CHANGED') {
            throw new BadRequestException(
                'Cet événement est généré automatiquement et ne peut pas être supprimé',
            );
        }

        return this.prisma.event.delete({
            where: {
                id: eventId,
            },
        });
    }
}