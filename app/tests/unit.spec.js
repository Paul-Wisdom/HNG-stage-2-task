const {generateToken, verifyToken} = require('../utils/jwtUtils');


describe('Testing JWT', () => {
    test('tokens are generated', () => {
        const payload = {id: 5};

        const token = generateToken(payload, '1h');
        // const decodedPayload = verifyToken(token);
        
        expect(token).toBeDefined();

    });

    test('valid tokens decodes correctly', () => {
        const payload = {id: 5};

        const token = generateToken(payload, '1h');
        const decodedPayload = verifyToken(token);
        
        expect(decodedPayload.id).toBe(payload.id);

    });

    test('Invalid tokens decodes to null', () => {
        const payload = {id: 5};
        const invalidToken = 'invalid Token'

        const token = generateToken(payload, '1h');
        const decodedPayload = verifyToken(invalidToken);
        
        expect(decodedPayload).toBe(null);

    });

    test('Tokens expires on time', async () => {
        const payload = {id: 5};

        const token = generateToken(payload, '1s');
        const timeOut = await setTimeout(() => {
            const decodedPayload = verifyToken(token);
        
            expect(decodedPayload).toBe(null);
        }, 2000)

    });
})
