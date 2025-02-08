import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeyService } from './key.service';

@Controller('keys')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keyService.findOne(id);
  }
}
