import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
}, {
    timestamps: true,
});

UserSchema.methods.matchPassword =async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.pre('save', async function (next) {
 if(!this.isModified){
        next();
 }
 const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', UserSchema);

export default User;
