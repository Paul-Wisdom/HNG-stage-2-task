const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const createServer = require('../utils/createServer');
const generateRandomString= require('../utils/generateRandomString');

const User = require('../models/user');

jest.mock('../models/user', () => {
    const User = jest.fn();

    User.create = jest.fn();
    User.findOne = jest.fn();

    return User;
})

jest.mock('bcryptjs', () => {
    const bcrypt = jest.fn();
    bcrypt.hash = jest.fn().mockImplementation(async (param, salt) => {
        return (`hashed${param}`);
    });
    bcrypt.compare = jest.fn().mockImplementation(async (password, hashedPassword) => {
        return hashedPassword === `hashed${password}`;
    })

    return bcrypt;
});

const app = createServer()

describe('signing up', () => {
    test('without first name',async () => {
        const payload = {lastName: "Doe", email: "test@test.com", password: "12345678", phone: "09099999999"};

        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test('without last name',async () => {
        const payload = {firstName: "Doe", email: "test@test.com", password: "12345678", phone: "09099999999"};

        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test('without email',async () => {
        const payload = {firstName: "John", lastName: "Doe",  password: "12345678", phone: "09099999999"};

        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test('without password',async () => {
        const payload = {firstName: "John", lastName: "Doe", email: "test@test.com", phone: "09099999999"};

        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test('without phone',async () => {
        const payload = {firstName: "John", lastName: "Doe", email: "test@test.com", password: "12345678"};

        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test('when email is alredy in use',async () => {
        const payload = {firstName: "John", lastName: "Doe", email: "test@test.com", password: "12345678", phone: "09099999999"};
        const mockUser = {firstName: "Another", lastName: "user", email:"test@test.com",password: "password", phone: "080888888"};

        User.findOne.mockResolvedValue(mockUser)
        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(422);
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test('when all fields are valid',async () => {
        const payload = {firstName: "John", lastName: "Doe", email: "test@test.com", password: "12345678", phone: "09099999999"};
        // const mockUser = {firstName: "Another", lastName: "user", email:"test@test.com",password: "password", phone: "080888888"};

        User.findOne.mockResolvedValue(null)
        User.create.mockResolvedValue({...payload, userId: generateRandomString() });

        const mockUser =  await User.create();
        mockUser.createOrganisation = jest.fn();
        mockUser.createOrganisation.mockResolvedValue({orgId: generateRandomString(), name: `${payload.firstName}'s organisation`, description: "default org"})
        const response = await supertest(app).post('/auth/register').send(payload);

        expect(response.status).toBe(201);
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });
});

describe('signing in', () => {
    test('without email', async () => {
        const payload = {password: "12345678"};

        const response = await supertest(app).post('/auth/login').send(payload);

        expect(response.status).toBe(401);
        expect(User.findOne).not.toHaveBeenCalled()
    });

    test('without password', async () => {
        const payload = {email: "test@test.com"};

        const response = await supertest(app).post('/auth/login').send(payload);

        expect(response.status).toBe(401);
        expect(User.findOne).not.toHaveBeenCalled()
    });

    test('when account does not exists', async () => {
        const payload = {email: "test@test.com", password: "12345678"};

        User.findOne.mockResolvedValue(null);
        const response = await supertest(app).post('/auth/login').send(payload);

        expect(response.status).toBe(401);
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test('with wrong password', async () => {
        const payload = {email: "test@test.com", password: "12345678"};
        const mockUser = {firstName: "Another", lastName: "user", email:"test@test.com",password: "password", phone: "080888888"};

        User.findOne.mockResolvedValue(mockUser);
        const match = await bcrypt.compare(payload.password, mockUser.password);
        const response = await supertest(app).post('/auth/login').send(payload);

        expect(response.status).toBe(401);
        expect(match).toBe(false);
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalled()
    });

    test('with correct password', async () => {
        const payload = {email: "test@test.com", password: "12345678"};
        const mockUser = {firstName: "Another", lastName: "user", email:"test@test.com",password: "hashed12345678", phone: "080888888"};

        User.findOne.mockResolvedValue(mockUser);
        const match = await bcrypt.compare(payload.password, mockUser.password);
        const response = await supertest(app).post('/auth/login').send(payload);

        expect(response.status).toBe(200);
        expect(match).toBe(true);
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalled()
    });
})
