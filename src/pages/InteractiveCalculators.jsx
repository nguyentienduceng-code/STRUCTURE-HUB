import { useState, useMemo } from 'react';
import {
  Calculator,
  Wind,
  Layers,
  Building2,
  Hammer,
  CheckCircle,
  Compass,
  Sparkles,
  Building,
  TrendingUp,
  Shield,
  Boxes,
  LayoutGrid,
  Search,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileCheck2,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CalcWindTCVN2737 from '../components/calculators/CalcWindTCVN2737';
import CalcLiveLoadReduction from '../components/calculators/CalcLiveLoadReduction';
import CalcBeamRebar from '../components/calculators/CalcBeamRebar';
import CalcBoltCapacity from '../components/calculators/CalcBoltCapacity';
import CalcPileCapacity from '../components/calculators/CalcPileCapacity';
import CalcAnchorageLap from '../components/calculators/CalcAnchorageLap';
import CalcRCBeamAdvanced from '../components/calculators/CalcRCBeamAdvanced';
import CalcLoadCombination from '../components/calculators/CalcLoadCombination';
import CalcPunchingShear from '../components/calculators/CalcPunchingShear';
import CalcDeadLoadBuilder from '../components/calculators/CalcDeadLoadBuilder';

export default function InteractiveCalculators() {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [activeModuleId, setActiveModuleId] = useState('deadload');
  const [searchQuery, setSearchQuery] = useState('');

  // Cấu trúc 4 Chuyên khoa Kết cấu Chuẩn mực (Taxonomy)
  const DISCIPLINES = useMemo(
    () => [
      {
        id: 'loads',
        label: 'Tải trọng & Tổ hợp',
        shortLabel: 'Tải trọng',
        standard: 'TCVN 2737:2023',
        icon: <Calculator size={18} />,
        badgeText: '4 Mô-đun',
        description: 'Xác định tĩnh tải đa lớp sàn/tường, chiết giảm hoạt tải, áp lực gió động và tổ hợp tải trọng ULS/SLS Envelope.',
        modules: [
          {
            id: 'deadload',
            code: '1.1',
            title: 'Tích lũy Tĩnh tải Sàn Hoàn thiện & Tường trên Dầm',
            shortTitle: 'Tĩnh tải Sàn & Tường (A1)',
            standard: 'TCVN 2737:2023 (Mục 5)',
            badge: 'Mô-đun A1',
            icon: <Boxes size={18} />,
            desc: 'Tính toán tải trọng đa lớp sàn (Gk, Gd) & tải phân bố đều của tường gạch xây trên dầm có trừ diện tích cửa mở.',
            component: <CalcDeadLoadBuilder />,
            highlights: ['Đa lớp sàn tùy biến', 'Gạch 4 lỗ/tuynel/AAC', 'Trừ cửa sổ & cửa đi', 'Cầu nối Handoff JSON'],
          },
          {
            id: 'liveload',
            code: '1.2',
            title: 'Chiết giảm Hoạt tải Sử dụng Sàn & Cột/Tường',
            shortTitle: 'Chiết giảm Hoạt tải',
            standard: 'TCVN 2737:2023 (Điều 8.3)',
            badge: 'Hoạt tải Q',
            icon: <Layers size={18} />,
            desc: 'Tự động tính hệ số giảm tải theo diện tích truyền tải A (≥ 36m²) và theo số tầng truyền tải n (≥ 2 tầng).',
            component: <CalcLiveLoadReduction />,
            highlights: ['Hệ số diện tích α_A', 'Hệ số số tầng α_n', 'Khóa chặn biên an toàn', 'Policy Engine η'],
          },
          {
            id: 'wind',
            code: '1.3',
            title: 'Tải trọng Gió Động Tác dụng lên Công trình',
            shortTitle: 'Gió TCVN 2737:2023',
            standard: 'TCVN 2737:2023 (Điều 10.2)',
            badge: 'Tải trọng Gió',
            icon: <Wind size={18} />,
            desc: 'Tra cứu áp lực gió cơ sở W₀ chu kỳ 50 năm, hệ số k(z) theo địa hình A/B/C/D, cắt chặn z_min và tính Wk, Wd.',
            component: <CalcWindTCVN2737 />,
            highlights: ['Địa hình A/B/C/D', 'Cắt chặn z_min = 9m', 'Hệ số giật Gf', 'Phụ lục A4 đầy đủ'],
          },
          {
            id: 'combos',
            code: '1.4',
            title: 'Trình tạo Tổ hợp ULS/SLS & Bao Nội lực Envelope',
            shortTitle: 'Tổ hợp Envelope (A4)',
            standard: 'TCVN 2737:2023 (Điều 5, 8 & 10)',
            badge: 'Mô-đun A4',
            icon: <TrendingUp size={18} />,
            desc: 'Lập 4 tổ hợp tải trọng cơ bản (Tĩnh tải, Hoạt tải, Gió) + Tổ hợp đặc biệt Động đất, xuất Envelope Max/Min.',
            component: <CalcLoadCombination />,
            highlights: ['ULS_Q, ULS_W, ULS_QW, ULS_E', 'Bao cực đại Envelope', 'Hệ số ψ chuẩn hóa', 'Tìm Combo nguy hiểm nhất'],
          },
        ],
      },
      {
        id: 'concrete',
        label: 'Bê tông Cốt thép',
        shortLabel: 'BTCT',
        standard: 'TCVN 5574:2018',
        icon: <Building2 size={18} />,
        badgeText: '4 Mô-đun',
        description: 'Tính toán cốt thép uốn dầm đơn/kép, kiểm toán cốt đai chịu cắt, chọc thủng sàn nấm và chi tiết neo nối thép.',
        modules: [
          {
            id: 'beam',
            code: '2.1',
            title: 'Cốt thép Dầm BTCT chịu Uốn (Cốt đơn)',
            shortTitle: 'Dầm Cốt đơn Cơ bản',
            standard: 'TCVN 5574:2018 (Điều 8.1.2)',
            badge: 'Cốt đơn ULS',
            icon: <Building size={18} />,
            desc: 'Kiểm toán khả năng chịu uốn tiết diện chữ nhật, kiểm tra giới hạn α_m ≤ α_R, ξ ≤ ξ_R, tính diện tích As và hàm lượng μ%.',
            component: <CalcBeamRebar />,
            highlights: ['Bê tông B15-B60', 'Thép CB240T-CB600V', 'Khống chế μ_min - μ_max', 'Khóa phá hoại giòn'],
          },
          {
            id: 'beamadvanced',
            code: '2.2',
            title: 'Dầm BTCT Cốt kép & Cốt đai Cắt Toàn diện',
            shortTitle: 'Dầm Cốt kép & Cắt (B1)',
            standard: 'TCVN 5574:2018 (Điều 8.1.2 & 8.1.3)',
            badge: 'Mô-đun B1',
            icon: <Building2 size={18} />,
            desc: "Tự động tính cốt kép (As, As') khi mômen vượt α_R, kiểm tra dải nén nghiêng bê tông V_strut và tính cốt đai V_Rd.",
            component: <CalcRCBeamAdvanced />,
            highlights: ["Cốt kép As, As'", "Dải nén nghiêng V_strut", "Cốt đai V_Rd,c + V_Rd,s", "Oracle sai số 0.000%"],
          },
          {
            id: 'punching',
            code: '2.3',
            title: 'Kiểm toán Chọc thủng Sàn nấm & Đài cọc',
            shortTitle: 'Chọc thủng Sàn nấm (B4)',
            standard: 'TCVN 5574:2018 (Điều 8.1.4.2)',
            badge: 'Mô-đun B4',
            icon: <Shield size={18} />,
            desc: 'Xác định chu vi tới hạn ub góc 45°, xét điều kiện cột giữa/biên/góc, tương tác mômen uốn 2 phương và cốt đai gia cường.',
            component: <CalcPunchingShear />,
            highlights: ['Chu vi 45° u_b', 'Tương tác uốn 2 phương', 'Cốt đai chọc thủng F_sw', 'Giới hạn trần 2 F_ult'],
          },
          {
            id: 'anchorage',
            code: '2.4',
            title: 'Chiều dài Neo & Nối chồng Cốt thép',
            shortTitle: 'Neo & Nối Cốt thép',
            standard: 'TCVN 5574:2018 (Điều 10.3.5)',
            badge: 'Cấu tạo Neo/Nối',
            icon: <Compass size={18} />,
            desc: 'Xác định cường độ bám dính Rbond, chiều dài neo cơ sở L0,an, chiều dài neo thiết kế Lan và chiều dài nối chồng Llap.',
            component: <CalcAnchorageLap />,
            highlights: ['Công thức 255-259', 'Vùng chịu kéo / nén', 'Cảnh báo thép d > 32mm', 'Quy cách nối chồng'],
          },
        ],
      },
      {
        id: 'steel',
        label: 'Kết cấu Thép & Liên kết',
        shortLabel: 'Thép',
        standard: 'TCVN 5575:2024',
        icon: <Hammer size={18} />,
        badgeText: '1 Mô-đun',
        description: 'Tính toán liên kết bu lông cường độ cao chịu lực cắt, ép mặt, chịu kéo và tương tác cắt-kéo theo tiêu chuẩn mới nhất.',
        modules: [
          {
            id: 'bolt',
            code: '3.1',
            title: 'Khả năng Chịu lực Bu lông Cường độ cao',
            shortTitle: 'Bu lông CĐC 5575:2024',
            standard: 'TCVN 5575:2024 (Điều 8.4)',
            badge: 'Bu lông CĐC',
            icon: <Hammer size={18} />,
            desc: 'Kiểm toán sức chịu cắt Nbs, sức chịu ép mặt Nbp, sức chịu kéo Nbt và kiểm tra tương tác cắt-kéo cấp bền 4.6 - 10.9.',
            component: <CalcBoltCapacity />,
            highlights: ['Cấp bền 4.6 đến 10.9', 'Kiểm tra ép mặt N_bp', 'Tương tác cắt + kéo', 'Xuất bản vẽ & Handoff'],
          },
        ],
      },
      {
        id: 'geotech',
        label: 'Địa kỹ thuật & Nền móng',
        shortLabel: 'Nền móng',
        standard: 'TCVN 10304:2014',
        icon: <CheckCircle size={18} />,
        badgeText: '1 Mô-đun',
        description: 'Xác định sức chịu tải cọc đơn qua số liệu thí nghiệm hiện trường SPT (Meyerhof), phân tách ma sát thành bên và sức kháng mũi.',
        modules: [
          {
            id: 'pile',
            code: '4.1',
            title: 'Sức chịu tải Cọc đơn theo Chỉ số SPT',
            shortTitle: 'Sức chịu tải Cọc SPT',
            standard: 'TCVN 10304:2014 (Phụ lục G)',
            badge: 'Cọc SPT',
            icon: <CheckCircle size={18} />,
            desc: 'Tính toán sức kháng mũi cực hạn Qb, tổng ma sát thành bên cực hạn Qs và sức chịu tải thiết kế Rc theo công thức Meyerhof.',
            component: <CalcPileCapacity />,
            highlights: ['Phương pháp Meyerhof', 'Cọc ép / Cọc khoan nhồi', 'Khống chế trần N_p ≤ 50', 'Hệ số an toàn F_s = 2.0'],
          },
        ],
      },
    ],
    []
  );

  // Danh sách phẳng 10 mô-đun tuần tự phục vụ điều hướng
  const allModulesFlat = useMemo(() => {
    const list = [];
    DISCIPLINES.forEach((disc) => {
      disc.modules.forEach((m) => {
        list.push({ ...m, disciplineId: disc.id, disciplineName: disc.label });
      });
    });
    return list;
  }, [DISCIPLINES]);

  // Tìm mô-đun hiện tại
  const currentModuleIndex = allModulesFlat.findIndex((m) => m.id === activeModuleId);
  const currentModule = allModulesFlat[currentModuleIndex] || allModulesFlat[0];

  // Tìm kiếm trong Dashboard Overview
  const filteredDisciplines = useMemo(() => {
    if (!searchQuery.trim()) return DISCIPLINES;
    const q = searchQuery.toLowerCase();
    return DISCIPLINES.map((disc) => {
      const matchedModules = disc.modules.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.standard.toLowerCase().includes(q) ||
          m.highlights.some((h) => h.toLowerCase().includes(q))
      );
      return { ...disc, modules: matchedModules };
    }).filter((disc) => disc.modules.length > 0);
  }, [DISCIPLINES, searchQuery]);

  // Chuyển sang mô-đun cụ thể
  const handleSelectModule = (modId, discId) => {
    setActiveModuleId(modId);
    setActiveCategory(discId);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Điều hướng trước / sau
  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      const prev = allModulesFlat[currentModuleIndex - 1];
      setActiveModuleId(prev.id);
      setActiveCategory(prev.disciplineId);
    }
  };

  const handleNextModule = () => {
    if (currentModuleIndex < allModulesFlat.length - 1) {
      const next = allModulesFlat[currentModuleIndex + 1];
      setActiveModuleId(next.id);
      setActiveCategory(next.disciplineId);
    }
  };

  // Lấy các mô-đun thuộc Category đang chọn
  const currentDiscipline = DISCIPLINES.find((d) => d.id === activeCategory);

  return (
    <div className="interactive-calculators-container">
      <PageHeader
        title="8. Bộ Công cụ Tính toán Tương tác TCVN (10 Mô-đun)"
        breadcrumb="Trang chủ / 8. Máy tính Tương tác TCVN"
        description="Hệ thống máy tính kỹ thuật kết cấu chuẩn 4 tầng (Zero-Error Tolerance) phân bố theo 4 Trụ cột chuyên môn: Tải trọng & Tổ hợp (TCVN 2737), Bê tông Cốt thép (TCVN 5574), Kết cấu Thép (TCVN 5575) và Nền móng (TCVN 10304)."
      />

      {/* Banner giới thiệu Kiến trúc & Tiêu chuẩn */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(16,185,129,0.10) 100%)',
          border: '1px solid rgba(102,126,234,0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="var(--accent-gold)" />
              <span className="gradient-text">Kiến trúc Tính toán Khoa học Kết nối AI Agent Ecosystem</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
              Sắp xếp khoa học theo <strong>4 Chuyên khoa Kết cấu</strong>. Tích hợp trọn vẹn: <strong>(1) Input kiểm soát biên</strong> &rarr;{' '}
              <strong>(2) Toán học giải tích TCVN</strong> &rarr; <strong>(3) Policy Engine &eta;</strong> &rarr;{' '}
              <strong>(4) Phụ lục A4 &amp; Cầu nối SKILL_BRIDGE v2.1.0</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="spec-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>
              10 Mô-đun Hoàn thiện
            </span>
            <span className="spec-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}>
              29/29 Test PASS
            </span>
          </div>
        </div>
      </div>

      {/* Hệ thống Điều hướng 2 Cấp (2-Tier Navigation) */}
      <div className="calc-nav-container">
        {/* Cấp 1: Bộ lọc Chuyên khoa (Category Pills) */}
        <div className="calc-discipline-nav">
          <button
            type="button"
            className={`calc-discipline-btn ${activeCategory === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveCategory('overview')}
            title="Xem danh mục tổng quan 10 bài toán phân theo chuyên môn"
          >
            <LayoutGrid size={17} />
            <span>Tổng quan Danh mục</span>
            <span className="calc-discipline-count">10</span>
          </button>

          {DISCIPLINES.map((disc) => (
            <button
              key={disc.id}
              type="button"
              className={`calc-discipline-btn ${activeCategory === disc.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(disc.id);
                // Nếu mô-đun hiện tại không thuộc nhóm này thì gán mô-đun đầu tiên của nhóm
                if (!disc.modules.some((m) => m.id === activeModuleId)) {
                  setActiveModuleId(disc.modules[0].id);
                }
              }}
            >
              {disc.icon}
              <span>{disc.label}</span>
              <span className="calc-discipline-count">{disc.modules.length}</span>
            </button>
          ))}

          <button
            type="button"
            className={`calc-discipline-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
            title="Hiển thị tuần tự toàn bộ 10 mô-đun (Phục vụ thẩm tra & in ấn)"
          >
            <BookOpen size={17} />
            <span>Xem Toàn bộ 10 Mô-đun</span>
          </button>
        </div>

        {/* Cấp 2: Sub-navigation chọn mô-đun con trong Chuyên khoa */}
        {currentDiscipline && (
          <div className="calc-sub-nav">
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '6px' }}>
              Bài toán trong nhóm:
            </span>
            {currentDiscipline.modules.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`calc-sub-btn ${activeModuleId === m.id ? 'active' : ''}`}
                onClick={() => setActiveModuleId(m.id)}
              >
                <span className="calc-sub-code">{m.code}</span>
                <span>{m.shortTitle}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* VIEW 1: DASHBOARD TỔNG QUAN (OVERVIEW CATALOG)                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeCategory === 'overview' && (
        <div>
          {/* Search bar trong overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '520px' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm nhanh mô-đun (VD: dầm, gió, bu lông, chọc thủng, cọc, tải trọng)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  background: 'var(--bg-input, #1e293b)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                }}
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {/* Render 4 khối chuyên môn */}
          {filteredDisciplines.map((disc) => (
            <section key={disc.id} className="calc-catalog-section">
              <div className="calc-catalog-header">
                <h3 className="calc-catalog-title">
                  {disc.icon}
                  <span>{disc.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--accent-primary)' }}>
                    ({disc.standard})
                  </span>
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {disc.modules.length} công cụ tính toán
                </span>
              </div>

              <div className="calc-catalog-grid">
                {disc.modules.map((m) => (
                  <div key={m.id} className="calc-catalog-card">
                    <div>
                      <div className="calc-catalog-top">
                        <span className="calc-catalog-code">Mô-đun {m.code}</span>
                        <span className="calc-catalog-badge">{m.badge}</span>
                      </div>
                      <h4 className="calc-catalog-name">{m.title}</h4>
                      <p className="calc-catalog-desc">{m.desc}</p>
                      <div className="calc-catalog-tags">
                        {m.highlights.map((h, i) => (
                          <span key={i} className="calc-catalog-tag">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="calc-catalog-btn"
                      onClick={() => handleSelectModule(m.id, disc.id)}
                    >
                      <span>Mở công cụ tính toán</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* VIEW 2: CHẾ ĐỘ TẬP TRUNG (FOCUSED MODULE VIEW)                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeCategory !== 'overview' && activeCategory !== 'all' && (
        <div>
          {/* Header breadcrumb & Next/Prev switcher */}
          <div className="calc-focused-header">
            <div className="calc-breadcrumb">
              <span>Mục 8</span>
              <span>/</span>
              <span>{currentDiscipline?.label}</span>
              <span>/</span>
              <strong>Mô-đun {currentModule.code}: {currentModule.shortTitle}</strong>
              <span className="spec-badge" style={{ marginLeft: '6px', fontSize: '0.72rem' }}>
                {currentModule.standard}
              </span>
            </div>

            <div className="calc-step-switcher">
              <button
                type="button"
                className="calc-step-btn"
                onClick={handlePrevModule}
                disabled={currentModuleIndex === 0}
                title="Chuyển sang mô-đun liền trước"
              >
                <ArrowLeft size={14} />
                <span>Trước</span>
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentModuleIndex + 1} / {allModulesFlat.length}
              </span>

              <button
                type="button"
                className="calc-step-btn"
                onClick={handleNextModule}
                disabled={currentModuleIndex === allModulesFlat.length - 1}
                title="Chuyển sang mô-đun tiếp theo"
              >
                <span>Sau</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Render duy nhất component đang active */}
          {currentModule.component}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* VIEW 3: XEM TOÀN BỘ 10 MÔ-ĐUN (AUDIT / PRINT MODE)                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeCategory === 'all' && (
        <div>
          <div
            style={{
              padding: '12px 18px',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Chế độ Thẩm tra Toàn diện: Hiển thị tuần tự 10 Mô-đun tính toán phân theo 4 Chuyên khoa
              </span>
            </div>
            <button
              type="button"
              className="calc-action-btn"
              onClick={() => setActiveCategory('overview')}
              style={{ padding: '4px 12px', fontSize: '0.82rem' }}
            >
              Về Tổng quan Danh mục
            </button>
          </div>

          {/* Khối I: Tải trọng & Tổ hợp */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '8px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calculator size={22} />
              <span>PHẦN I: TẢI TRỌNG &amp; TỔ HỢP TẢI TRỌNG (TCVN 2737:2023)</span>
            </h3>
            <CalcDeadLoadBuilder />
            <CalcLiveLoadReduction />
            <CalcWindTCVN2737 />
            <CalcLoadCombination />
          </div>

          {/* Khối II: Bê tông Cốt thép */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ borderBottom: '2px solid var(--accent-green)', paddingBottom: '8px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={22} />
              <span>PHẦN II: KẾT CẤU BÊ TÔNG CỐT THÉP (TCVN 5574:2018)</span>
            </h3>
            <CalcBeamRebar />
            <CalcRCBeamAdvanced />
            <CalcPunchingShear />
            <CalcAnchorageLap />
          </div>

          {/* Khối III: Kết cấu Thép */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ borderBottom: '2px solid var(--accent-gold, #f59e0b)', paddingBottom: '8px', color: 'var(--accent-gold, #f59e0b)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Hammer size={22} />
              <span>PHẦN III: KẾT CẤU THÉP &amp; LIÊN KẾT (TCVN 5575:2024)</span>
            </h3>
            <CalcBoltCapacity />
          </div>

          {/* Khối IV: Địa kỹ thuật & Móng */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ borderBottom: '2px solid #8b5cf6', paddingBottom: '8px', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={22} />
              <span>PHẦN IV: ĐỊA KỸ THUẬT &amp; NỀN MÓNG (TCVN 10304:2014)</span>
            </h3>
            <CalcPileCapacity />
          </div>
        </div>
      )}
    </div>
  );
}
