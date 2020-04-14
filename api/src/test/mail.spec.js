// process.env.NODE_ENV = 'test';
// const chai = require('chai');
// const server = require('../index');
// const request = require('supertest')(server);
// const Mail = require('../infra/email/mail');

// let auth = {};

// const Logar = (auth) => {
//     return (done) => {
//         request
//         .post('/login')
//         .send({ username: 'tpuntart', password: '123' })
//         .expect(200)
//         .end((err, res) => {
//             if(err) return done(err);
//             auth.token = res.body;
//             return done();
//         });
//     }
// }

// describe('Testes da classe de emails.', () => {

//     // beforeEach(Logar(auth));

//     it('Teste do metodo principal, fire', (done) => {

//         const emailList = [
//             {
//                 email: 'luizfelipe.dasilva94@gmail.com',
//                 vars: { name: 'Luiz Felipe' }
//             },
//             {
//                 email: 'luizlipefs@hotmail.com',
//                 vars: { name: 'Silva' }
//             },
//         ];

//         const mail = new Mail('testetemplate.html', emailList, { subject: 'Bem Vindos' });
//         mail.fire();
//         done();
//     });

// });