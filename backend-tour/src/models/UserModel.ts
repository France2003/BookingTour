import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
    phone: string;
    email: string;
    password: string;
    role: "user" | "admin"; 
}
const UserSchema = new Schema<IUser>({
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});
const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
