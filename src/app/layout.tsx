import { publicIdentity } from '~/lib/public-identity';
import '~/app/globals.css';

import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist } from 'next/font/google';

import { Nav } from '~/components/nav';
import { AnalyticsProvider } from '~/components/posthog-provider';
import { Providers } from '~/components/providers';
import { RouteChrome } from '~/components/route-chrome';
import { SaaSMakerFeedback } from '~/components/saasmaker-feedback';
import { SiteFooter } from '~/components/site-footer';
import { VitalsReporter } from '~/components/VitalsReporter';

const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: {
    default: 'Live — Bucket Lists, Side Quests & Weekly Journal',
    template: '%s · Live',
  },
  description:
    'Find bucket-list ideas and side quests, keep your own list, log what you do, and write one private entry each week.',
  keywords: ['bucket list', 'experiences', 'side quests', 'weekly journal'],
  authors: [{ name: 'Live' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon.ico', sizes: 'any' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Live',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: 'Live',
    url: 'https://live.significanthobbies.com',
    title: 'Live — Bucket Lists, Side Quests & Weekly Journal',
    description:
      'Find bucket-list ideas and side quests, keep your own list, log what you do, and write one private entry each week.',
    images: [
      {
        url: 'https://live.significanthobbies.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Live',
      },
    ],
  },
  metadataBase: new URL('https://live.significanthobbies.com'),
  twitter: {
    card: 'summary_large_image',
    title: 'Live — Bucket Lists, Side Quests & Weekly Journal',
    description:
      'Find bucket-list ideas and side quests, keep your own list, log what you do, and write one private entry each week.',
    images: ['https://live.significanthobbies.com/opengraph-image'],
  },
};

export const viewport: Viewport = {
  themeColor: '#120e09',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <head>
        {/* Shared public identity: also used by the Astro landing. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(publicIdentity),
          }}
        />
        {/* Microsoft Clarity — session replay + heatmaps (additive; PostHog stays) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};var done=0,ev=["pointerdown","keydown","touchstart","scroll"],timer;function go(){if(done)return;done=1;clearTimeout(timer);ev.forEach(function(e){removeEventListener(e,go)});var t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;var y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)}ev.forEach(function(e){addEventListener(e,go,{passive:true,once:true})});timer=setTimeout(go,90000)})(window,document,"clarity","script","ybcglnzl4t");window.clarity("set","project_id","live");`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${fraunces.variable} min-h-screen bg-background text-foreground font-sans antialiased`}
      >
        <AnalyticsProvider>
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <RouteChrome
              navigation={<Nav />}
              footer={<SiteFooter />}
              feedback={<SaaSMakerFeedback />}
            >
              {children}
            </RouteChrome>
            <VitalsReporter />
          </Providers>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
