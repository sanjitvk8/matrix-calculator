# MatrixCalc+ 🧮

A beautiful, full-stack matrix calculator with advanced mathematical operations and intelligent access control.

## Features

### ✨ Core Functionality
- **Dynamic Matrix Input**: Animated grids that expand based on selected dimensions (1x1 to 6x6)
- **Dual Modes**: 
  - **Learn Mode**: Step-by-step symbolic solutions showing mathematical reasoning
  - **Calculation Mode**: Direct numerical results for quick computations
- **Smart Access Control**: Basic operations for everyone, advanced features for authenticated users

### 🔐 Authentication & Access
- **Public Operations**: Addition, subtraction, multiplication, transpose, determinant, inverse
- **Premium Operations** (Login Required): Eigenvalues, eigenvectors, LU/QR/SVD decomposition, matrix exponential, rank, null space
- **Supabase Auth**: Secure email/password authentication with JWT tokens
- **User Dashboard**: Calculation history and saved operations for logged-in users

### 🎨 Beautiful Design
- **Modern UI**: Clean interface using Tailwind CSS and ShadCN/UI components
- **Smooth Animations**: Framer Motion powered transitions for mode switching, matrix expansion, and result displays
- **Dark Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing

### 🚀 Technical Excellence
- **React + TypeScript**: Type-safe frontend with modern React patterns
- **FastAPI Backend**: High-performance Python API with NumPy, SciPy, and SymPy
- **Real-time Validation**: React Hook Form with Zod schemas
- **Error Handling**: Comprehensive error states with helpful user feedback

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Supabase account (for authentication)

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Add your Supabase project URL and anon key
3. Configure JWT secret for backend authentication

## Architecture

### Frontend (`/src`)
- **Components**: Reusable UI components with animations
- **Hooks**: Custom hooks for authentication and dark mode
- **Services**: API communication layer
- **Types**: TypeScript definitions for type safety

### Backend (`/backend`)
- **FastAPI**: Modern Python web framework
- **Matrix Engine**: NumPy/SciPy for numerical computations
- **Symbolic Math**: SymPy for step-by-step solutions
- **JWT Auth**: Supabase token validation

### Database (Supabase)
- **User Management**: Built-in authentication system
- **Calculation History**: Store user's previous calculations
- **Row Level Security**: Secure data access patterns

## Mathematical Operations

### Basic Operations (Public)
- Matrix addition and subtraction
- Matrix multiplication
- Transpose calculation
- Determinant computation
- Matrix inverse

### Advanced Operations (Premium)
- Eigenvalue and eigenvector analysis
- LU, QR, and SVD decompositions
- Matrix exponential
- Rank and null space calculations

## Development

### Code Organization
- **Modular Architecture**: Clean separation of concerns
- **Component Library**: Consistent UI components
- **Type Safety**: Full TypeScript coverage
- **Error Boundaries**: Robust error handling

### Performance
- **Optimized Animations**: Smooth 60fps animations
- **Lazy Loading**: Code splitting for faster loads
- **Caching**: Efficient data management
- **Responsive**: Optimized for all screen sizes

## Deployment

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account

### Environment Setup
1. Create new Supabase project
2. Generate new API keys
3. Configure environment variables
4. Set up database schema

### Build & Deploy
1. Frontend: `npm run build`
2. Backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
3. Configure reverse proxy (nginx recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using React, TypeScript, FastAPI, and Supabase.