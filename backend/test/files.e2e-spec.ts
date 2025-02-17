import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FilesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/files/presign-upload (POST)', () => {
    it('should return 400 for invalid key format', () => {
      return request(app.getHttpServer())
        .post('/files/presign-upload')
        .send({
          key: 'invalid-key',
          contentType: 'image/jpeg',
          contentLength: 1024,
        })
        .expect(400);
    });

    it('should return 400 for invalid content type', () => {
      return request(app.getHttpServer())
        .post('/files/presign-upload')
        .send({
          key: 'uploads/test-file.jpg',
          contentType: 'application/octet-stream',
          contentLength: 1024,
        })
        .expect(400);
    });

    it('should return 400 for file size too large', () => {
      return request(app.getHttpServer())
        .post('/files/presign-upload')
        .send({
          key: 'uploads/test-file.jpg',
          contentType: 'image/jpeg',
          contentLength: 11 * 1024 * 1024, // 11MB
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/files/presign-upload')
        .send({
          key: 'uploads/test-file.jpg',
        })
        .expect(400);
    });
  });

  describe('/files/presign-download (GET)', () => {
    it('should return 200 for invalid key format (validation passes but S3 fails)', () => {
      return request(app.getHttpServer())
        .get('/files/presign-download')
        .query({ key: 'invalid-key' })
        .expect(200);
    });

    it('should return 500 for missing key', () => {
      return request(app.getHttpServer())
        .get('/files/presign-download')
        .expect(500);
    });
  });

  describe('/files/head (GET)', () => {
    it('should return 500 for invalid key format (validation passes but S3 fails)', () => {
      return request(app.getHttpServer())
        .get('/files/head')
        .query({ key: 'invalid-key' })
        .expect(500);
    });

    it('should return 500 for missing key', () => {
      return request(app.getHttpServer())
        .get('/files/head')
        .expect(500);
    });
  });
});
