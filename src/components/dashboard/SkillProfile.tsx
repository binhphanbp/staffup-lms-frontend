import React from 'react';

export const SkillProfile = () => {
  return (
    <div className="card p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Hồ sơ Năng lực (Tech Stack)</h3>
        <a
          href="#"
          className="text-primary bg-primary-bg rounded px-2 py-1 text-[10px] font-semibold hover:underline"
        >
          Chi tiết
        </a>
      </div>

      <div className="space-y-4">
        {/* Skill 1 */}
        <div>
          <div className="mb-1.5 flex justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <i className="fa-brands fa-aws text-[#ff9900]"></i> AWS Services
            </span>
            <span className="font-mono font-bold text-slate-800">Lvl 3 (Mid)</span>
          </div>
          <div className="flex h-1.5 gap-1">
            <div className="flex-1 rounded-l-full bg-[#ff9900]"></div>
            <div className="flex-1 bg-[#ff9900]"></div>
            <div className="flex-1 bg-[#ff9900]"></div>
            <div className="flex-1 bg-slate-100"></div>
            <div className="flex-1 rounded-r-full bg-slate-100"></div>
          </div>
        </div>

        {/* Skill 2 */}
        <div>
          <div className="mb-1.5 flex justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <i className="fa-brands fa-docker text-[#2496ed]"></i> Docker / K8s
            </span>
            <span className="font-mono font-bold text-slate-800">Lvl 4 (Senior)</span>
          </div>
          <div className="flex h-1.5 gap-1">
            <div className="flex-1 rounded-l-full bg-[#2496ed]"></div>
            <div className="flex-1 bg-[#2496ed]"></div>
            <div className="flex-1 bg-[#2496ed]"></div>
            <div className="flex-1 bg-[#2496ed]"></div>
            <div className="flex-1 rounded-r-full bg-slate-100"></div>
          </div>
        </div>

        {/* Skill 3 */}
        <div>
          <div className="mb-1.5 flex justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <i className="fa-brands fa-python text-[#3776ab]"></i> Python / Scripting
            </span>
            <span className="font-mono font-bold text-slate-800">Lvl 2 (Junior)</span>
          </div>
          <div className="flex h-1.5 gap-1">
            <div className="flex-1 rounded-l-full bg-[#3776ab]"></div>
            <div className="flex-1 bg-[#3776ab]"></div>
            <div className="flex-1 bg-slate-100"></div>
            <div className="flex-1 bg-slate-100"></div>
            <div className="flex-1 rounded-r-full bg-slate-100"></div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-md border border-orange-100 bg-orange-50 p-3 text-[11px] text-orange-700">
        <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
        <div className="leading-relaxed">
          Năng lực <strong>Bảo mật hệ thống (Security)</strong> đang ở mức 0. Đây là kỹ năng bắt
          buộc trong Quý này.
        </div>
      </div>
    </div>
  );
};
