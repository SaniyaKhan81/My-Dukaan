import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function Notification({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  const bgColor = type === 'success' 
    ? 'bg-green-50 border-green-200 text-green-800' 
    : 'bg-red-50 border-red-200 text-red-800'

  const Icon = type === 'success' ? CheckCircle : AlertCircle

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-md w-full ${bgColor} border rounded-lg shadow-lg p-4 animate-slide-in`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}





