var request = require("request");
var expect;
import('chai').then(chai => {  // dynamically importing chai as I wasgetting ESM error otherwise
    expect = chai.expect;
});

var baseUrl = "http://localhost:3000";

describe('User Form API', () => {
    describe('POST /saveUserForm', () => {
        it('should save user form data', (done) => {
            const formData = {
                first_name: 'Test',
                last_name: 'User',
                password: 'Pa$$w0rd!',
                email: 'testuser@example.com'
            };

            request.post({
                url: baseUrl + '/saveUserForm',
                json: true,
                body: formData
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });


        it('should return 400 if form data is invalid', (done) => {
            const invalidData = null;

            request.post({
                url: baseUrl + '/saveUserForm',
                json: true,
                body: invalidData
            }, function (err, res, body) {
                // console.log('Error:', err);
                // console.log('Response:', res.statusCode);
                expect(res.statusCode).to.equal(400);
                done();
            });
        });
    });

    describe('DELETE /deleteUser', () => {
        it('should delete user by email', (done) => {
            const emailToDelete = {
                email: 'testuser@example.com'
            };

            request.delete({
                url: baseUrl + '/deleteUser',
                json: true,
                body: emailToDelete
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('should return 500 if email is not available', (done) => {
            const invalidEmail = {
                email: null
            };

            request.delete({
                url: baseUrl + '/deleteUser',
                json: true,
                body: invalidEmail
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });
});
