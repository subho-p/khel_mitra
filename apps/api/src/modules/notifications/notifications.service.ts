import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AllNotificationsQuerySchema, CreateNotificationSchema } from './schemas';
import { PrismaService } from 'src/libs/db/db.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private client: PrismaService) {}
    async create(userId: number, data: CreateNotificationSchema): Promise<Notification> {
        return this.client.notification.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async findAll(
        userId: number,
        query: AllNotificationsQuerySchema,
    ): Promise<{
        notifications: Notification[];
        total: number;
    }> {
        const { page, limit, isRead, type } = query;

        let where: any = { userId };

        if (isRead !== undefined) {
            where = { ...where, isRead };
        }

        if (type !== undefined) {
            where = { ...where, type };
        }

        const notifications = await this.client.notification.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await this.client.notification.count({ where });

        return { notifications, total };
    }

    async toggleRead(id: string, userId: number) {
        const notification = await this.client.notification.findUnique({ where: { id } });

        if (!notification) {
            throw new BadRequestException('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new UnauthorizedException("You don't have access to this notification");
        }

        return this.client.notification.update({
            where: { id },
            data: { read: !notification.read },
        });
    }

    async delete(id: string, userId: number) {
        const notification = await this.client.notification.delete({ where: { id, userId } });

        if (!notification) {
            throw new BadRequestException('Notification not found');
        }

        return notification;
    }
}
