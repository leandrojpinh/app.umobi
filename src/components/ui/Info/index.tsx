import { ReactNode } from "react";

interface InfoProps {
  label: string;
  text: string;
}

export const InfoGroup = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:flex-1 w-full">
      {children}
    </div>
  )
};

export const Info = ({ label, text }: InfoProps) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <strong className="text-sm text-app-text2 mb-1 font-normal tracking-widest">{label}</strong>
      <span className="font-app-text">{text}</span>
    </div>
  )
}