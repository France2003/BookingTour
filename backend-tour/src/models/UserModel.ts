import mongoose, { Schema, Document } from "mongoose";
interface IBooking {
  _id: string;
  tour: {
    title: string;
  };
  createdAt: string;
  tourId: mongoose.Schema.Types.ObjectId; 
  date: Date;
  amount: number;
}

export interface IUser extends Document {
  phone: string;
  email: string;
  password: string;
  role: "user" | "admin";
  name?: string;
  birthdate?: Date;
  gender?: "Nam" | "Nữ" | "Khác";
  address?: string;
  city?: string;
  avatar?: string;
  bookings?: IBooking[];
}

const UserSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // Các trường mới bổ sung
  name: { type: String },
  birthdate: { type: Date },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  address: { type: String },
  city: { type: String },
  avatar: { type: String },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
