import mongoose from 'mongoose'
import { loadConfig } from '../config/env';


export const connectToDatabase = async() => {
    const config = await loadConfig()
    let mongoURI = config.mongoUri
        await mongoose.connect(mongoURI).then(() => {
            console.log('connected to the database')
        }).catch(err => {
            console.log('error in connecting to the database',err)
        })

}