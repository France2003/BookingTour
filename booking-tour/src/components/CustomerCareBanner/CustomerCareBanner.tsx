const customerServices = [
    {
      icon: "📲",
      title: "GIÁ TỐT - NHIỀU ƯU ĐÃI",
      desc: "Ưu đãi và quà tặng hấp dẫn khi mua tour online",
    },
    {
      icon: "🛒",
      title: "THANH TOÁN AN TOÀN",
      desc: "Được bảo mật bởi tổ chức quốc tế Global Sign",
    },
    {
      icon: "✏️",
      title: "TƯ VẤN MIỄN PHÍ",
      desc: "Hỗ trợ tư vấn online miễn phí",
    },
    {
      icon: "⭐",
      title: "THƯƠNG HIỆU UY TÍN",
      desc: "Thương hiệu lữ hành hàng đầu Việt Nam",
    },
  ];
  export default function CustomerCareBanner() {
    return (
      <div className="max-w-7xl  mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        {customerServices.map((service, index) => (
          <div
            key={index}
            className="flex  items-center gap-3 border border-blue-500 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="text-3xl">{service.icon}</div>
            <div>
              <h4 className="font-bold text-blue-600 text-sm uppercase">
                {service.title}
              </h4>
              <p className="text-blue-600 text-sm">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  