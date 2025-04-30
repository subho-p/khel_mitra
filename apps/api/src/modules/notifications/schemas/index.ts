import { NotificationType } from '@prisma/client';
import z from 'zod';

// Body
const notificationSchema = z.object({
    type: z.nativeEnum(NotificationType).default(NotificationType.GENERAL),
    title: z.string({ required_error: 'title is required' }),
    body: z.string({ required_error: 'body is required' }),
});

export const createNotificationSchema = notificationSchema;
export const updateNotificationSchema = notificationSchema.partial();

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;

// Query
export const allNotificationsQuerySchema = z.object({
    type: z.nativeEnum(NotificationType).optional(),
    isRead: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
})

export type AllNotificationsQuerySchema = z.infer<typeof allNotificationsQuerySchema>;