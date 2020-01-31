import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from '@hapi/joi';

@Injectable()
export class ValidationPipe implements PipeTransform {

    constructor(private readonly schema: Joi.ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        if (value) {
            const result = this.schema.validate(value);
            if (result.error) {
                throw new BadRequestException('Validation failed');
            }
        }
        return value;
    }
}
