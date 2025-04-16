import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  // userId: mongoose.Schema.Types.ObjectId;
  tourId: mongoose.Schema.Types.ObjectId;
  date: Date;
  amount: number;

  // Thông tin bổ sung
  adults: number;
  children: number;
  babies: number;

  paymentType: "full" | "half";      // Hình thức thanh toán
  paymentMethod: "atm" | "momo";     // Phương thức thanh toán

  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },

    // Các trường được bổ sung
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    babies: { type: Number, required: true },

    paymentType: { type: String, enum: ["full", "half"], required: true },
    paymentMethod: { type: String, enum: ["atm", "momo"], required: true },
  },
  {
    timestamps: true,
  }
);
export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
