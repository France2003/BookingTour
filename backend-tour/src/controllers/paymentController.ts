import nodemailer from "nodemailer";
// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Dịch vụ email (có thể thay đổi)
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});
// Hàm gửi email xác nhận
export const sendConfirmationEmail = (customerEmail: string, paymentDetails: any) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: customerEmail,
    subject: 'Xác nhận thanh toán thành công',
    text: `Cảm ơn bạn đã thanh toán thành công! \n\n
      Chi tiết thanh toán: \n
      - Tên khách hàng: ${paymentDetails.customerName} \n
      - Phương thức thanh toán: ${paymentDetails.paymentMethod} \n
      - Số tiền thanh toán: ${paymentDetails.amount} VND \n
      - Ngày thanh toán: ${paymentDetails.paymentDate}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Lỗi khi gửi email:", error);
      return;
    }
    console.log("Email xác nhận đã được gửi: " + info.response);
  });
};

// API lấy thông tin thanh toán từ DB (ví dụ)
export const getPaymentDetails = (req: any, res: any) => {
  const bookingId = req.params.id;
  // Lấy thông tin thanh toán từ DB (dùng ví dụ tĩnh ở đây)
  const paymentDetails = {
    customerName: "Nguyễn Văn A",
    paymentMethod: "Momo",
    amount: 2000000,
    paymentDate: new Date().toLocaleString(),
    customerEmail: "customer@example.com",
  };

  res.status(200).json(paymentDetails);
};

// Controller gửi email xác nhận
export const sendConfirmationEmailController = (req: any, res: any) => {
  const { customerEmail, paymentDetails } = req.body;

  // Gửi email xác nhận
  sendConfirmationEmail(customerEmail, paymentDetails);

  res.status(200).send({ message: "Email xác nhận đã được gửi!" });
};
