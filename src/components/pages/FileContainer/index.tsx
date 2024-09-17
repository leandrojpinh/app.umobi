import { ReactNode } from "react"

export const FileContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-dashed border-app-text border-[1px] relative rounded-md my-4 mx-0">
      {children}
    </div>
  )
}