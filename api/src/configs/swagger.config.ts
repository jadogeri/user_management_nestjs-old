
import { DocumentBuilder } from '@nestjs/swagger';

  export const swaggerConfig = new DocumentBuilder()
    .setTitle('User Auth App')
    .setDescription('The API description')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('User API', 'https://your-website.com', 'your-email@example.com')
    .setTermsOfService('https://your-website.com/terms')
    .setExternalDoc('Find out more', 'https://your-website.com/docs')
    .addServer('http://localhost:3000', "Local development server")
    .addServer('https://your-website.com', "Production server")
    .addServer('https://staging.your-website.com', "Staging server")
    .addServer('http://localhost:3001', "Testing server")
    .addTag('User', 'Operations related to users')
    // Add bearer authentication if your API uses JWTs
    .addBearerAuth()
    .build();


