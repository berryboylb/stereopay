import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './Dto';
import { PaginationParams } from './Dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async findAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: Media[]; total: number; page: number; perPage: number }> {
    const [users, total] = await this.mediaRepository.findAndCount({
      where: {
        status: 'active',
        isDeleted: false,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { data: users, total, page, perPage };
  }

  async create(
    user: CreateMediaDto,
    mediaUrl: string,
    type: string,
  ): Promise<Media> {
    return await this.mediaRepository.save({
      name: user.name,
      description: user.description,
      url: mediaUrl,
      type,
      status: 'active',
      isDeleted: false,
    });
  }

  async findById(id: number): Promise<Media> {
    return await this.mediaRepository.findOne({
      where: { id },
    });
  }

  async findByTitleOrDescription(query: string): Promise<Media> {
    return await this.mediaRepository.findOne({
      where: [{ name: query }, { description: query }],
    });
  }

  async update(id: number, status: string): Promise<Media> {
    await this.mediaRepository.update(id, { status });
    return await this.mediaRepository.findOne({
      where: { id },
    });
  }

  async updateStatus(id: number, status: string): Promise<Media> {
    const record = await this.mediaRepository.findOne({
      where: { id },
    });

    if (!record || record.isDeleted == true)
      throw new NotFoundException(`Record with the id of ${id} not found `);

    if (record.status === status)
      throw new BadRequestException(`Status is already set to ${status}`);

    record.status = status;
    record.updated_at = new Date();
    return await this.mediaRepository.save(record);
  }

  async softDelete(id: number): Promise<boolean> {
    const record = await this.mediaRepository.findOne({
      where: { id },
    });
    if (!record || record.isDeleted == true) {
      throw new NotFoundException(`Record with the id of ${id} not found `);
    }
    record.status = 'inactive';
    record.isDeleted = true;
    record.deleted_at = new Date();
    await this.mediaRepository.save(record);
    return true;
  }
}
