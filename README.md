# My Dukaan

**The e-commerce website for students**

## Problem Statement

Students face numerous challenges in their academic journey that require comprehensive solutions:

- **Assignment Solutions**: Students often struggle with complex assignments and need step-by-step solutions to understand concepts and complete their work on time
- **Study Materials**: Access to quality study materials, solved worksheets, lab manuals, and course-specific resources is limited and scattered
- **University-Specific Content**: Finding resources tailored to their specific university's curriculum, course structure, and requirements is difficult
- **Tutoring Services**: Students need on-demand tutoring help for specific topics, assignments, or exam preparation, but finding reliable tutors within their academic domain is challenging
- **Resource Sharing**: Students who excel in certain subjects have no easy way to monetize their knowledge and help fellow students while earning

Traditional platforms like Fiverr offer tutoring and assignment-solving services, but they lack the academic focus and university-specific context that students need. Meanwhile, general e-commerce platforms don't cater to the unique needs of the student community.

## Solution

**My Dukaan** is a specialized platform that combines the best of Fiverr's service marketplace model with traditional e-commerce, specifically designed for the student community and their academic needs.

### What Makes Us Different

- **Academic Focus**: Unlike generic platforms, My Dukaan is built specifically for students, with resources and services tailored to university curricula
- **University-Specific Marketplace**: Resources and services are organized by university, ensuring students find exactly what they need for their specific courses and requirements
- **Dual Marketplace Model**:
  - **E-Commerce**: Students can buy and sell pre-made resources like solved assignments, step-by-step solutions, lab manuals, study guides, and course materials
  - **Service Marketplace**: Students can hire tutors for personalized sessions, get assignments solved on-demand, or book consultation hours with subject matter experts
- **Student-to-Student Economy**: Creates a peer-to-peer learning economy where students can both learn from and teach each other, all within their academic domain
- **Comprehensive Academic Support**: One platform for all academic needs - from buying study materials to hiring tutors to selling your own resources

Think of it as **Fiverr meets Amazon, but exclusively for students** - where you can both purchase ready-made academic resources and hire services like tutoring or assignment help, all curated for your university and academic level.

## Features

- 🛒 **Marketplace**: Browse and purchase student resources (assignments, worksheets, lab manuals, study guides)
- 📤 **Resource Upload**: Easy upload system for assignments, worksheets, and study materials
- 🏪 **Storefronts**: Create your own storefront to showcase all your resources
- 👨‍🏫 **Tutoring Services**: Hire tutors for personalized sessions or get on-demand assignment help
- 💳 **Payment System**: Secure online payment integration (ready for Stripe/PayPal)
- 🎯 **University-Specific**: Resources and services organized by university and course
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
7. **Tutoring Booking System**: Implement calendar and booking system for tutoring services
8. **University-Specific Filtering**: Add university and course-based filtering

## Payment Integration

The checkout page is set up but uses mock data. To integrate real payments:

1. **Stripe**: Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
2. **PayPal**: Install `@paypal/react-paypal-js`
3. Update the `Checkout.jsx` component with actual payment processing

## License

MIT
