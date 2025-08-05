# GearBricks E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A modern, full-stack e-commerce platform built with Next.js 15, specializing in LEGO-compatible building blocks and mystery box (blindbox) products. Features multilingual support, secure authentication, integrated payment processing, and an innovative spinning wheel gambling system.

## 🚀 Features

### Core E-Commerce

- **Product Management**: Complete CRUD operations for products with categories, images, and inventory tracking
- **Shopping Cart**: Persistent cart with local storage and database synchronization
- **Order Processing**: Full order lifecycle management with multiple payment methods
- **User Authentication**: Secure login/register with NextAuth.js (credentials + Google OAuth)
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and blindboxes

### Unique Features

- **Mystery Box System**: Interactive blindbox products with probability-based rewards
- **Spinning Wheel**: Engaging gambling-style interface for blindbox opening
- **Prize Distribution**: Algorithmic prize selection based on configurable probabilities
- **Reward Management**: Automatic cart addition of won items with special pricing

### Technical Features

- **Internationalization**: Multi-language support (English/Vietnamese) with next-intl
- **Payment Integration**: VNPay payment gateway for Vietnamese market
- **Image Management**: Cloudinary integration for optimized image handling
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict typing

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Context API
- **Internationalization**: next-intl

### Backend

- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **File Upload**: Cloudinary
- **Payment**: VNPay Gateway

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js with Turbopack
- **Font Optimization**: Geist Sans & Mono

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   ├── admin/               # Admin dashboard
│   └── api/                 # API routes
├── components/              # Reusable UI components
│   ├── blindbox/           # Mystery box components
│   ├── cart/               # Shopping cart components
│   ├── layout/             # Layout components
│   ├── product/            # Product components
│   └── ui/                 # Base UI components
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config
├── lib/                    # Utility functions
├── models/                 # MongoDB schemas
├── services/               # Business logic services
└── types/                  # TypeScript type definitions
```

## 🏗 Architecture

### Database Schema

- **Users**: Authentication, profile, admin status, spin counts
- **Products**: Catalog items with categories, images, pricing
- **Blindboxes**: Mystery boxes with product pools and probabilities
- **Orders**: Purchase records with payment and shipping info
- **Cart**: Persistent shopping cart per user
- **SpinRecords**: Blindbox opening history and results

### Key Features Implementation

#### Mystery Box System

- Probability-based prize selection algorithm
- Real-time spinning wheel animation
- Automatic prize delivery to cart
- Spin count management and tracking

#### Internationalization

- Route-based locale detection (`/en/*`, `/vi/*`)
- Server-side message loading
- Locale-aware navigation and redirects
- Admin panel excluded from i18n

#### Payment Processing

- VNPay integration for Vietnamese market
- COD (Cash on Delivery) support
- Order status tracking
- Secure transaction handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account
- VNPay merchant account (for payments)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gearbricks

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPay (optional)
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay-return

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/gearbricks-ecom.git
   cd gearbricks-ecom
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start MongoDB**

   ```bash
   # Using MongoDB locally
   mongod

   # Or use MongoDB Atlas cloud connection
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📖 Usage

### User Flow

1. **Browse Products**: Explore the catalog with category filtering
2. **Add to Cart**: Select items and quantities
3. **Blindbox Experience**: Purchase mystery boxes and spin for prizes
4. **Checkout**: Secure payment with VNPay or COD
5. **Order Tracking**: Monitor order status and history

### Admin Flow

1. **Access Admin Panel**: Navigate to `/admin` (requires admin privileges)
2. **Manage Products**: Create, edit, delete products and categories
3. **Blindbox Management**: Configure mystery boxes with product pools and probabilities
4. **Order Management**: Process and track customer orders
5. **User Management**: Monitor user activity and spin counts

### Blindbox System

1. **Purchase**: Buy blindbox or earn spins through promotions
2. **Spin**: Use interactive spinning wheel interface
3. **Win**: Receive randomized prizes based on configured probabilities
4. **Collect**: Prizes automatically added to cart at no additional cost

## 🔧 Configuration

### Internationalization

- Modify `src/i18n/routing.ts` to add/remove supported locales
- Update message files in `messages/` directory
- Configure middleware for route handling

### Payment Methods

- VNPay: Configure merchant settings in VNPay dashboard
- COD: Enabled by default, can be configured per region

### Blindbox Probabilities

- Configure through admin panel
- Must total 100% for each blindbox
- Supports fine-tuned probability distributions

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Docker

```bash
# Build Docker image
docker build -t gearbricks-ecom .

# Run container
docker run -p 3000:3000 gearbricks-ecom
```

### Traditional VPS

1. Set up Node.js environment
2. Configure reverse proxy (Nginx)
3. Set up SSL certificates
4. Configure environment variables
5. Run with PM2 or similar process manager

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the fantastic React framework
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [MongoDB](https://www.mongodb.com/) for flexible data storage
- [Cloudinary](https://cloudinary.com/) for image optimization
- [VNPay](https://vnpay.vn/) for payment processing

## 📞 Support

For support, email support@gearbricks.com or join our Discord community.

---

**Built with ❤️ for the LEGO building community**
