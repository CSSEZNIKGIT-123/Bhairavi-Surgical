import './globals.css';
import { Poppins } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { QuoteProvider } from '@/context/QuoteContext';
import CartDrawer from '@/components/cart/CartDrawer';
import QuoteBuilderDrawer from '@/components/quote/QuoteBuilderDrawer';
import GlobalFloatingActions from '@/components/ui/GlobalFloatingActions';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Yugan Ayurved & Panchkarma Products — Multi-Mode Commerce Platform (B2B, B2C & SPECIAL)',
  description:
    'Authentic classical Ayurvedic formulations, pure medicated oils, wildcrafted churnas, and bespoke Panchkarma therapy equipment. Rooted in tradition, crafted for modern wellness.',
  keywords: 'Ayurveda, Panchkarma products, classical medicated oils, Shirodhara vessels, Kansa massage wand, Mahanarayan taila, Ksheerabala 101, herbal churnas, B2B Ayurvedic wholesale',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-[#FAF8F5] text-charcoal min-h-screen flex flex-col font-poppins antialiased">
        <AuthProvider>
          <CartProvider>
            <QuoteProvider>
              {children}
              <CartDrawer />
              <QuoteBuilderDrawer />
              <GlobalFloatingActions />
            </QuoteProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
