import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';

export const useProgress = () => {
  const { user } = useAuth();
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch the user's completed topics on load
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('topic_id')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (!error && data) {
        // Store topic IDs in a Set for super-fast lookups in the UI
        setCompletedTopics(new Set(data.map(item => item.topic_id)));
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  // Toggle a topic's completion status
  const toggleTopic = async (topicId, isCurrentlyCompleted) => {
    if (!user) return;

    // Optimistically update the UI instantly
    setCompletedTopics(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyCompleted) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });

    try {
      if (isCurrentlyCompleted) {
        // Delete the record if unchecking
        await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId);
      } else {
        // Insert a record if checking
        await supabase
          .from('user_progress')
          .upsert({ 
            user_id: user.id, 
            topic_id: topicId, 
            is_completed: true 
          });
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      // If the database fails, you might want to revert the optimistic update here in a real app
    }
  };

  return { completedTopics, toggleTopic, loadingProgress: loading };
};