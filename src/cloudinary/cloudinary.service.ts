// src/cloudinary/cloudinary.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File | string): Promise<string> {
    try {
      if (typeof file === 'string') {
        const result = await cloudinary.uploader.upload(file, {
          folder: 'uploads/manga-image',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'webp' },
          ],
        });
        return this.optimizeUrl(result.secure_url);
      } else {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'uploads/manga-image',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'webp' },
              ],
            },
            (error, result) => {
              if (error) {
                reject(new InternalServerErrorException(error.message));
              } else {
                resolve(this.optimizeUrl(result.secure_url));
              }
            },
          );

          const readableStream = new Readable();
          readableStream.push(file.buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Image upload failed');
    }
  }
  private optimizeUrl(url: string): string {
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_800/');
  }
}
