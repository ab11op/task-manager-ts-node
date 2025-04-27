import mongoose from 'mongoose'

export const connectToDatabase = async() => {

        await mongoose.connect(process.env.MONGO_URI as string).then(() => {
            console.log('connected to the database')
        }).catch(err => {
            console.log('error in connecting to the database',err)
        })

}