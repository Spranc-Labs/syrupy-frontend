/**
 * Highlight Client Script
 * Runs inside iframes to capture and render text highlights
 */

(function() {
  'use strict';

  let tooltip = null;
  let currentSelection = null;

  // Normalize text for consistent matching (handles smart quotes, whitespace, punctuation)
  // preserveSpacing: if true, don't trim (for building combined search text from multiple nodes)
  function normalizeText(text, preserveSpacing = false) {
    let normalized = text
      // Convert ALL quote variations to straight quotes
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')  // All double quote variants
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")  // All single quote variants
      // Normalize whitespace (newlines, tabs, multiple spaces -> single space)
      .replace(/[\n\r\t]+/g, ' ')
      // Normalize punctuation spacing - exactly one space after sentence endings and common punctuation
      .replace(/([.!?])\s*/g, '$1 ')    // Exactly one space after . ! ?
      .replace(/\s*([,;:])\s*/g, '$1 ') // Exactly one space after , ; :
      .replace(/\s+/g, ' ');             // Collapse any remaining multiple spaces

    // Only trim if we're not preserving spacing between text nodes
    return preserveSpacing ? normalized : normalized.trim();
  }

  // Helper to get text before/after a range for context
  function getTextContext(range, charsBefore = 32, charsAfter = 32) {
    const container = range.commonAncestorContainer;
    const fullText = container.textContent || '';
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    const prefix = fullText.substring(Math.max(0, startOffset - charsBefore), startOffset);
    const suffix = fullText.substring(endOffset, Math.min(fullText.length, endOffset + charsAfter));

    return { prefix, suffix };
  }

  // Capture text selection
  function captureSelection() {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const exactText = selection.toString();
    const { prefix, suffix } = getTextContext(range);

    // Normalize text before saving to ensure consistent matching later
    return {
      exact_text: normalizeText(exactText),
      prefix_text: normalizeText(prefix),
      suffix_text: normalizeText(suffix),
      page_url: window.location.href
    };
  }

  // Create and show tooltip near selection
  function showTooltip(x, y) {
    // Remove existing tooltip
    removeTooltip();

    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.className = 'highlight-tooltip';
    tooltip.innerHTML = `
      <button class="highlight-tooltip-btn" data-action="highlight">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Highlight</span>
      </button>
    `;

    // Position tooltip
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 50}px`; // Position above cursor
    tooltip.style.zIndex = '999999';

    // Add to document
    document.body.appendChild(tooltip);

    // Add click handler
    const highlightBtn = tooltip.querySelector('[data-action="highlight"]');
    if (highlightBtn) {
      highlightBtn.addEventListener('click', handleHighlightClick);
    }

    // Store current selection
    currentSelection = captureSelection();
  }

  // Remove tooltip
  function removeTooltip(force = false) {
    if (tooltip) {
      // If not forcing removal, check if user has an active selection
      // This prevents clearing the tooltip when user is about to create a new highlight
      if (!force) {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
          // User has a selection, likely about to show new tooltip - don't remove yet
          return;
        }
      }
      tooltip.remove();
      tooltip = null;
    }
    currentSelection = null;
  }

  // Handle highlight button click
  function handleHighlightClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // Store the selection range BEFORE clearing it - we'll use this to render immediately
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      try {
        pendingHighlightRange = selection.getRangeAt(0).cloneRange();
        console.log('[Highlight Client] Stored selection range for immediate highlighting');
      } catch (err) {
        console.log('[Highlight Client] Failed to store selection range:', err.message);
        pendingHighlightRange = null;
      }
    }

    if (currentSelection && window.parent) {
      // Show loading state
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        <span>Saving...</span>
      `;

      // Send to parent for saving
      window.parent.postMessage({
        type: 'new_highlight',
        highlight: currentSelection
      }, '*');
    }

    // Remove tooltip (force=true to ensure removal even if new selection exists)
    removeTooltip(true);

    // Clear browser selection to allow immediate new selection
    if (selection) {
      selection.removeAllRanges();
    }
  }

  // Variables for delete tooltip
  let deleteTooltip = null;

  // Show delete tooltip when clicking on a highlight
  function showDeleteTooltip(x, y, highlightId, markElement) {
    // Don't show delete tooltip if user has text selected (they're trying to highlight)
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
      return;
    }

    // Remove any existing delete tooltip
    removeDeleteTooltip();

    // Create delete tooltip
    deleteTooltip = document.createElement('div');
    deleteTooltip.className = 'highlight-delete-tooltip';
    deleteTooltip.innerHTML = `
      <button class="highlight-delete-btn" data-highlight-id="${highlightId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete</span>
      </button>
    `;

    // Position tooltip near the highlight element itself
    const rect = markElement.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Position above the highlight, centered horizontally
    const tooltipX = rect.left + scrollX + (rect.width / 2);
    const tooltipY = rect.top + scrollY - 10; // 10px above the highlight

    deleteTooltip.style.left = `${tooltipX}px`;
    deleteTooltip.style.top = `${tooltipY}px`;
    deleteTooltip.style.transform = 'translate(-50%, -100%)'; // Center horizontally, position above

    // Add to document
    document.body.appendChild(deleteTooltip);

    // Add click handler
    const deleteBtn = deleteTooltip.querySelector('.highlight-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleDeleteHighlight(highlightId, markElement);
      });
    }

    // Close tooltip when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', removeDeleteTooltip, { once: true });
    }, 0);
  }

  // Remove delete tooltip
  function removeDeleteTooltip() {
    if (deleteTooltip) {
      deleteTooltip.remove();
      deleteTooltip = null;
    }
  }

  // Handle delete highlight
  function handleDeleteHighlight(highlightId, markElement) {
    // Show loading state
    if (deleteTooltip) {
      const btn = deleteTooltip.querySelector('.highlight-delete-btn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <span>Deleting...</span>
        `;
      }
    }

    // Send delete request to parent
    if (window.parent) {
      window.parent.postMessage({
        type: 'delete_highlight',
        highlightId: highlightId
      }, '*');
    }

    // Optimistically remove ALL marks with this highlight ID from DOM
    // (Multi-node highlights have multiple mark elements)
    const allMarks = document.querySelectorAll(`mark[data-highlight-id="${highlightId}"]`);
    const parentNodes = new Set();

    allMarks.forEach((mark) => {
      if (mark.parentNode) {
        parentNodes.add(mark.parentNode);
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
      }
    });

    // Normalize parent nodes to merge adjacent text nodes
    parentNodes.forEach((parent) => {
      parent.normalize();
    });

    // Remove tooltip
    removeDeleteTooltip();
  }

  // Clear all existing highlights from the page
  function clearAllHighlights() {
    const allHighlightMarks = document.querySelectorAll('mark[data-highlight-id]');
    console.log('[Highlight Client] Clearing', allHighlightMarks.length, 'highlights');

    // Track parent nodes that need normalization
    const parentNodes = new Set();

    allHighlightMarks.forEach((mark) => {
      // Track parent for later normalization
      if (mark.parentNode) {
        parentNodes.add(mark.parentNode);
      }

      // Replace mark with its text content to preserve the text
      const textNode = document.createTextNode(mark.textContent || '');
      mark.replaceWith(textNode);
    });

    // Normalize all affected parent nodes to merge adjacent text nodes
    // This ensures consistent DOM structure for subsequent searches
    parentNodes.forEach((parent) => {
      parent.normalize();
    });
  }

  // Build a map of all text nodes with their positions in concatenated text
  function buildTextNodeMap() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodes = [];
    let combinedText = '';
    let node;

    while (node = walker.nextNode()) {
      const text = node.textContent || '';
      // IMPORTANT: Use preserveSpacing=true to keep trailing/leading spaces
      // This ensures proper spacing when text nodes are concatenated
      const normalizedText = normalizeText(text, true);

      // Skip empty nodes
      if (!normalizedText.trim()) continue;

      nodes.push({
        node: node,
        originalText: text,
        normalizedText: normalizedText,
        startOffset: combinedText.length,
        endOffset: combinedText.length + normalizedText.length
      });

      combinedText += normalizedText;
    }

    return { nodes, combinedText };
  }

  // Find text across multiple nodes and return the affected nodes with positions
  function findTextAcrossNodes(exactText, prefixText = '', suffixText = '') {
    const { nodes, combinedText } = buildTextNodeMap();
    const normalizedExactText = normalizeText(exactText);

    console.log('[Highlight Client] Searching for text in', nodes.length, 'nodes');

    // Find the text in the combined text
    const index = combinedText.indexOf(normalizedExactText);

    if (index === -1) {
      console.log('[Highlight Client] Text not found in combined text');
      return null;
    }

    console.log('[Highlight Client] Found text at index', index);

    // Verify context if available
    if (prefixText || suffixText) {
      const normalizedPrefixText = normalizeText(prefixText);
      const normalizedSuffixText = normalizeText(suffixText);

      const beforeText = combinedText.substring(Math.max(0, index - 32), index);
      const afterText = combinedText.substring(
        index + normalizedExactText.length,
        index + normalizedExactText.length + 32
      );

      const contextMatches = (
        (!normalizedPrefixText || beforeText.includes(normalizedPrefixText)) &&
        (!normalizedSuffixText || afterText.includes(normalizedSuffixText))
      );

      if (contextMatches) {
        console.log('[Highlight Client] Context matches');
      } else {
        console.log('[Highlight Client] Context mismatch, but highlighting anyway (text found)');
      }
    }

    // Find which nodes contain this text
    const startIndex = index;
    const endIndex = index + normalizedExactText.length;

    const affectedNodes = nodes.filter(nodeInfo => {
      // Node is affected if it overlaps with [startIndex, endIndex)
      return nodeInfo.startOffset < endIndex && nodeInfo.endOffset > startIndex;
    });

    if (affectedNodes.length === 0) {
      console.log('[Highlight Client] No nodes found for text range');
      return null;
    }

    console.log('[Highlight Client] Found text across', affectedNodes.length, 'node(s)');

    // Calculate the offset within each node
    const matches = affectedNodes.map((nodeInfo, i) => {
      const nodeStartInCombined = nodeInfo.startOffset;
      const nodeEndInCombined = nodeInfo.endOffset;

      // Calculate how much of this node is part of the match
      const matchStartInCombined = Math.max(startIndex, nodeStartInCombined);
      const matchEndInCombined = Math.min(endIndex, nodeEndInCombined);

      // Offset within the normalized text of this node
      const normalizedStartOffset = matchStartInCombined - nodeStartInCombined;
      const normalizedEndOffset = matchEndInCombined - nodeStartInCombined;

      // Map back to original text positions
      // We need to find where in the original text these normalized positions correspond to
      const originalText = nodeInfo.originalText;
      let actualStartOffset = -1;
      let actualEndOffset = -1;

      // Find the start position in original text
      let normalizedPos = 0;
      for (let i = 0; i <= originalText.length; i++) {
        if (normalizedPos === normalizedStartOffset) {
          actualStartOffset = i;
          break;
        }
        if (i < originalText.length) {
          const char = originalText[i];
          const normalizedChar = normalizeText(char);
          normalizedPos += normalizedChar.length;
        }
      }

      // Find the end position in original text
      normalizedPos = 0;
      for (let i = 0; i <= originalText.length; i++) {
        if (normalizedPos === normalizedEndOffset) {
          actualEndOffset = i;
          break;
        }
        if (i < originalText.length) {
          const char = originalText[i];
          const normalizedChar = normalizeText(char);
          normalizedPos += normalizedChar.length;
        }
      }

      // Fallback: if we couldn't find exact positions, use ratio-based estimation
      if (actualStartOffset === -1 || actualEndOffset === -1) {
        const startRatio = normalizedStartOffset / nodeInfo.normalizedText.length;
        const endRatio = normalizedEndOffset / nodeInfo.normalizedText.length;
        actualStartOffset = Math.floor(startRatio * originalText.length);
        actualEndOffset = Math.floor(endRatio * originalText.length);
      }

      return {
        node: nodeInfo.node,
        startOffset: actualStartOffset,
        endOffset: actualEndOffset,
        isFirst: i === 0,
        isLast: i === affectedNodes.length - 1
      };
    });

    return matches;
  }

  // Render a highlight
  function renderHighlight(highlight, retryCount = 0) {
    console.log('[Highlight Client] renderHighlight START:', {
      id: highlight.id,
      text: highlight.exact_text?.substring(0, 50),
      justCreated: highlight.justCreated || false,
      retryCount: retryCount,
    });

    // NEW: For just-created highlights, use the stored selection range directly
    if (highlight.justCreated && pendingHighlightRange) {
      console.log('[Highlight Client] Using stored selection range for immediate highlighting');

      try {
        // Check if this is a single-element or cross-element selection
        const startContainer = pendingHighlightRange.startContainer;
        const endContainer = pendingHighlightRange.endContainer;
        const isCrossElement = startContainer !== endContainer;

        // Shared click handler setup
        const setupClickHandler = (markElement) => {
          let canDelete = false;
          setTimeout(() => { canDelete = true; }, 500);

          markElement.addEventListener('click', function(e) {
            if (!canDelete) return;
            e.preventDefault();
            e.stopPropagation();
            const firstMark = document.querySelector(`mark[data-highlight-id="${highlight.id}"]`);
            showDeleteTooltip(e.clientX, e.clientY, highlight.id, firstMark || markElement);
          });
        };

        if (!isCrossElement) {
          // Single element - simple surroundContents
          const mark = document.createElement('mark');
          mark.className = `highlight highlight-${highlight.color}`;
          mark.dataset.highlightId = highlight.id;
          mark.style.backgroundColor = getHighlightColor(highlight.color);
          mark.style.cursor = 'pointer';
          mark.style.borderRadius = '2px';
          mark.style.padding = '1px 0';
          setupClickHandler(mark);

          pendingHighlightRange.surroundContents(mark);
          console.log('[Highlight Client] ✅ Highlighted successfully');
        } else {
          // Cross-element selection - wrap each text node separately
          console.log('[Highlight Client] Cross-element selection detected');

          // Get all text nodes within the range
          const walker = document.createTreeWalker(
            pendingHighlightRange.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            null
          );

          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            if (pendingHighlightRange.intersectsNode(node)) {
              textNodes.push(node);
            }
          }

          // Wrap each text node
          textNodes.forEach((textNode, index) => {
            const mark = document.createElement('mark');
            mark.className = `highlight highlight-${highlight.color}`;
            mark.dataset.highlightId = highlight.id;
            mark.style.backgroundColor = getHighlightColor(highlight.color);
            mark.style.cursor = 'pointer';
            mark.style.borderRadius = '2px';
            mark.style.padding = '1px 0';
            setupClickHandler(mark);

            // Calculate the portion of this text node that's in the range
            const nodeRange = document.createRange();
            nodeRange.selectNodeContents(textNode);

            // Find intersection with the original range
            const isFirst = textNode === startContainer || textNode === startContainer.firstChild;
            const isLast = textNode === endContainer || textNode === endContainer.lastChild;

            if (isFirst && isLast) {
              // Entire selection is within this single node
              nodeRange.setStart(textNode, pendingHighlightRange.startOffset);
              nodeRange.setEnd(textNode, pendingHighlightRange.endOffset);
            } else if (isFirst) {
              // First node - from startOffset to end
              nodeRange.setStart(textNode, pendingHighlightRange.startOffset);
            } else if (isLast) {
              // Last node - from start to endOffset
              nodeRange.setEnd(textNode, pendingHighlightRange.endOffset);
            }
            // else: middle node - use entire node (already set by selectNodeContents)

            try {
              nodeRange.surroundContents(mark);
            } catch (e) {
              console.warn('[Highlight Client] Failed to wrap node:', e.message);
            }
          });

          console.log('[Highlight Client] ✅ Highlighted', textNodes.length, 'nodes');
        }

        // Clear the pending range
        pendingHighlightRange = null;
        return;  // Done! No need for TreeWalker search
      } catch (e) {
        console.log('[Highlight Client] Failed to wrap stored range:', e.message);
        console.log('[Highlight Client] Falling back to TreeWalker search...');
        pendingHighlightRange = null;
        // Fall through to TreeWalker search below
      }
    }

    const { exact_text, prefix_text, suffix_text, color } = highlight;

    // Remove existing highlight with same ID to prevent duplicates/darkening
    const existingMark = document.querySelector(`mark[data-highlight-id="${highlight.id}"]`);
    if (existingMark) {
      console.log('[Highlight Client] Removing duplicate highlight:', highlight.id);
      // Replace mark with its text content to preserve the text
      const textNode = document.createTextNode(existingMark.textContent || '');
      existingMark.replaceWith(textNode);
    }

    console.log('[Highlight Client] Searching for text:', exact_text.substring(0, 50) + '...');
    console.log('[Highlight Client] Normalized search text:', normalizeText(exact_text).substring(0, 50) + '...');

    // Use multi-node search to find text that may span multiple elements
    const matches = findTextAcrossNodes(exact_text, prefix_text, suffix_text);

    if (!matches) {
      // If text not found and we have retries left, wait and try again
      if (retryCount < 5) {
        console.log(`[Highlight Client] ❌ Text not found, retrying in 500ms (${5 - retryCount} retries left)...`);
        setTimeout(() => renderHighlight(highlight, retryCount + 1), 500);
        return;
      }

      // Out of retries, log detailed error
      console.warn('[Highlight Client] ❌ Text not found in page after 5 retries:', exact_text.substring(0, 50) + '...');
      console.log('[Highlight Client] This could mean: text was not found or has changed since capture');
      return;
    }

    // Preserve user's current selection before DOM manipulation
    const userSelection = window.getSelection();
    const hasActiveSelection = userSelection && !userSelection.isCollapsed && userSelection.toString().trim().length > 0;
    let savedRange = null;

    if (hasActiveSelection) {
      try {
        savedRange = userSelection.getRangeAt(0).cloneRange();
      } catch (e) {
        // Selection might be invalid, continue anyway
      }
    }

    // Create the mark element
    const mark = document.createElement('mark');
    mark.className = `highlight highlight-${color}`;
    mark.dataset.highlightId = highlight.id;
    mark.style.backgroundColor = getHighlightColor(color);
    mark.style.cursor = 'pointer';
    mark.style.borderRadius = '2px';
    mark.style.padding = '1px 0';

    // Add click handler for delete option
    let canDelete = true;

    // For newly rendered highlights (from render_highlight message), add delay
    // This prevents accidental delete when clicking near just-created highlight
    if (highlight.justCreated) {
      canDelete = false;
      setTimeout(() => {
        canDelete = true;
      }, 500);
    }

    mark.addEventListener('click', function(e) {
      if (!canDelete) {
        return; // Ignore clicks on newly created highlights for 500ms
      }
      e.preventDefault();
      e.stopPropagation();
      showDeleteTooltip(e.clientX, e.clientY, highlight.id, mark);
    });

    try {
      if (matches.length === 1) {
        // Single node - simple case
        const match = matches[0];
        const range = document.createRange();
        range.setStart(match.node, match.startOffset);
        range.setEnd(match.node, match.endOffset);

        try {
          range.surroundContents(mark);
          console.log('[Highlight Client] ✅ Highlighted successfully');
        } catch (e) {
          // Fallback to extractContents for overlapping marks
          const fragment = range.extractContents();
          mark.appendChild(fragment);
          range.insertNode(mark);
          console.log('[Highlight Client] ✅ Highlighted successfully (fallback)');
        }
      } else {
        // Multi-node highlight - create separate mark for each text node
        // This preserves the original DOM structure (paragraphs, etc.)
        console.log('[Highlight Client] Multi-node highlight across', matches.length, 'nodes');

        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];

          // Create individual mark element for this node
          const nodeMark = document.createElement('mark');
          nodeMark.className = `highlight highlight-${color}`;
          nodeMark.dataset.highlightId = highlight.id;
          nodeMark.style.backgroundColor = getHighlightColor(color);
          nodeMark.style.cursor = 'pointer';
          nodeMark.style.borderRadius = '2px';
          nodeMark.style.padding = '1px 0';

          // Add click handler to each mark
          nodeMark.addEventListener('click', function(e) {
            if (!canDelete) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            // Pass the first mark element for positioning the delete tooltip
            const firstMark = document.querySelector(`mark[data-highlight-id="${highlight.id}"]`);
            showDeleteTooltip(e.clientX, e.clientY, highlight.id, firstMark || nodeMark);
          });

          // Create range for just this node's portion
          const range = document.createRange();
          range.setStart(match.node, match.startOffset);
          range.setEnd(match.node, match.endOffset);

          // Wrap this portion (stays in original location!)
          try {
            range.surroundContents(nodeMark);
          } catch (e) {
            // Fallback for nested elements
            const fragment = range.extractContents();
            nodeMark.appendChild(fragment);
            range.insertNode(nodeMark);
          }
        }

        console.log('[Highlight Client] ✅ Highlighted', matches.length, 'nodes');
      }
    } catch (error) {
      console.error('[Highlight Client] Error rendering highlight:', error.message);
      return;
    }

    // Restore user's selection after DOM manipulation
    if (savedRange) {
      try {
        userSelection.removeAllRanges();
        userSelection.addRange(savedRange);
      } catch (e) {
        // Range might be invalid after DOM changes, that's okay
      }
    }
  }

  // Get color for highlight (using secondary color #6366f1)
  function getHighlightColor(color) {
    const colors = {
      yellow: 'rgba(99, 102, 241, 0.25)', // Light secondary color
      green: 'rgba(0, 255, 0, 0.3)',
      blue: 'rgba(0, 0, 255, 0.2)',
      pink: 'rgba(255, 0, 255, 0.3)',
      purple: 'rgba(128, 0, 128, 0.3)'
    };
    return colors[color] || colors.yellow;
  }

  // Store pending highlights to render after page load
  let pendingHighlights = [];
  let pageLoaded = false;
  let pendingHighlightRange = null; // Store user's selection range for immediate highlighting

  // Check if page content is actually loaded (not just DOM ready)
  function isContentLoaded() {
    // Check if there's actual article content (more than just nav/header)
    const textNodes = [];
    let totalTextLength = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while (node = walker.nextNode()) {
      const trimmed = node.textContent.trim();
      if (trimmed.length > 20) {
        textNodes.push(node);
        totalTextLength += trimmed.length;
      }
    }
    // Content loaded if we have reasonable article content (not just headers)
    // Most blog articles have 10-50 nodes and 1000+ chars
    const isLoaded = textNodes.length >= 10 && totalTextLength >= 1000;
    console.log('[Highlight Client] Content check:', textNodes.length, 'nodes,', totalTextLength, 'chars,', 'loaded:', isLoaded);
    return isLoaded;
  }

  // Wait for content to load with retries
  function waitForContentAndRender(highlights, retries = 10) {
    if (isContentLoaded()) {
      console.log('[Highlight Client] Content loaded, rendering', highlights.length, 'highlights');
      // Clear all existing highlights before rendering new ones
      clearAllHighlights();
      highlights.forEach((highlight, index) => {
        console.log(`[Highlight Client] Rendering highlight ${index + 1}/${highlights.length}:`, highlight);
        renderHighlight(highlight);
      });
    } else if (retries > 0) {
      console.log('[Highlight Client] Content not ready, waiting... (retries left:', retries, ')');
      setTimeout(() => waitForContentAndRender(highlights, retries - 1), 500);
    } else {
      console.warn('[Highlight Client] Content never loaded, attempting to render anyway');
      // Clear all existing highlights before rendering new ones
      clearAllHighlights();
      highlights.forEach(renderHighlight);
    }
  }

  // Check if page is already loaded
  if (document.readyState === 'complete') {
    pageLoaded = true;
    console.log('[Highlight Client] Page already loaded');
  } else {
    // Wait for page to load
    window.addEventListener('load', function() {
      pageLoaded = true;
      console.log('[Highlight Client] Page loaded, checking for content...');
      if (pendingHighlights.length > 0) {
        waitForContentAndRender(pendingHighlights);
        pendingHighlights = [];
      }
    });
  }

  // Listen for messages from parent
  window.addEventListener('message', function(event) {
    const timestamp = new Date().toISOString();
    if (event.data.type) {
      console.log(`[${timestamp}] [Highlight Client] Received message:`, event.data.type);
    }

    if (event.data.type === 'load_highlights') {
      const highlights = event.data.highlights || [];
      console.log('[Highlight Client] load_highlights - Count:', highlights.length);
      console.log('[Highlight Client] load_highlights - IDs:', highlights.map((h) => h.id));
      console.log('[Highlight Client] Highlights data:', highlights);

      if (pageLoaded) {
        // Page loaded, wait for content then render
        waitForContentAndRender(highlights);
      } else {
        // Page not ready, queue for later
        console.log('[Highlight Client] Page not ready, queuing highlights');
        pendingHighlights = highlights;
      }
    } else if (event.data.type === 'render_highlight') {
      // Render single newly created highlight
      console.log('[Highlight Client] Received render_highlight:', event.data.highlight);

      if (pageLoaded) {
        console.log('[Highlight Client] Rendering newly created highlight directly...');
        renderHighlight(event.data.highlight);
      } else {
        console.log('[Highlight Client] Page not loaded, queuing highlight');
        pendingHighlights.push(event.data.highlight);
      }
    } else if (event.data.type === 'scroll_to_highlight') {
      // Scroll to a specific highlight
      const highlightId = event.data.highlightId;
      console.log('[Highlight Client] Received scroll_to_highlight:', highlightId);

      const markElement = document.querySelector(`mark[data-highlight-id="${highlightId}"]`);

      if (markElement) {
        console.log('[Highlight Client] Found highlight, scrolling...');
        markElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn('[Highlight Client] Highlight not found:', highlightId);
      }
    }
  });

  // Show tooltip on mouseup (text selection)
  document.addEventListener('mouseup', function(e) {
    // Delay to ensure selection is complete and avoid race conditions with rendering
    setTimeout(() => {
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
        // Show tooltip at mouse position
        showTooltip(e.pageX, e.pageY);
      } else {
        // Remove tooltip if no selection
        removeTooltip();
      }
    }, 50); // Increased from 10ms to 50ms to avoid race conditions
  });

  // Remove tooltip when clicking elsewhere
  document.addEventListener('mousedown', function(e) {
    // Only remove selection tooltip, not delete tooltip
    // Don't remove if clicking on the tooltip itself
    if (tooltip && !tooltip.contains(e.target)) {
      removeTooltip();
    }
    // Note: Delete tooltip is handled separately with its own click-away listener
  });

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .highlight {
      transition: background-color 0.2s;
      position: relative;
    }
    .highlight:hover {
      filter: brightness(0.95);
      cursor: pointer;
    }
    .highlight-tooltip {
      background: white;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 2px;
      font-family: Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .highlight-tooltip-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 24px;
      padding: 0 8px;
      background: transparent;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #444444;
      cursor: pointer;
      transition: background-color 0.15s;
      white-space: nowrap;
    }
    .highlight-tooltip-btn:hover {
      background: #F3F3F3;
    }
    .highlight-tooltip-btn:active {
      background: #E5E5E5;
    }
    .highlight-tooltip-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .highlight-tooltip-btn svg {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }
    .highlight-delete-tooltip {
      position: absolute;
      background: white;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 2px;
      z-index: 999999;
      font-family: Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .highlight-delete-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 24px;
      padding: 0 8px;
      background: transparent;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #ef4444;
      cursor: pointer;
      transition: background-color 0.15s;
      white-space: nowrap;
    }
    .highlight-delete-btn:hover {
      background: #FEF2F2;
    }
    .highlight-delete-btn svg {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);

  console.log('[Highlight Client] Initialized with tooltip UI');

  // Send iframe_ready message to parent
  if (window.parent && window.parent !== window) {
    console.log('[Highlight Client] Sending iframe_ready message to parent');
    window.parent.postMessage({ type: 'iframe_ready' }, '*');
  }
})();
