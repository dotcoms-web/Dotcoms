import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001' as never)
        .maybeSingle();
      if (mounted) {
        setSettings(data as Record<string, string> | null);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
