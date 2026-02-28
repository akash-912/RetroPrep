import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// 1. Add 'branch' as a parameter here
export const useSyllabus = (branch, semester) => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select(`
            id,
            name,
            credits,
            semester,
            branch,
            units (
              id,
              unit_number,
              title,
              topics (
                id,
                title,
                youtube_url
              )
            )
          `)
          // 2. Add both filters to the query!
          .eq('branch', branch)
          .eq('semester', semester);

        if (error) throw error;
        
        const sortedData = data.map(subject => ({
          ...subject,
          units: subject.units.sort((a, b) => a.unit_number - b.unit_number)
        }));

        setSyllabus(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 3. Only fetch if we have BOTH a branch and a semester selected
    if (branch && semester) {
      fetchSyllabus();
    }
  }, [branch, semester]); // Add branch to dependency array

  return { syllabus, loading, error };
};