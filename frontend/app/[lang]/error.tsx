'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-ms-black">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-ms-black text-ms-white hover:bg-ms-stone transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
