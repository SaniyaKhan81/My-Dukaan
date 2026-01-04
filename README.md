# My Dukaan - Student Resource Marketplace

A student-friendly marketplace where students can upload and sell their resources (solved assignments, worksheets, etc.) or create storefronts for their small businesses.

## Features

- 🛒 **Marketplace**: Browse and purchase student resources
- 📤 **Resource Upload**: Easy upload system for assignments, worksheets, and study materials
- 🏪 **Storefronts**: Create your own storefront to showcase all your resources
- 💳 **Payment System**: Secure online payment integration (ready for Stripe/PayPal)
- 🎨 **Modern UI**: Built with React and Tailwind CSS

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable components
│   └── Navbar.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Marketplace.jsx
│   ├── UploadResource.jsx
│   ├── MyStorefront.jsx
│   ├── Storefront.jsx
│   └── Checkout.jsx
├── App.jsx          # Main app component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Next Steps

1. **Backend Integration**: Connect to a backend API (Node.js, Python, etc.)
2. **Authentication**: Implement real user authentication (Firebase, Auth0, or custom)
3. **File Storage**: Set up file upload to cloud storage (AWS S3, Cloudinary, etc.)
4. **Payment Gateway**: Integrate Stripe or PayPal for real payments
5. **Database**: Set up database for users, resources, and transactions
6. **Search & Filters**: Enhance search functionality with filters and sorting

## Payment Integration

The checkout page is set up but uses mock data. To integrate real payments:

1. **Stripe**: Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
2. **PayPal**: Install `@paypal/react-paypal-js`
3. Update the `Checkout.jsx` component with actual payment processing

## License

MIT

