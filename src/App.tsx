import type { Component } from 'solid-js';
import Search from './components/Search';
import './main.css'

const App: Component = () => {
  return (
    <div class="main-container">
      <h2 class="app-heading">Search for content in all open tabs</h2>
      <Search />
    </div>
  );
};

export default App;
