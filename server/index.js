import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import History from './models/History.js'
import User from './models/User.js'
import bcrypt from 'bcryptjs'

// Configuración de variables de entorno
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Variables de entorno
const PORT = process.env.PORT
const MONGOURL = process.env.MONGOURL

// Conexión a MongoDB
mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((error) => console.log("Error connecting to MongoDB:", error))

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'any Token now.' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token useless.' })
        }
        req.user = user
        next()
    })
}
//Ruta para obtener historias no completadas
app.get('/histories', async (req,res) => {
    try {
        const allHistories = await History.find({ status: { $ne: 'completed' } })
        res.json(allHistories)
    } catch (error) {
        res.status(500).json({message: 'Error'})
    }
})
//Ruta para obtener todas las historias completadas
app.get('/histories-published', async (req,res) => {
    try {
        const historiesPublished = await History.find({ status: { $ne: 'in progress' } }).populate('author', 'username')
        res.json(historiesPublished)
    } catch (error) {
        res.status(500).json({message: 'Error'})
    }
})

//Ruta para crear una historia
app.post('/history',verifyToken, async (req, res) => {
    try {
        const { title, text} = req.body
        const authorId = req.user.id

        // Validación de campos
        if (!title || !text) {
            return res.status(400).json({ error: 'Title and Text must be Required.' })
        }

        // Crear la nueva historia
        const newHistory = new History({
            title,
            author: authorId,
            content: [
                {
                    text,
                    author: authorId,
                    approved: true, 
                }
            ],
        })

        await newHistory.save()
        res.status(201).json({ message: 'History made sucessfully', history: newHistory })
    } catch (error) {
        res.status(500).json({ error: 'Error to save the history', details: error.message })
    }
})
//Ruta para obtener una historia por su id
app.get('/history/:id', async (req, res) => {
    try {
        const { id } = req.params

        const history = await History.findById(id).populate('author', 'username').populate('content.author', 'username')

        if (!history) {
            return res.status(404).json({ error: 'History not found.' })
        }

        res.json(history)
    } catch (error) {
        res.status(500).json({ error: 'Error to found history', details: error.message })
    }
})
//Ruta para obtener las historias del usuario
app.get('/myhistories/:user', verifyToken, async (req,res) => {
    try{
        const {user} = req.params
        const userFound = await User.findOne({username:user})

        if(!userFound){
            return res.status(400).json({error: 'Author not found'})
        }

        const authorHistories = await History.find({author: userFound.id}).populate('author','username').populate({path: 'content', populate: {path: 'author', select: 'username'}})

        if(!authorHistories){
            return res.status(404).json({error: 'Histories of author not found'})
        }
        res.json({histories: authorHistories})
    }catch(error){
        res.status(500).json({error: 'Error to found Histories'})
    }
})

//Ruta para añadir contenido al usuario
app.post('/history/:id/add-content', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const { text} = req.body
        const authorId = req.user.id

        if (!text || !authorId) {
            return res.status(400).json({ error: 'Text and author must be Required.' })
        }

        // Verificar si la historia existe
        const history = await History.findById(id)
        if (!history) {
            return res.status(404).json({ error: 'History not found.' })
        }

        // Agregar contenido
        if(history.status === 'completed'){
            return res.status(400).json({error: 'this history is completed'})
        }else if(history.status === 'in progress'){
            history.content.push({ text, author: authorId })
        }
   
        await history.save()

        res.status(201).json({ message: 'You contribute to the history succesfully', history })
    } catch (error) {
        res.status(500).json({ error: 'Error to contribute', details: error.message })
    }
})
//Ruta para cambiar el estado a la historia
app.post('/history/:id/change-status', verifyToken, async (req,res) => {
    try {
        const { id } = req.params
        const history = await History.findById(id)
        if (!history) {
            return res.status(404).json({ error: 'History not found.' })
        }

        if (history.status === 'completed') {
            history.status = 'in progress'
        } else if (history.status === 'in progress') {
            history.status = 'completed'
        } else {
          
        }

        await history.save()
        res.status(201).json({ message: 'Status changed', history })
    } catch (error) {
        res.status(500).json({ error: 'Error to change the status', details: error.message })
    }
})
//Ruta para registrar
app.post('/signup', async (req,res) => {
    try{
        const {username, password} = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and Password must be Required' })
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ error: 'username is already in use.' })
        }

        const newUser = new User({
            username,
            password
        })
        await newUser.save()
        res.status(201).json({ message: 'Username create sucessfully', user: newUser })
    }catch(error){
        res.status(500).json({error: 'Error to create username'})
    }
})

//Ruta para iniciar sesion 
app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and Password must be required.' })
        }

        // Buscar el usuario por nombre de usuario
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Username invalid.' })
        }

        // Verificar la contraseña utilizando el método matchPassword
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Password invalid' })
        }

        // Crear un token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,                  
            { expiresIn: '24h' }                      
        );

        res.status(200).json({ message: 'Welcome', token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error to Sign in.' })
    }
})

//Ruta para eliminar historia
app.delete('/delete-history/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid history ID format.' })
        }

        const history = await History.findByIdAndDelete(id);

        if (!history) {
            return res.status(404).json({ error: 'History not found.' })
        }
        res.status(200).json({ message: 'History deleted successfully.' })
    } catch (error) {
        res.status(500).json({ error: 'Cannot delete the history.' })
    }
})
//Ruta para eliminar cuenta
app.delete('/delete-account/:id', verifyToken, async (req,res) => {
    try{
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid history ID format.' })
        }

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({ error: 'Account not found.' })
        }
        res.status(200).json({ message: 'Your account are done.' })
    }catch(error){
        res.status(500).json({ error: 'Cannot delete the account.' })
    }
})


app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: ` Welcome ${req.user.username}` })
})

