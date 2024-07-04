import { useState } from "react"

interface OpenStateProps {
  defaultOpen?: boolean
}

export const useOpenState = (props?: OpenStateProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(props?.defaultOpen || false)

  const toggleOpen = () => {
    return setIsOpen((prev) => !prev)
  }

  const open = () => {
    return setIsOpen(true)
  }

  const close = () => {
    return setIsOpen(false)
  }

  return { isOpen, setIsOpen, toggleOpen, open, close }
}
