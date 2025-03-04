
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionProps {
  table: string;
  event?: SubscriptionEvent;
  schema?: string;
  filter?: string;
  filterValue?: string;
  onDataChange?: (payload: RealtimePostgresChangesPayload<any>) => void;
}

/**
 * A hook for subscribing to real-time updates from Supabase tables
 */
export const useRealtimeSubscription = ({
  table,
  event = '*',
  schema = 'public',
  filter,
  filterValue,
  onDataChange
}: UseRealtimeSubscriptionProps) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const filterOptions = filter && filterValue 
      ? { [filter]: filterValue } 
      : undefined;

    console.log(`Setting up real-time subscription for ${table}`, { event, filterOptions });
    
    try {
      // Create the channel with a unique name for this subscription
      const channelName = `${table}-changes-${Math.random().toString(36).substring(2, 11)}`;
      
      const newChannel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event,
            schema,
            table,
            ...(filterOptions || {})
          },
          (payload) => {
            console.log(`Real-time update received for ${table}:`, payload);
            if (onDataChange) {
              onDataChange(payload);
            }
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for ${table}:`, status);
          setIsConnected(status === 'SUBSCRIBED');
        });

      setChannel(newChannel);
      
      return () => {
        console.log(`Cleaning up real-time subscription for ${table}`);
        if (newChannel) {
          supabase.removeChannel(newChannel);
        }
      };
    } catch (err) {
      console.error(`Error setting up real-time subscription for ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return () => {};
    }
  }, [table, event, schema, filter, filterValue, onDataChange]);

  return { isConnected, error };
};
