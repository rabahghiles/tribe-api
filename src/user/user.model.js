import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String, required: true },
    birth_date: { type: Date, required: true },
    roles: { type: [String], required: true },
    quote: {
        type: {
            text: String,
            author: String,
        },
    },
    contributions: { type: Number, required: true },
    created_at: { type: Date, required: true }
});

export default mongoose.model("User", UserSchema);