import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Lock, CreditCard, CheckCircle, Wallet, Printer, ArrowLeft, Smartphone } from 'lucide-react'
import { formatPKR, API_BASE } from '../data/constants'
import { apiFetch } from '../utils/api'
import { validatePaymentDetails } from '../utils/validatePayment'

export default function Checkout() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('jazzcash')
  const [walletData, setWalletData] = useState({
    mobileNumber: '',
    accountName: '',
    walletPin: '',
    email: '',
  })
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })
  const [formErrors, setFormErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    apiFetch(`/api/resources/${resourceId}`)
      .then(setResource)
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false))
  }, [resourceId, navigate])

  const handleCardFormatting = (e) => {
    let { name, value } = e.target
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19)
    } else if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').slice(0, 5)
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4)
    }
    setCardData({ ...cardData, [name]: value })
  }

  const handleWalletChange = (e) => {
    let { name, value } = e.target
    if (name === 'mobileNumber') {
      value = value.replace(/\D/g, '').slice(0, 11)
    } else if (name === 'walletPin') {
      value = value.replace(/\D/g, '').slice(0, 6)
    }
    setWalletData({ ...walletData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors([])

    const paymentDetails = paymentMethod === 'card' ? cardData : walletData
    const validation = validatePaymentDetails(paymentMethod, paymentDetails)

    if (!validation.valid) {
      setFormErrors(validation.errors)
      return
    }

    setIsProcessing(true)

    try {
      const transaction = await apiFetch('/api/transactions/checkout', {
        method: 'POST',
        body: JSON.stringify({ resourceId, paymentMethod, paymentDetails }),
      })

      setReceipt({
        orderId: transaction.orderId,
        date: new Date(transaction.createdAt).toLocaleString('en-PK'),
        item: transaction.resource.title,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        paymentRef: transaction.paymentRef,
        resourceId: transaction.resource._id,
      })
    } catch (err) {
      setFormErrors([err.message])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/api/resources/${receipt.resourceId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      alert('Download failed')
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = receipt.item
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>
  }

  if (!resource) return null

  const sellerName = resource.seller?.name || resource.sellerName || 'Unknown'

  if (receipt) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary-600 to-purple-700 p-8 text-center text-white">
            <CheckCircle className="h-10 w-10 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="text-purple-100 opacity-80">Receipt generated — transaction saved to ledger</p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Official Receipt</span>
              <span className="text-primary-600 font-mono text-sm">{receipt.orderId}</span>
            </div>

            <div className="space-y-3 border-b border-dashed border-gray-200 pb-6 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Resource</span>
                <span className="font-medium text-right max-w-[55%]">{receipt.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span>{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="capitalize">{receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono text-xs">{receipt.paymentRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-semibold">COMPLETED</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold">Total Paid</span>
              <span className="text-2xl font-black text-primary-600">{formatPKR(receipt.amount)}</span>
            </div>

            <button onClick={handleDownload}
              className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold mb-3 hover:bg-indigo-700">
              Download Full Document
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
              <button onClick={() => navigate('/marketplace')}
                className="py-2 border rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
                Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
                  { id: 'easypaisa', label: 'EasyPaisa', icon: Wallet },
                  { id: 'card', label: 'Debit/Credit Card', icon: CreditCard },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => { setPaymentMethod(id); setFormErrors([]) }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className="h-6 w-6 mx-auto mb-1 text-primary-600" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {formErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {formErrors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Mobile Number *
                      </label>
                      <input type="tel" name="mobileNumber" required placeholder="03XXXXXXXXX"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={walletData.mobileNumber} onChange={handleWalletChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                      <input type="text" name="accountName" required placeholder="Name as on wallet"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={walletData.accountName} onChange={handleWalletChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wallet PIN *</label>
                      <input type="password" name="walletPin" required placeholder="4–6 digit PIN" maxLength={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={walletData.walletPin} onChange={handleWalletChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email for Receipt *</label>
                      <input type="email" name="email" required placeholder="you@email.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={walletData.email} onChange={handleWalletChange} />
                    </div>
                    <p className="text-xs text-gray-500">Simulated payment — validates format only, no real charge</p>
                  </>
                )}

                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                      <input type="text" name="cardholderName" required placeholder="As printed on card"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={cardData.cardholderName} onChange={handleCardFormatting} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                      <input type="text" name="cardNumber" required placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={cardData.cardNumber} onChange={handleCardFormatting} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry *</label>
                        <input type="text" name="expiryDate" required placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                          value={cardData.expiryDate} onChange={handleCardFormatting} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                        <input type="password" name="cvv" required placeholder="•••"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                          value={cardData.cvv} onChange={handleCardFormatting} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Card validated via Luhn algorithm & expiry check</p>
                  </>
                )}

                <button type="submit" disabled={isProcessing}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 disabled:opacity-70 flex items-center justify-center gap-3 mt-2">
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>Pay {formatPKR(resource.price)} Securely</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <p className="font-medium text-gray-900">{resource.title}</p>
                <p className="text-gray-500">{resource.university} &bull; {resource.courseCode}</p>
                <p className="text-gray-500">Seller: {sellerName}</p>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPKR(resource.price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
