import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in">
      {children}
    </div>
  );
}
