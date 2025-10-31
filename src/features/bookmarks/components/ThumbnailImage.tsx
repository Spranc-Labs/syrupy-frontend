import { Link } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import type { BrowserTab } from '@/entities/browsing-session'

interface ThumbnailImageProps {
  item: BrowserTab
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const showFavicon = (!item.preview?.image || imageError) && item.preview?.favicon && !faviconError
  const showPlaceholder =
    !item.preview?.image || (imageError && (!item.preview?.favicon || faviconError))

  return (
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-base-300">
      {item.preview?.image && !imageError && (
        <img
          src={item.preview.image}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      {showFavicon && item.preview?.favicon && (
        <img
          src={item.preview.favicon}
          alt=""
          className="h-6 w-6"
          onError={() => setFaviconError(true)}
        />
      )}
      {showPlaceholder && <Link className="h-6 w-6 text-text-quaternary" />}
    </div>
  )
}
