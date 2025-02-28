import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgencyService } from './user-agency.service';
import { UpdateAgencyDto } from './dto/update-user-agency.dto';

@ApiTags('agencies')
@UseGuards(AuthGuard)
@Controller('agencies')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get('me')
  @ApiOperation({ summary: 'Exibir dados da agência do usuário autenticado' })
  async findMyAgency(@Request() req) {
    const userId = req.user.userId;
    return this.agencyService.findByUserId(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar dados da agência do usuário autenticado' })
  async updateMyAgency(@Request() req, @Body() updateAgencyDto: UpdateAgencyDto) {
    const userId = req.user.userId;
    return this.agencyService.update(userId, updateAgencyDto);
  }
}