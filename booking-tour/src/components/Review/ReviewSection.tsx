import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
interface Review {
    user: string;
    comment: string;
    rating: number;
}

const ReviewSection = ({ tourId, existingReviews = [] }: { tourId: string; existingReviews: Review[] }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState<Review[]>(existingReviews);
    const [userName, setUserName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Lấy tên người dùng từ API dựa vào email lưu trong localStorage
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) return;

                const res = await axios.get("http://localhost:3001/api/auth/users");
                const user = res.data.find((u: any) => u.email === email);

                if (user && user.name) {
                    setUserName(user.name);
                } else {
                    console.warn("Không tìm thấy người dùng khớp email");
                }
            } catch (err) {
                console.error("Lỗi khi lấy tên người dùng từ API", err);
            }
        };
        fetchUserName();
    }, []);
    const handleSubmitReview = async () => {
        try {
            setIsSubmitting(true);
            const res = await axios.post(`http://localhost:3001/api/reviews/${tourId}`, {
                user: userName,
                comment,
                rating,
            });
            setReviews(res.data);
            setComment("");
            setRating(5);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 1500);
        } catch (err) {
            console.error("Lỗi khi gửi đánh giá", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Đánh giá & Bình luận</h2>
            <div className="space-y-4 mb-6">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded shadow">
                            <p className="font-semibold">{review.user}</p>
                            <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={i < review.rating ? "text-yellow-400 text-[20px]" : "text-gray-300"}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có đánh giá nào.</p>
                )}
            </div>

            <div className="space-y-2">
                <textarea
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span
                            key={star}
                            onClick={() => setRating(star)}
                            whileTap={{ scale: 1.3 }}
                            whileHover={{ scale: 1.2 }}
                            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                        >
                            ★
                        </motion.span>
                    ))}
                </div>
                <motion.button
                    onClick={handleSubmitReview}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded text-white font-semibold transition-colors duration-300 
      ${submitted ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"} 
      ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!userName || isSubmitting}
                >
                    {isSubmitting ? "Đang gửi..." : submitted ? "Đã gửi!" : "Gửi đánh giá"}
                </motion.button>
            </div>
        </div>
    );
};

export default ReviewSection;
