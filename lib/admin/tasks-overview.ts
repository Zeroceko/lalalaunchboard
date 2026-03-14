import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

interface ParsedTask {
  id: string;
  title: string;
  completed: boolean;
}

interface ParsedSection {
  id: string;
  title: string;
  completed: boolean;
  tasks: ParsedTask[];
}

export interface TaskSectionOverview {
  id: string;
  title: string;
  completed: number;
  total: number;
  completionRate: number;
  level: string;
  openTasks: ParsedTask[];
}

export interface TaskOverview {
  completed: number;
  total: number;
  completionRate: number;
  openTasks: ParsedTask[];
  sections: TaskSectionOverview[];
}

function getLevelLabel(completionRate: number) {
  if (completionRate >= 100) {
    return "Tamamlandi";
  }

  if (completionRate >= 67) {
    return "Ileri seviye";
  }

  if (completionRate >= 34) {
    return "Orta seviye";
  }

  if (completionRate > 0) {
    return "Basladi";
  }

  return "Bekliyor";
}

function buildSectionOverview(section: ParsedSection): TaskSectionOverview {
  const sourceTasks =
    section.tasks.length > 0
      ? section.tasks
      : [
          {
            id: section.id,
            title: section.title,
            completed: section.completed
          }
        ];

  const completed = sourceTasks.filter((task) => task.completed).length;
  const total = sourceTasks.length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    id: section.id,
    title: section.title,
    completed,
    total,
    completionRate,
    level: getLevelLabel(completionRate),
    openTasks: sourceTasks.filter((task) => !task.completed)
  };
}

export async function getTaskOverview(): Promise<TaskOverview> {
  const tasksPath = path.join(process.cwd(), "specs", "tasks.md");
  const fileContent = await readFile(tasksPath, "utf8");
  const lines = fileContent.split("\n");
  const sections = new Map<string, ParsedSection>();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const taskMatch = line.match(/^- \[(x| )\]\*? (\d+\.\d+) (.+)$/);

    if (taskMatch) {
      const [, state, id, title] = taskMatch;
      const sectionId = id.split(".")[0];
      const section =
        sections.get(sectionId) ??
        {
          id: sectionId,
          title: `Bolum ${sectionId}`,
          completed: false,
          tasks: []
        };

      section.tasks.push({
        id,
        title,
        completed: state === "x"
      });
      sections.set(sectionId, section);
      continue;
    }

    const sectionMatch = line.match(/^- \[(x| )\]\*? (\d+)\. (.+)$/);

    if (!sectionMatch) {
      continue;
    }

    const [, state, id, title] = sectionMatch;
    const section =
      sections.get(id) ??
      {
        id,
        title,
        completed: state === "x",
        tasks: []
      };

    section.title = title;
    section.completed = state === "x";
    sections.set(id, section);
  }

  const sectionList = Array.from(sections.values())
    .sort((left, right) => Number(left.id) - Number(right.id))
    .map(buildSectionOverview);

  const openTasks = sectionList.flatMap((section) =>
    section.openTasks.map((task) => ({
      ...task,
      title: `${task.id} - ${task.title}`
    }))
  );

  const completed = sectionList.reduce((sum, section) => sum + section.completed, 0);
  const total = sectionList.reduce((sum, section) => sum + section.total, 0);

  return {
    completed,
    total,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    openTasks,
    sections: sectionList
  };
}
