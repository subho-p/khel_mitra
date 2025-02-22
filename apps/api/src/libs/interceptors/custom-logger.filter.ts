import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomLoggerFilter implements ExceptionFilter {
    private readonly logger = new Logger(CustomLoggerFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        this.logger.error(
            `⚠️ [${request.method}] ${request.url} - ${status} ${JSON.stringify(errorResponse)}`,
        );

        // response.status(status).json({
        //     status: false,
        //     statusCode: status,
        //     message: errorResponse['message'] || 'An error occurred',
        //     timestamp: new Date().toISOString(),
        //     path: request.url,
        // });

        response.status(status).json(errorResponse);
    }
}
