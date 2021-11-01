import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BadDataException } from 'src/exceptions/badData.exception';

@Catch(BadDataException)
export class BadDataExceptionFilter implements ExceptionFilter {
    catch(exception: BadDataException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
            .status(400)
            .json({
                statusCode: 400,
                message: exception.getMessage(),
                error: 'Bad Request'
            });
    }
}