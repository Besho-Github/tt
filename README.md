# Egyptian Finance App

A production-grade, responsive financial web application for the Egyptian market built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🏠 Home Page
- Search functionality for all financial instruments
- Main Gold 21K price card with interactive chart
- Navigation tiles for quick access to different sections
- Real-time price updates with percentage changes

### 📊 Financial Data
- **Gold Prices**: 21K, 24K, 18K, and Ounce tracking with EGP/USD toggle
- **Silver Prices**: Per gram and per ounce with historical charts
- **Egyptian Stocks**: EGX symbols (COMI, FWRY, SWDY, EGTS, ABUK) with volume data
- **Currency Exchange**: USD, EUR, GBP, SAR rates against EGP

### 💱 Currency Converter
- Real-time conversion between multiple currencies
- Swap functionality with visual feedback
- Popular conversion shortcuts
- Exchange rate history and last updated timestamps

### 📈 Interactive Charts
- Sparklines for quick price trend visualization
- Full-featured area and line charts with Recharts
- Multiple timeframes: 1D, 1W, 1M, 1Y
- Responsive design with touch-friendly interactions

### 📱 Responsive Design
- Mobile-first approach with bottom navigation
- Desktop layout with left sidebar
- 12-column grid system for larger screens
- Dark theme optimized for financial data

### 🌐 Internationalization
- RTL (Right-to-Left) support for Arabic
- Arabic-friendly typography and spacing
- Currency formatting for Egyptian market
- Bilingual interface ready (English/Arabic)

### 💼 Portfolio Management
- Subscription-based portfolio tracking
- Watchlist functionality
- Price alerts and notifications
- Performance analytics (Premium feature)

### 📰 Financial News
- Latest financial news with category filtering
- EGX, Currencies, Gold/Silver, and General news
- Time-based sorting and external source links
- Clean, readable article layout

### ⚙️ Settings & Personalization
- User profile management with avatar support
- Theme selection (Dark/Light)
- Default currency preference (EGP/USD)
- Language and RTL toggle
- Local storage persistence

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Data Fetching**: TanStack Query for caching and state management
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for data fetching
│   ├── gold/              # Gold prices page
│   ├── silver/            # Silver prices page
│   ├── stocks/            # Egyptian stocks page
│   ├── currencies/        # Exchange rates page
│   ├── convert/           # Currency converter
│   ├── portfolio/         # Portfolio management
│   ├── news/              # Financial news
│   ├── settings/          # User settings
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── ui/                # Reusable UI components
│   ├── charts/            # Chart components
│   ├── layout/            # Layout components
│   └── providers/         # React providers
├── lib/
│   ├── data-adapters.ts   # Data layer abstraction
│   ├── mock-data.ts       # Mock data generators
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd egyptian-finance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```
   USE_MOCK=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Data Sources

### Mock Data (Default)
The app includes comprehensive mock data generators for:
- Gold prices with realistic fluctuations
- Silver market data
- Egyptian stock exchange (EGX) data
- Currency exchange rates
- Financial news articles

### Real Data Integration
The architecture supports easy integration with real APIs:
- Exchange rates via exchangerate.host API
- Extensible adapter pattern for other data sources
- Environment flag switching between mock and real data

## API Endpoints

- `GET /api/gold?base=EGP&range=1D` - Gold prices
- `GET /api/silver?base=EGP&range=1D` - Silver prices
- `GET /api/stocks/summary` - Stock market summary
- `GET /api/stocks/history?symbol=COMI&range=1D` - Individual stock history
- `GET /api/rates?base=EGP` - Exchange rates
- `GET /api/convert?amount=1000&from=EGP&to=USD` - Currency conversion
- `GET /api/news` - Financial news articles

## Design System

### Colors
- **Gold**: `#fbbf24` for gold-related content
- **Success**: `#10b981` for positive changes
- **Danger**: `#ef4444` for negative changes
- **Primary**: Dynamic based on theme
- **Muted**: Subtle backgrounds and secondary text

### Typography
- **Headlines**: Large, bold numbers for prices
- **Body**: Clean, readable text with proper contrast
- **Arabic Support**: RTL-friendly font stacks

### Components
- **Cards**: Rounded corners (rounded-2xl) with subtle shadows
- **Charts**: Interactive with tooltips and responsive design
- **Navigation**: Bottom bar (mobile) / sidebar (desktop)
- **Forms**: Consistent input styling with focus states

## Mobile Optimization

- Touch-friendly interface with appropriate tap targets
- Optimized chart interactions for mobile devices
- Bottom navigation for easy thumb access
- Responsive grid layouts that adapt to screen size
- Performance optimized with lazy loading and caching

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators
- Alternative text for visual elements

## Performance

- **Next.js 14** with App Router for optimal performance
- **TanStack Query** for intelligent data caching
- **Lazy loading** for charts and heavy components
- **Optimized images** and assets
- **Bundle splitting** for faster initial loads

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern financial applications
- Egyptian market data structure based on EGX standards
- Currency formatting following Egyptian conventions
- RTL support for Arabic-speaking users

