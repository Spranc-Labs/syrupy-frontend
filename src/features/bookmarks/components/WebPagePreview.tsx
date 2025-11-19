import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Info, Loader } from 'react-feather'
import type { CreateHighlightInput, Highlight } from '@/entities/highlight'
import { useCreateHighlight, useDeleteHighlight, useHighlights } from '@/entities/highlight'
import { tokenStorage } from '@/shared/api'
import { PreviewErrorState } from './PreviewErrorState'

// Helper: Detect if highlight is a standalone note (should NOT be rendered on page)
// A standalone note has no text selection context (empty/null prefix AND suffix)
// Note: start_offset and end_offset are intentionally null for all highlights (legacy fields)
function isStandaloneNote(highlight: Highlight): boolean {
  // Check if prefix_text is truly empty (null, undefined, or empty string after trim)
  const hasNoPrefix =
    highlight.prefix_text === null ||
    highlight.prefix_text === undefined ||
    highlight.prefix_text.trim() === ''

  // Check if suffix_text is truly empty (null, undefined, or empty string after trim)
  const hasNoSuffix =
    highlight.suffix_text === null ||
    highlight.suffix_text === undefined ||
    highlight.suffix_text.trim() === ''

  // Only treat as standalone note if BOTH prefix and suffix are empty
  // AND the highlight has actual text content
  return hasNoPrefix && hasNoSuffix && highlight.exact_text.length > 0
}

interface WebPagePreviewProps {
  url: string
  bookmarkId?: number
  highlightIdToScrollTo?: number | null
}

type CheckStatus = 'checking' | 'embeddable' | 'blocked' | 'error'

export function WebPagePreview({ url, bookmarkId, highlightIdToScrollTo }: WebPagePreviewProps) {
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('checking')
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutIdRef = useRef<number | null>(null)

  // Fetch highlights for this bookmark
  const { data: highlights = [] } = useHighlights(bookmarkId)
  const createHighlight = useCreateHighlight()
  const deleteHighlight = useDeleteHighlight()

  // Filter out standalone notes - only send text highlights to iframe
  const pageHighlights = useMemo(() => {
    const filtered = highlights.filter((h) => !isStandaloneNote(h))
    console.log('[WebPagePreview] pageHighlights updated:', {
      total: highlights.length,
      filtered: filtered.length,
      highlights: filtered.map((h) => ({ id: h.id, text: h.exact_text.substring(0, 30) })),
    })
    return filtered
  }, [highlights])

  // Scroll to highlight when highlightIdToScrollTo changes
  useEffect(() => {
    if (highlightIdToScrollTo && checkStatus === 'embeddable' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'scroll_to_highlight',
          highlightId: highlightIdToScrollTo.toString(),
        },
        '*'
      )
    }
  }, [highlightIdToScrollTo, checkStatus])

  // Always use proxy - it bypasses embedding restrictions
  // Set up timeout once per URL change to detect loading failures
  useEffect(() => {
    setCheckStatus('embeddable')
    setIsIframeLoading(true)

    // Clear any existing timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    // Set timeout safety net - if iframe doesn't signal ready within 5 seconds, show error
    // This catches cases where CSP blocks our script or page fails to initialize
    timeoutIdRef.current = setTimeout(() => {
      console.warn('[WebPagePreview] Iframe loading timeout - showing error state')
      setCheckStatus('error')
      setIsIframeLoading(false)
    }, 5000) as unknown as number

    // Cleanup timeout on unmount or URL change
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
    }
  }, [url])

  // Handle messages from iframe
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Verify origin (in production, check against allowed origins)
      if (!event.data || typeof event.data.type !== 'string') return

      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] [WebPagePreview] Received message:`, event.data.type, event.data)

      if (event.data.type === 'iframe_ready') {
        console.log(
          '[WebPagePreview] iframe_ready - Sending',
          pageHighlights.length,
          'highlights to iframe'
        )

        // Clear timeout since iframe loaded successfully
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current)
          timeoutIdRef.current = null
        }

        setIsIframeLoading(false) // Iframe has loaded successfully

        // Check for page loading failures after a short delay
        // This catches: blank pages, broken SPAs, CSS failures, CORS failures
        setTimeout(() => {
          try {
            const iframeDoc = iframeRef.current?.contentDocument
            if (!iframeDoc || !iframeDoc.body) return

            const body = iframeDoc.body
            const bodyStyle = window.getComputedStyle(body)

            // Check 1: Is body completely hidden?
            const isBodyHidden = bodyStyle.display === 'none' || bodyStyle.visibility === 'hidden'

            // Check 2: Is body height zero (blank page)?
            const isBodyBlank = body.offsetHeight === 0 && body.scrollHeight === 0

            // Check 3: Is body very small (likely failed to render)?
            const isTooSmall = body.offsetHeight < 50 && body.scrollHeight < 50

            // Check 4: Check if there's any visible content
            // Modern SPAs that fail to hydrate often have hidden content
            let hasVisibleContent = false
            const allElements = body.querySelectorAll('*')
            for (const el of Array.from(allElements).slice(0, 100)) {
              // Check first 100 elements
              const style = window.getComputedStyle(el as HTMLElement)
              if (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0' &&
                (el as HTMLElement).offsetHeight > 0
              ) {
                hasVisibleContent = true
                break
              }
            }

            // Diagnostic logging
            console.log('[WebPagePreview] Page health check:', {
              bodyHidden: isBodyHidden,
              bodyBlank: isBodyBlank,
              bodyHeight: body.offsetHeight,
              bodyScrollHeight: body.scrollHeight,
              isTooSmall: isTooSmall,
              hasVisibleContent: hasVisibleContent,
              childrenCount: body.children.length,
            })

            // Trigger error if any failure condition is met
            if (isBodyHidden || isBodyBlank || isTooSmall || !hasVisibleContent) {
              console.warn('[WebPagePreview] Page failed to render - showing error UI')
              setCheckStatus('error')
              setIsIframeLoading(false)
            }
          } catch (error) {
            // If we can't access contentDocument, likely cross-origin restriction
            console.error('[WebPagePreview] Error checking page:', error)
          }
        }, 2000) // Wait 2 seconds for page to render and hydrate

        // Send highlights to iframe when it's ready (only text highlights, not standalone notes)
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'load_highlights',
              highlights: pageHighlights,
            },
            '*'
          )
        }
      } else if (event.data.type === 'new_highlight' && bookmarkId) {
        console.log('[WebPagePreview] new_highlight - Creating highlight:', event.data.highlight)
        // Save new highlight
        const highlightData = event.data.highlight as CreateHighlightInput
        createHighlight.mutate(
          {
            ...highlightData,
            bookmark_id: bookmarkId,
            color: 'yellow', // Default color
          },
          {
            onSuccess: (savedHighlight) => {
              console.log(
                '[WebPagePreview] Highlight saved successfully, sending render_highlight:',
                savedHighlight.id,
                savedHighlight.exact_text.substring(0, 50)
              )
              // Send saved highlight back to iframe for immediate rendering
              // Mark as justCreated to prevent immediate delete clicks
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  {
                    type: 'render_highlight',
                    highlight: {
                      ...savedHighlight,
                      justCreated: true,
                    },
                  },
                  '*'
                )
              }
            },
          }
        )
      } else if (event.data.type === 'delete_highlight') {
        console.log(
          '[WebPagePreview] delete_highlight - Deleting highlight:',
          event.data.highlightId
        )
        // Delete highlight
        const highlightId = event.data.highlightId as number
        deleteHighlight.mutate(highlightId, {
          onError: () => {
            // On error, reload highlights to restore the deleted one (only text highlights)
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'load_highlights',
                  highlights: pageHighlights,
                },
                '*'
              )
            }
          },
        })
      } else if (event.data.type === 'highlight_error') {
        // Handle highlight errors (duplicate, overlap, etc.)
        const errorMessage = event.data.error as string
        console.warn('[WebPagePreview] Highlight error:', errorMessage)
        // TODO: Show toast notification to user
        // toast.error(errorMessage)
      } else if (event.data.type === 'proxy_error') {
        // Handle proxy errors (network failures, HTTP errors, etc.)
        console.error('[WebPagePreview] Proxy error:', event.data)
        setCheckStatus('error')
        setIsIframeLoading(false)
      }
    },
    [pageHighlights, bookmarkId, createHighlight, deleteHighlight]
  )

  // Listen for messages from iframe
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // Send highlights to iframe on load and when they change (bidirectional sync)
  // Only send text highlights, not standalone notes
  useEffect(() => {
    if (checkStatus === 'embeddable' && iframeRef.current?.contentWindow) {
      console.log(
        '[WebPagePreview] pageHighlights changed, sending load_highlights:',
        pageHighlights.length,
        'highlights'
      )
      console.log(
        '[WebPagePreview] Highlight IDs being sent:',
        pageHighlights.map((h) => h.id)
      )
      // Send highlights to iframe - it will clear and re-render
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'load_highlights',
          highlights: pageHighlights,
        },
        '*'
      )
    }
  }, [pageHighlights, checkStatus])

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleIframeError = () => {
    setCheckStatus('error')
    setIsIframeLoading(false)
  }

  const handleIframeLoad = () => {
    console.log('[WebPagePreview] iframe onLoad fired')

    // Check if page actually rendered after a short delay
    setTimeout(() => {
      try {
        const iframeDoc = iframeRef.current?.contentDocument
        if (!iframeDoc || !iframeDoc.body) {
          console.warn('[WebPagePreview] Cannot access iframe content - showing error UI')
          setCheckStatus('error')
          setIsIframeLoading(false)
          return
        }

        const body = iframeDoc.body
        const bodyStyle = window.getComputedStyle(body)

        // Check if page is visible
        const isBodyHidden =
          bodyStyle.display === 'none' ||
          bodyStyle.visibility === 'hidden' ||
          bodyStyle.opacity === '0'
        const isBodyBlank = body.offsetHeight === 0 && body.scrollHeight === 0
        const isTooSmall = body.offsetHeight < 50 && body.scrollHeight < 50

        // Check for visible content
        let hasVisibleContent = false
        const allElements = body.querySelectorAll('*')
        for (const el of Array.from(allElements).slice(0, 100)) {
          const style = window.getComputedStyle(el as HTMLElement)
          if (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            (el as HTMLElement).offsetHeight > 0
          ) {
            hasVisibleContent = true
            break
          }
        }

        console.log('[WebPagePreview] Page health check (onLoad):', {
          bodyHidden: isBodyHidden,
          bodyBlank: isBodyBlank,
          bodyHeight: body.offsetHeight,
          isTooSmall: isTooSmall,
          hasVisibleContent: hasVisibleContent,
        })

        if (isBodyHidden || isBodyBlank || isTooSmall || !hasVisibleContent) {
          console.warn('[WebPagePreview] Page loaded but content not visible - showing error UI')
          setCheckStatus('error')
          setIsIframeLoading(false)
        }
      } catch (error) {
        console.error('[WebPagePreview] Error in onLoad handler - showing error UI:', error)
        setCheckStatus('error')
        setIsIframeLoading(false)
      }
    }, 1500) // Check 1.5 seconds after load
  }

  // Use proxy URL for embedding with auth token
  const token = tokenStorage.getAccessToken()
  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'
  const proxyUrl = `${apiBaseUrl}/api/v1/proxy?url=${encodeURIComponent(url)}&token=${token}`

  // Show blocked/error state
  if (checkStatus === 'blocked' || checkStatus === 'error') {
    return (
      <div className="flex h-full flex-col bg-base-100">
        {/* Info banner for error states */}
        <div className="flex items-center gap-2 border-border border-b bg-base-200 px-4 py-2">
          <Info className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
          <p className="text-text-secondary text-xs">
            Unable to load preview from{' '}
            <span className="font-medium text-text-primary">{new URL(url).hostname}</span>
          </p>
          <button
            type="button"
            onClick={openInNewTab}
            className="ml-auto flex items-center gap-1 text-primary text-xs hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Open Original
          </button>
        </div>

        {/* Error/Blocked content */}
        <div className="relative flex flex-1 items-center justify-center bg-base-100">
          <PreviewErrorState onOpenInNewTab={openInNewTab} />
        </div>
      </div>
    )
  }

  // Show iframe with loading overlay
  return (
    <div className="flex h-full flex-col bg-base-100">
      {/* Info banner - only shown during loading */}
      {isIframeLoading && (
        <div className="flex items-center gap-2 border-border border-b bg-base-200 px-4 py-2">
          <Info className="h-4 w-4 flex-shrink-0 text-info" />
          <p className="text-text-secondary text-xs">
            Loading preview from{' '}
            <span className="font-medium text-text-primary">{new URL(url).hostname}</span>...
          </p>
          <button
            type="button"
            onClick={openInNewTab}
            className="ml-auto flex items-center gap-1 text-primary text-xs hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Open Original
          </button>
        </div>
      )}

      <div className="relative flex flex-1 items-center justify-center bg-base-100">
        {/* Loading overlay - shown until iframe_ready message received */}
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100">
            <div className="text-center">
              <Loader className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-text-tertiary">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Iframe - starts loading immediately */}
        <iframe
          ref={iframeRef}
          src={proxyUrl}
          title="Web Page Preview"
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  )
}
