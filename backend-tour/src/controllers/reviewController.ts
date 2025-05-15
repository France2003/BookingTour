import { Request, Response } from "express";
import Tour from "../models/Tour";

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, comment, rating } = req.body;
    const { id } = req.params;

    const tour = await Tour.findById(id);
    if (!tour){
       res.status(404).json({ message: "Không tìm thấy tour" });
       return 
    } 
    tour.reviews.push({ user, comment, rating });
    const total = (tour.reviews || []).reduce((acc, curr) => acc + curr.rating, 0);
    tour.rating = total / tour.reviews.length;

    await tour.save();
    res.status(200).json(tour.reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm đánh giá" });
  }
};
