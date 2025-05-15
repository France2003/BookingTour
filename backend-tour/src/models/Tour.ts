import mongoose, { Schema, Document } from "mongoose";
interface IProgram {
    day: number; 
    activities: string[];
}
export interface ITour extends Document {
    title: string;
    tour: string;
    isFeatured?: boolean;
    tourCode: string;
    destination: string;
    vehicle: string;
    location: string;
    duration: string;
    price: number;
    highlights: string[]
    discount?: number; 
    image: string;
    additionalImageUrls: string,
    rating?: number; // Trung bình đánh giá
    reviews: { user: string; comment: string; rating: number }[];
    startDate: Date; // Ngày bắt đầu
    endDate: Date; // Ngày kết thúc
    seatsAvailable: number; // Số chỗ còn trống
    region: string;
    status: 'active' | 'booked' | 'completed';
    childPrice?: number; // Giá trẻ em
    babyPrice?: number; // Giá trẻ sơ sinh
    program: IProgram[]; // Chương trình tour
    // services: IService[]; // Dịch vụ kèm theo
}
const TourSchema = new Schema<ITour>(
    {
        title: { type: String, required: true },
        tour: { type: String, required: true },
        isFeatured: { type: Boolean, default: false },
        tourCode: { type: String, unique: true, required: true },
        destination: { type: String, required: true },
        vehicle: { type: String, required: true },
        location: { type: String, required: true },
        duration: { type: String, required: true },
        highlights: {
            type: [String], // 👈 Chuyển sang mảng string
            required: true,
          },    
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // Giảm giá mặc định là 0
        image: { type: String, required: true },
        additionalImageUrls: [{ type: String }],
        rating: { type: Number, default: 5 }, // Mặc định đánh giá 5 sao
        reviews: {
            type: [
              {
                user: { type: String, required: true },
                comment: { type: String, required: true },
                rating: { type: Number, required: true },
              },
            ],
            default: [],
          },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        seatsAvailable: { type: Number, required: true },
        region: { type: String, required: true, enum: ["mien-bac", "mien-trung", "mien-nam"] }, // ✅ Bắt buộc nhập
        status: {
            type: String,
            enum: ['active', 'booked', 'completed'],
            default: 'active', // Mặc định là active
        },
        childPrice: { type: Number, required: true }, // Giá cho trẻ em
        babyPrice: { type: Number, required: true },  // Giá cho em bé
        program: [
            {
                day: { type: Number, required: true },
                activities: [{ type: String, required: true }],
            },
        ], 
    },
    { timestamps: true }
);
export default mongoose.model<ITour>("Tour", TourSchema);
