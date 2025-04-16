import Logo from "../../assets/image/logoVisit.png";
export default function Footer() {
  return (
    <footer className="bg-[#08264b] text-white py-10 px-4">
      <div className="max-w-7xl text-[13px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div >
          <img
            src={Logo}
            alt="Logo"
            className="h-15 w-19 mb-4"
          />
          <p>Lữ hành DinhPhapTour, thương hiệu lữ hành hàng đầu Việt Nam</p>
          <p>Thương hiệu quốc gia</p>
          <div className="flex gap-3 text-yellow-400 text-[25px] my-4">
            <span>🏆</span>
            <span>🌟</span>
            <span>🥇</span>
          </div>
          <p>Tổng đài: <strong>0363977687</strong></p>
          <p>Email: <a href="https://mail.google.com/mail/u/0/#sent?compose=new" className="underline">Phapcv2003@gmail.com</a></p>
          <p>Địa chỉ: 35 Khuê Mỹ Đông 5, phường Khuê Mỹ, quận Ngũ Hành Sơn, thành phố Đà Nẵng</p>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-[13px] uppercase">Dịch vụ</h4>
          <ul className="space-y-1  text-sm">
            <li>Tour trong nước</li>
            <li>Dịch vụ du lịch</li>
            <li>Vé máy bay</li>
            <li>Thuê xe</li>
            <li>Du học Saigontourist</li>
            <li>Việc làm ngoài nước</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 uppercase">Chăm sóc khách hàng</h4>
          <ul className="space-y-1 text-sm">
            <li>Thẻ khách hàng</li>
            <li>Đổi điểm Hoa Mai Vàng</li>
            <li>Travel Voucher</li>
            <li>Bảo hiểm Du lịch</li>
            <li>Ý kiến khách hàng</li>
            <li>Tra cứu thông tin Đoàn</li>
            <li>Giải quyết khiếu nại</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 uppercase">Liên hệ</h4>
          <ul className="space-y-1 text-sm">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Chi nhánh</li>
            <li>Quy định bảo vệ</li>
            <li>Điều khoản chung</li>
            <li>Hướng dẫn mua tour online</li>
            <li>Quy định thanh toán</li>
            <li>Chính sách giao nhận</li>
            <li>Chính sách huỷ phạt</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách chất lượng</li>
            <li>Tuyển dụng</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
