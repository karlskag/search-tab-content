import {For, Show, createSignal, createEffect} from "solid-js";
import {NodeDataRecord} from "./Search";
import {markAndShowResult} from "../remoteFns";

const getFaviconUrl = (url) => {
  return `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`
}

function a11yClick(event){
  const code = event.charCode || event.keyCode;
  if (code === 32 || code === 13) {
    event.preventDefault()
    return true
  }
  return false
}

const getSortedMatches = (matches: NodeDataRecord) => {
  // Sort by number of matching text-nodes
  return Object.entries(matches).sort((a, b) => {
    return b[1].length - a[1].length
  })
}

export const Results = (props: { matches: NodeDataRecord }) => {
  const [sortedMatches, setSortedMatches] = createSignal(getSortedMatches(props.matches ?? {}))
  createEffect(() => setSortedMatches(getSortedMatches(props.matches)))

  return <Show when={sortedMatches().length > 0}>
      <p class="navigation-hint">Navigate with <kbd>Tab</kbd> or <kbd>Shift</kbd> + <kbd>Tab</kbd>.</p>
      <For each={sortedMatches()}>
      {([tabId, matches]) => {
        return <div class="results-container">
          <div class="search-result-heading">
            <p class="match-count">{`${matches.length} matching on page:`}</p>
            <div class="icon-heading">
              <img class="favicon" alt="favicon" src={getFaviconUrl(matches[0]?.url)} />
              <h2 class="result-heading line-clamp-1">{matches[0]?.title}</h2>
            </div>
            <p class="result-url">{matches[0]?.url}</p>
          </div>
          <ul class="match-container">
            <For each={matches}>
              {(match) =>
                <li tabindex="0"
                    class="match"
                    onkeypress={(e) => a11yClick(e) && markAndShowResult(match.className, tabId)}
                    onclick={() => markAndShowResult(match.className, tabId)}>
                <span class="line-clamp-2">{match.text}</span>
              </li>}
            </For>
          </ul>
        </div>
      }}
    </For>
  </Show>
}