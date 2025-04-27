import { BadRequestException, PipeTransform, Logger, ArgumentMetadata } from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
    private logger: Logger;
    constructor(private schema: z.ZodSchema) {
        this.logger = new Logger('Zod Validation');
    }

    transform(value: unknown, meatdata: ArgumentMetadata) {
        try {
            this.logger.debug(value);
            const parsedValue = this.schema.safeParse(value);
            if (!parsedValue.success) {
                throw parsedValue.error;
            }
            return parsedValue.data;
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const message = error.errors[0].message;
                this.logger.error(message, meatdata.type);
                throw new BadRequestException(message || 'Validation failed');
            }

            this.logger.error(String(error), meatdata.type);
            throw new BadRequestException('Validation failed');
        }
    }
}
