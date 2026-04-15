'use client';

import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

export default function VisitorId() {
  const [id, setId] = useState<string>('');

  useEffect(() => {
    let saved = localStorage.getItem('visitor_id');
    if (!saved) {
      saved = `UID-${nanoid(10).toUpperCase()}`;
      localStorage.setItem('visitor_id', saved);
    }
    setId(saved);
  }, []);

  return (
    <span className="font-mono text-xs opacity-50 tracking-widest">
      {id || 'LOADING...'}
    </span>
  );
}
