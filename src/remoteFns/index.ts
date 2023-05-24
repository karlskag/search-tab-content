export async function getAllTabs() {
  const res = await chrome.tabs.query({});
  return res
}

export const prepareRemote = () => {
  const SHORTEST_ALLOWED_TEXT = 20
  function isHidden(el) {
    return (el.offsetParent === null)
  }

  // TODO: Cleanup listener
  // Register search result listener
  chrome.runtime.onMessage.addListener(function(className) {
    const resultEls = Array.from(document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>)
    resultEls[0].style.background = 'yellow'
    resultEls[0].style.color = 'black'
    resultEls[0].scrollIntoView({ block: 'center' })

    setTimeout(() => {
      // Ease out bg of matching search
      resultEls[0].style.transition = 'background-color 0.5s ease, color 0.5s ease'
      resultEls[0].style.background = 'initial'
      resultEls[0].style.color = 'initial'
    }, 4000)
  });

  // Find all text-nodes, set classname and return data
  let localTN = []
  let searchRoot = document.getElementsByTagName('body')[0]
  let tw = document.createTreeWalker(searchRoot, NodeFilter.SHOW_TEXT)
  let title = document.title
  let url = document.documentURI

  let currentNode = tw.currentNode;
  let idx = 0;
  while (currentNode) {
    const parentEl = currentNode.parentElement
    const trimmedVal = currentNode.nodeValue?.trim() ?? ''
    if (!isHidden(parentEl)
      && trimmedVal.length > SHORTEST_ALLOWED_TEXT
      && parentEl.tagName !== 'SCRIPT') {
      let cn = `search-possible-match-${idx}`
      parentEl.classList.add(cn)

      localTN.push({
        className: cn,
        text: trimmedVal,
        title,
        url,
      });
    }
    currentNode = tw.nextNode();
    idx++;
  }

  return localTN
}

export const markAndShowResult = async (className, tabId) => {
  const parsedId = parseInt(tabId)
  chrome.tabs.update(parsedId, { active: true, highlighted: true })
  chrome.tabs.sendMessage(parsedId, className);
}