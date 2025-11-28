import React, { useMemo } from 'react'

function parseProductsRaw(value) {
  if (!value) return []
  // Try decodeURIComponent (in case it's encoded)
  let raw = value
  try {
    raw = decodeURIComponent(value)
  } catch (e) {
    raw = value
  }

  // If JSON
  const trimmed = raw.trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)
      // Expect array of objects or single object
      const arr = Array.isArray(parsed) ? parsed : [parsed]
      return arr.map((it) => {
        // Support different field names
        return {
          id: it.id ?? it.product_id ?? it.sku ?? it["product_id"] ?? null,
          quantity: Number(it.quantity ?? it.qty ?? it.count ?? 1) || 1,
          raw: it,
        }
      })
    } catch (e) {
      // fallthrough
    }
  }

  // Otherwise assume comma-separated list of items like: id:qty,id2:qty2
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const items = parts.map((part) => {
    // common separators: :, x, * or =
    let id = part
    let quantity = 1
    const colonMatch = part.match(/^(.+?):(\d+)$/)
    const xMatch = part.match(/^(.+?)x(\d+)$/i)
    const eqMatch = part.match(/^(.+?)=(\d+)$/)
    const starMatch = part.match(/^(.+?)\*(\d+)$/)
    if (colonMatch) {
      id = colonMatch[1]
      quantity = Number(colonMatch[2])
    } else if (xMatch) {
      id = xMatch[1]
      quantity = Number(xMatch[2])
    } else if (eqMatch) {
      id = eqMatch[1]
      quantity = Number(eqMatch[2])
    } else if (starMatch) {
      id = starMatch[1]
      quantity = Number(starMatch[2])
    } else {
      // maybe there's a pipe with quantity like id:sku:qty or seller:product:qty
      const nums = part.split(':')
      if (nums.length >= 2 && /\d+$/.test(nums[nums.length - 1])) {
        quantity = Number(nums[nums.length - 1])
        id = nums.slice(0, nums.length - 1).join(':')
      }
    }

    return { id: id || null, quantity: Number(quantity) || 1, raw: part }
  })
  return items
}

export default function Checkout() {
  const params = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    const entries = []
    for (const key of new Set(Array.from(sp.keys()))) {
      const all = sp.getAll(key)
      entries.push({ key, values: all })
    }
    return entries
  }, [])

  const productsParam = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    const p = sp.get('products')
    if (!p) return { raw: null, items: [] }
    const items = parseProductsRaw(p)
    return { raw: p, items }
  }, [])

  return (
    <section className="checkout">
      <h2>URL Parameters</h2>
      {params.length === 0 ? (
        <p>No URL parameters found.</p>
      ) : (
        <table className="params">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value(s)</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.key}>
                <td><code>{p.key}</code></td>
                <td>
                  {p.values.map((v, i) => (
                    <div key={i}><code>{v}</code></div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Products Param</h2>
      {productsParam.raw == null ? (
        <p>No <code>products</code> parameter present.</p>
      ) : (
        <div>
          {productsParam.items.length === 0 ? (
            <p>Unable to parse any product items from the <code>products</code> parameter.</p>
          ) : (
            <table className="products">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product ID</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {productsParam.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><code>{String(it.id)}</code></td>
                    <td>{it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  )
}
