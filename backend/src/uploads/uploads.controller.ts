import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Get('/download/:token')
  async download(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<any> {
    const upload = await this.uploadsService.getOne(token);
    const data = await this.uploadsService.download(upload);

    const uploadDto = this.uploadsService.toUploadDto(upload);

    res.header('Content-Type', upload.mimetype);
    res.header('Content-Disposition', `attachment; filename="${uploadDto.name}"`);
    res.send(data);
  }
}
