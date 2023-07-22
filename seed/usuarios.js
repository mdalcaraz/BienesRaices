import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Mariano',
        email: 'mdalcaraz@live.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10)
    },
    {
        nombre: 'Mariano',
        email: 'test@test.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10)
    },
    {
        nombre: 'Mariano',
        email: 'test2@test2.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10)
    }
]

export default usuarios