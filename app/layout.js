import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import GeminiChatbot from './components/geminiChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LearnHub - AI-Powered Learning Platform',
  description: 'Create personalized courses, track your progress, and enhance your learning with AI-powered tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
        <GeminiChatbot/>
      </body>
    </html>
  )
}