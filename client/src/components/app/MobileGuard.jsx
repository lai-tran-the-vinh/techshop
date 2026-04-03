import { useEffect, useState } from 'react';

const TABLET_BREAKPOINT = 1024; // px — dưới lg coi là tablet/mobile

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= TABLET_BREAKPOINT
  );

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isDesktop;
}

export default function MobileGuard({ children }) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7e161c 0%, #13001e 100%)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div style={{ marginBottom: 24 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect width="80" height="80" rx="40" fill="rgba(255,255,255,0.08)" />
            <rect x="24" y="16" width="32" height="48" rx="4" stroke="#F37021" strokeWidth="2.5" fill="none" />
            <rect x="34" y="54" width="12" height="3" rx="1.5" fill="#F37021" />
            <line x1="24" y1="50" x2="56" y2="50" stroke="#F37021" strokeWidth="2" />
            {/* X mark */}
            <circle cx="56" cy="24" r="10" fill="#7e161c" stroke="#F37021" strokeWidth="2" />
            <line x1="52" y1="20" x2="60" y2="28" stroke="#F37021" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="20" x2="52" y2="28" stroke="#F37021" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 16, color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
          TechShop
        </div>

        {/* Title */}
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
          Chưa hỗ trợ thiết bị di động
        </h2>

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: '0 0 32px' }}>
          Website hiện chỉ hoạt động tốt nhất trên máy tính.
          Vui lòng truy cập bằng trình duyệt desktop để có trải nghiệm đầy đủ.
        </p>

        {/* Divider hint */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '16px 24px',
          maxWidth: 300,
          width: '100%',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            💻 Khuyến nghị sử dụng màn hình từ <strong style={{ color: '#F37021' }}>1024px</strong> trở lên
          </p>
        </div>
      </div>
    );
  }

  return children;
}
