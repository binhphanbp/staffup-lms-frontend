'use client';

export const DepartmentCompletionChart = () => {
  const departments = [
    { name: 'Sales', value: 95, color: '#1A73E8' },
    { name: 'Tech', value: 92, color: '#1A73E8' },
    { name: 'HR', value: 85, color: '#1A73E8' },
    { name: 'Marketing', value: 65, color: '#EA4335' },
    { name: 'Finance', value: 88, color: '#1A73E8' },
  ];

  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <h3 className="mb-6 text-[16px] font-medium text-[#202124]">
        Tỷ lệ Hoàn thành theo Phòng ban
      </h3>

      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[13px] text-[#5F6368]">{dept.name}</span>
              <span className="text-[13px] font-medium text-[#202124]">{dept.value}%</span>
            </div>
            <div className="h-[24px] w-full overflow-hidden rounded bg-[#F1F3F4]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${dept.value}%`,
                  backgroundColor: dept.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
