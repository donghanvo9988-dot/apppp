// components/Heatmap.tsx
import React from 'react';

interface HeatmapProps {
  data: { date: string; completed: boolean; count: number }[];
}

export const ActivityHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold tracking-wide">Biểu đồ Hoạt động (Heatmap)</h3>
        <span className="text-xs text-slate-400">365 ngày qua</span>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px]">
          {data.map((item, index) => (
            <div
              key={index}
              title={`${item.date}: ${item.completed ? 'Đã hoàn thành' : 'Chưa có hoạt động'}`}
              className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-indigo-400 ${
                item.completed 
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-400">
        <span>Ít</span>
        <div className="flex gap-1">
          <span className="w-3 h-3 rounded-[2px] bg-slate-800"></span>
          <span className="w-3 h-3 rounded-[2px] bg-emerald-500"></span>
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
};