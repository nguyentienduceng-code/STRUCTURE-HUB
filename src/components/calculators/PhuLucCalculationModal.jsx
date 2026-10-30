import { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function PhuLucCalculationModal({ isOpen, onClose, phuLucData }) {
  const [styleMode, setStyleMode] = useState('times'); // 'times' | 'tvtk'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !phuLucData) return null;

  const {
    title,
    subtitle,
    standardRef,
    dateStr,
    inputTable,
    summaryTable,
    steps,
    utilization,
    markdown,
  } = phuLucData;

  const isTimes = styleMode === 'times';

  const handleCopyMarkdown = () => {
    try {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40);
    link.href = url;
    link.download = `PHU_LUC_${safeTitle}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="phuluc-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="phuluc-modal-window"
        style={{
          width: '100%',
          maxWidth: '960px',
          height: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL CONTROL HEADER (NO PRINT) */}
        <div
          className="no-print"
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--overlay-very-light)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isTimes
                  ? 'linear-gradient(135deg, #002060 0%, #0070C0 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Thuyết minh Phụ lục Tính toán (Chuẩn SKILL_PHULUC v2.0)
                <Sparkles size={16} color="var(--accent-gold)" />
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Định dạng Hồ sơ Kỹ thuật Chuẩn Pháp lý Xây dựng Việt Nam
              </span>
            </div>
          </div>

          {/* Style Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '3px',
                borderRadius: '8px',
                background: 'var(--overlay-hover)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <button
                type="button"
                onClick={() => setStyleMode('times')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isTimes ? '#002060' : 'transparent',
                  color: isTimes ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Bộ 1: Times New Roman
              </button>
              <button
                type="button"
                onClick={() => setStyleMode('tvtk')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: !isTimes ? '#2563eb' : 'transparent',
                  color: !isTimes ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Bộ 2: TVTK (Arial)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#555555',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PRINTABLE CALCULATION SHEET BODY */}
        <div
          className="phuluc-sheet-viewport"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            background: '#e8ecf0',
            fontFamily: isTimes ? "'Times New Roman', 'Times', serif" : "'Arial', sans-serif",
            color: '#111827',
          }}
        >
          {/* A4 PAGE CONTAINER */}
          <div
            className={`phuluc-a4-page ${isTimes ? 'phuluc-a4-page--times' : 'phuluc-a4-page--arial'}`}
            style={{
              maxWidth: '840px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#1a1a1a',
              border: '1px solid rgba(0,0,0,0.12)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              padding: '36px 42px',
              borderRadius: '8px',
              lineHeight: 1.65,
            }}
          >
            {/* 1. KHUNG HEADER & THẨM ĐỊNH (SECTION 0) */}
            <div
              style={{
                borderBottom: `2px solid ${isTimes ? '#002060' : '#2563eb'}`,
                paddingBottom: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isTimes ? '#002060' : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    CÔNG TY CP TƯ VẤN THIẾT KẾ KẾT CẤU XÂY DỰNG
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                    PHÒNG KỸ THUẬT &amp; THẨM TRA KẾT CẤU CÔNG TRÌNH
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#6b7280' }}>
                  <div>Ngày lập: <strong>{dateStr}</strong></div>
                  <div>Hồ sơ số: <strong>PL-{new Date().getFullYear()}-01</strong></div>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h1
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: isTimes ? '#002060' : '#1e3a8a',
                    textTransform: 'uppercase',
                    margin: '0 0 6px 0',
                    lineHeight: 1.35,
                  }}
                >
                  {title}
                </h1>
                <div style={{ fontSize: '0.92rem', color: '#333333', fontStyle: 'italic' }}>
                  {subtitle}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: isTimes ? 'rgba(0, 32, 96, 0.08)' : 'rgba(37, 99, 235, 0.08)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isTimes ? '#002060' : '#2563eb',
                  }}
                >
                  <Layers size={14} />
                  <span>Căn cứ pháp lý: {standardRef}</span>
                </div>
                {utilization && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '8px',
                      marginLeft: '8px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: utilization.bg,
                      border: `1px solid ${utilization.border}`,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: utilization.color,
                    }}
                  >
                    <span>{utilization.icon} Hệ số sử dụng: &eta; = {utilization.eta.toFixed(3)} ({utilization.label})</span>
                  </div>
                )}
              </div>

              {/* BẢNG PHÊ DUYỆT 3 CỘT (AGENTS.MD §8) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  marginTop: '20px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, color: '#555555', textTransform: 'uppercase' }}>Thực hiện</div>
                  <div style={{ fontWeight: 600, marginTop: '4px', color: '#111827' }}>Trợ lý AI Antigravity</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Mô-đun Tính toán Tự động</div>
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, color: '#555555', textTransform: 'uppercase' }}>Kiểm tra</div>
                  <div style={{ fontWeight: 600, marginTop: '4px', color: '#111827' }}>Kỹ sư Kết cấu</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Kiểm tra mô hình &amp; công thức</div>
                </div>
                <div style={{ padding: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#555555', textTransform: 'uppercase' }}>Chủ trì Thiết kế</div>
                  <div style={{ fontWeight: 600, marginTop: '4px', color: isTimes ? '#0070C0' : '#2563eb' }}>Kỹ sư Chủ trì CCHN</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Phê duyệt hồ sơ thiết kế</div>
                </div>
              </div>
            </div>

            {/* 2. BẢNG THÔNG SỐ ĐẦU VÀO */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: isTimes ? '#002060' : '#1e40af',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>1. Thông số Hình học, Tải trọng &amp; Cơ lý Vật liệu</span>
              </h2>
              <div className="spec-table-container">
                <table className="spec-table" style={{ fontSize: '0.86rem', width: '100%' }}>
                  <thead>
                    <tr style={{ background: isTimes ? '#002060' : '#2563eb', color: '#fff' }}>
                      <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                      <th>Thông số Thiết kế</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Ký hiệu</th>
                      <th style={{ width: '130px', textAlign: 'right' }}>Giá trị</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Đơn vị</th>
                      <th>Căn cứ / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputTable.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                        <td>{row.label}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Cambria Math', serif", fontStyle: 'italic', fontWeight: 600 }}>
                          {row.symbol}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                          {row.value}
                        </td>
                        <td style={{ textAlign: 'center', color: '#4b5563' }}>{row.unit}</td>
                        <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{row.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (FONTS & MATH ELEGANCE) */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: isTimes ? '#002060' : '#1e40af',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                <span>2. Trình tự Tính toán Step-by-Step (Thuyết minh Chi tiết)</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {steps.map((stepText, idx) => {
                  // Phân tách bước tính và nội dung
                  const match = stepText.match(/^(Bước\s*\d+\s*\[[^\]]+\]):\s*(.*)$/);
                  const stepHeader = match ? match[1] : `Bước ${idx + 1}`;
                  const stepBody = match ? match[2] : stepText;

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        borderLeft: `4px solid ${isTimes ? '#0070C0' : '#3b82f6'}`,
                        borderTop: '1px solid #e2e8f0',
                        borderRight: '1px solid #e2e8f0',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color: isTimes ? '#002060' : '#1e3a8a',
                          marginBottom: '6px',
                        }}
                      >
                        {stepHeader}
                      </div>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          lineHeight: 1.65,
                          fontFamily: isTimes ? "'Times New Roman', 'Cambria Math', serif" : "'Arial', sans-serif",
                          color: '#333333',
                        }}
                      >
                        {stepBody}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. BẢNG TỔNG HỢP KIỂM TOÁN CHỈ SỐ SỬ DỤNG η */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: isTimes ? '#002060' : '#1e40af',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <span>3. Bảng Tổng hợp Kết quả Kiểm toán Khả năng Chịu lực (&eta;)</span>
              </h2>
              <div className="spec-table-container">
                <table className="spec-table" style={{ fontSize: '0.86rem', width: '100%' }}>
                  <thead>
                    <tr style={{ background: isTimes ? '#002060' : '#2563eb', color: '#fff' }}>
                      <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                      <th>Tiêu chí Kiểm toán</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>Ký hiệu</th>
                      <th style={{ width: '130px', textAlign: 'right' }}>Giá trị Tính toán</th>
                      <th style={{ width: '130px', textAlign: 'right' }}>Giới hạn Cho phép</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>Hệ số &eta;</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryTable.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background:
                            idx === summaryTable.length - 1
                              ? isTimes
                                ? 'rgba(255, 242, 204, 0.25)'
                                : 'rgba(226, 239, 218, 0.25)'
                              : 'transparent',
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.stt}</td>
                        <td style={{ fontWeight: idx === summaryTable.length - 1 ? 700 : 500 }}>{row.item}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Cambria Math', serif", fontStyle: 'italic', fontWeight: 600 }}>
                          {row.symbol}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{row.calcVal}</td>
                        <td style={{ textAlign: 'right', color: '#4b5563' }}>{row.limitVal}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>
                          {row.eta !== '-' ? row.eta : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              background: row.status.includes('ĐẠT') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: row.status.includes('ĐẠT') ? '#10b981' : '#ef4444',
                              border: `1px solid ${row.status.includes('ĐẠT') ? '#10b981' : '#ef4444'}`,
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. DISCLAIMER & TRÁCH NHIỆM HÀNH NGHỀ (AGENTS.MD §8) */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '16px',
                borderTop: '1px dashed #cbd5e1',
                fontSize: '0.78rem',
                color: '#555555',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#333333', marginBottom: '4px' }}>
                <ShieldCheck size={14} />
                <span>Trách nhiệm và Bảo lưu Kỹ thuật (TCVN Standards Lock):</span>
              </div>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                Tài liệu do trợ lý AI STRUCTURE-HUB lập tự động theo quy chuẩn SKILL_PHULUC. Kết quả tính toán mang tính tham khảo kỹ thuật, phải được kỹ sư có chứng chỉ hành nghề phù hợp kiểm tra, đối chiếu và chịu trách nhiệm trước khi sử dụng cho hồ sơ thiết kế, thi công hoặc thẩm tra chính thức.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER CONTROLS (NO PRINT) */}
        <div
          className="no-print"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--overlay-very-light)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tiêu chuẩn xuất bản: <strong>{isTimes ? 'Bộ 1 (Times New Roman)' : 'TVTK (Arial)'}</strong> | Khổ giấy: <strong>A4</strong>
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="calc-action-btn"
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>In / Lưu PDF A4</span>
            </button>
            <button
              type="button"
              className="calc-action-btn"
              onClick={handleDownloadMd}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Tải file .md</span>
            </button>
            <button
              type="button"
              className="calc-action-btn copy-btn"
              onClick={handleCopyMarkdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent-gradient)',
                color: '#fff',
                border: 'none',
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép Markdown Phụ lục'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
