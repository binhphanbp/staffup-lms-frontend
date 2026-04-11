import React from 'react';

export const BadgeTab = () => {
  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out] space-y-8 pb-12">
      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <i className="fa-solid fa-circle-info text-primary mt-0.5"></i>
        <div>
          <h4 className="mb-1 text-sm font-bold text-blue-800">
            Hệ thống Gamification của Staffup
          </h4>
          <p className="text-xs leading-relaxed text-blue-700">
            Thu thập huy hiệu bằng cách hoàn thành các bài Lab thực hành hoặc bài thi trắc nghiệm.
            Huy hiệu được chia làm 3 cấp: Bronze (Cơ bản), Silver (Thành thạo), Gold (Chuyên gia).
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-bold text-slate-800">
          Infrastructure & Cloud
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Badge 1 */}
          <div className="card badge-card group flex cursor-pointer flex-col items-center border-transparent p-4 text-center hover:border-blue-200">
            <div className="hexagon-wrapper badge-gold mb-3">
              <div className="hexagon-border"></div>
              <div className="hexagon">
                <i className="fa-brands fa-docker text-4xl text-[#2496ed]"></i>
              </div>
            </div>
            <div className="mb-1 text-xs font-bold text-slate-800">Docker Master</div>
            <div className="rounded border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-600">
              Level: Gold
            </div>
          </div>

          {/* Badge 2 */}
          <div className="card badge-card group flex cursor-pointer flex-col items-center border-transparent p-4 text-center hover:border-orange-200">
            <div className="hexagon-wrapper badge-silver mb-3">
              <div className="hexagon-border"></div>
              <div className="hexagon">
                <i className="fa-brands fa-aws text-4xl text-[#ff9900]"></i>
              </div>
            </div>
            <div className="mb-1 text-xs font-bold text-slate-800">Cloud Builder</div>
            <div className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              Level: Silver
            </div>
          </div>

          {/* Badge 3 */}
          <div className="card badge-card group flex cursor-pointer flex-col items-center border-transparent p-4 text-center hover:border-blue-200">
            <div className="hexagon-wrapper badge-bronze mb-3">
              <div className="hexagon-border"></div>
              <div className="hexagon">
                <i className="fa-solid fa-dharmachakra text-4xl text-[#326ce5]"></i>{' '}
              </div>
            </div>
            <div className="mb-1 text-xs font-bold text-slate-800">K8s Explorer</div>
            <div className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              Level: Bronze
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
