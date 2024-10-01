import mongoose from 'mongoose'

const connectionDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(connect.connection.host)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

export default connectionDB