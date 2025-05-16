import { useParams } from "react-router-dom";
const destinations = [
  {
    slug: "ha-giang-noi-da-no-hoa",
    category: "Du lịch Việt Nam",
    title: "Hà Giang - Nơi đá nở hoa",
    desc: "Mùa hè được xem thời điểm lý tưởng để bạn có một chuyến xê dịch đến vùng địa đầu của Tổ quốc. Đôi khi sẽ có những cơn mưa bất chợt nhưng bạn vẫn sẽ cảm nhận được vẻ đẹp cảnh vật nơi đây ở mỗi thời điểm khác nhau. Vì sao lại là Hà Giang, bạn hãy cùng Lữ hành DinhPhapTour khám phá nhé!",
    view: [{
      view1: "<strong>Hà Giang - rực rỡ mùa nước đổ</strong>",
      view2: "Tháng 5, 6 là thời điểm mà Hà Giang vào mùa nước đổ, là một trong những thời điểm lý tưởng nhất để khám phá vẻ đẹp vừa quyến rũ, vừa mới lạ của Hà Giang.",
      view3: "Cánh đồng Hoàng Su Phì hay những thửa ruộng bậc thang nằm ngay dưới chân cung đường hạnh phúc ở đèo Mã Pí Lèng là một trong những nơi ngắm trọn vẹn vẻ đẹp Hà Giang vào mùa nước đổ.",
      view4: "<strong>Hà Giang - bình dị vào mùa lúa chín</strong>",
      view5: "Mùa lúa chín ở Hà Giang thường rơi vào tháng 8 và tháng 9, được xem là thời gian vàng để bạn ngắm nhìn sắc vàng óng ánh của những thửa ruộng bậc thang, phong cảnh thiên nhiên hùng vĩ, nên thơ và mang nét đẹp dịu dàng hiếm nơi nào có được.",
      view6: "Vào mùa này cũng chính là lúc nhiều nhiếp ảnh gia “hẹn hò” về nơi đây để lưu giữ vào bộ sưu tập của mình những tấm ảnh đẹp đến nao lòng.",
    }],
    img: "https://saigontourist.net/uploads/destination/TrongNuoc/mienbac/Ha-giang/Xin-Man_1131374039.jpg",
    img2: "https://saigontourist.net/uploads/destination/TrongNuoc/mienbac/Ha-giang/Nho-Que-River-view-from-Ma-Pi-Leng-Pass_705056626.jpg"
  },
  {
    slug: "du-lich-nuoc-ngoai-304-15",
    category: "Du lịch Thái Lan",
    title: "Du lịch nước ngoài - Trải nghiệm mới mẻ cho kỳ nghỉ 30/4 và 1/5",
    desc: "Du lịch nước ngoài không chỉ giúp bạn khám phá những nền văn hóa mới mẻ, mở rộng tầm nhìn mà còn mang đến cho bạn những trải nghiệm độc đáo và khó quên.",
    view: [{
      view1: "Kỳ nghỉ lễ 30/4 và 1/5 đang đến gần, đây là thời điểm lý tưởng để bạn và gia đình tận hưởng những chuyến du lịch và khám phá những vùng đất mới. Thay vì những điểm đến quen thuộc trong nước, hãy thử trải nghiệm du lịch nước ngoài để mang đến những kỷ niệm và đáng nhớ cho kỳ nghỉ của bạn. Dưới đây là một số điểm đến du lịch nước ngoài lý tưởng vào dịp lễ:",
      view2: "<strong>Bangkok, Thái Lan:  </strong> Thành phố không ngủ, nơi những nét truyền thống hòa quyện cùng hiện đại, hứa hẹn mang đến cho du khách một hành trình đầy cảm xúc. Dưới ánh đèn rực rỡ, Bangkok ẩn chứa vô số điều kỳ diệu, từ những đền đài cổ kính, những khu chợ sầm uất đến những món ăn đường phố đầy mê hoặc.",
      view3: "<strong>Singapore:  </strong> Quốc đảo sư tử, là điểm đến với sự pha trộn độc đáo giữa hiện đại và truyền thống. Nơi đây mang đến cho du khách vô số trải nghiệm thú vị từ tham quan các địa danh nổi tiếng, thưởng thức ẩm thực đa dạng đến hòa mình vào không khí sôi động của thành phố.",
      view4: "<strong>Kuala Lumpur, Malaysia: </strong> Một thành phố sôi động và đa văn hóa, tự hào với sự pha trộn hấp dẫn giữa nét quyến rũ của thế giới cũ và sự tinh tế hiện đại. Thành phố này là nơi hội tụ của nhiều nền văn hóa khác nhau.",
      view5: " <strong>Hà Giang: </strong>sKỳ nghỉ lễ 30/4 và 1/5 là thời điểm lý tưởng để bạn và gia đình tận hưởng những chuyến du lịch nước ngoài đầy thú vị. Du lịch nước ngoài không chỉ giúp bạn khám phá những nền văn hóa mới mẻ, mở rộng tầm nhìn mà còn mang đến cho bạn những trải nghiệm độc đáo và khó quên. Hãy để Lữ Hành Saigontourist  đồng hành cùng bạn trong những chuyến du lịch nước ngoài đầy thú vị trong dịp lễ này!",
    }],
    img2: "https://saigontourist.net/uploads/destination/NuocNgoai/Thailand/Bangkok-China-Town_1124522612.jpg",
  },
  {
    slug: "5-diem-den-304-15",
    category: "Du lịch Việt Nam",
    title: "5 điểm đến không thể bỏ qua cho kỳ nghỉ lễ 30/4 - 1/5",
    desc: "Du lịch 30/4 1/5 là dịp để bạn khám phá các vùng đất tuyệt đẹp, thử sức với các trải nghiệm mới mẻ. Vì vậy việc chọn điểm đến cũng cần sự tìm hiểu thật kỹ lưỡng.",
    view: [{
      view1: "Dịp lễ 30/4 và 1/5 sắp tới chính là cơ hội tuyệt vời để bạn cùng gia đình và bạn bè khám phá những điểm đến mới mẻ, ẩn chứa vẻ đẹp tiềm ẩn của Việt Nam. Mỗi vùng miền trên dải đất hình chữ S đều mang một nét đẹp riêng, sẵn sàng chào đón bạn với những trải nghiệm độc đáo:",
      view2: "<strong>Côn Đảo: </strong> Nơi đây được mệnh danh là viên ngọc bích bởi vẻ đẹp hoang sơ, bình yên cùng hệ sinh thái đa dạng và những di tích lịch sử giá trị, Côn Đảo đang dần trở thành điểm đến lý tưởng cho những ai muốn tìm kiếm một kỳ nghỉ lễ 30/4 và 1/5 thật khác biệt.",
      view3: "<strong>Huế: </strong> luôn là điểm đến níu chân du khách bởi nét đẹp cổ kính, trầm mặc pha lẫn sự lãng mạn, thơ mộng. Dịp lễ 30/4 và 1/5 sắp tới, hãy cùng khám phá Cố đô Huế để trải nghiệm những giá trị văn hóa, lịch sử độc đáo và hòa mình vào không khí lễ hội sôi động.",
      view4: "<strong>Đà Lạt: </strong> khí hậu mát mẻ quanh năm, cảnh quan thiên nhiên thơ mộng với những rừng thông xanh ngút ngàn, những đồi hoa rực rỡ và những hồ nước lãng mạn. Nơi đây còn sở hữu nhiều điểm tham quan hấp dẫn như Hồ Xuân Hương, Thung lũng Tình Yêu, Đồi Mộng Mơ,..",
      view5: " <strong>Hà Giang: </strong>sở hữu những cung đường uốn lượn quanh co, những dốc núi cao ngút tầm mắt, những cánh đồng hoa tam giác mạch nở rộ. Nơi đây hứa hẹn sẽ mang đến cho bạn những trải nghiệm du lịch khó quên trong dịp lễ 30/4 và 1/5.",
      view6: " <strong>Ninh Bình: </strong> được mệnh danh là vịnh Hạ Long trên cạn với những danh lam thắng cảnh nổi tiếng như Tràng An, Tam Cốc - Bích Động, Hang Múa,... Nơi đây còn lưu giữ nhiều di tích lịch sử giá trị như Cố đô Hoa Lư, đền vua Lê Đại Hành,...Với những cảnh quan thiên nhiên hùng vĩ, những di tích lịch sử lâu đời, và những món ăn đặc sản hấp dẫn, Lữ hành Saigontourist hứa hẹn sẽ mang đến cho bạn một kỳ nghỉ lễ 30/4 và 1/5 thật đáng nhớ! ",
    }],
    img2: "https://saigontourist.net/uploads/destination/TrongNuoc/DaNang/Cu-Lao-Cham-island-Danang_490593952.jpg",
  },
];

const TravelDestinationsDetail = () => {
  const { slug } = useParams();
  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return (
      <div className="text-center text-red-500 py-20">
        <h2 className="text-2xl font-bold">Không tìm thấy điểm đến!</h2>
      </div>
    );
  }
  const views = destination.view?.[0];
  return (
    <div className="px-[200px] pt-[600px] pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="mt-8">
        {destination.img2 && (
          <img
            src={destination.img2}
            alt={destination.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-md mt-6"
          />
        )}
        <div className="mt-8">
          <p className="text-3xl font-bold text-blue-700">{destination.title}</p>
          {views && (
            <div className="mt-8 space-y-4 text-lg text-gray-800">
              {Object.values(views).map((paragraph, index) => (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                  className="leading-relaxed"
                />
              ))}
            </div>
          )}
        </div>
        <p className="mt-4 text-gray-700 leading-relaxed text-lg">
          {destination.desc}
        </p>
      </div>
    </div>
  );
};

export default TravelDestinationsDetail;
