import { useState } from 'react'
import { Header } from './components/Header.tsx'
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
import { liveDrop, MANIFESTO, PRODUCTION_LINE } from './data/drops.ts'

export default function App() {
  const [cartCount, setCartCount] = useState(0)
  const drop = liveDrop()

  // Between chapters there is no product, and saying so is better than an
  // empty shop.
  if (!drop) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[13px] tracking-widest">BETWEEN DROPS</p>
        <p className="max-w-sm text-[12px] leading-relaxed text-ink/60">
          {MANIFESTO.line} {MANIFESTO.sub}
        </p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header dropNumber={drop.number} cartCount={cartCount} />
      <Hero drop={drop} />
      <Marquee text={PRODUCTION_LINE} invert />
      <BuyPanel drop={drop} onAdd={(qty) => setCartCount((c) => c + qty)} />
      <Marquee text={PRODUCTION_LINE} invert />
      <About />
      <NextDrop />
      <GivingBack />
      <ShippingBand />
      <Contact />
      <FooterMark />
      <Footer />
    </div>
  )
}
