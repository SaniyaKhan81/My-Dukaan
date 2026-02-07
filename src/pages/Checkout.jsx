import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { DollarSign, Lock, CreditCard, CheckCircle, Wallet, Printer, Download, ArrowLeft } from 'lucide-react'

// Mock data
const mockResources = {
  '1': { id: 1, title: 'Calculus I Solved Assignments', price: 15.99, category: 'Mathematics' },
  '2': { id: 2, title: 'Physics Lab Reports', price: 12.50, category: 'Physics' },
}

export default function Checkout() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const resource = mockResources[resourceId] || mockResources['1']
  
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)

  // Proper Input Formatting Logic
  const handleCardFormatting = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Formats: 1234 5678 1234 5678
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiryDate') {
      // Formats: MM/YY
      value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').slice(0, 5);
    } else if (name === 'cvv') {
      // Limits to 3 or 4 digits
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate API Call to a Payment Gateway
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Generate POS Receipt Data
    const transactionReceipt = {
      orderId: `MD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('en-PK'),
      item: resource.title,
      amount: resource.price,
      cardLast4: paymentData.cardNumber.slice(-4),
      transactionStatus: 'COMPLETED'
    }

    setReceipt(transactionReceipt)
    setIsProcessing(false)
  }

  // --- RECEIPT VIEW (Point of Sale Output) ---
  if (receipt) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-primary-600 to-purple-700 p-8 text-center text-white">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="text-purple-100 opacity-80">Thank you for your purchase!</p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Digital Receipt</span>
              <span className="text-primary-600 font-mono text-sm">{receipt.orderId}</span>
            </div>

            <div className="space-y-4 border-b border-dashed border-gray-200 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Resource</span>
                <span className="font-medium text-gray-900">{receipt.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">Card (**** {receipt.cardLast4})</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Total Paid</span>
              <span className="text-2xl font-black text-primary-600">${receipt.amount.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => window.print()} className="flex items-center justify-center space-x-2 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm">
                <Printer className="h-4 w-4" /> <span>Print</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm">
                <Download className="h-4 w-4" /> <span>Download</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition-all shadow-lg"
            >
              Continue to Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- PAYMENT FORM VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Card Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Full name as on card"
                    value={paymentData.cardholderName}
                    onChange={handleCardFormatting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      placeholder="0000 0000 0000 0000"
                      value={paymentData.cardNumber}
                      onChange={handleCardFormatting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={paymentData.expiryDate}
                      onChange={handleCardFormatting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      required
                      placeholder="•••"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={paymentData.cvv}
                      onChange={handleCardFormatting}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-3"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Pay ${resource.price.toFixed(2)} Securely</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{resource.title}</span>
                  <span className="font-medium">${resource.price.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${resource.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}