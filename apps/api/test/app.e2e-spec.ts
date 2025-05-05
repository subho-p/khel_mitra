import * as request from 'supertest';

const randomString = () => Math.random().toString(36).substring(2);

describe('App e2e tests', () => {
    let req: request.Agent;

    beforeAll(() => {
        req = request('http://localhost:3333/api/v1');
    });

    afterAll(() => {
        // req.close();
    });

    it.todo('All is good');

    it('Should be healthy', (done) => {
        req.get('/health').expect(200);

        done();
    });

    const email = `test${randomString()}@test.com`;
    const password = 'test123';
    let accessToken: string;
    let userId: string;

    describe('Auth service', () => {
        test('Should sign up', async () => {
            const res = await req
                .post('/auth/signup')
                .send({
                    email,
                    password,
                })
                .expect(201);

            expect(res.body.data.accessToken).toBeDefined();

            accessToken = res.body.data.accessToken;
        });

        test('Should not sign up with same email', async () => {
            await req
                .post('/auth/signup')
                .send({
                    email,
                    password,
                })
                .expect(400);
        });

        test('Should sign in', async () => {
            const res = await req
                .post('/auth/signin')
                .send({
                    email,
                    password,
                })
                .expect(200);

            expect(res.body.data.accessToken).toBeDefined();

            accessToken = res.body.data.accessToken;
        });

        test('Should not sign in with wrong password', async () => {
            await req
                .post('/auth/signin')
                .send({
                    email,
                    password: 'wrong-password',
                })
                .expect(400);
        });

        test('Should not sign in with wrong email', async () => {
            await req
                .post('/auth/signin')
                .send({
                    email: 'wrong-email',
                    password,
                })
                .expect(400);
        });

        test('Should not sign in with wrong email and password', async () => {
            await req
                .post('/auth/signin')
                .send({
                    email: 'wrong-email',
                    password: 'wrong-password',
                })
                .expect(400);
        });

        test('Check auth', async () => {
            await req.post('/auth/check').set('Authorization', `Bearer ${accessToken}`).expect(200);
        });

        test('Should logout', async () => {
            await req
                .post('/auth/signout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            accessToken = '';
        });

        test('Check auth after logout', async () => {
            await req.post('/auth/check').set('Authorization', `Bearer ${accessToken}`).expect(401);
        });
    });

    describe('User service', () => {
        test('Should get all users', async () => {
            await req
                .post('/auth/signin')
                .send({ email, password })
                .expect(200)
                .then((res) => {
                    accessToken = res.body.data.accessToken;
                });

            await req
                .get('/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .then((res) => {
                    userId = res.body.data.user.id;
                });
        });
    });

    describe('Notification service', () => {
        let notificationId: string;

        test('Should get notifications', async () => {
            const res = await req
                .get('/notifications/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            notificationId = res.body.data.notifications[0].id;
        });

        test('Should toggle notification', async () => {
            await req
                .post(`/notifications/${userId}/${notificationId}/toggle-read`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });

        test('Should delete notification', async () => {
            await req
                .delete(`/notifications/${userId}/${notificationId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });
    });
});
