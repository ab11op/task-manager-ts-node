import mongoose from 'mongoose'


export const connectToDatabase = async() => {
        const MONGO_URI=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvd25i9.mongodb.net/${process.env.DB_NAME}`
        await mongoose.connect(MONGO_URI).then(() => {
            console.log('connected to the database')
        }).catch(err => {
            console.log('error in connecting to the database',err)
        })

}