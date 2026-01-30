import { useEffect, useState } from 'react';
import { getSmartLinkConfig } from '@/lib/adsSource';

interface SmartLinkBoxProps {
  className?: string;
}

const SmartLinkBox = ({ className = '' }: SmartLinkBoxProps) => {
  const [config, setConfig] = useState<{ url: string; text: string } | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const smartLinkConfig = await getSmartLinkConfig();
      if (smartLinkConfig?.enabled) {
        setConfig({
          url: smartLinkConfig.url,
          text: smartLinkConfig.text
        });
      }
    };
    loadConfig();
  }, []);

  if (!config) return null;

  return (
    <div className={`smart-link-box ${className}`}>
      <a 
        href={config.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="smart-link-content"
      >
        <span className="smart-link-text">{config.text}</span>
      </a>
      <style>{`
        .smart-link-box {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 25%, #d63031 50%, #b71540 75%, #6c3483 100%);
          border-radius: 12px;
          padding: 3px;
          margin: 16px 0;
          box-shadow: 0 4px 15px rgba(214, 48, 49, 0.4);
        }
        .smart-link-content {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(30,0,20,0.9) 100%);
          border-radius: 10px;
          padding: 12px 16px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .smart-link-content:hover {
          background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(50,0,30,0.8) 100%);
        }
        .smart-link-text {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          line-height: 1.4;
        }
        @media (max-width: 640px) {
          .smart-link-text {
            font-size: 13px;
          }
          .smart-link-content {
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartLinkBox;

