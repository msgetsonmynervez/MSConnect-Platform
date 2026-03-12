import { useState, useCallback } from 'react'

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    // Clear after 3 seconds - enough time for cognitive processing
    setTimeout(() => setMessage(null), 3000)
  }, [])

  return { toast, message }
}
