import type { Process } from "@anima/core";

/**
 * Act 4: the one process the four of them draw together on the wall.
 *
 * Deliberately NOT BPMN - plain boxes and arrows, because that is honestly what
 * a first workshop produces. Episode 1 teaches no notation.
 *
 * The box that matters is `komu_it`: it was in nobody's telling. It appears
 * when someone asks "а кто говорит айтишникам?", which is the line the whole
 * episode is built to earn.
 */
export const resolved: Process = {
  id: "resolved",
  speaker: "Вместе",
  color: "neutral",
  audited: false,
  nodes: [
    { id: "vykhod", kind: "start", label: "Решение о найме", cue: "r1" },
    { id: "prikaz", kind: "task", label: "Приказ и документы", cue: "r2" },
    { id: "komu_it", kind: "task", label: "Кто сообщает ИТ", cue: "r_missing" },
    { id: "dostupy", kind: "task", label: "Доступы и техника", cue: "r3" },
    { id: "vstrecha", kind: "task", label: "Встреча в первый день", cue: "r4" },
    { id: "gotov", kind: "end", label: "Человек работает", cue: "r5" },
  ],
  edges: [
    { from: "vykhod", to: "prikaz", cue: "r2" },
    // This edge is the half-drawn arrow that hangs, then completes.
    { from: "prikaz", to: "komu_it", cue: "r_missing" },
    { from: "komu_it", to: "dostupy", cue: "r3" },
    { from: "dostupy", to: "vstrecha", cue: "r4" },
    { from: "vstrecha", to: "gotov", cue: "r5" },
  ],
};
