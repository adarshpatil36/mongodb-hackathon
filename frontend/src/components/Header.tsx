import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from './Icons'
import Button from './Button'

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Register Patient', href: '/register-patient' },
    { name: 'Chat', href: '/chat' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'Book Appointment', href: '/book' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-white">
            Tether
          </Link>
          
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/login">
              <Button type="button" variant="default" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-slideDown">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm transition-colors py-2 ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button type="button" variant="ghost" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button type="button" variant="default" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
