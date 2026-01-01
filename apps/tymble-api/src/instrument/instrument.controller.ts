import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import {
  CreateInstrumentDto,
  CreateInstrumentResponseDto,
} from './dto/create-instrument.dto';
import {
  UpdateInstrumentDto,
  UpdateInstrumentResponseDto,
} from './dto/update-instrument.dto';
import { InstrumentService } from './instrument.service';

@UseGuards(JwtAuthGuard)
@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  @ZodResponse({
    type: CreateInstrumentResponseDto,
  })
  create(@Body() createInstrumentDto: CreateInstrumentDto) {
    return this.instrumentService.create(createInstrumentDto);
  }

  @Get()
  findAll() {
    return this.instrumentService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.instrumentService.searchByName(query);
  }

  @Get(':id')
  @ZodResponse({
    type: CreateInstrumentResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.instrumentService.findOne(id);
  }

  @Get('symbol/:symbol')
  findBySymbol(@Param('symbol') symbol: string) {
    return this.instrumentService.findBySymbol(symbol);
  }

  @Patch(':id')
  @ZodResponse({
    type: UpdateInstrumentResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateInstrumentDto: UpdateInstrumentDto
  ) {
    return this.instrumentService.update(id, updateInstrumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instrumentService.remove(id);
  }
}
