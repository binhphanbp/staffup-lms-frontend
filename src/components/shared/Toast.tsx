interface ToastProps {
  visible: boolean;
  message: string;
}

export function Toast({ visible, message }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-lg transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
    >
      <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
      <span className="text-[14px]">{message}</span>
    </div>
  );
}
