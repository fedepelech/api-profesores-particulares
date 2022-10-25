'use strict';

const {User} = require('@lib/models');

const teachers = [
    {
        "firstName": "Ricardo",
        "surName": "Lopéz",
        "email": "ricardol@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Licenciado en Ciencias Matématicas",
        "experience": "2 años siendo docente en diferentes escuelas secundarias"
    },
    {
        "firstName": "Juan Cruz",
        "surName": "Lococo",
        "email": "juancrloc@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Historiador",
        "experience": "15 años. Escritor de muchos libros sobre distintos procéres de Argentina (por ej: Mariano Moreno, Juan Manuel de Rosas, etc)."
    },
    {
        "firstName": "Esteban",
        "surName": "Garrido",
        "email": "estebang@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Licenciado en Ciencias Económicas",
        "experience": "1 año. Actualmente trabajo en CocosCap siendo asesor sobre las nuevas funcionalidades que se deben implementar en base al mercado"
    },
    {
        "firstName": "Paola",
        "surName": "Velazquez",
        "email": "pvelazquez1998@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Licenciada en Lenguas",
        "experience": "2 años. Doy clases de inglés en la institución Aprending"
    },
    {
        "firstName": "Monica",
        "surName": "Gutierrez",
        "email": "monicag@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Ingeniera en Ciencias Químicas",
        "experience": "12 años. Soy consultora en un laboratorio francés."
    },
    {
        "firstName": "Carlos",
        "surName": "Neuer",
        "email": "neuercarlos@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "-",
        "experience": "Toda mi familia es alemana. Nací en Argentina pero viví desde los 3 hasta los 20 años en Alemania, por ende hablo ambas lenguas de forma nativa."
    },
    {
        "firstName": "Pablo",
        "surName": "Estigarribia",
        "email": "pabloestig@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Licenciado en Física",
        "experience": "4 años dando clases en la UTREF."
    },
    {
        "firstName": "Vanesa",
        "surName": "Golffeisthen",
        "email": "Golffeisthenv@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Ingeniera en Electrónica",
        "experience": "10 años. Intelligence Production en Samsung Microcomponentes"
    },
    {
        "firstName": "Laura",
        "surName": "Sanchez",
        "email": "sanchezlaura@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Tecnicatura en Desarrollo de Software",
        "experience": "3 años. Software Engineer en MercadoLibre"
    },
    {
        "firstName": "Martin",
        "surName": "Herrera",
        "email": "herreramartin@gmail.com",
        "password": "pass123",
        "phoneCod": "011",
        "phoneNumber": "1122333344",
        "degree": "Licenciado en Ciencias Estadísticas",
        "experience": "20 años. Docente en UADE"
    }
];

const students = [
    {
        "firstName": "Martin",
        "surName": "Trocovsly",
        "email": "asdf@gmail.com",
        "password": "aaaa",
        "role": "student"
    }
]

function createUsers() {
    const promises = students.map((user) => User.findOneAndUpdate(
        { 
            firstName: user.firstName,
            surName: user.surName,
            email: user.email,
            role: user.role,
        },
        {
            firstName: user.firstName,
            surName: user.surName,
            email: user.email,
            role: user.role,
            password: user.password
        },
        { upsert: true }
    ));
    return Promise.all(promises);
}

module.exports = {
    createUsers
};