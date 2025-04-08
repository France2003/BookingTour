import { Request, Response } from "express";
import mongoose from "mongoose";
import Tour from "../models/Tour";

// ✅ Lấy danh sách tour
export const getTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { region, search } = req.query;

        let filter: any = {};

        // ✅ Lọc theo vùng miền nếu có
        if (region) {
            filter.region = region;
        }

        // ✅ Tìm kiếm theo từ khóa (tiêu đề, địa điểm, nơi đến)
        if (search) {
            filter.$or = [
                { title: new RegExp(search as string, "i") }, // tìm theo tiêu đề
                { location: new RegExp(search as string, "i") }, // tìm theo địa điểm
                { destination: new RegExp(search as string, "i") }, // tìm theo nơi đến
            ];
        }

        // ✅ Lấy danh sách tour theo bộ lọc và sắp xếp theo thời gian tạo
        const tours = await Tour.find(filter).sort({ createdAt: -1 });

        res.json(tours);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tour:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};
// ✅ Lấy tour theo ID
export const getTourById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tourId = req.params.id;
        console.log('Request for tour with ID:', tourId);  // Log ID
        const tour = await Tour.findById(tourId);

        if (!tour) {
            console.log('Tour not found for ID:', tourId);
            res.status(404).json({ message: "Tour không tồn tại!" });
            return
        }

        res.json(tour);
    } catch (error) {
        console.error("Lỗi khi lấy tour:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};


// ✅ Thêm tour mới (Chỉ admin)
export const createTour = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("📝 Dữ liệu nhận được:", req.body); // Kiểm tra toàn bộ dữ liệu đầu vào
        const { title, tour, tourCode, destination, vehicle, location, duration, price, imageUrl, additionalImages, startDate, endDate, seatsAvailable, region, childPrice, babyPrice, program } = req.body;
        // ✅ Kiểm tra dữ liệu hợp lệ
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!tour) missingFields.push('tour');
        if (!tourCode) missingFields.push('tourCode');
        if (!destination) missingFields.push('destination');
        if (!vehicle) missingFields.push('vehicle');
        if (!location) missingFields.push('location');
        if (!duration) missingFields.push('duration');
        if (!price) missingFields.push('price');
        if (!imageUrl) missingFields.push('imageUrl');  // Đổi từ image sang imageUrl
        if (!additionalImages || additionalImages.length === 0) missingFields.push('additionalImages'); // Kiểm tra nếu không có hình ảnh phụ
        if (!startDate) missingFields.push('startDate');
        if (!endDate) missingFields.push('endDate');
        if (!seatsAvailable) missingFields.push('seatsAvailable');
        if (!region) missingFields.push('region');
        if (!childPrice) missingFields.push('childPrice');
        if (!babyPrice) missingFields.push('babyPrice');
        if (!program) missingFields.push('program'); // Kiểm tra chương trình tour

        // Nếu thiếu trường nào thì trả về thông báo chi tiết
        if (missingFields.length > 0) {
            res.status(400).json({ message: `Thiếu thông tin: ${missingFields.join(', ')}` });
            return;
        }

        // ✅ Kiểm tra nếu tourCode đã tồn tại
        const existingTour = await Tour.findOne({ tourCode });
        if (existingTour) {
            res.status(400).json({ message: `Tour với mã ${tourCode} đã tồn tại!` });
            return;
        }

        // ✅ Chuyển đổi dữ liệu nếu cần
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);
        const formattedPrice = Number(price);
        const formattedSeats = Number(seatsAvailable);
        const formattedChildPrice = Number(childPrice);
        const formattedBabyPrice = Number(babyPrice);

        // Kiểm tra tính hợp lệ của giá trị
        if (isNaN(formattedPrice) || isNaN(formattedSeats)) {
            res.status(400).json({ message: "Giá và số ghế phải là số" });
            console.error("Lỗi: Giá và số ghế phải là số hợp lệ");
            return;
        }

        if (isNaN(formattedPrice) || isNaN(formattedSeats) || isNaN(formattedChildPrice) || isNaN(formattedBabyPrice)) {
            res.status(400).json({ message: "Giá, số ghế, giá trẻ em và giá em bé phải là số" });
            console.error("Lỗi: Giá, số ghế, giá trẻ em hoặc giá em bé không hợp lệ");
            return;
        }

        // ✅ Áp dụng giảm giá nếu là năm hiện tại
        let discount = 0;
        const currentYear = new Date().getFullYear();
        if (formattedStartDate.getFullYear() === currentYear) {
            discount = 10; // Giảm giá 10% cho các tour trong năm hiện tại
        }

        // ✅ Tạo tour mới
        const newTour = new Tour({
            title,
            tour,
            tourCode,
            destination,
            vehicle,
            location,
            duration,
            price: formattedPrice,
            discount,
            image: imageUrl, // Đổi từ image sang imageUrl
            additionalImages: additionalImages,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            seatsAvailable: formattedSeats,
            region,
            status: 'active', // Mặc định tour có trạng thái 'active'
            childPrice: formattedChildPrice,
            babyPrice: formattedBabyPrice,
            program, // Chương trình tour
        });

        // Lưu tour mới vào cơ sở dữ liệu
        await newTour.save();
        res.status(201).json({ message: "Thêm tour thành công!", tour: newTour });
    } catch (error) {
        console.error("❌ Lỗi khi thêm tour:", error);
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// ✅ Cập nhật tour
export const updateTour = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }
        const { status, childPrice, babyPrice } = req.body;
        if (status && !['active', 'booked', 'completed'].includes(status)) {
            res.status(400).json({ message: "Trạng thái không hợp lệ" });
            return;
        }
        if (childPrice && isNaN(childPrice)) {
            res.status(400).json({ message: "Giá trẻ em phải là số" });
            return;
        }
        if (childPrice && isNaN(babyPrice)) {
            res.status(400).json({ message: "Giá  em bé phải là số" });
            return;
        }
        const { program } = req.body;
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, { program }, { new: true });

        if (!updatedTour) {
            res.status(404).json({ message: "Tour không tồn tại!" });
            return;
        }

        res.json({ message: "Cập nhật tour thành công!", tour: updatedTour });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật tour", error });
    }
};
export const updateTourStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        console.log(`Updating tour with ID: ${id}, Status: ${status}`);  // Thêm log để kiểm tra

        if (!['active', 'booked', 'completed'].includes(status)) {
            res.status(400).json({ message: "Trạng thái không hợp lệ" });
            return;
        }

        const updatedTour = await Tour.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedTour) {
            res.status(404).json({ message: "Tour không tồn tại!" });
            return;
        }

        res.json({ message: `Tour đã được cập nhật trạng thái thành ${status}`, tour: updatedTour });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái tour:', error);  // Log lỗi để kiểm tra
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái tour", error });
    }
};

// ✅ Xóa tour
export const deleteTour = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }

        const deletedTour = await Tour.findByIdAndDelete(req.params.id);

        if (!deletedTour) {
            res.status(404).json({ message: "Tour không tồn tại!" });
            return;
        }

        res.json({ message: "Xóa tour thành công!", tour: deletedTour });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa tour", error });
    }
};
// Cập nhật trạng thái tour thành 'completed'
export const markTourAsCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Kiểm tra xem tour có tồn tại hay không
        const tour = await Tour.findById(id);
        if (!tour) {
            res.status(404).json({ message: 'Tour không tồn tại!' });
            return;
        }

        // Cập nhật trạng thái tour thành 'completed'
        tour.status = 'completed';
        await tour.save();

        res.json({ message: 'Tour đã hoàn thành!', tour });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái tour', error });
    }
};