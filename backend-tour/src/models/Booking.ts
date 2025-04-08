import mongoose, { Schema, Document } from "mongoose";

interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  tourId: mongoose.Schema.Types.ObjectId;
  date: Date;
  amount: number; // Doanh thu từ booking này
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // Giả sử mỗi booking có một số tiền
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
