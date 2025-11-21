import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const AdSlot = ({ position='sidebar' }) => {
  const [ads, setAds] = useState([]);
  useEffect(() => {
    apiFetch('/ads').then(list => {
      setAds(list.filter(a => a.position === position && a.active));
    }).catch(console.error);
  }, [position]);

  if (ads.length === 0) return null;
  const ad = ads[0];
  return <div className={`ad-slot ad-${position}`} style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: ad.html }} />;
};

export default AdSlot;
