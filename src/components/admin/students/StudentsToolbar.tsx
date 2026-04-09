export function StudentsToolbar() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
        <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
        <input
          type="text"
          placeholder="Tìm tên, email học viên..."
          className="flex-1 border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
        />
      </div>
      <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
        <option>Tất cả Phòng ban</option>
        <option>Sales</option>
        <option>Marketing</option>
        <option>Tech</option>
        <option>HR</option>
      </select>
      <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
        <option>Tất cả Trạng thái</option>
        <option>Hoạt động</option>
        <option>Đã khóa</option>
      </select>
      <button className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#DADCE0] bg-white text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
        <span className="material-symbols-outlined text-[20px]">refresh</span>
      </button>
    </div>
  );
}
