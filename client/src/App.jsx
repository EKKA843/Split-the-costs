import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import Mainpage from './pages/Mainpage'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Mainpage />
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}

export default App
