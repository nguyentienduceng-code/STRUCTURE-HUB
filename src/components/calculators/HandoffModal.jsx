import { useState } from 'react';
import { Bot, Copy, Check, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HandoffModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (data.module_name || 'handoff').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `HANDOFF_${safeName}_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--overlay-very-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Handoff JSON cho AI Agent <Sparkles size={16} color="var(--accent-gold)" />
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Chuẩn dữ liệu liên Skill <code>SKILL_BRIDGE v2.1.0</code> — Tương thích 100% với AI Agents
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div className="calc-metric-box" style={{ padding: '10px 14px' }}>
              <span className="calc-metric-label">Mô-đun Tính toán</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{data.module_name}</strong>
            </div>
            <div className="calc-metric-box" style={{ padding: '10px 14px' }}>
              <span className="calc-metric-label">Hệ số &eta; / Trạng thái</span>
              <strong style={{ fontSize: '0.95rem', color: data.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                &eta; = {typeof data.utilization_ratio_eta === 'number' ? data.utilization_ratio_eta.toFixed(3) : data.utilization_ratio_eta} ({data.status})
              </strong>
            </div>
            <div className="calc-metric-box" style={{ padding: '10px 14px' }}>
              <span className="calc-metric-label">Độ tin cậy dữ liệu</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={15} /> {data.confidence_level || 'HIGH'}
              </strong>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong>💡 Hướng dẫn chuyển giao cho AI Agent:</strong>
            <p style={{ margin: '6px 0 0 0' }}>
              Sao chép JSON này hoặc tải file <code>.json</code> về máy. Bạn có thể gửi vào prompt của Antigravity/Argon:
              <br />
              <code style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                &quot;@[SKILL_PHULUC] Hãy lập Thuyết minh tính toán kỹ thuật .docx hoàn chỉnh từ dữ liệu Handoff JSON này&quot;
              </code>
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <pre
              style={{
                margin: 0,
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--border-glass)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                maxHeight: '320px',
                overflow: 'auto',
                lineHeight: 1.5,
              }}
            >
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--overlay-very-light)',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Schema: <code>SKILL_BRIDGE_SCHEMA_v2.1</code>
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="calc-action-btn"
              onClick={handleDownload}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Tải file .json</span>
            </button>
            <button
              type="button"
              className="calc-action-btn copy-btn"
              onClick={handleCopy}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép JSON'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

