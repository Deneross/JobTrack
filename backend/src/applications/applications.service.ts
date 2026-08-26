import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateEventDto } from './dto/create-event.dto';
import {    addDaysToToday, todayUtc,} from '../common/utils/date.utils';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { CompleteInterviewDto } from './dto/complete-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class ApplicationsService {
    constructor(private readonly prisma: PrismaService) {}

    private async syncApplicationFromInterviews(
        applicationId: number,
        tx: any,
    ) {
        const activeInterview = await tx.interview.findFirst({
            where: {
                applicationId,
                completedAt: null,
            },
            orderBy: {
                scheduledAt: 'asc',
            },
        });

        if (activeInterview) {
            return tx.application.update({
                where: { id: applicationId },
                data: {
                    status: 'INTERVIEW',
                    followUpAt: null,
                },
            });
        }

        const latestCompletedInterview =
            await tx.interview.findFirst({
                where: {
                    applicationId,
                    completedAt: {
                        not: null,
                    },
                },
                orderBy: {
                    completedAt: 'desc',
                },
            });

        if (!latestCompletedInterview) {
            return tx.application.update({
                where: { id: applicationId },
                data: {
                    status: 'SENT',
                    followUpAt: addDaysToToday(7),
                },
            });
        }

        switch (latestCompletedInterview.outcome) {
            case 'WAITING_RESPONSE':
                return tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'WAITING_RESPONSE',
                        followUpAt: addDaysToToday(5),
                    },
                });

            case 'OFFER':
                return tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'OFFER',
                        followUpAt: null,
                    },
                });

            case 'REJECTED':
                return tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'REJECTED',
                        followUpAt: null,
                    },
                });

            case 'NEXT_INTERVIEW':
                return tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'INTERVIEW',
                        followUpAt: null,
                    },
                });

            default:
                return tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'SENT',
                        followUpAt: addDaysToToday(7),
                    },
                });
        }
    }

    findAll() {
        return this.prisma.application.findMany();
    }

    async addInterview(
        applicationId: number,
        data: CreateInterviewDto,
    ) {
        const application = await this.findOne(applicationId);

        return this.prisma.$transaction(async (tx) => {
            const interview = await tx.interview.create({
                data: {
                    type: data.type,
                    scheduledAt: new Date(data.scheduledAt),
                    location: data.location,
                    notes: data.notes,
                    applicationId,
                },
            });

            if (application.status !== 'INTERVIEW') {
                await tx.application.update({
                    where: { id: applicationId },
                    data: {
                        status: 'INTERVIEW',
                        followUpAt: null,
                    },
                });

                await tx.event.create({
                    data: {
                        type: 'STATUS_CHANGED',
                        title: 'Statut modifié',
                        description: `${application.status} → INTERVIEW`,
                        applicationId,
                    },
                });
            }

            await tx.event.create({
                data: {
                    type: 'INTERVIEW',
                    title: 'Entretien planifié',
                    description: data.location
                        ? `${data.type} — ${data.location}`
                        : data.type,
                    applicationId,
                    eventDate: new Date(data.scheduledAt),
                },
            });

            return interview;
        });
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
                interviews: {
                    orderBy: {
                        scheduledAt: 'asc',
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

        // Ces statuts sont pilotés par le workflow d'entretien
        if (
            data.status === 'INTERVIEW' ||
            data.status === 'WAITING_RESPONSE'
        ) {
            throw new BadRequestException(
                'Ce statut est géré automatiquement par le workflow des entretiens',
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const statusChanged =
                data.status !== undefined &&
                data.status !== currentApplication.status;

            let followUpAt = currentApplication.followUpAt;

            if (statusChanged) {
                switch (data.status) {
                    case 'SENT':
                        followUpAt = addDaysToToday(7);
                        break;

                    case 'TO_APPLY':
                    case 'REJECTED':
                    case 'OFFER':
                    case 'ABANDONED':
                        followUpAt = null;
                        break;
                }
            }

            const updatedApplication = await tx.application.update({
                where: { id },
                data: {
                    ...data,

                    ...(statusChanged && {
                        followUpAt,
                    }),
                },
            });

            if (statusChanged) {
                await tx.event.create({
                    data: {
                        type: 'STATUS_CHANGED',
                        title: 'Statut modifié',
                        description:
                            `${currentApplication.status} → ${data.status}`,
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
        if (
            event.type === 'CREATED' ||
            event.type === 'STATUS_CHANGED' ||
            event.type === 'INTERVIEW'
        ) {
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

    async removeInterview(
        applicationId: number,
        interviewId: number,
    ) {
        await this.findOne(applicationId);

        const interview = await this.prisma.interview.findUnique({
            where: { id: interviewId },
        });

        if (
            !interview ||
            interview.applicationId !== applicationId
        ) {
            throw new NotFoundException(
                `Entretien ${interviewId} introuvable`,
            );
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.interview.delete({
                where: { id: interviewId },
            });

            await tx.event.create({
                data: {
                    type: 'NOTE',
                    title: 'Entretien supprimé',
                    description:
                        `${interview.type} — ${interview.scheduledAt.toISOString()}`,
                    applicationId,
                },
            });

            await this.syncApplicationFromInterviews(
                applicationId,
                tx,
            );
        });
    }

    async updateInterview(
        applicationId: number,
        interviewId: number,
        data: UpdateInterviewDto,
    ) {
        await this.findOne(applicationId);

        const interview = await this.prisma.interview.findUnique({
            where: { id: interviewId },
        });

        if (
            !interview ||
            interview.applicationId !== applicationId
        ) {
            throw new NotFoundException(
                `Entretien ${interviewId} introuvable`,
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedInterview = await tx.interview.update({
                where: { id: interviewId },
                data: {
                    type: data.type,
                    scheduledAt: data.scheduledAt
                        ? new Date(data.scheduledAt)
                        : undefined,
                    location: data.location,
                    notes: data.notes,
                    outcome: data.outcome,
                },
            });

            await this.syncApplicationFromInterviews(
                applicationId,
                tx,
            );

            return updatedInterview;
        });
    }

    async completeInterview(
        applicationId: number,
        interviewId: number,
        data: CompleteInterviewDto,
    ) {
        const application = await this.findOne(applicationId);

        const interview = await this.prisma.interview.findUnique({
            where: { id: interviewId },
        });

        if (
            !interview ||
            interview.applicationId !== applicationId
        ) {
            throw new NotFoundException(
                `Entretien ${interviewId} introuvable`,
            );
        }

        if (interview.completedAt) {
            throw new BadRequestException(
                'Cet entretien est déjà terminé',
            );
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. On termine l'entretien
            const completedInterview = await tx.interview.update({
                where: { id: interviewId },
                data: {
                    completedAt: new Date(),
                    outcome: data.outcome,
                },
            });

            // 2. On journalise le résultat de l'entretien
            await tx.event.create({
                data: {
                    type: 'INTERVIEW',
                    title: 'Entretien terminé',
                    description: `Résultat : ${data.outcome}`,
                    applicationId,
                },
            });

            // 3. Une seule fonction décide maintenant du statut réel
            const syncedApplication =
                await this.syncApplicationFromInterviews(
                    applicationId,
                    tx,
                );

            // 4. On crée un événement de statut uniquement
            // si le statut final a réellement changé
            if (syncedApplication.status !== application.status) {
                await tx.event.create({
                    data: {
                        type: 'STATUS_CHANGED',
                        title: 'Statut modifié',
                        description:
                            `${application.status} → ${syncedApplication.status}`,
                        applicationId,
                    },
                });
            }

            return {
                interviewId: completedInterview.id,
                outcome: completedInterview.outcome,
                status: syncedApplication.status,
                followUpAt: syncedApplication.followUpAt,
            };
        });
    }
}

