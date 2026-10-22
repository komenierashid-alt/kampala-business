import { useState, useEffect } from "react";
import { db, addProduct } from "./lib/firebase.js"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;
    await addProduct(name, price, qty);
    setName(""); setPrice(""); setQty("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Kampala Business - Sugar Stock</h1>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input placeholder="Item (sugar)" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Price (5000)" value={price} onChange={e=>setPrice(e.target.value)} type="number" />
        <input placeholder="Qty (10)" value={qty} onChange={e=>setQty(e.target.value)} type="number" />
        <button type="submit">Add</button>
      </form>
      <div>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: 10, margin: 5 }}>
            <b>{p.name}</b> - Price: {p.price} - Qty: {p.qty}
          </div>
        ))}
      </div>
      <p>Total products: {products.length}</p>
    </div>
  );
}
