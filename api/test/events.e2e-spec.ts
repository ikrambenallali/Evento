import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

describe('EventsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let createdEventId: string;

  const mockUserId = new Types.ObjectId().toHexString();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Générer un token valide pour les tests
    accessToken = jwtService.sign({ sub: mockUserId, id: mockUserId });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/events (POST)', () => {
    it('should fail if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ title: 'Test' })
        .expect(401);
    });

 it('should create an event when authenticated', async () => {
 const response = await request(app.getHttpServer())
  .post('/events')
  .set('Authorization', `Bearer ${accessToken}`)
  .send({
    title: 'Soirée Networking',
    description: 'Un événement de test',
    date: '2026-05-20',
    location: 'Casablanca',
    capacity: 100,       // vrai number ici
    // createdBy: mockUserId, // optionnel
    // photoUrl: 'http://fake.url/image.jpg' // optionnel
  })
  .expect(201);


  createdEventId = response.body._id;
  expect(createdEventId).toBeDefined();
});


  });

  describe('/events (GET)', () => {
    it('should return all events', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get event by ID', () => {
      if (!createdEventId) {
        console.warn('Event creation failed, skipping GET by ID test');
        return;
      }

      return request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200)
        .then(res => {
          expect(res.body._id).toBe(createdEventId);
        });
    });
  });

  describe('/events/:id (PUT)', () => {
    it('should update event status', () => {
      if (!createdEventId) {
        console.warn('Event creation failed, skipping PUT test');
        return;
      }

      return request(app.getHttpServer())
        .put(`/events/${createdEventId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'PUBLISHED' })
        .expect(200)
        .then(res => {
          expect(res.body.status).toBe('PUBLISHED');
        });
    });
  });

  describe('/events/:id (DELETE)', () => {
    it('should delete the event', async () => {
      if (!createdEventId) {
        console.warn('Event creation failed, skipping DELETE test');
        return;
      }

      await request(app.getHttpServer())
        .delete(`/events/${createdEventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Vérification finale : l'événement doit être supprimé
      await request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(404);
    });
  });
});
