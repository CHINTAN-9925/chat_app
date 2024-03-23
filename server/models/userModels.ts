import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    name: string;
    email: string;
    password: string;
    pic?: string;
    isAdmin: boolean;
}

const userSchema = new mongoose.Schema<UserType>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            required: false,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

userSchema.methods.matchPassword = async function (enteredPassword:string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<UserType>("User", userSchema);
export default User
