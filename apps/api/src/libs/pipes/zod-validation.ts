import { BadRequestException, PipeTransform, Logger, ArgumentMetadata } from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodSchema) {}

    transform(value: unknown, meatdata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const message = error.errors[0].message;
                Logger.error(message, meatdata.type);
                throw new BadRequestException(message || 'Validation failed');
            }

            Logger.error(String(error), meatdata.type);
            throw new BadRequestException('Validation failed');
        }
    }
}
