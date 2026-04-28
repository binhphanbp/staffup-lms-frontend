'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from '@/lib/toast';
import { LearningPathGraph } from '@/components/admin/learning-path/LearningPathGraph';
import { StatsBar } from '@/components/admin/learning-path/StatsBar';
import { EmployeeSelector } from '@/components/admin/learning-path/EmployeeSelector';
import { PassedSelector } from '@/components/admin/learning-path/PassedSelector';
import { DataEditor } from '@/components/admin/learning-path/DataEditor';
import { EmailPanel } from '@/components/admin/learning-path/EmailPanel';
import {
  learningPathService,
  type CurriculumEdge,
  type CurriculumNode,
  type EmployeeListItem,
  type GeneratedEmail,
  type PreviewResult,
} from '@/services/learning-path.service';

type Tab = 'passed' | 'editor';

export default function LearningPathPage() {
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [edges, setEdges] = useState<CurriculumEdge[]>([]);
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [tab, setTab] = useState<Tab>('passed');
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [savingPassed, setSavingPassed] = useState(false);

  const reloadGraph = useCallback(async () => {
    const g = await learningPathService.getGraph();
    setNodes(g.nodes);
    setEdges(g.edges);
  }, []);

  // Initial load: graph + employees
  useEffect(() => {
    (async () => {
      try {
        const [g, emp] = await Promise.all([
          learningPathService.getGraph(),
          learningPathService.listEmployees(),
        ]);
        setNodes(g.nodes);
        setEdges(g.edges);
        setEmployees(emp);
      } catch (err) {
        console.error(err);
        toast.error('Không tải được dữ liệu lộ trình.');
      } finally {
        setLoadingGraph(false);
      }
    })();
  }, []);

  // Whenever employee changes → load their passed-set from DB
  useEffect(() => {
    if (!selectedEmployeeId) {
      setPassedIds([]);
      return;
    }
    (async () => {
      try {
        const p = await learningPathService.preview({ userId: Number(selectedEmployeeId) });
        // We don't have a separate "get test results" endpoint; the preview's exempted = passed
        setPassedIds(p.exempted.map((n) => n.id).sort());
        setPreview(p);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedEmployeeId]);

  // Recompute preview whenever passedIds changes (algorithmic, not from DB)
  useEffect(() => {
    if (nodes.length === 0) return;
    let cancelled = false;
    (async () => {
      setLoadingPreview(true);
      try {
        const p = await learningPathService.preview({ passedNodeIds: passedIds });
        if (!cancelled) setPreview(p);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [passedIds, nodes.length, edges.length]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  async function handleGenerate() {
    if (!preview) return;
    setLoadingEmail(true);
    try {
      const employeeData = selectedEmployee
        ? {
            fullName: selectedEmployee.fullName,
            position: selectedEmployee.position || 'Nhân viên',
            department: selectedEmployee.department?.name ?? 'Phòng ban',
            startDate: new Date().toISOString().slice(0, 10),
            testScore: 80,
          }
        : {
            fullName: 'Nhân viên Mới',
            position: 'Junior',
            department: 'General',
            startDate: new Date().toISOString().slice(0, 10),
            testScore: 80,
          };
      const result = await learningPathService.generateEmail({
        userId: selectedEmployeeId ? Number(selectedEmployeeId) : undefined,
        employee: employeeData,
        passedNodeIds: passedIds,
      });
      setEmail(result.email);
      toast.success('Đã sinh email AI.');
    } catch (err) {
      console.error(err);
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Không thể sinh email.')
          : 'Không thể sinh email.';
      toast.error(msg);
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleSavePassedToDb() {
    if (!selectedEmployeeId) {
      toast.error('Chọn nhân viên trước khi lưu.');
      return;
    }
    setSavingPassed(true);
    try {
      await learningPathService.setTestResults(Number(selectedEmployeeId), passedIds);
      toast.success(`Đã lưu ${passedIds.length} kết quả cho ${selectedEmployee?.fullName}.`);
    } catch (err) {
      console.error(err);
      toast.error('Không thể lưu kết quả test.');
    } finally {
      setSavingPassed(false);
    }
  }

  async function handleGraphMutate() {
    await reloadGraph();
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">route</span>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Lộ trình Học tập Thích ứng
              </h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                AI POWERED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              50 bài Onboarding · DAG · Tối ưu thời gian học cho từng nhân viên
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Legend />
          </div>
        </div>
        <div className="mt-3">
          <StatsBar preview={preview} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph */}
        <div className="relative flex-1 bg-slate-100 dark:bg-slate-900">
          {loadingGraph || !preview ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-sm text-slate-500">
                <span className="material-symbols-outlined block animate-spin text-[32px]">
                  progress_activity
                </span>
                Đang tải lộ trình…
              </div>
            </div>
          ) : (
            <LearningPathGraph nodes={nodes} edges={edges} preview={preview} />
          )}
          {loadingPreview && !loadingGraph ? (
            <div className="absolute right-4 bottom-4 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-800 dark:text-slate-200">
              Đang tính lại…
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="flex w-[420px] flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3 border-b border-slate-200 p-3 dark:border-slate-800">
            <EmployeeSelector
              employees={employees}
              selectedId={selectedEmployeeId}
              onSelect={(id) => {
                setSelectedEmployeeId(id);
                setEmail(null);
              }}
              disabled={loadingGraph}
            />
            <EmailPanel
              email={email}
              loading={loadingEmail}
              onGenerate={handleGenerate}
              disabled={!preview}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTab('passed')}
              className={`flex-1 px-3 py-2 text-xs font-medium ${
                tab === 'passed'
                  ? 'border-b-2 border-sky-500 text-sky-700 dark:text-sky-300'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Bài đã pass
            </button>
            <button
              onClick={() => setTab('editor')}
              className={`flex-1 px-3 py-2 text-xs font-medium ${
                tab === 'editor'
                  ? 'border-b-2 border-sky-500 text-sky-700 dark:text-sky-300'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Đổi data (BGK)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'passed' ? (
              <PassedSelector
                nodes={nodes}
                passedIds={passedIds}
                onChange={setPassedIds}
                onSavePassedToDb={selectedEmployeeId ? handleSavePassedToDb : undefined}
                saving={savingPassed}
              />
            ) : (
              <DataEditor nodes={nodes} edges={edges} onMutate={handleGraphMutate} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Legend() {
  const items: { label: string; color: string; icon: string }[] = [
    { label: 'Miễn', color: 'text-emerald-600', icon: 'check_circle' },
    { label: 'Học ngay', color: 'text-sky-600', icon: 'play_circle' },
    { label: 'Khóa', color: 'text-slate-500', icon: 'lock' },
  ];
  return (
    <div className="flex items-center gap-3 text-[11px]">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1">
          <span className={`material-symbols-outlined text-[14px] ${it.color}`}>{it.icon}</span>
          <span className="text-slate-600 dark:text-slate-400">{it.label}</span>
        </span>
      ))}
    </div>
  );
}
