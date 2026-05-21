export interface HistoryEvent {
  id: string;
  title: string;
  year: string;
  period: string;
  category: "khoi-nghia" | "chong-ngoai-xam" | "trieu-dai" | "hien-dai";
  tags: string[];
  image: string;
  shortSummary: string;
  content: string;
  aiSummary: string;
  figures: { name: string; role: string }[];
  significance: string;
}

export const historyEvents: HistoryEvent[] = [
  {
    id: "khoi-nghia-hai-ba-trung",
    title: "Khởi nghĩa Hai Bà Trưng",
    year: "40 - 43 SCN",
    period: "Thời kỳ Bắc thuộc lần 1",
    category: "khoi-nghia",
    tags: ["Bắc thuộc", "Hai Bà Trưng", "chống nhà Hán", "phụ nữ anh hùng"],
    image: "https://images.unsplash.com/photo-1682864917958-6cad4a5b9b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Cuộc khởi nghĩa do Hai Bà Trưng lãnh đạo chống ách đô hộ của nhà Đông Hán, giành độc lập cho đất nước trong 3 năm (40–43 SCN).",
    content: `Vào năm 40 SCN, Trưng Trắc và Trưng Nhị – hai chị em người huyện Mê Linh (nay thuộc Hà Nội) – đã phát động cuộc khởi nghĩa vũ trang chống lại ách đô hộ của nhà Đông Hán. Nguyên nhân trực tiếp là việc thái thú Tô Định tàn bạo, giết chết Thi Sách – chồng bà Trưng Trắc.

Cuộc khởi nghĩa nhanh chóng lan rộng, thu hút đông đảo nhân dân và các tướng lĩnh khắp vùng. Nghĩa quân đánh chiếm 65 thành, trị sở, lập nên nhà nước độc lập với kinh đô đặt tại Mê Linh.

Trưng Trắc xưng vương, sử gọi là Trưng Vương. Đây là lần đầu tiên trong lịch sử, một phụ nữ đứng lên lãnh đạo dân tộc giành lại chủ quyền. Tuy nhiên, đến năm 43 SCN, nhà Hán cử Mã Viện đem đại quân sang đàn áp. Trước sức mạnh áp đảo của kẻ thù, Hai Bà Trưng đã gieo mình xuống sông Hát Giang tuẫn tiết để bảo toàn khí tiết.

Dù thất bại, cuộc khởi nghĩa Hai Bà Trưng đã khơi dậy tinh thần yêu nước, ý chí bất khuất của dân tộc Việt Nam và để lại dấu ấn lịch sử vô cùng sâu sắc.`,
    aiSummary: "Khởi nghĩa Hai Bà Trưng (40-43 SCN) là cuộc nổi dậy do Trưng Trắc và Trưng Nhị lãnh đạo chống nhà Đông Hán. Nghĩa quân chiếm 65 thành, lập nước độc lập 3 năm. Đây là biểu tượng bất khuất của dân tộc và sức mạnh phụ nữ Việt Nam.",
    figures: [
      { name: "Trưng Trắc", role: "Thủ lĩnh chính, xưng Trưng Vương" },
      { name: "Trưng Nhị", role: "Đồng lãnh đạo cuộc khởi nghĩa" },
      { name: "Thi Sách", role: "Chồng Trưng Trắc, người châm ngòi nổ cuộc khởi nghĩa" },
    ],
    significance: "Cuộc khởi nghĩa đầu tiên của phụ nữ trong lịch sử Việt Nam, thể hiện tinh thần độc lập và bất khuất của dân tộc."
  },
  {
    id: "tran-bach-dang-938",
    title: "Trận Bạch Đằng - Ngô Quyền",
    year: "938 SCN",
    period: "Thời kỳ Bắc thuộc lần 3",
    category: "chong-ngoai-xam",
    tags: ["Ngô Quyền", "Bạch Đằng", "chống Nam Hán", "cọc gỗ"],
    image: "https://images.unsplash.com/photo-1758782963689-181d6176932f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Ngô Quyền đại phá quân Nam Hán trên sông Bạch Đằng năm 938, chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ.",
    content: `Năm 938, Ngô Quyền – một tướng tài người Đường Lâm (Hà Nội ngày nay) – đã tổ chức trận đánh lịch sử trên sông Bạch Đằng để chống lại quân xâm lược Nam Hán.

Chiến thuật thiên tài của Ngô Quyền là đóng cọc gỗ nhọn bịt sắt xuống lòng sông. Khi thủy triều lên, cọc chìm dưới nước. Quân ta dùng thuyền nhỏ nhử địch vào sâu, rồi rút lui khi thủy triều xuống. Thuyền chiến lớn của Nam Hán bị cọc đâm thủng, mắc cạn và bị quân ta tiêu diệt hoàn toàn.

Hoàng tử Nam Hán là Lưu Hoằng Tháo tử trận. Đây là thất bại nặng nề nhất của Nam Hán, buộc nhà nước này phải từ bỏ mộng xâm lược Việt Nam.

Trận chiến Bạch Đằng năm 938 được coi là một trong những trận đánh vĩ đại nhất lịch sử Việt Nam, mở ra thời đại độc lập, tự chủ lâu dài của dân tộc sau hơn 1000 năm Bắc thuộc. Ngô Quyền sau đó xưng vương, đặt kinh đô tại Cổ Loa.`,
    aiSummary: "Trận Bạch Đằng năm 938 do Ngô Quyền chỉ huy, dùng chiến thuật cọc gỗ đánh bại thủy quân Nam Hán. Chiến thắng này chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập cho dân tộc Việt Nam.",
    figures: [
      { name: "Ngô Quyền", role: "Chủ tướng, người thiết kế trận địa cọc" },
      { name: "Lưu Hoằng Tháo", role: "Hoàng tử Nam Hán, tử trận trên sông Bạch Đằng" },
    ],
    significance: "Chấm dứt 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập dài lâu cho dân tộc Việt Nam."
  },
  {
    id: "nha-ly-thanh-lap",
    title: "Nhà Lý thành lập & Dời đô về Thăng Long",
    year: "1009 - 1010 SCN",
    period: "Thời kỳ phong kiến độc lập",
    category: "trieu-dai",
    tags: ["Nhà Lý", "Lý Thái Tổ", "Thăng Long", "Hà Nội", "dời đô"],
    image: "https://images.unsplash.com/photo-1650820597435-c1d6d6cbbcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Lý Công Uẩn lên ngôi năm 1009, lập ra nhà Lý và quyết định dời đô từ Hoa Lư về Đại La, đổi tên thành Thăng Long – nền tảng của Hà Nội ngày nay.",
    content: `Năm 1009, sau khi vua Lê Long Đĩnh – vị vua cuối cùng của nhà Tiền Lê – qua đời, Lý Công Uẩn được các quan và tăng lữ tôn lên làm vua, lập nên triều đại nhà Lý. Đây là một trong những triều đại vàng son nhất lịch sử Việt Nam, kéo dài 216 năm.

Năm 1010, Lý Thái Tổ ban "Chiếu dời đô" – một áng văn chương lịch sử bất hủ – quyết định dời kinh đô từ Hoa Lư (Ninh Bình) về thành Đại La. Theo truyền thuyết, khi thuyền đến nơi, nhà vua thấy rồng vàng bay lên nên đổi tên thành Thăng Long (rồng bay lên).

Thăng Long trở thành trung tâm chính trị, kinh tế, văn hóa của đất nước. Nhà Lý đã xây dựng Văn Miếu – Quốc Tử Giám (1070-1076), đặt nền tảng cho nền giáo dục Nho học của Việt Nam.

Thời Lý cũng chứng kiến sự phát triển rực rỡ của Phật giáo, kiến trúc và nghệ thuật. Các công trình như chùa Một Cột, tháp Báo Thiên là di sản kiến trúc quý báu của thời kỳ này.`,
    aiSummary: "Nhà Lý (1009-1225) do Lý Công Uẩn thành lập. Năm 1010, dời đô về Thăng Long (Hà Nội ngày nay). Triều đại kéo dài 216 năm, phát triển rực rỡ về văn hóa, giáo dục (Văn Miếu) và Phật giáo.",
    figures: [
      { name: "Lý Công Uẩn (Lý Thái Tổ)", role: "Người sáng lập nhà Lý, ban Chiếu dời đô" },
      { name: "Lý Thường Kiệt", role: "Danh tướng nhà Lý, đánh bại quân Tống" },
    ],
    significance: "Thành lập kinh đô Thăng Long – nền tảng của Hà Nội hiện đại, đặt nền móng cho nhà nước phong kiến trung ương tập quyền."
  },
  {
    id: "khang-chien-chong-mong-nguyen",
    title: "Kháng chiến chống Mông – Nguyên",
    year: "1258, 1285, 1288",
    period: "Thời kỳ nhà Trần",
    category: "chong-ngoai-xam",
    tags: ["Nhà Trần", "Trần Hưng Đạo", "Mông Cổ", "Bạch Đằng", "ba lần kháng chiến"],
    image: "https://images.unsplash.com/photo-1764000667049-2199a9c904f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Nhà Trần ba lần đánh bại quân Mông – Nguyên (1258, 1285, 1288) – đế quốc hùng mạnh nhất thế giới thời bấy giờ, dưới sự lãnh đạo thiên tài của Hưng Đạo Đại Vương.",
    content: `Thế kỷ XIII, đế quốc Mông Cổ là đế quốc lớn nhất thế giới, đã chinh phục Trung Quốc, Ba Tư, Nga và nhiều vùng đất khác. Việt Nam – dưới triều đại nhà Trần – đã ba lần đánh bại đội quân xâm lược "bất khả chiến bại" này.

**Lần 1 (1258):** Quân Mông Cổ do Ngột Lương Hợp Thai chỉ huy tràn vào Đại Việt. Nhà Trần áp dụng chiến thuật "vườn không nhà trống", rút lui chiến lược, rồi phản công tiêu diệt địch.

**Lần 2 (1285):** 50 vạn quân Nguyên do Thoát Hoan chỉ huy tấn công. Quân dân nhà Trần kiên cường kháng cự. Hội nghị Diên Hồng lịch sử (1284) – nơi toàn dân đồng thanh quyết tâm đánh giặc – thể hiện ý chí đoàn kết dân tộc.

**Lần 3 (1288):** Trận Bạch Đằng lịch sử, Trần Hưng Đạo dùng lại chiến thuật cọc gỗ của Ngô Quyền, tiêu diệt hoàn toàn thủy quân Nguyên. Đây là chiến thắng oanh liệt nhất trong ba cuộc kháng chiến.

Thành công của ba cuộc kháng chiến chống Mông – Nguyên là minh chứng cho tinh thần đoàn kết và tài thao lược quân sự kiệt xuất của dân tộc Việt Nam.`,
    aiSummary: "Nhà Trần ba lần đánh bại quân Mông-Nguyên (1258, 1285, 1288). Hưng Đạo Đại Vương Trần Quốc Tuấn là thống soái tài ba. Chiến thắng Bạch Đằng 1288 tiêu diệt thủy quân Nguyên, bảo vệ nền độc lập dân tộc.",
    figures: [
      { name: "Trần Hưng Đạo (Trần Quốc Tuấn)", role: "Tổng chỉ huy quân đội, chiến lược gia thiên tài" },
      { name: "Vua Trần Nhân Tông", role: "Vua nhà Trần lãnh đạo hai cuộc kháng chiến sau" },
      { name: "Trần Quang Khải", role: "Danh tướng, chiến thắng tại Chương Dương" },
    ],
    significance: "Một trong những chiến thắng vĩ đại nhất lịch sử thế giới, bảo vệ nền độc lập và khẳng định sức mạnh của dân tộc Việt Nam."
  },
  {
    id: "khoi-nghia-lam-son",
    title: "Khởi nghĩa Lam Sơn",
    year: "1418 - 1427",
    period: "Thời kỳ chống Minh",
    category: "khoi-nghia",
    tags: ["Lê Lợi", "Nguyễn Trãi", "chống nhà Minh", "Lam Sơn", "Bình Ngô đại cáo"],
    image: "https://images.unsplash.com/photo-1758104372177-6a234763a29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Lê Lợi và Nguyễn Trãi lãnh đạo cuộc khởi nghĩa 10 năm (1418-1427) đánh đuổi quân Minh, giành lại độc lập và lập nên nhà Hậu Lê.",
    content: `Đầu thế kỷ XV, nhà Minh (Trung Quốc) xâm lược và đô hộ Đại Việt từ năm 1407. Trước cảnh đất nước lầm than, Lê Lợi – một hào trưởng ở Lam Sơn (Thanh Hóa) – đã phát động cuộc khởi nghĩa năm 1418.

Bên cạnh Lê Lợi, Nguyễn Trãi – nhà tư tưởng, chính khách lỗi lạc – đóng vai trò quan trọng trong việc vạch ra đường lối chiến lược "đánh vào lòng người" (tâm công). Ông soạn thảo vô số thư từ, hịch kêu gọi nhân dân và chiêu hàng giặc.

Sau 10 năm gian khổ, nghĩa quân Lam Sơn từng bước lớn mạnh, đánh bại quân Minh trong nhiều trận lớn. Năm 1427, quân Minh đại bại, buộc phải rút lui. Lê Lợi lên ngôi vua, thành lập nhà Hậu Lê (1428).

Năm 1428, Nguyễn Trãi soạn "Bình Ngô đại cáo" – được mệnh danh là "bản tuyên ngôn độc lập" thứ hai của Việt Nam – khẳng định chủ quyền và ý thức dân tộc của đất nước Đại Việt.`,
    aiSummary: "Khởi nghĩa Lam Sơn (1418-1427) do Lê Lợi và Nguyễn Trãi lãnh đạo, đánh đuổi nhà Minh sau 10 năm kháng chiến. Kết quả là lập ra nhà Hậu Lê và Nguyễn Trãi soạn Bình Ngô đại cáo - tuyên ngôn độc lập.",
    figures: [
      { name: "Lê Lợi", role: "Chủ soái, sau lên ngôi vua Lê Thái Tổ" },
      { name: "Nguyễn Trãi", role: "Quân sư, soạn thảo Bình Ngô đại cáo" },
      { name: "Lê Lai", role: "Danh tướng, hy sinh thay Lê Lợi" },
    ],
    significance: "Giải phóng đất nước khỏi ách đô hộ nhà Minh, Bình Ngô đại cáo là tuyên ngôn độc lập bất hủ của dân tộc."
  },
  {
    id: "tran-dong-da",
    title: "Trận Đống Đa - Quang Trung đại phá quân Thanh",
    year: "1789",
    period: "Thời kỳ Tây Sơn",
    category: "chong-ngoai-xam",
    tags: ["Quang Trung", "Nguyễn Huệ", "Đống Đa", "Tây Sơn", "chống nhà Thanh"],
    image: "https://images.unsplash.com/photo-1682864917958-6cad4a5b9b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Vua Quang Trung (Nguyễn Huệ) chỉ huy 10 vạn quân thần tốc hành quân, đại phá 29 vạn quân Thanh trong 5 ngày Tết Kỷ Dậu (1789).",
    content: `Năm 1788, quân nhà Thanh (Trung Quốc) do Tôn Sĩ Nghị chỉ huy với 29 vạn quân tràn vào Đại Việt, chiếm Thăng Long. Chúa Nguyễn Ánh cầu viện Thanh triều để chống lại nhà Tây Sơn.

Nhận tin, Nguyễn Huệ lập tức lên ngôi Hoàng đế với đế hiệu Quang Trung tại Phú Xuân (Huế) ngày 25/11/1788, rồi dẫn quân ra Bắc với tốc độ thần kỳ.

Trong vòng 5 ngày (từ mùng 3 đến mùng 5 Tết Kỷ Dậu), quân Tây Sơn đã đánh tan tác quân Thanh. Trận Đống Đa là đòn quyết định, nơi quân Tây Sơn tiêu diệt đạo quân chủ lực của địch. Tôn Sĩ Nghị bỏ chạy tán loạn, thậm chí không kịp mặc giáp.

Chiến thắng Đống Đa năm 1789 là một trong những chiến thắng chớp nhoáng và vĩ đại nhất lịch sử quân sự Việt Nam và thế giới. Ngày mùng 5 Tết hàng năm, Hà Nội tổ chức Hội Gò Đống Đa để tưởng nhớ chiến thắng này.`,
    aiSummary: "Trận Đống Đa (mùng 5 Tết Kỷ Dậu 1789): Quang Trung - Nguyễn Huệ đại phá 29 vạn quân Thanh chỉ trong 5 ngày. Đây là chiến thắng quân sự thần tốc nhất lịch sử Việt Nam, giải phóng Thăng Long.",
    figures: [
      { name: "Nguyễn Huệ (Quang Trung)", role: "Vua Tây Sơn, thống soái thiên tài" },
      { name: "Tôn Sĩ Nghị", role: "Tổng đốc nhà Thanh, bỏ chạy sau thất bại" },
      { name: "Ngô Văn Sở", role: "Tướng Tây Sơn tại Bắc Hà" },
    ],
    significance: "Chiến thắng thần tốc trong 5 ngày, bảo vệ nền độc lập trước đế quốc Thanh, đỉnh cao võ công của nhà Tây Sơn."
  },
  {
    id: "cach-mang-thang-tam",
    title: "Cách mạng Tháng Tám",
    year: "Tháng 8 năm 1945",
    period: "Thời kỳ cận – hiện đại",
    category: "hien-dai",
    tags: ["Hồ Chí Minh", "Việt Minh", "độc lập", "1945", "Tuyên ngôn Độc lập"],
    image: "https://images.unsplash.com/photo-1758104372177-6a234763a29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Cuộc cách mạng do Đảng Cộng sản và Việt Minh lãnh đạo, giành chính quyền trong cả nước, chấm dứt ách thực dân Pháp và phát xít Nhật. Ngày 2/9/1945, Hồ Chí Minh đọc Tuyên ngôn Độc lập.",
    content: `Tháng 8 năm 1945, sau khi Nhật Bản đầu hàng quân Đồng Minh, cơ hội ngàn vàng đã đến với cách mạng Việt Nam. Đảng Cộng sản Đông Dương và Mặt trận Việt Minh dưới sự lãnh đạo của Hồ Chí Minh đã phát động Tổng khởi nghĩa toàn quốc.

Chỉ trong vòng 15 ngày (14-28/8/1945), nhân dân khắp cả nước nổi dậy giành chính quyền từ tay thực dân Pháp và phát xít Nhật. Ngày 19/8, Hà Nội khởi nghĩa thành công. Ngày 23/8, vua Bảo Đại thoái vị, chấm dứt chế độ quân chủ phong kiến.

Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc "Tuyên ngôn Độc lập" – văn kiện lịch sử khai sinh nước Việt Nam Dân chủ Cộng hòa, mở ra kỷ nguyên mới của lịch sử dân tộc.

Cách mạng Tháng Tám là thắng lợi của tinh thần đoàn kết và ý chí giải phóng dân tộc, là một trong những trang sử chói lọi nhất của Việt Nam thế kỷ XX.`,
    aiSummary: "Cách mạng Tháng Tám (8/1945): Việt Minh và Đảng Cộng sản lãnh đạo tổng khởi nghĩa, giành chính quyền trong 15 ngày. Ngày 2/9/1945, Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Ba Đình, khai sinh nước VNDCCH.",
    figures: [
      { name: "Hồ Chí Minh", role: "Chủ tịch Việt Minh, đọc Tuyên ngôn Độc lập" },
      { name: "Bảo Đại", role: "Vua cuối cùng triều Nguyễn, thoái vị ngày 25/8" },
      { name: "Trường Chinh", role: "Tổng Bí thư Đảng, chỉ đạo Tổng khởi nghĩa" },
    ],
    significance: "Khai sinh nước Việt Nam Dân chủ Cộng hòa, chấm dứt ách thực dân phong kiến, mở ra kỷ nguyên độc lập, tự do."
  },
  {
    id: "tran-dien-bien-phu",
    title: "Chiến dịch Điện Biên Phủ",
    year: "13/3 – 7/5/1954",
    period: "Kháng chiến chống Pháp",
    category: "chong-ngoai-xam",
    tags: ["Võ Nguyên Giáp", "Điện Biên Phủ", "chống Pháp", "1954", "chiến thắng lịch sử"],
    image: "https://images.unsplash.com/photo-1764000667049-2199a9c904f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Chiến dịch Điện Biên Phủ (13/3 - 7/5/1954) do Đại tướng Võ Nguyên Giáp chỉ huy, đánh tan tập đoàn cứ điểm mạnh nhất của Pháp, kết thúc chiến tranh Đông Dương.",
    content: `Sau 9 năm kháng chiến trường kỳ, Điện Biên Phủ là trận quyết chiến chiến lược giữa quân đội Việt Nam và thực dân Pháp. Pháp xây dựng Điện Biên Phủ thành một "pháo đài bất khả xâm phạm" với 49 cứ điểm, 16.200 quân và hệ thống hỏa lực mạnh.

Đại tướng Võ Nguyên Giáp, sau khi cân nhắc kỹ lưỡng, đã thay đổi phương án tấn công từ "đánh nhanh, giải quyết nhanh" sang "đánh chắc, tiến chắc" – một quyết định lịch sử đúng đắn.

Bộ đội Việt Nam đã vượt qua núi non hiểm trở, kéo pháo vào trận địa bằng sức người, đào hào tiến vào bao vây từng cứ điểm một cách kiên nhẫn và bài bản.

Sau 56 ngày đêm chiến đấu (13/3 – 7/5/1954), toàn bộ tập đoàn cứ điểm Điện Biên Phủ bị tiêu diệt. Tướng De Castries và toàn bộ Bộ chỉ huy Pháp bị bắt làm tù binh.

Chiến thắng Điện Biên Phủ dẫn đến Hiệp định Genève (7/1954), chấm dứt chiến tranh Đông Dương, buộc Pháp rút khỏi Việt Nam, Lào và Campuchia.`,
    aiSummary: "Chiến dịch Điện Biên Phủ (13/3-7/5/1954): Đại tướng Võ Nguyên Giáp chỉ huy 56 ngày đêm, tiêu diệt toàn bộ tập đoàn cứ điểm Pháp. Kết quả dẫn đến Hiệp định Genève, Pháp rút khỏi Đông Dương.",
    figures: [
      { name: "Võ Nguyên Giáp", role: "Tổng chỉ huy chiến dịch, Đại tướng huyền thoại" },
      { name: "Henri Navarre", role: "Tổng chỉ huy quân Pháp ở Đông Dương" },
      { name: "De Castries", role: "Chỉ huy tập đoàn cứ điểm, bị bắt 7/5/1954" },
    ],
    significance: "Chiến thắng quân sự vĩ đại, chấm dứt chủ nghĩa thực dân Pháp ở Đông Dương, cổ vũ phong trào giải phóng dân tộc toàn thế giới."
  },
  {
    id: "thong-nhat-dat-nuoc",
    title: "Thống nhất đất nước",
    year: "30/4/1975",
    period: "Kháng chiến chống Mỹ",
    category: "hien-dai",
    tags: ["Thống nhất", "1975", "giải phóng miền Nam", "30/4", "Chiến dịch Hồ Chí Minh"],
    image: "https://images.unsplash.com/photo-1650820597435-c1d6d6cbbcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    shortSummary: "Ngày 30/4/1975, Chiến dịch Hồ Chí Minh thành công, giải phóng Sài Gòn, thống nhất đất nước sau 30 năm chiến tranh.",
    content: `Sau 30 năm chiến tranh gian khổ (1945-1975), ngày 30 tháng 4 năm 1975 đánh dấu mốc lịch sử trọng đại nhất của dân tộc Việt Nam trong thế kỷ XX – ngày thống nhất đất nước.

Chiến dịch Hồ Chí Minh (từ 26/4 đến 30/4/1975) là đòn cuối cùng và quyết định. Các binh đoàn chủ lực quân đội nhân dân Việt Nam từ nhiều hướng tiến vào Sài Gòn.

Lúc 11 giờ 30 phút ngày 30/4/1975, xe tăng 390 của Lữ đoàn tăng thiết giáp 203 húc đổ cánh cổng Dinh Độc Lập. Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện. Lá cờ giải phóng được cắm lên Dinh Độc Lập, đánh dấu sự sụp đổ hoàn toàn của chính quyền Sài Gòn.

Ngày 2/7/1976, nước Cộng hòa Xã hội Chủ nghĩa Việt Nam chính thức được thành lập, đất nước hoàn toàn thống nhất sau hàng thập kỷ chia cắt.

Chiến thắng 30/4/1975 là kết tinh của ý chí, xương máu và tinh thần bất khuất của cả dân tộc Việt Nam qua nhiều thế hệ.`,
    aiSummary: "Ngày 30/4/1975, Chiến dịch Hồ Chí Minh thành công. Xe tăng húc đổ cổng Dinh Độc Lập, Dương Văn Minh đầu hàng vô điều kiện. Đất nước thống nhất sau 30 năm kháng chiến chống Mỹ.",
    figures: [
      { name: "Văn Tiến Dũng", role: "Tổng chỉ huy Chiến dịch Hồ Chí Minh" },
      { name: "Dương Văn Minh", role: "Tổng thống cuối cùng, tuyên bố đầu hàng" },
      { name: "Lê Duẩn", role: "Bí thư Thứ nhất Đảng, chỉ đạo chiến lược" },
    ],
    significance: "Thống nhất hoàn toàn đất nước sau 30 năm kháng chiến, mở ra kỷ nguyên xây dựng và phát triển đất nước."
  },
];

export const categories = [
  { id: "all", label: "Tất cả" },
  { id: "khoi-nghia", label: "Khởi nghĩa" },
  { id: "chong-ngoai-xam", label: "Chống ngoại xâm" },
  { id: "trieu-dai", label: "Triều đại" },
  { id: "hien-dai", label: "Hiện đại" },
];

export const periods = [
  "Thời kỳ Bắc thuộc lần 1",
  "Thời kỳ Bắc thuộc lần 3",
  "Thời kỳ phong kiến độc lập",
  "Thời kỳ nhà Trần",
  "Thời kỳ chống Minh",
  "Thời kỳ Tây Sơn",
  "Thời kỳ cận – hiện đại",
  "Kháng chiến chống Pháp",
  "Kháng chiến chống Mỹ",
];
