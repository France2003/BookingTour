import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

interface Tour {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: "active" | "booked" | "completed";
    location: string;
    destination: string;
    image?: string;
    price?: number;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const query = useQuery().get("query") || "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/tours?search=${encodeURIComponent(query)}`);
                setTours(response.data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm tour:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchData();
        }
    }, [query]);

    return (
        <div className="px-6 pt-[620px] md:px-16 pt-40 pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <h2 className="text-3xl font-bold mb-8">
                Kết quả tìm kiếm cho: "<span className="text-blue-600">{query}</span>"
            </h2>

            {loading ? (
                <p>Đang tải...</p>
            ) : tours.length === 0 ? (
                <p className="text-gray-600">Không tìm thấy tour nào phù hợp.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <Link to={`/tour/${tour._id}`}>
                            <div
                                key={tour._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            >
                                {tour.image && (
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-blue-700 mb-2 line-clamp-2">{tour.title}</h3>
                                    <p className="text-sm text-gray-600 mb-1">📍 {tour.location}</p>
                                    <p className="text-sm text-gray-600 mb-1">🚩 {tour.destination}</p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        🗓 {new Date(tour.startDate).toLocaleDateString()} -{" "}
                                        {new Date(tour.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">📌 Trạng thái: {tour.status}</p>
                                    {tour.price && (
                                        <p className="text-lg font-bold text-green-600">
                                            💰 {tour.price.toLocaleString("vi-VN")}₫
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
