import mongoose, { Schema, Document } from "mongoose";

interface IRevenue extends Document {
  amount: number;
  date: Date;
}

const revenueSchema = new Schema<IRevenue>({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

// Dùng named export cho Revenue
export const Revenue = mongoose.model<IRevenue>("Revenue", revenueSchema);
