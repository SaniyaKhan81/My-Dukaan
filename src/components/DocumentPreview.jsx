import { useState, useEffect } from 'react'
import { X, Lock, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { API_BASE } from '../data/constants'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function DocumentPreview({ resource, onClose }) {
  const [preview, setPreview] = useState(null)
  const [pdfCanvas, setPdfCanvas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/resources/${resource._id}/preview`)
        const contentType = res.headers.get('content-type') || ''

        if (contentType.includes('application/pdf')) {
          const blob = await res.blob()
          const arrayBuffer = await blob.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          const page = await pdf.getPage(1)
          const viewport = page.getViewport({ scale: 1.2 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
          setPdfCanvas(canvas.toDataURL())
          setPreview({ type: 'pdf' })
        } else if (contentType.includes('image/')) {
          const blob = await res.blob()
          setPreview({ type: 'image', url: URL.createObjectURL(blob) })
        } else {
          const data = await res.json()
          setPreview(data)
        }
      } catch {
        setError('Could not load preview')
      } finally {
        setLoading(false)
      }
    }

    loadPreview()
  }, [resource._id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-indigo-50">
          <div>
            <h3 className="font-bold text-gray-900">{resource.title}</h3>
            <p className="text-sm text-indigo-600">Page 1 preview only</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-indigo-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && <p className="text-center text-gray-500 py-12">Loading preview...</p>}
          {error && <p className="text-center text-red-500 py-12">{error}</p>}

          {pdfCanvas && (
            <div className="relative">
              <img src={pdfCanvas} alt="Page 1 preview" className="w-full border rounded-lg shadow-sm" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-3">
                <span className="text-xs text-gray-500 bg-white/90 px-3 py-1 rounded-full border flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Remaining pages locked
                </span>
              </div>
            </div>
          )}

          {preview?.type === 'image' && (
            <div className="relative">
              <img src={preview.url} alt="Preview" className="w-full max-h-96 object-contain border rounded-lg blur-sm" />
              <p className="text-center text-sm text-gray-500 mt-2">Full quality available after purchase</p>
            </div>
          )}

          {(preview?.type === 'docx' || preview?.type === 'text') && (
            <div className="relative">
              <div className="bg-gray-50 border rounded-lg p-6 font-mono text-sm text-gray-700 whitespace-pre-wrap max-h-80 overflow-hidden">
                {preview.excerpt}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Lock className="h-4 w-4" />
                Showing first section only — {preview.totalLines ? `${preview.totalLines} lines total` : 'full document locked'}
              </p>
            </div>
          )}

          {preview?.type === 'unsupported' && (
            <p className="text-center text-gray-600 py-8">{preview.excerpt}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Close
          </button>
          <Link
            to={`/checkout/${resource._id}`}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            <ShoppingBag className="h-4 w-4" />
            Buy Full Document
          </Link>
        </div>
      </div>
    </div>
  )
}
