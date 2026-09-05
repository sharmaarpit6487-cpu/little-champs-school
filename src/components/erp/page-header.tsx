import { ReactNode } from "react";

interface ERPPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function ERPPageHeader({ title, description, action }: ERPPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="page-heading">{title}</h1>
        <p className="page-subheading">{description}</p>
      </div>
      {action}
    </div>
  );
}
