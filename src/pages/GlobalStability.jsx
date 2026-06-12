import { useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  Wind, 
  Zap, 
  RotateCw, 
  Move, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  ClipboardList,
  ChevronRight
} from 'lucide-react';

export default function GlobalStability() {
  const [activeTab, setActiveTab] = useState(0);

  const stabilityChecks = [
    {
      id: 'chong-lat',
      title: '6.1. Ổn định Chống Lật Công trình',
      ref: 'TCVN 2737:2023, Mục 7.3',
      limitState: 'TTGH1 (Trạng thái giới hạn cực hạn)',
      badgeClass: 'badge-uls',
      icon: <RotateCw size={18} />,
      description: 'Kiểm tra nhằm đảm bảo toàn bộ công trình không bị quay lật quanh mép ngoài của móng dưới tác động của các mô men gây lật (chủ yếu là tải trọng gió ngang) so với mô men giữ ổn định (chủ yếu là trọng lượng bản thân).',
      criterionHtml: (
        <div className="formula-line">
          <var>M<sub>cl</sub></var> &ge; <var>M<sub>gl</sub></var>
        </div>
      ),
      criterion: 'M_cl >= M_gl',
      formula: 'M_{cl} \\ge M_{gl}',
      parameters: [
        { name: 'M_cl (Mô men chống lật)', desc: 'Xác định từ phần tĩnh tải có lợi và hoạt tải dài hạn: 0.9 × Tĩnh tải + η × Hoạt tải dài hạn (trong đó η là hệ số kể đến phần dài hạn của hoạt tải). Hệ số 0.9 cho tĩnh tải nhằm đề phòng trường hợp tĩnh tải thực tế nhẹ hơn tính toán.' },
        { name: 'M_gl (Mô men gây lật)', desc: 'Tổng mô men do các tải trọng ngang gây lật gây ra. Trong đó tải trọng gió tính toán được nhân hệ số độ tin cậy γ_f = 2.1 (TTGH1).' }
      ],
      notes: 'Sự kết hợp giữa hệ số quy đổi lớn cho tải trọng gió (γ_f = 2.1) và việc giảm trừ tĩnh tải chống lật (hệ số 0.9) khiến yêu cầu chống lật của TCVN 2737:2023 khắt khe hơn rất nhiều so với tiêu chuẩn cũ. Các công trình cao tầng mảnh hoặc kết cấu thép nhẹ có thể cần giải pháp móng nặng hơn hoặc neo giữ sâu hơn.',
      tableData: [
        { type: 'Tải gây lật (Gió tính toán ULS)', coef: 'γ_f = 2.1', desc: 'Phản ánh quy đổi áp lực gió từ chu kỳ lặp 10 năm lên chu kỳ lặp 430-450 năm.' },
        { type: 'Tải chống lật (Tĩnh tải có lợi)', coef: 'γ_f = 0.9', desc: 'Hệ số an toàn giảm tải trọng thường xuyên khi có tác dụng giữ ổn định.' },
        { type: 'Tải chống lật (Hoạt tải dài hạn)', coef: 'η', desc: 'Hệ số hoạt tải dài hạn có lợi cho chống lật.' }
      ]
    },
    {
      id: 'chong-truot',
      title: '6.2. Ổn định Chống Trượt Công trình',
      ref: 'TCVN 2737:2023, Mục 7.3',
      limitState: 'TTGH1 (Trạng thái giới hạn cực hạn)',
      badgeClass: 'badge-uls',
      icon: <Move size={18} />,
      description: 'Kiểm tra ổn định chống trượt ngang của công trình tại mặt tiếp xúc giữa đáy móng và nền đất dưới tác động của lực ngang tính toán (gió, động đất).',
      criterionHtml: (
        <div className="formula-line">
          <var>F<sub>ct</sub></var> &ge; <var>F<sub>gt</sub></var>
        </div>
      ),
      criterion: 'F_ct >= F_gt',
      formula: 'F_{ct} \\ge F_{gt}',
      parameters: [
        { name: 'F_gt (Lực gây trượt)', desc: 'Tổng lực ngang tính toán, ví dụ như thành phần ngang của tải trọng gió tính toán (γ_f = 2.1 cho ULS) hoặc tải trọng động đất thiết kế (A_Ed).' },
        { name: 'F_ct (Lực chống trượt)', desc: 'Sức kháng ma sát đáy móng tính bằng: (0.9 × Tổng tĩnh tải đứng có lợi) × μ (μ là hệ số ma sát giữa móng và nền) cộng các lực kháng ngang của cọc, áp lực đất bị động (nếu có).' }
      ],
      notes: 'Hệ số ma sát μ phụ thuộc vào loại đất nền dưới đáy móng (thường dao động từ 0.30 - 0.45). Cần đặc biệt lưu ý giảm tĩnh tải đứng thẳng xuống hệ số 0.9 để đảm bảo an toàn.',
      tableData: [
        { type: 'Lực gây trượt do Gió', coef: 'γ_f = 2.1', desc: 'Thành phần ngang tính toán của tải trọng gió ở TTGH1.' },
        { type: 'Lực gây trượt do Động đất', coef: 'γ_f = 1.0', desc: 'Lực ngang động đất thiết kế A_Ed theo TCVN 9386.' },
        { type: 'Lực chống trượt ma sát', coef: 'γ_f = 0.9', desc: 'Hệ số tĩnh tải đứng có lợi khi tính ma sát kháng trượt.' }
      ]
    },
    {
      id: 'chuyen-vi-dinh-tinh',
      title: '6.3. Chuyển vị Đỉnh do Gió tĩnh',
      ref: 'TCVN 2737:2023, Phụ lục G',
      limitState: 'TTGH2 (Trạng thái giới hạn sử dụng)',
      badgeClass: 'badge-sls',
      icon: <Wind size={18} />,
      description: 'Kiểm tra chuyển vị ngang tại đỉnh công trình dưới tác dụng của thành phần tĩnh của tải trọng gió nhằm đảm bảo tính thẩm mỹ, tránh nứt tường vách bao che phi kết cấu và tạo cảm giác an tâm cho người sử dụng.',
      criterionHtml: (
        <div className="formula-line">
          <var>&Delta;<sub>đỉnh</sub></var> &le; <span className="fraction"><span className="numerator"><var>H</var></span><span className="denominator">500</span></span>
        </div>
      ),
      criterion: 'Δ_dinh <= [u]_dinh (thường là H/500)',
      formula: '\\Delta_{đỉnh} \\le \\frac{H}{500}',
      parameters: [
        { name: 'Δ_đỉnh', desc: 'Chuyển vị ngang đàn hồi tại đỉnh công trình do thành phần tĩnh của tải trọng gió tiêu chuẩn gây ra.' },
        { name: '[u]_đỉnh (Chuyển vị giới hạn)', desc: 'Tra cứu trực tiếp Phụ lục G của TCVN 2737:2023 (thường là H/500 cho nhà bê tông). Đối với nhà thép tiền chế theo tiêu chuẩn Mỹ MBMA 2012, giới hạn cột dưới tải gió 10 năm là H/60.' }
      ],
      notes: 'Thực hiện kiểm tra theo TTGH2. Tổ hợp tải trọng sử dụng các hệ số độ tin cậy γ_f = 1.0. Giá trị tải trọng gió được lấy tương ứng với chu kỳ lặp 10 năm.',
      tableData: [
        { type: 'Hệ số độ tin cậy tải trọng gió', coef: 'γ_f = 1.0', desc: 'Sử dụng trị số tiêu chuẩn ở TTGH2.' },
        { type: 'Chu kỳ lặp gió kiểm tra', coef: '10 năm', desc: 'Đặc thù tính toán chuyển vị theo TCVN 2737:2023.' },
        { type: 'Giới Hạn MBMA (Nhà thép)', coef: 'H/60', desc: 'Áp dụng cho cột chịu tĩnh tải + gió 10 năm.' }
      ]
    },
    {
      id: 'chuyen-vi-dinh-dong',
      title: '6.4. Chuyển vị Đỉnh do Gió động',
      ref: 'TCVN 2737:2023, Phụ lục G & Mục 10.2.7',
      limitState: 'TTGH2 (Trạng thái giới hạn sử dụng)',
      badgeClass: 'badge-sls',
      icon: <Zap size={18} />,
      description: 'Kiểm tra chuyển vị ngang tại đỉnh công trình do tác động tổng hợp của thành phần tĩnh và động của gió, đặc biệt quan trọng với các công trình nhạy cảm động lực học.',
      criterionHtml: (
        <div className="formula-line">
          <var>&Delta;<sub>đỉnh,động</sub></var> &le; <span className="fraction"><span className="numerator"><var>H</var></span><span className="denominator">500</span></span>
        </div>
      ),
      criterion: 'Δ_dinh_dong <= H/500',
      formula: '\\Delta_{đỉnh, động} \\le \\frac{H}{500}',
      parameters: [
        { name: 'Hệ số hiệu ứng giật G_f', desc: 'Kể đến thành phần động lực học của tải trọng gió. G_f phụ thuộc vào tần số dao động riêng thứ nhất, kích thước công trình và dạng địa hình. Với công trình có chu kỳ dao động riêng thứ nhất T_1 ≤ 1s lấy G_f = 0.85.' },
        { name: 'Thay đổi cốt lõi TCVN mới', desc: 'TCVN 2737:2023 yêu cầu xem xét thành phần động của tải trọng gió (qua G_f) cho cả nhà thấp tầng, không chỉ nhà cao trên 40m như trước.' }
      ],
      notes: 'Tải trọng gió tiêu chuẩn (gió 10 năm, γ_f = 1.0) được dùng làm cơ sở để tính toán hệ số G_f và kiểm tra chuyển vị tổng hợp.',
      tableData: [
        { type: 'Hệ số hiệu ứng giật G_f (Hệ cứng)', coef: '0.85', desc: 'Lấy trực tiếp cho công trình có chu kỳ T_1 ≤ 1s.' },
        { type: 'Hệ số hiệu ứng giật G_f (Hệ mềm)', coef: 'Tính toán chi tiết', desc: 'Yêu cầu tính toán động học chi tiết khi T_1 > 1s.' }
      ]
    },
    {
      id: 'lech-tang-gio',
      title: '6.5. Chuyển vị Lệch tầng do Gió',
      ref: 'TCVN 2737:2023, Phụ lục G.2.3.5',
      limitState: 'TTGH2 (Trạng thái giới hạn sử dụng)',
      badgeClass: 'badge-sls',
      icon: <Layers size={18} />,
      description: 'Kiểm soát chuyển vị ngang tương đối giữa hai tầng liên tiếp dưới tác động của gió nhằm ngăn ngừa sự hư hỏng của tường ngăn, vách kính trang trí và cửa sổ.',
      criterionHtml: (
        <div className="formula-line">
          <span className="fraction"><span className="numerator"><var>&Delta;u</var></span><span className="denominator"><var>h</var></span></span> &le; <span className="fraction"><span className="numerator">1</span><span className="denominator"><var>X</var></span></span>
        </div>
      ),
      criterion: 'Δu / h <= 1/X (thường là 1/450 - 1/500)',
      formula: '\\frac{\\text{Demand}}{\\text{Capacity}} \\le 1.0',
      parameters: [
        { name: 'Δu (Chuyển vị ngang tương đối)', desc: 'Hiệu số chuyển vị ngang giữa hai tầng liên tiếp liền kề.' },
        { name: 'h (Chiều cao tầng)', desc: 'Chiều cao thông thủy hoặc chiều cao tính toán của tầng.' },
        { name: 'Chỉ xét tác động', desc: 'Chỉ xét do tác dụng của gió tiêu chuẩn (10 năm) và độ lún nghiêng của móng (nếu có).' }
      ],
      notes: 'Việc kiểm soát chuyển vị lệch tầng do gió giúp bảo vệ các kết cấu bao che bằng vật liệu giòn gắn cứng vào khung nhà. MBMA 2012 của Mỹ khống chế gián tiếp qua biến dạng của xà gồ vách (thường là L/120) và chuyển vị tổng thể cột H/60.',
      tableData: [
        { type: 'Hệ số tải trọng gió tiêu chuẩn', coef: 'γ_f = 1.0', desc: 'Tổ hợp ở TTGH2 sử dụng gió tiêu chuẩn.' },
        { type: 'Giới hạn kết cấu bê tông', coef: '1/500', desc: 'Mức khống chế an toàn cho tường xây gạch ngăn phòng.' }
      ]
    },
    {
      id: 'lech-tang-dong-dat',
      title: '6.6. Chuyển vị Lệch tầng do Động đất',
      ref: 'TCVN 9386:2012, Mục 4.4.3.2',
      limitState: 'Trạng thái hạn chế hư hỏng (Damage Limitation)',
      badgeClass: 'badge-sls',
      icon: <Activity size={18} />,
      description: 'Đánh giá chuyển vị lệch tầng dưới tác động động đất nhằm khống chế hư hỏng cho các cấu kiện phi kết cấu dẻo hoặc giòn lắp đặt trong công trình.',
      criterionHtml: (
        <div className="formula-line">
          <span className="fraction"><span className="numerator"><var>d<sub>r</sub></var> &bull; &nu;</span><span className="denominator"><var>h</var></span></span> &le; <var>[u]<sub>lệch</sub></var>
        </div>
      ),
      criterion: 'd_r * ν / h <= Giới hạn (từ 0.005 đến 0.010)',
      formula: '\\frac{d_r \\cdot \\nu}{h} \\le [u]_{lệch}',
      parameters: [
        { name: 'd_r', desc: 'Chuyển vị ngang tương đối giữa các tầng thiết kế dưới tác động động đất.' },
        { name: 'ν (Hệ số giảm)', desc: 'Kể đến chu kỳ lặp lại thấp hơn của tác động động đất liên quan đến yêu cầu hạn chế hư hỏng. ν = 0.4 cho công trình cấp quan trọng I & II; ν = 0.5 cho cấp III & IV.' },
        { name: 'Tổ hợp động đất hạn chế hư hỏng', desc: 'Tác động động đất thiết kế A_Ed được nhân giảm với hệ số ν: E_d = G_kj + P + (ν × A_Ed) + ∑(ψ_2,i × Q_k,i).' }
      ],
      notes: 'Khối lượng tham gia dao động để tính toán lực động đất sử dụng tổ hợp: ∑G_kj + ∑(ψ_E,i × Q_k,i), với ψ_E,i = φ × ψ_2,i (tra cứu từ Bảng 3.4 và 4.2 của TCVN 9386).',
      tableData: [
        { type: 'Cấu kiện phi kết cấu giòn gắn cứng', coef: '≤ 0.005', desc: 'Áp dụng cho tường xây gạch thông thường, vách kính cố định.' },
        { type: 'Cấu kiện phi kết cấu dẻo', coef: '≤ 0.0075', desc: 'Áp dụng cho tường thạch cao, tấm cemboard có khe co giãn.' },
        { type: 'Cấu kiện không cản trở biến dạng', coef: '≤ 0.010', desc: 'Áp dụng khi kết cấu không có tường ngăn hoặc tường liên kết trượt.' }
      ]
    },
    {
      id: 'gia-toc-dao-dong',
      title: '6.7. Gia tốc Dao động do Gió',
      ref: 'Tham khảo ISO 10137:2007 (TCVN 2737:2023 chưa quy định cụ thể)',
      limitState: 'Trạng thái giới hạn sử dụng (Độ tiện nghi của con người)',
      badgeClass: 'badge-sls',
      icon: <TrendingUp size={18} />,
      description: 'Kiểm soát gia tốc dao động ngang của sàn tầng mái do gió giật gây ra nhằm tránh cho người sử dụng công trình cao tầng có cảm giác chóng mặt, sợ hãi hoặc mất tiện nghi.',
      criterionHtml: (
        <div className="formula-line">
          <var>a<sub>peak</sub></var> &le; <var>a<sub>lim</sub></var>(<var>f<sub>0</sub></var>)
        </div>
      ),
      criterion: 'a_peak <= a_lim (phụ thuộc tần số f_0)',
      formula: 'a_{peak} \\le a_{lim}(f_0)',
      parameters: [
        { name: 'a_peak (Gia tốc đỉnh tính toán)', desc: 'Gia tốc ngang cực đại của tầng trên cùng dưới tác dụng của tải trọng gió động.' },
        { name: 'a_lim (Gia tốc giới hạn)', desc: 'Xác định dựa trên tần số dao động riêng thứ nhất f_0 của công trình và công năng sử dụng (nhà ở có f_0 = 0.617 Hz giới hạn gia tốc là a_lim = 0.05 m/s²).' }
      ],
      notes: 'Do TCVN chưa quy định trị số cụ thể, kỹ sư bắt buộc phải tham khảo tiêu chuẩn quốc tế như ISO 10137 hoặc ISO 2631. Gió dùng để tính toán gia tốc thường lấy chu kỳ lặp ngắn (1 năm theo tiêu chuẩn châu Âu EN 1991-1-4) để sát với thực tế vận hành hàng ngày.',
      tableData: [
        { type: 'Giới hạn gia tốc nhà ở (f_0 = 0.5Hz)', coef: '0.05 m/s²', desc: 'Mức đảm bảo người dân sinh hoạt bình thường không bị chóng mặt.' },
        { type: 'Giới hạn gia tốc văn phòng (f_0 = 0.5Hz)', coef: '0.07 m/s²', desc: 'Người làm việc văn phòng chấp nhận mức dao động lớn hơn một chút.' },
        { type: 'Chu kỳ lặp gió kiểm tra tiện nghi', coef: '1 - 10 năm', desc: 'Tùy thuộc vào tiêu chuẩn tham chiếu quốc tế được chọn áp dụng.' }
      ]
    },
    {
      id: 'hieu-ung-p-delta',
      title: '6.8. Hiệu ứng P-Delta do Động đất',
      ref: 'TCVN 9386:2012, Mục 4.4.2.2',
      limitState: 'TTGH1 (Phân tích phi tuyến bậc 2)',
      badgeClass: 'badge-uls',
      icon: <Scale size={18} />,
      description: 'Đánh giá mức độ ảnh hưởng của hiệu ứng bậc hai (P-Delta) do lực dọc P kết hợp với độ lệch ngang d_r gây ra, làm tăng thêm mô men uốn phụ trong cột.',
      criterionHtml: (
        <div className="formula-line">
          &theta; = <span className="fraction"><span className="numerator"><var>P<sub>tot</sub></var> &bull; <var>d<sub>r</sub></var></span><span className="denominator"><var>V<sub>tot</sub></var> &bull; <var>h</var></span></span> &le; 0.3
        </div>
      ),
      criterion: 'θ <= 0.3 (Hệ số nhạy cảm chuyển vị ngang)',
      formula: '\\theta = \\frac{P_{tot} \\cdot d_r}{V_{tot} \\cdot h}',
      parameters: [
        { name: 'P_tot (Tổng tải thẳng đứng)', desc: 'Tổng tải trọng trọng trường tích lũy từ tầng đang xét trở lên (∑G_kj + ∑ψ_E,i × Q_k,i).' },
        { name: 'd_r (Chuyển vị ngang lệch tầng)', desc: 'Chuyển vị ngang tương đối giữa các tầng thiết kế.' },
        { name: 'V_tot (Tổng lực cắt ngang tầng)', desc: 'Tổng lực cắt ngang tầng do tác động động đất thiết kế gây ra.' },
        { name: 'h (Chiều cao tầng)', desc: 'Chiều cao thông thủy của tầng đang xét.' }
      ],
      notes: 'Chỉ số θ dùng để đánh giá mức độ mảnh và nhạy cảm của khung nhà. Nếu θ > 0.3, kết cấu có nguy cơ mất ổn định hình học nghiêm trọng và không được phép đưa vào sử dụng.',
      tableData: [
        { type: 'θ ≤ 0.1', coef: 'Bỏ qua', desc: 'Hiệu ứng bậc hai không đáng kể, có thể phân tích đàn hồi bậc một.' },
        { type: '0.1 < θ ≤ 0.2', coef: 'Nhân 1/(1-θ)', desc: 'Khuếch đại nội lực động đất gần đúng để bù hiệu ứng bậc hai.' },
        { type: '0.2 < θ ≤ 0.3', coef: 'Phân tích bậc hai', desc: 'Bắt buộc chạy phân tích hình học phi tuyến bậc hai chi tiết bằng phần mềm.' },
        { type: 'θ > 0.3', coef: 'Không cho phép', desc: 'Bắt buộc tăng độ cứng ngang của công trình hoặc tăng tiết diện cột.' }
      ]
    },
    {
      id: 'dieu-kien-deo',
      title: '6.9. Điều kiện dẻo kết cấu (Cột khỏe - Dầm yếu)',
      ref: 'TCVN 9386:2012, Mục 4.4.2.3',
      limitState: 'Độ dẻo kháng chấn kết cấu',
      badgeClass: 'badge-uls',
      icon: <ShieldCheck size={18} />,
      description: 'Nguyên tắc thiết kế kháng chấn nhằm đảm bảo khớp dẻo hình thành ở các dầm trước khi xảy ra ở các cột chịu lực đứng chính, ngăn ngừa cơ chế phá hủy tầng mềm nguy hiểm.',
      criterionHtml: (
        <div className="formula-line">
          &sum;<var>M<sub>Rc</sub></var> &ge; 1.3 &bull; &sum;<var>M<sub>Rb</sub></var>
        </div>
      ),
      criterion: '∑M_Rc >= 1.3 * ∑M_Rb (tại các nút khung)',
      formula: '\\sum M_{Rc} \\ge 1.3 \\sum M_{Rb}',
      parameters: [
        { name: '∑M_Rc', desc: 'Tổng mô men kháng uốn thiết kế của các cột hội tụ tại một nút (loại trừ các nút ở tầng mái).' },
        { name: '∑M_Rb', desc: 'Tổng mô men kháng uốn thiết kế của các dầm hội tụ tại nút đó.' },
        { name: 'Hệ số ứng xử q', desc: 'Hệ số giảm lực động đất để phản ánh khả năng tiêu tán năng lượng trong miền phi tuyến. Với khung BTCT cấp DCM có q0 = 3.0 * αu/α1, cấp DCH có q0 = 4.5 * αu/α1 (αu/α1 ≤ 1.5).' }
      ],
      notes: 'Việc lựa chọn cấp độ dẻo (DCL - Thấp, DCM - Trung bình, DCH - Cao) sẽ quy định giá trị hệ số ứng xử q được phép sử dụng. Cấp độ dẻo cao giúp giảm tải động đất nhưng đòi hỏi cấu tạo chi tiết cốt thép đai vùng khớp dẻo rất khắt khe.',
      tableData: [
        { type: 'Cấp độ dẻo thấp (DCL)', coef: 'q = 1.5', desc: 'Lực động đất tính toán lớn, cấu tạo cốt thép bình thường.' },
        { type: 'Cấp độ dẻo trung bình (DCM)', coef: 'q = 3.0', desc: 'Giảm lực động đất, cấu tạo đai nghiêm ngặt vùng chân cột và đầu dầm.' },
        { type: 'Cấp độ dẻo cao (DCH)', coef: 'q = 4.5', desc: 'Giảm tối đa lực động đất, cấu tạo thép cực kỳ phức tạp để đảm bảo dẻo dai.' }
      ]
    },
    {
      id: 'ud-column-wall',
      title: '6.10. Kiểm tra Khả năng Chịu lực Cột/Vách (ud)',
      ref: 'TCVN 5574:2018 (BTCT) & TCVN 5575:2024 (Thép)',
      limitState: 'TTGH1 (Sức bền cấu kiện chịu lực chính)',
      badgeClass: 'badge-uls',
      icon: <ClipboardList size={18} />,
      description: 'Kiểm tra tỷ số sử dụng (ud - Utilization demand/capacity ratio) cho các cấu kiện cột/vách chịu nén lệch tâm xiên dưới các tổ hợp nội lực bất lợi nhất.',
      criterionHtml: (
        <div className="formula-line">
          <var>u<sub>d</sub></var> = <span className="fraction"><span className="numerator">Demand</span><span className="denominator">Capacity</span></span> &le; 1.0
        </div>
      ),
      criterion: 'ud = Demand / Capacity <= 1.0',
      formula: 'u_d = \\frac{\\text{Demand}}{\\text{Capacity}} \\le 1.0',
      parameters: [
        { name: 'Cấu kiện BTCT (TCVN 5574:2018)', desc: 'Kiểm tra nén uốn đồng thời dựa trên biểu đồ tương tác N-Mx-My phi tuyến (sử dụng mô hình biến dạng phi tuyến của vật liệu) và kiểm tra bền cắt Q ≤ Qb + Qsw.' },
        { name: 'Cấu kiện Thép (TCVN 5575:2024)', desc: 'Kiểm tra bền chịu nén uốn σ = N/A + M/W ≤ fyd * γc; ổn định tổng thể chịu nén đúng tâm N/(φA) ≤ fyd * γc. Kể đến hệ số ổn định hệ thanh không gian bằng phần mềm γs = 1.3 và hệ số độ tin cậy tầm quan trọng γn.' }
      ],
      notes: 'Hệ số ud biểu thị mức độ khai thác vật liệu của cấu kiện. Kết cấu an toàn tối ưu khi ud đạt từ 0.75 - 0.95. Nếu ud > 1.0, cấu kiện bị quá tải và mất an toàn.',
      tableData: [
        { type: 'Hệ số ổn định hệ thép γs', coef: '1.30', desc: 'Hệ số an toàn ổn định tổng thể hệ kết cấu mới của TCVN 5575:2024.' },
        { type: 'Hệ số tin cậy vật liệu thép γm', coef: '1.05', desc: 'Áp dụng cho thép cán để xác định fyd = fy / γm.' },
        { type: 'Hệ số làm việc dài hạn bê tông γb1', coef: '0.90', desc: 'Hệ số giảm cường độ bê tông khi chịu tác dụng tải trọng dài hạn.' }
      ]
    }
  ];

  

  const activeCheck = stabilityChecks[activeTab];

  return (
    <div>
      <style>{`
        .tab-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
          flex-wrap: wrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tab-nav::-webkit-scrollbar {
          display: none;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--overlay-very-light);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          background: var(--overlay-light);
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        @media (max-width: 768px) {
          .tab-nav {
            flex-wrap: nowrap;
          }
          .tab-btn {
            padding: 7px 10px;
            font-size: 0.85rem;
          }
        }

        .check-header {
          margin-bottom: 24px;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge-uls {
          background: rgba(239, 68, 68, 0.15);
          color: var(--red);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .badge-sls {
          background: rgba(96, 165, 250, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }
        .parameter-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }
        .parameter-item {
          background: var(--overlay-very-light);
          border: 1px solid var(--overlay-light);
          border-radius: var(--radius-sm);
          padding: 14px 18px;
        }
        .parameter-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          font-family: var(--font-mono);
        }
        .parameter-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .stability-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>

      <h1 className="page-title">Ổn định Tổng thể Công trình</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Hệ thống Yêu cầu Kiểm tra Kết cấu theo TCVN & ISO</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Tổng hợp chi tiết 09 hạng mục kiểm tra ổn định tổng thể, chuyển vị lệch tầng, hiệu ứng bậc hai và sức bền cấu kiện cốt lõi của công trình dựa trên <strong>TCVN 2737:2023</strong>, <strong>TCVN 9386:2012</strong>, <strong>TCVN 5574:2018</strong>, <strong>TCVN 5575:2024</strong> và <strong>ISO 10137:2007</strong>.
        </p>
      </div>

      <div className="tab-nav" style={{ flexWrap: 'wrap' }}>
        {stabilityChecks.map((check, idx) => (
          <button 
            key={check.id}
            className={`tab-btn ${activeTab === idx ? 'active' : ''}`} 
            onClick={() => setActiveTab(idx)}
          >
            {check.icon}
            {check.title}
          </button>
        ))}
      </div>

      <div className="stability-list">
        <div key={activeCheck.id} className="collapsible-card" style={{ padding: '24px' }}>
          <div className="check-header">
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>Tiêu chuẩn tham chiếu: <span style={{ color: 'var(--text-primary)' }}>{activeCheck.ref}</span></span>
              <span className={`badge ${activeCheck.badgeClass}`}>
                {activeCheck.limitState}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontSize: '1rem' }}>
              {activeCheck.description}
            </p>
          </div>

          <div className="grid-layout">
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Tiêu chí Chấp nhận & Công thức</h3>
              <div className="formula-block">
                {activeCheck.criterionHtml}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0, marginTop: '12px' }}>
                Điều kiện: Trị số tính toán &le; Trị số giới hạn cho phép.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Lưu ý Thiết kế & Kỹ thuật</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {activeCheck.notes}
              </div>
            </div>
          </div>

          {activeCheck.tableData && (
            <div className="card" style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} />
                <span>Hệ số & Tổ hợp Tải trọng Áp dụng</span>
              </h3>
              <div className="spec-table-container">
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th>Thành phần / Trường hợp</th>
                      <th>Trị số / Hệ số an toàn</th>
                      <th>Mô tả chi tiết kỹ thuật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCheck.tableData.map((row, i) => (
                      <tr key={i}>
                        <td><strong>{row.type}</strong></td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{row.coef}</td>
                        <td>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="var(--amber)" />
              <span>Các Tham số Tính toán Chi tiết</span>
            </h3>
            <div className="parameter-list">
              {activeCheck.parameters.map((param, i) => (
                <div key={i} className="parameter-item">
                  <div className="parameter-name">{param.name}</div>
                  <div className="parameter-desc">{param.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
