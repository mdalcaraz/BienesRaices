import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import propiedades from "./propiedades.js"
import db from "../config/db.js";
import { Categoria, Precio, Usuario, Propiedad} from "../models/index.js"


const importarDatos = async () => {
    try {
        //autenticar
        await db.authenticate()

        //Generar columnas
        await db.sync()

        //Insertar datos

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios),
            Propiedad.bulkCreate(propiedades)
        ])

        console.log("Datos insertados correctamente")
        exit(0) //termina bien, por eso es 0
    } catch (error) {
        console.log(error)
        exit(1) //el 1 indica error
    }
}

const eliminarDatos = async () => {
    try {

        //Metodo 1 x 1
        // await Promise.all([
        //     Categoria.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true })
        // ])

        await db.sync({ force: true }) // 1 linea para todos

        console.log("Datos eliminados correctamente")
        exit()
    } catch (error) {
        console.log(error)
        exit(1) //el 1 indica error
    }
}

if (process.argv[2] === "-i") {
    importarDatos()
}

if (process.argv[2] === "-e") {
    eliminarDatos()
}