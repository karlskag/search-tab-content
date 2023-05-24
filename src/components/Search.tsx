import {createSignal, onMount} from "solid-js";
import {getAllTabs, prepareRemote} from "../remoteFns";
import {Results} from "./Results"
import searchIconUrl from '/assets/icons-search.svg'

export type NodeData = { text: string, title: string, className: string, url: string }
export type NodeDataRecord = Record<string, NodeData[]>

export default () => {
  let nodeData: NodeDataRecord = {};
  const [query, setQuery] = createSignal('')

  const getMatchingNodes = (): NodeDataRecord => {
    const input = query()
    const trimmedInput = input.trim()
    if (trimmedInput.length < 3) return {}

    return Object.entries(nodeData).reduce((acc, [id, data]) => {
      const matches = data.filter(nd => nd.text.toLowerCase().includes(input.toLowerCase()))
      if (!!matches.length) {
        acc[id] = matches
      }
      return acc
    }, {})
  }

  onMount(async () => {
    let tabs = await getAllTabs()
    tabs.forEach(async t => {
      const exec = await chrome.scripting.executeScript({ target: { tabId: t.id }, func: prepareRemote })
      nodeData[t.id] = exec[0].result
    })
  })

  return <div>
    <form>
      {/*Should be throttled*/}
      <div class="input-container">
        <img alt="search-icon" class="search-icon" src={searchIconUrl} />
        <input autofocus class="search-input" placeholder="Search for..." oninput={(e) => setQuery(e.target.value)} />
      </div>
    </form>
    <Results matches={getMatchingNodes()} query={query()}/>
  </div>;
};
