import {
  BadRequestException,
  HttpException,
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  Param,
  Res,
  NotFoundException,
  Req,
  Logger,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  PaginationParams,
  QueryMediaDto,
  StatusMediaDto,
  CreateMediaDto,
} from './Dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { upload } from './utils';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { Request as RequestType, Response } from 'express';
import * as fs from 'fs';
import path = require('path');
import { TransformInterceptor } from '../exception.filter';
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const filename: string =
      path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
    const extension: string = path.parse(file.originalname).ext;
    callback(null, `${filename}${extension}`);
  },
});

const fileFilter = function (
  req: RequestType,
  file: Express.Multer.File,
  cb: (error: Error, acceptFile: boolean) => void,
) {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('audio/')
  ) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException('Only image and audio files are allowed!'),
      false,
    );
  }
};

const imageOptions = {
  limits: {
    fileSize: 5 * 1000 * 1000, // 5 Mb
  },
  fileFilter,
  storage: storage,
};

@Controller('media')
@UseInterceptors(TransformInterceptor)
export class MediaController {
  constructor(private mediaService: MediaService) {}
  private readonly logger = new Logger('Media');
  @UseInterceptors(FilesInterceptor('media', 1, imageOptions))
  @Post('/')
  async create(
    @Body() body: CreateMediaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: RequestType,
    @Res() res: Response,
  ) {
    const media = files && files[0];
    if (!media)
      throw new BadRequestException('Must upload an image or a audio');
    const uploader = async (path: string) => await upload(path, 'streopay');
    const response = await uploader(media.path);
    fs.unlinkSync(media.path);
    const record = await this.mediaService.create(
      body,
      response.url,
      media.mimetype.startsWith('image/') ? 'image' : 'audio',
    );
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'created a new record',
      data: {
        record,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAllMedia(@Query() query: PaginationParams, @Res() res: Response) {
    const records = await this.mediaService.findAll(query.page, query.perPage);
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'successfully fetched records',
      data: {
        records,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/search')
  async getMedia(@Query() query: QueryMediaDto, @Res() res: Response) {
    const record = await this.mediaService.findByTitleOrDescription(
      query.query,
    );
    if (!record || record.isDeleted == true)
      throw new NotFoundException('Record not found');
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'successfully fetched record',
      data: {
        record,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getMediaById(@Res() res: Response, @Param('id') id: number) {
    const record = await this.mediaService.findById(id);
    if (!record || record.isDeleted == true)
      throw new NotFoundException(`Record with the id of ${id} not found `);
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'successfully fetched record',
      data: {
        record,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  async updateMedia(
    @Param('id') id: number,
    @Query() query: StatusMediaDto,
    @Res() res: Response,
  ) {
    const record = await this.mediaService.updateStatus(id, query.status);
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'successfully updated record',
      data: {
        record,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteMedia(@Param('id') id: number, @Res() res: Response) {
    const record = await this.mediaService.softDelete(id);
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'successfully deleted record',
      data: record,
    });
  }
}
