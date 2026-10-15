'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Flame, Trophy, Target, Clock, Plus, Trash2, 
  LayoutDashboard, CheckSquare, Calendar, BookOpen, Sparkles, Play, Pause, RotateCcw, Smile
} from 'lucide-react';

interface HabitItem {
  id: string;
  name: string;
  category: string;
  streak: number;
  completed: boolean;
}

interface TaskItem {
  id: string;
  time: string;
  title: string;
  status: 'CHƯA LÀM' | 'ĐANG LÀM' | 'HOÀN THÀNH';
}

interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}

interface JournalItem {
  id: string;
  date: string;
  mood: string;
  content: string;
}

export default function PersonalTrackerApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'schedule' | 'goals' | 'journal'>('dashboard');

  // Khởi tạo state mặc định (khớp 100% giữa Server và Client lần render đầu tiên)
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', name: 'Uống đủ 2.5L nước', category: 'Sức khỏe', streak: 12, completed: true },
    { id: '2', name: 'Thiền định 15 phút', category: 'Tinh thần', streak: 5, completed: false },
    { id: '3', name: 'Giải 1 bài Codeforces / LeetCode', category: 'Trí tuệ', streak: 8, completed: false },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', time: '08:00 - 11:00', title: 'Deep Work: Phát triển tính năng Core Backend', status: 'HOÀN THÀNH' },
    { id: 't2', time: '14:00 - 16:00', title: 'Đọc sách Clean Architecture (30 trang)', status: 'ĐANG LÀM' },
    { id: 't3', time: '20:00 - 21:00', title: 'Chạy bộ thể dục vòng quanh công viên', status: 'CHƯA LÀM' },
  ]);

  const [goals, setGoals] = useState<GoalItem[]>([
    { id: 'g1', title: 'Đọc sách phát triển bản thân', current: 18, target: 24, unit: 'cuốn' },
    { id: 'g2', title: 'Hoàn thành chứng chỉ System Design', current: 70, target: 100, unit: '%' },
    { id: 'g3', title: 'Chạy bộ tích lũy trong năm', current: 320, target: 500, unit: 'km' },
  ]);

  const [journals, setJournals] = useState<JournalItem[]>([
    { id: 'j1', date: '15/10/2026', mood: '🚀', content: 'Hôm nay hoàn thành xuất sắc module kiến trúc phần mềm. Kỷ luật giúp tạo ra sự tự do.' }
  ]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Nạp dữ liệu từ localStorage ngay sau khi render xong lần đầu
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem('tracker_habits_v2');
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedTasks = localStorage.getItem('tracker_tasks_v2');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedGoals = localStorage.getItem('tracker_goals_v2');
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedJournals = localStorage.getItem('tracker_journals_v2');
      if (savedJournals) setJournals(JSON.parse(savedJournals));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert('Đã hoàn thành phiên Pomodoro! Hãy nghỉ ngơi ngắn nhé.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Lưu LocalStorage tự động (chỉ lưu sau khi đã load xong lần đầu để tránh ghi đè dữ liệu)
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('tracker_habits_v2', JSON.stringify(habits));
    localStorage.setItem('tracker_tasks_v2', JSON.stringify(tasks));
    localStorage.setItem('tracker_goals_v2', JSON.stringify(goals));
    localStorage.setItem('tracker_journals_v2', JSON.stringify(journals));
  }, [habits, tasks, goals, journals, isLoaded]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  };
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Sức khỏe');
  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now().toString(), name: newHabitName.trim(), category: newHabitCategory, streak: 1, completed: false }]);
    setNewHabitName('');
  };
  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

  const cycleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus: TaskItem['status'] = 
          t.status === 'CHƯA LÀM' ? 'ĐANG LÀM' :
          t.status === 'ĐANG LÀM' ? 'HOÀN THÀNH' : 'CHƯA LÀM';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const incrementGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + 1) } : g));
  };

  const [newJournalContent, setNewJournalContent] = useState('');
  const [newJournalMood, setNewJournalMood] = useState('🚀');
  const addJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalContent.trim()) return;
    const dateStr = new Date().toLocaleDateString('vi-VN');
    setJournals([{ id: Date.now().toString(), date: dateStr, mood: newJournalMood, content: newJournalContent.trim() }, ...journals]);
    setNewJournalContent('');
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 leading-tight">Life Tracker</h2>
              <span className="text-xs text-indigo-400 font-medium">Pro Edition</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'habits', label: 'Thói quen & Heatmap', icon: CheckSquare },
              { id: 'schedule', label: 'Thời khóa biểu & Pomodoro', icon: Calendar },
              { id: 'goals', label: 'Mục tiêu năm & Quý', icon: Target },
              { id: 'journal', label: 'Nhật ký & Bài học', icon: BookOpen },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400 mb-1">Trạng thái kỷ luật</p>
          <div className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Tuyệt vời! Ổn định
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h1 className="font-bold text-lg text-indigo-400">Life Tracker</h1>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-sm px-3 py-1.5 rounded-lg text-slate-200"
          >
            <option value="dashboard">Dashboard</option>
            <option value="habits">Thói quen</option>
            <option value="schedule">Thời khóa biểu</option>
            <option value="goals">Mục tiêu</option>
            <option value="journal">Nhật ký</option>
          </select>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Chào buổi tối, Nhà kiến tạo! 🚀
                </h1>
                <p className="text-slate-400 text-sm mt-1">Hôm nay là Thứ Năm, 15/10/2026. Hãy duy trì kỷ luật thép.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="font-bold text-amber-400">Streak: 12 Ngày</span>
              </div>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tiến độ Hôm nay</p>
                  <h3 className="text-2xl font-bold mt-1 text-emerald-400">{progressPercent}%</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Thói quen hoàn thành</p>
                  <h3 className="text-2xl font-bold mt-1">{completedCount}/{totalHabits}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Target className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Kỷ lục Streak</p>
                  <h3 className="text-2xl font-bold mt-1">28 Ngày</h3>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl"><Trophy className="w-6 h-6" /></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Giờ Làm việc Sâu</p>
                  <h3 className="text-2xl font-bold mt-1">3.5 Giờ</h3>
                </div>
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl"><Clock className="w-6 h-6" /></div>
              </div>
            </div>

            {/* Habit Manager */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" /> Quản lý Thói quen & Hoạt động Hằng ngày
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Tỷ lệ hoàn thành thói quen</span>
                  <span className="font-semibold text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <form onSubmit={addHabit} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Nhập tên thói quen mới..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100"
                >
                  <option value="Sức khỏe">Sức khỏe</option>
                  <option value="Trí tuệ">Trí tuệ</option>
                  <option value="Tinh thần">Tinh thần</option>
                  <option value="Công việc">Công việc</option>
                </select>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
                  <Plus className="w-5 h-5" /> Thêm mới
                </button>
              </form>

              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className={`p-4 rounded-xl border flex items-center justify-between ${habit.completed ? 'bg-slate-950/60 border-emerald-500/30 text-slate-400' : 'bg-slate-950 border-slate-800 text-slate-100'}`}>
                    <div className="flex items-center gap-3.5">
                      <button onClick={() => toggleHabit(habit.id)} className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer ${habit.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'}`}>
                        {habit.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>
                      <div>
                        <h4 className={`font-medium text-sm ${habit.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{habit.name}</h4>
                        <span className="text-xs text-indigo-400">{habit.category} • 🔥 {habit.streak} ngày</span>
                      </div>
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} className="text-slate-600 hover:text-red-400 p-2 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HABITS & HEATMAP */}
        {activeTab === 'habits' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Biểu đồ nhiệt hoạt động</h2>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Lưới GitHub Heatmap (98 ngày gần nhất)</h3>
              <div className="overflow-x-auto pb-2">
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px]">
                  {Array.from({ length: 98 }).map((_, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-[3px] ${i % 3 === 0 || i % 5 === 0 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE & POMODORO */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Thời khóa biểu & Bộ đếm Pomodoro</h2>
            
            {/* Pomodoro Widget */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg text-indigo-300">Phiên tập trung Deep Work</h3>
                <p className="text-xs text-slate-400 mt-1">Hẹn giờ 25 phút để hoàn thành nhiệm vụ hiệu quả nhất.</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-mono font-bold text-amber-400">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                <button onClick={() => setIsRunning(!isRunning)} className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl text-white cursor-pointer shadow-lg">
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-slate-300 cursor-pointer">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Task list interactive */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-slate-200">Danh sách công việc (Click để đổi trạng thái)</h3>
              {tasks.map(t => (
                <div key={t.id} onClick={() => cycleTaskStatus(t.id)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all">
                  <div>
                    <span className="text-xs text-indigo-400 font-semibold">{t.time}</span>
                    <h4 className="font-semibold text-slate-100 mt-0.5">{t.title}</h4>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-lg font-medium ${
                    t.status === 'HOÀN THÀNH' ? 'bg-emerald-500/10 text-emerald-400' :
                    t.status === 'ĐANG LÀM' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GOALS */}
        {activeTab === 'goals' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Mục tiêu phát triển năm 2026</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {goals.map(g => {
                const percent = Math.round((g.current / g.target) * 100);
                return (
                  <div key={g.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">{g.title}</h4>
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-indigo-400">{g.current} / {g.target} <span className="text-xs text-slate-400">{g.unit}</span></p>
                        <button onClick={() => incrementGoal(g.id)} className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1 rounded-lg text-xs transition-all cursor-pointer">
                          + Tăng
                        </button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Tiến độ</span><span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Nhật ký & Sổ tay bài học</h2>
            
            <form onSubmit={addJournal} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-slate-200">Viết nhật ký hôm nay</h3>
              <div className="flex gap-3">
                {['🚀', '😊', '💡', '🔥', '🎯'].map(m => (
                  <button type="button" key={m} onClick={() => setNewJournalMood(m)} className={`p-2 rounded-xl text-xl border ${newJournalMood === m ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-800 bg-slate-950'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Hôm nay bạn đã học được bài học gì đắt giá? Cảm xúc ra sao..."
                value={newJournalContent}
                onChange={(e) => setNewJournalContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl cursor-pointer">
                Lưu Nhật ký
              </button>
            </form>

            <div className="space-y-4">
              {journals.map(j => (
                <div key={j.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-indigo-400 font-semibold">{j.date}</span>
                    <span className="text-xl">{j.mood}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{j.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}