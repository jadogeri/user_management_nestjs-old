import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

export const globalValidationPipe: ValidationPipe = new ValidationPipe({
    // 1. Strip non-decorated properties
    whitelist: true, 
    
    // 2. Throw an error if non-white-listed properties are present
    forbidNonWhitelisted: true, 
    
    // 3. Automatically transform payloads to DTO instances
    transform: true, 
});