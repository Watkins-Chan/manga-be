/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter } from './schemas/chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}

  async create(
    createChapterDto: CreateChapterDto,
    imagePaths: string[],
  ): Promise<Chapter> {
    const { manga, chapterNumber } = createChapterDto;

    // Check chapterNumber already for this manga
    const existingChapter = await this.chapterModel.findOne({
      manga: new Types.ObjectId(manga),
      chapterNumber,
    });

    if (existingChapter) {
      throw new ConflictException(
        'Chapter number already exists for this manga.',
      );
    }
    const imageUrls = imagePaths.map(
      (filename) => `/${process.env.UPLOADS_FOLDER}/${filename}`,
    );

    const createdChapter = new this.chapterModel({
      ...createChapterDto,
      manga: new Types.ObjectId(manga),
      author: new Types.ObjectId(createChapterDto.author),
      releaseDate: new Date(createChapterDto.releaseDate) ?? new Date(),
      images: imageUrls,
    });

    return createdChapter.save();
  }

  async findAll(mangaId?: string): Promise<Chapter[]> {
    const filter = mangaId ? { manga: new Types.ObjectId(mangaId) } : {};
    return this.chapterModel.find(filter).sort({ chapterNumber: 1 }).exec();
  }

  async findOne(id: string): Promise<Chapter> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Chapter not found');
    }
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  async update(
    id: string,
    updateChapterDto: UpdateChapterDto,
    newImagePaths?: string[],
  ): Promise<Chapter> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Chapter not found');
    }

    const updatedData: any = { ...updateChapterDto };
    if (updateChapterDto.manga) {
      updatedData.manga = new Types.ObjectId(updateChapterDto.manga);
    }
    if (updateChapterDto.author) {
      updatedData.author = new Types.ObjectId(updateChapterDto.author);
    }
    if (updateChapterDto.releaseDate) {
      updatedData.releaseDate = new Date(updateChapterDto.releaseDate);
    }

    if (newImagePaths && newImagePaths?.length > 0) {
      const newImageUrls = newImagePaths.map(
        (filename) => `/${process.env.UPLOADS_FOLDER}/${filename}`,
      );
      updatedData.images = [
        ...(updateChapterDto.images || []),
        ...newImageUrls,
      ];
    }

    const updatedChapter = await this.chapterModel
      .findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedChapter) {
      throw new NotFoundException('Chapter not found');
    }

    return updatedChapter;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Chapter not found');
    }

    const chapter = await this.chapterModel.findByIdAndDelete(id).exec();
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    if (chapter.images && chapter.images.length > 0) {
      const deletePromises = chapter.images.map(async (imageUrl) => {
        const filePath = join(__dirname, '..', '..', imageUrl);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error(`Failed to delete image at ${filePath}:`, error);
        }
      });
      await Promise.all(deletePromises);
    }
  }

  async removeImage(id: string, imageUrl: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Chapter not found');
    }

    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const imageIndex = chapter.images.indexOf(imageUrl);
    if (imageIndex === -1) {
      throw new NotFoundException('Image not found in chapter');
    }

    // Remove image
    chapter.images.splice(imageIndex, 1);
    await chapter.save();

    const filePath = join(__dirname, '..', '..', imageUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete image at ${filePath}:`, error);
    }
  }
}
