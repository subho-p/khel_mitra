import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
    AllNotificationsQuerySchema,
    allNotificationsQuerySchema,
    CreateNotificationSchema,
    createNotificationSchema,
} from './schemas';
import { Notification } from '@prisma/client';
import {
    ApiResponse,
    ApiResponseWithPagination,
    ApiSuccessResponse,
} from 'src/libs/utils/response';
import { ZodValidationPipe } from 'src/libs/pipes';
import { JwtAuthGuard } from 'src/libs/guards';
import { GetUser } from 'src/libs/decorators';

@Controller('notifications/:userId')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    async create(
        @Param('userId') userId: number,
        @Body(new ZodValidationPipe(createNotificationSchema)) data: CreateNotificationSchema,
    ): Promise<ApiResponse<{ notification: Notification }>> {
        const notification = await this.notificationsService.create(userId, data);

        return {
            success: true,
            data: { notification },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query(new ZodValidationPipe(allNotificationsQuerySchema))
        query: AllNotificationsQuerySchema,
        @GetUser('id') userId: number,
    ): Promise<ApiResponseWithPagination<{ notifications: Notification[] }>> {
        const { notifications, total } = await this.notificationsService.findAll(userId, query);

        return {
            success: true,
            data: { notifications },
            pagination: {
                page: query.page,
                pageSize: query.limit,
                totalCount: total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':notificationId/toggle-read')
    async toggleRead(
        @Param('notificationId') id: string,
        @GetUser('id') userId: number,
    ): Promise<ApiResponse<{ notification: Notification }>> {
        const notification = await this.notificationsService.toggleRead(id, userId);

        return {
            success: true,
            data: { notification },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':notificationId')
    async delete(
        @Param('notificationId') id: string,
        @GetUser('id') userId: number,
    ): Promise<ApiSuccessResponse> {
        await this.notificationsService.delete(id, userId);

        return {
            success: true,
        };
    }
}
