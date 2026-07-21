import mongoose from "mongoose";

const { model, models, Schema } = mongoose;


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "please provide username"]
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        type: String,
        default: "https://i.pinimg.com/564x/05/4c/b1/054cb148f9a8ef419b55166e0ce4dd64.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

})

const User = models?.User || model('user', userSchema);

export default User; // Change this line to use default export
