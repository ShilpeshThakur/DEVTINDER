const mongoose = require("mongoose")

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://namaste_dev:Shilpesh007@cluster0.84msq.mongodb.net/devTinder')
}

module.exports = { connectDb }
