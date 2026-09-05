/**
 * Canonical class levels for Little Champs School (Nursery to Class 8).
 * Maps display labels to database grade numbers used in the Class model.
 */
export const SCHOOL_CLASS_LEVELS = [
  { label: "Nursery", grade: 0, section: "A" },
  { label: "Jr. KG", grade: -1, section: "A" },
  { label: "Sr. KG", grade: -2, section: "A" },
  { label: "Class 1", grade: 1, section: "A" },
  { label: "Class 2", grade: 2, section: "A" },
  { label: "Class 3", grade: 3, section: "A" },
  { label: "Class 4", grade: 4, section: "A" },
  { label: "Class 5", grade: 5, section: "A" },
  { label: "Class 6", grade: 6, section: "A" },
  { label: "Class 7", grade: 7, section: "A" },
  { label: "Class 8", grade: 8, section: "A" },
] as const;

export type SchoolClassLabel = (typeof SCHOOL_CLASS_LEVELS)[number]["label"];

export function classDisplayName(name: string, section?: string | null) {
  if (section) return `${name} - Section ${section}`;
  return name;
}
