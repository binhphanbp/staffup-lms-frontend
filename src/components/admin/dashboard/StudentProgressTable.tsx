interface StudentProgressTableProps {
  data?: Array<{
    fullName: string;
    email: string;
    courseTitle: string;
    progressPercent: number;
  }>;
  loading?: boolean;
}

const SkeletonRow = () => (
  <tr className="border-b border-[#F1F3F4]">
    <td className="py-3">
      <div className="flex items-center gap-3">
        <div className="h-[32px] w-[32px] animate-pulse rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </td>
    <td className="py-3">
      <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="py-3">
      <div className="h-2 w-[100px] animate-pulse rounded-full bg-gray-200" />
    </td>
  </tr>
);

export const StudentProgressTable = ({ data, loading }: StudentProgressTableProps) => {
  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#202124]">Tiến độ Học viên mới nhất</h3>
        <button className="text-[13px] font-medium text-[#1A73E8] hover:underline">
          Xem tất cả
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#DADCE0]">
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Học viên
            </th>
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Khóa học đang tham gia
            </th>
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Tiến độ
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-[13px] text-[#5F6368]">
                Chưa có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((student, index) => (
              <tr key={index} className="border-b border-[#F1F3F4]">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#202124]">
                        {student.fullName}
                      </div>
                      <div className="text-[12px] text-[#5F6368]">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-[13px] text-[#202124]">{student.courseTitle}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-[100px] overflow-hidden rounded-full bg-[#F1F3F4]">
                      <div
                        className="h-full bg-[#1A73E8]"
                        style={{ width: `${student.progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[13px] font-medium text-[#202124]">
                      {student.progressPercent}%
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
