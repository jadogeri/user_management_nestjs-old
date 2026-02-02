import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Session')
@Controller('sessions') // Defines the base route as /sessions
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() createSessionDto: CreateSessionDto) {
    // Passes the request body to the service to create a new session
    return await this.sessionService.create(createSessionDto);
  }

  @Get()
  async findAll() {
    // Retrieves all session records
    return await this.sessionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Retrieves a single session by its unique ID
    return await this.sessionService.findOne(id);
  }

  @Get('auth/:authId')
  async findAllByAuthId(@Param('authId') authId: string) {
    // Uses the custom service method to filter sessions by Auth ID
    return await this.sessionService.findAllByAuthId(+authId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    // Updates a specific session's data
    return await this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Removes the session from the database
    return await this.sessionService.remove(id);
  }
}
