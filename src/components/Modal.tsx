import { useEffect, useId, useRef } from "react"; import type { ReactNode } from "react"; import { X } from "lucide-react";
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode; }) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId();
  useEffect(() => { const dialog = ref.current; if (dialog && !dialog.open) dialog.showModal(); return () => { if (dialog?.open) dialog.close(); }; }, []);
  return (
    <dialog ref={ref} aria-labelledby={titleId} onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="m-auto max-h-[92dvh] w-[min(94vw,900px)] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950 p-0 text-slate-100 shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md">
      <div className="p-5 sm:p-8"><div className="mb-6 flex items-center justify-between gap-4"><h2 id={titleId} className="text-xl font-black">{title}</h2><button className="icon-button" onClick={onClose}><X size={20} /></button></div>{children}</div>
    </dialog>
  );
}
