import type { AbsentProcess, Process } from "@anima/core";

/**
 * The four tellings of "приём сотрудника".
 *
 * Straight from scripts/ep01-nobody-has-seen-it.md. Note that Olga's is the
 * only one that is actually correct - she is audited, so her process is
 * written down and right. The episode's argument depends on her NOT being a
 * caricature.
 */

export const olga: Process = {
  id: "olga",
  speaker: "Ольга",
  color: "blue",
  audited: true,
  nodes: [
    { id: "start", kind: "start", label: "Выход сотрудника", cue: "olga_start" },
    { id: "prikaz", kind: "task", label: "Приказ о приёме", cue: "olga_prikaz" },
    { id: "podpis", kind: "task", label: "Подпись", cue: "olga_podpis" },
    { id: "kartochka", kind: "task", label: "Личная карточка", cue: "olga_kartochka" },
    { id: "knizhka", kind: "task", label: "Трудовая книжка", cue: "olga_knizhka" },
  ],
  edges: [
    { from: "start", to: "prikaz", cue: "olga_prikaz" },
    { from: "prikaz", to: "podpis", cue: "olga_podpis" },
    { from: "podpis", to: "kartochka", cue: "olga_kartochka" },
    { from: "kartochka", to: "knizhka", cue: "olga_knizhka" },
  ],
};

export const sergey: Process = {
  id: "sergey",
  speaker: "Сергей",
  color: "amber",
  audited: false,
  // Was "tb" while Act 2 used the free overlay - crossing axes were an attempt
  // to stop the tellings merging visually. Lanes solved that structurally, so
  // Sergey reads left-to-right like everyone else again.
  nodes: [
    // The request box exists in his telling but dims to near-invisible on
    // "if I know in advance" - nobody ever sends it.
    { id: "zayavka", kind: "task", label: "Заявка", cue: "sergey_zayavka" },
    { id: "account", kind: "task", label: "Учётная запись", cue: "sergey_account" },
    { id: "mail", kind: "task", label: "Почта", cue: "sergey_mail" },
    { id: "dostup", kind: "task", label: "Доступы", cue: "sergey_dostup" },
    { id: "noutbuk", kind: "task", label: "Ноутбук", cue: "sergey_noutbuk" },
  ],
  edges: [
    { from: "zayavka", to: "account", cue: "sergey_account" },
    { from: "account", to: "mail", cue: "sergey_mail" },
    { from: "mail", to: "dostup", cue: "sergey_dostup" },
    { from: "dostup", to: "noutbuk", cue: "sergey_noutbuk" },
    // "Nobody sends the request. I find out when he's standing at the desk."
    { from: "", to: "account", fromNowhere: true, cue: "sergey_nowhere" },
  ],
};

export const director: Process = {
  id: "director",
  speaker: "Директор",
  color: "green",
  audited: false,
  nodes: [
    { id: "novyi", kind: "start", label: "Новый сотрудник", cue: "dir_novyi" },
    { id: "hr", kind: "task", label: "HR всё оформляет", cue: "dir_hr" },
  ],
  edges: [{ from: "novyi", to: "hr", cue: "dir_hr" }],
};

/**
 * The manager. No diagram - he did not know there was a process to describe.
 * Modelled as AbsentProcess so nothing can accidentally be drawn here.
 */
export const manager: AbsentProcess = {
  id: "manager",
  speaker: "Руководитель",
  absent: true,
};

export const allTellings = [olga, sergey, director, manager];
