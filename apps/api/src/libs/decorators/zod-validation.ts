import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes';
import { applyDecorators, UsePipes } from '@nestjs/common';

export function ZodValidation(schema: ZodType) {
    return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
