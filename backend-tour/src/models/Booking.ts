import { Schema, Document, model, Types } from "mongoose";
import { ITour } from "./Tour";

interface Passenger {
    name?: string;
    firstName?: string;
    gender?: string;
    phone?: string;
    address?: string;
    passport?: string;
}

interface Contact {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    region?: string;
}

export interface IBooking extends Document {
    tourId: Types.ObjectId | ITour;
    date: Date;
    amount: number;
    adults: number;
    children: number;
    babies: number;
    paymentType: "full" | "half";
    paymentMethod: "atm" | "momo";
    paymentInfo?: string;
    status?: "pending" | "confirmed" | "cancelled";
    passengers?: Passenger[];
    contact?: Contact;
    createdAt: Date;
    updatedAt: Date;
    email?: string; // Thêm trường email vào IBooking
}

const passengerSchema = new Schema<Passenger>(
    {
        name: String,
        firstName: String,
        gender: String,
        phone: String,
        address: String,
        passport: String,
    },
    { _id: false }
);

const contactSchema = new Schema<Contact>(
    {
        name: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        region: String,
    },
    { _id: false }
);

const bookingSchema = new Schema<IBooking>(
    {
        tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true }, // Đổi từ tourId
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        adults: { type: Number, required: true },
        children: { type: Number, required: true },
        babies: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
            required: true,
        },
        paymentType: { type: String, enum: ["full", "half"], required: true },
        paymentMethod: { type: String, enum: ["atm", "momo"], required: true },
        passengers: { type: [passengerSchema], default: [], required: false },
        paymentInfo: { type: String, default: "" },
        contact: { type: contactSchema, default: {}, required: false },
        email: { type: String, required: true },
    },
    { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
