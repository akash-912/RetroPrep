import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';

export const usePlanner = (selectedExamType) => {
  const { user } = useAuth();
  const [plannedTopics, setPlannedTopics] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch topics planned for the specific exam
  useEffect(() => {
    const fetchPlannedTopics = async () => {
      if (!user || !selectedExamType) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('exam_plans')
        .select('topic_id')
        .eq('user_id', user.id)
        .eq('exam_type', selectedExamType);

      if (!error && data) {
        setPlannedTopics(new Set(data.map(item => item.topic_id)));
      }
      setLoading(false);
    };

    fetchPlannedTopics();
  }, [user, selectedExamType]);

  // Add or remove a topic from the current exam plan
  const togglePlannedTopic = async (topicId, isCurrentlyPlanned) => {
    if (!user || !selectedExamType) return;

    // Optimistic UI update
    setPlannedTopics(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyPlanned) newSet.delete(topicId);
      else newSet.add(topicId);
      return newSet;
    });

    try {
      if (isCurrentlyPlanned) {
        await supabase
          .from('exam_plans')
          .delete()
          .eq('user_id', user.id)
          .eq('exam_type', selectedExamType)
          .eq('topic_id', topicId);
      } else {
        await supabase
          .from('exam_plans')
          .upsert({ 
            user_id: user.id, 
            exam_type: selectedExamType, 
            topic_id: topicId 
          });
      }
    } catch (error) {
      console.error("Failed to update exam plan:", error);
    }
  };

  return { plannedTopics, togglePlannedTopic, loadingPlanner: loading };
};