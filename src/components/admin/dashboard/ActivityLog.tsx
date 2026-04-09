export const ActivityLog = () => {
  const logs = [
    {
      icon: 'lightbulb',
      iconBg: 'bg-[#FEF7E0]',
      iconColor: 'text-[#F9AB00]',
      type: 'HỌC VIÊN',
      user: 'Trần Thị Bé',
      action: 'vừa mình chứng chỉ khóa Digital Marketing',
      time: '10 phút trước',
    },
    {
      icon: 'description',
      iconBg: 'bg-[#E8F4FD]',
      iconColor: 'text-[#1A73E8]',
      type: 'GIẢNG VIÊN',
      user: 'Vũ Hải Đăng',
      action: 'đã cập nhật nội dung module 3 khóa Python Cơ bản',
      time: '1 giờ trước',
    },
    {
      icon: 'school',
      iconBg: 'bg-[#E6F4EA]',
      iconColor: 'text-[#34A853]',
      type: 'HỆ THỐNG AI',
      user: 'Gợi ý tự động',
      action: '5 khóa học bị đáng mềm cho bộ phận Kế toán',
      time: '2 giờ trước',
    },
    {
      icon: 'admin_panel_settings',
      iconBg: 'bg-[#FCE8E6]',
      iconColor: 'text-[#EA4335]',
      type: '[ADMIN]',
      user: 'Thêm mới 25 tài khoản nhân viên đợt Onboarding tháng 3',
      action: '',
      time: '4km qua',
    },
  ];

  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <h3 className="mb-4 text-[16px] font-medium text-[#202124]">
        Nhật ký Hoạt động Toàn hệ thống
      </h3>

      <div className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-3 border-b border-[#F1F3F4] pb-3">
            <div
              className={`flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full ${log.iconBg}`}
            >
              <span className={`material-symbols-outlined text-[18px] ${log.iconColor}`}>
                {log.icon}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-[13px] text-[#202124]">
                <span className="font-medium text-[#5F6368]">{log.type}</span>{' '}
                {log.user && <strong>{log.user}</strong>} {log.action}
              </div>
              <div className="text-[12px] text-[#5F6368]">{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
