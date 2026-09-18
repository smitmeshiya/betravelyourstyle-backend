import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonapiService } from './common_api.service';
import { CommonMessages } from 'src/common/common-message';
import { getUploadStorage } from '../common/common.utils';
import { FileInterceptor } from '@nestjs/platform-express';
// import { generateCsrfToken } from "../main";
import type { Request, Response } from 'express';

@Controller('api')
export class CommonapiController {
    constructor(private readonly commonapiService: CommonapiService) { }

    @Post('/upload')
    // @UseInterceptors(FileInterceptor('file', { storage: getUploadStorage() }))
    @UseInterceptors(
        FileInterceptor('file', {
            storage: getUploadStorage(),
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = [
                    'image/png',
                    'image/jpeg',
                    'image/jpg',

                    'application/pdf', // pdf

                    // Audio
                    'audio/mpeg',   // mp3
                    'audio/wav',
                    'audio/ogg',

                    // Video
                    'video/mp4',
                    'video/mpeg',
                    'video/quicktime', // mov
                    'video/x-msvideo'
                ];

                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException('Only PNG and JPG images are allowed'),
                        false
                    );
                }

                callback(null, true);
            },
        }),
    )
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ) {
        try {
            if (!file) {
                throw new BadRequestException('File is required.');
            }

            // file.destination e.g. './uploads/profile_image'
            // Strip './' → 'uploads/profile_image'
            const folderSegment = (file.destination || '').replace(/^\.\//, '');

            // DB path: 'uploads/profile_image/filename.jpg'  (save this)
            const dbPath = `${folderSegment}/${file.filename}`;

            // Full URL: BASE_URL (without /api) + '/' + dbPath
            const serverBase = (process.env.BASE_URL ?? '').replace(/\/api$/, '');
            const fileUrl = `${serverBase}/${dbPath}`;

            return {
                status: true,
                message: 'File uploaded successfully',
                file: dbPath,   // ← save this value to DB
                url: fileUrl,   // ← use this for display
            };
        } catch (error: any) {
            return { status: false, message: error.message };
        }
    }
}
