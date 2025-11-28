import React from 'react'
import Checkout from './Checkout'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Facebook Commerce Checkout Landing</h1>
        <p className="subtitle">Demo: lists URL params and parses the <code>products</code> param</p>
      </header>
      <main>
        <Checkout />
      </main>
    </div>
  )
}
