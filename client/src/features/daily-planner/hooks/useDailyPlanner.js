// import { useState, useEffect } from "react";
// import { supabase } from "../../../lib/supabase";
// import { useAuth } from "../../auth/hooks/useAuth";

// export const useDailyPlanner = () => {
//   const { user } = useAuth();

//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [streak, setStreak] = useState(0);

//   const today = new Date().toISOString().split("T")[0];

//   //load streak
//   const loadStreak = async () => {
//     if (!user) return;

//     const { data } = await supabase
//       .from("streaks")
//       .select("*")
//       .eq("user_id", user.id)
//       .maybeSingle();

//     if (data) {
//       setStreak(data.showup_streak);
//     }
//   };

//   //update streak
//   const updateStreak = async () => {
//     if (!user) return;

//     const userId = user.id;

//     const today = new Date().toLocaleDateString("en-CA");

//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const yesterday = yesterdayDate.toLocaleDateString("en-CA");

//     const { data } = await supabase
//       .from("streaks")
//       .select("*")
//       .eq("user_id", userId)
//       .maybeSingle();

//     let newStreak = 1;

//     // first time user
//     if (!data) {
//       await supabase.from("streaks").insert({
//         user_id: userId,
//         showup_streak: 1,
//         last_active_date: today
//       });

//       setStreak(1);
//       return;
//     }

//     const lastDate = data.last_active_date;

//     // already counted today
//     if (lastDate === today) return;

//     if (lastDate === yesterday) {
//       newStreak = data.showup_streak + 1;
//     } else {
//       newStreak = 1;
//     }

//     await supabase
//       .from("streaks")
//       .update({
//         showup_streak: newStreak,
//         last_active_date: today
//       })
//       .eq("user_id", userId);

//     setStreak(newStreak);
//   };

//   // Load tasks
//   const loadTasks = async () => {
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("tasks")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq("task_date", today);

//     if (error) {
//       console.error("Load error:", error);
//       return;
//     }

//     setTasks(data || []);
//   };

//   useEffect(() => {
//     loadTasks();
//     loadStreak();
//   }, [user]);

//   // Add task
//   const addTask = async () => {
//     if (!newTask.trim()) return;

//     const { data, error } = await supabase
//       .from("tasks")
//       .insert({
//         user_id: user.id,
//         task_text: newTask,
//         task_date: today,
//         completed: false
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Insert error:", error);
//       return;
//     }

//     setTasks(prev => [...prev, data]);
//     setNewTask("");
//   };

//   // Toggle task
//   const toggleTask = async (task) => {
//     const newCompletedState = !task.completed;

//     const { data } = await supabase
//       .from("tasks")
//       .update({ completed: newCompletedState })
//       .eq("id", task.id)
//       .select()
//       .single();

//     setTasks(prev =>
//       prev.map(t => (t.id === task.id ? data : t))
//     );

//     // 🔥 If task was just completed -> update streak
//     if (!task.completed && newCompletedState) {
//       await updateStreak();
//     }
//   };

//   // Delete task
//   const deleteTask = async (id) => {
//     const { error } = await supabase
//       .from("tasks")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       console.error("Delete error:", error);
//       return;
//     }

//     setTasks(prev => prev.filter(t => t.id !== id));
//   };

//   const copyYesterdayTasks = async () => {
//     if (!user) return;

//     const today = new Date().toISOString().split("T")[0];

//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const yesterday = yesterdayDate.toISOString().split("T")[0];

//     // Get yesterday tasks
//     const { data: yesterdayTasks, error } = await supabase
//       .from("tasks")
//       .select("task_text")
//       .eq("user_id", user.id)
//       .eq("task_date", yesterday);

//     if (error) {
//       console.error(error);
//       return;
//     }

//     if (!yesterdayTasks.length) {
//       alert("No tasks found from yesterday");
//       return;
//     }

//     // Prepare new tasks for today
//     const tasksToInsert = yesterdayTasks.map(task => ({
//       user_id: user.id,
//       task_text: task.task_text,
//       task_date: today,
//       completed: false
//     }));

//     await supabase.from("tasks").insert(tasksToInsert);

//     loadTasks(); // reload today's tasks
//   };

//   const completedTasks = tasks.filter(t => t.completed).length;
//   const totalTasks = tasks.length;

//   return {
//     tasks,
//     newTask,
//     setNewTask,
//     addTask,
//     toggleTask,
//     deleteTask,
//     streak,
//     completedTasks,
//     totalTasks,
//     copyYesterdayTasks
//   };
// };