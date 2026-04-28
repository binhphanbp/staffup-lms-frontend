'use client';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useEffect, useMemo } from 'react';
import { LessonNode } from './LessonNode';
import type {
  CurriculumEdge,
  CurriculumNode,
  PreviewResult,
} from '@/services/learning-path.service';

const NODE_W = 200;
const NODE_H = 80;
const nodeTypes = { lesson: LessonNode };

function layout(
  nodes: CurriculumNode[],
  edges: CurriculumEdge[],
  preview: PreviewResult,
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', ranksep: 90, nodesep: 30, marginx: 20, marginy: 20 });

  for (const n of nodes) g.setNode(n.id, { width: NODE_W, height: NODE_H });
  for (const e of edges) g.setEdge(e.fromId, e.toId);
  dagre.layout(g);

  const flowNodes: Node[] = nodes.map((n) => {
    const pos = g.node(n.id);
    const classified = preview.classified[n.id];
    const data = classified ?? { ...n, status: 'available' as const, unmetPrereqs: [], layer: 0 };
    return {
      id: n.id,
      type: 'lesson',
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      data: data as unknown as Record<string, unknown>,
      draggable: false,
    };
  });

  const flowEdges: Edge[] = edges.map((e) => {
    const fromStatus = preview.classified[e.fromId]?.status;
    const toStatus = preview.classified[e.toId]?.status;
    const dimmed = fromStatus === 'exempt' && toStatus !== 'locked';
    return {
      id: `${e.fromId}-${e.toId}`,
      source: e.fromId,
      target: e.toId,
      animated: toStatus === 'available',
      style: {
        stroke: dimmed ? '#cbd5e1' : toStatus === 'locked' ? '#94a3b8' : '#0ea5e9',
        strokeWidth: 1.5,
        opacity: dimmed ? 0.4 : 1,
      },
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
}

interface Props {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
  preview: PreviewResult;
}

function GraphInner({ nodes, edges, preview }: Props) {
  const { fitView } = useReactFlow();
  const laidOut = useMemo(() => layout(nodes, edges, preview), [nodes, edges, preview]);

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15 }), 50);
    return () => clearTimeout(t);
  }, [laidOut, fitView]);

  return (
    <ReactFlow
      nodes={laidOut.nodes}
      edges={laidOut.edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
      maxZoom={1.5}
    >
      <Background gap={20} />
      <Controls position="bottom-right" />
      <MiniMap
        nodeColor={(n) => {
          const d = n.data as { status?: string };
          if (d.status === 'exempt') return '#10b981';
          if (d.status === 'available') return '#0ea5e9';
          return '#94a3b8';
        }}
        nodeStrokeWidth={2}
        position="top-right"
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

export function LearningPathGraph(props: Props) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}
