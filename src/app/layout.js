import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AssurCRM - Gestion Assurance Santé',
  description: 'Système CRM spécialisé pour la gestion des assurances santé avec intégration Oggo Data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}