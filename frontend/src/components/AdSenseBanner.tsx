import { useEffect } from 'react';

interface AdSenseBannerProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: string;
  layoutKey?: string;
}

export default function AdSenseBanner({
  client,
  slot,
  format = 'auto',
  responsive = 'true',
  layoutKey,
}: AdSenseBannerProps) {
  useEffect(() => {
    try {
      // @ts-expect-error window.adsbygoogle is not declared on window type
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-2" style={{ minHeight: '100px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(format !== 'fluid' ? { 'data-full-width-responsive': responsive } : {})}
      />
    </div>
  );
}
