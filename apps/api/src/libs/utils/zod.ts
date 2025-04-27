import { BadRequestException, Logger } from '@nestjs/common';
import z from 'zod';

export const zodValidation = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> => {
    if (!data) {
        throw new BadRequestException('Validation failed');
    }
    Logger.debug(data, "Data for zod validation");
    const validatedData = schema.safeParse(data);

    if (!validatedData.success) {
        Logger.error(validatedData.error, 'Zod Validation');
        const errors = validatedData.error.errors.map((e) => e.message);
        throw new BadRequestException(errors[0] || 'Validation failed');
    }

    return validatedData.data;
};
