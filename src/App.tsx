import { useState, useEffect } from 'react'
import { DemoPage } from '@/components/DemoPage'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <DemoPage 
      darkMode={darkMode} 
      onToggleDarkMode={toggleDarkMode} 
    />
  )
}

export default App
