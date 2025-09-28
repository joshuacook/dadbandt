import Link from 'next/link'
import { Instagram, Youtube, Music } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              dädbändt
            </Link>
          </div>
          <nav className="flex items-center space-x-8">
            <div className="flex space-x-4">
              <Link 
                href="https://www.instagram.com/joshua_fuego" 
                target="_blank"
                className="text-gray-700 hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCgr2bm27sjKVq8KqdbXmCbg" 
                target="_blank"
                className="text-gray-700 hover:text-gray-900"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </Link>
              <Link 
                href="https://distrokid.com/hyperfollow/joshuafuego/ceuta"
                target="_blank"
                className="text-gray-700 hover:text-gray-900"
                aria-label="Music"
              >
                <Music className="w-6 h-6" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
