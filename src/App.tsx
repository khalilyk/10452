import { useState } from 'react'
import { Header } from './components/Header.tsx'
import { OrderStatus } from './components/OrderStatus.tsx'
import { Hero } from './components/Hero.tsx'
import { BuyPanel } from './components/BuyPanel.tsx'
import { About } from './components/About.tsx'
import { ShippingBand } from './components/ShippingBand.tsx'
import { NextDrop } from './components/NextDrop.tsx'
import { GivingBack } from './components/GivingBack.tsx'
import { Contact } from './components/Contact.tsx'
import { Marquee } from './components/Marquee.tsx'
import { FooterMark } from './components/FooterMark.tsx'
import { Footer } from './components/Footer.tsx'
import { GiftModal } from './components/GiftModal.tsx'
import { ContentProvider, useContent } from './content/ContentContext.tsx'

export default function App() {
  return (
    <ContentProvider>
      <AppInner />
    </ContentProvider>
  )
}

function AppInner() {
  const [cartCount, setCartCount] = useState(0)
  const { drop, manifesto, productionLine } = useContent()

  // Between chapters there is no product, and saying so is better than an
  // empty shop.
  if (drop.status !== 'live') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[13px] tracking-widest">BETWEEN DROPS</p>
        <p className="max-w-sm text-[12px] leading-relaxed text-ink/60">
          {manifesto.line} {manifesto.sub}
        </p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header dropNumber={drop.number} cartCount={cartCount} />
      <OrderStatus />
      <Hero drop={drop} />
      <Marquee text={productionLine} invert />
      <BuyPanel drop={drop} onAdd={(qty) => setCartCount((c) => c + qty)} />
      <Marquee text={productionLine} invert />
      <About />
      <GivingBack />
      <NextDrop />
      <ShippingBand />
      <Contact />
      <FooterMark />
      <Footer />
      <GiftModal />
    </div>
  )
}
