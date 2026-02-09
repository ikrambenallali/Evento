import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwtService: JwtService;

  let participantToken: string;
  let adminToken: string;
  let eventId: string;
  let reservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = app.get(getConnectionToken());
    jwtService = app.get(JwtService);

    // Nettoyage complet pour repartir sur une base saine
    await connection.collection('users').deleteMany({});
    await connection.collection('events').deleteMany({});
    await connection.collection('reservations').deleteMany({});

    // Génération des tokens avec "sub" (obligatoire selon ton erreur précédente)
    participantToken = jwtService.sign({ 
      sub: new Types.ObjectId().toString(), 
      role: 'PARTICIPANT' 
    });
    
    adminToken = jwtService.sign({ 
      sub: new Types.ObjectId().toString(), 
      role: 'ADMIN' 
    });

    // Création d'un événement publié avec une capacité de 1
    const event = await connection.collection('events').insertOne({
      title: 'Workshop NestJS',
      status: 'PUBLISHED',
      capacity: 1,
      date: new Date(),
    });
    eventId = event.insertedId.toString();
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('/reservations (POST)', () => {
    it('should create a reservation successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ eventId })
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.status).toBe('PENDING');
      reservationId = response.body._id;
    });

    it('should fail if user already has a reservation (Duplicate)', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ eventId })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toBe('You already have a reservation');
        });
    });

    it('should fail if event is full (after confirmation)', async () => {
      // On génère un token pour un SECOND utilisateur
      const otherUserToken = jwtService.sign({ 
        sub: new Types.ObjectId().toString(), 
        role: 'PARTICIPANT' 
      });

      // On simule le fait que la première réservation est CONFIRMED en DB
      // L'event ayant une capacité de 1, il sera plein.
      await connection.collection('reservations').updateOne(
        { _id: new Types.ObjectId(reservationId) },
        { $set: { status: 'CONFIRMED' } }
      );

      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ eventId })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toBe('Event is full');
        });
    });
  });

  describe('/reservations/:id/cancel (PATCH)', () => {
    it('should allow a participant to cancel their own reservation', async () => {
      return request(app.getHttpServer())
        .patch(`/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.status).toBe('CANCELED');
        });
    });
  });

  describe('Admin Actions', () => {
    it('should allow admin to see all reservations', async () => {
      return request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should allow admin to update reservation status', async () => {
        // On crée une nouvelle résa pour tester le changement de statut
        const newRes = await connection.collection('reservations').insertOne({
            user: new Types.ObjectId(),
            event: new Types.ObjectId(eventId),
            status: 'PENDING'
        });

        return request(app.getHttpServer())
          .patch(`/reservations/${newRes.insertedId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'CONFIRMED' })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.status).toBe('CONFIRMED');
          });
    });

    it('should forbid participant from accessing all reservations', async () => {
      return request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});