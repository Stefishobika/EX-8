import React, { useMemo, useState } from 'react';
import './App.css';

const cakes = [
  { id: 1, name: 'Belgian Dark Chocolate', category: 'chocolate', price: 42, tags: ['Nut-Free'], desc: 'Rich 70% dark chocolate sponge layered with smooth chocolate ganache.', image: '/images/chocolate-cake.jpg' },
  { id: 2, name: 'Fresh Strawberry Shortcake', category: 'fruit', price: 38, tags: ['GF-Option'], desc: 'Light vanilla sponge filled with organic fresh strawberries and cream.', image: '/images/fresh-strawberry-cake.jpg' },
  { id: 3, name: 'Velvet Truffle Delight', category: 'signature', price: 48, tags: [], desc: 'Our award-winning signature cake coated in smooth cocoa dusting.', image: '/images/velvet-cake.jpg' },
  { id: 4, name: 'Zesty Lemon Berry', category: 'fruit', price: 36, tags: ['Nut-Free'], desc: 'Tangy lemon curd layers complemented by mixed woodland berries.', image: '/images/zesty-lemon-berry.jpg' },
  { id: 5, name: 'Plant-Based Berry Bliss', category: 'vegan', price: 40, tags: ['Vegan', 'GF'], desc: '100% vegan coconut sponge layered with fresh raspberry puree.', image: '/images/berry-blast.jpg' },
  { id: 6, name: 'Salted Caramel Macchiato', category: 'signature', price: 46, tags: [], desc: 'Espresso-infused sponge cake finished with homemade salted caramel drizzle.', image: '/images/salted-caramel-cake.jpg' }
];
const filters = ['all', 'chocolate', 'fruit', 'signature', 'vegan'];
const sizes = [{value:30,label:'6" Single Layer (Serves 6-8) - $30',short:'6" Single Layer (Serves 6-8)'},{value:50,label:'8" Double Layer (Serves 12-15) - $50',short:'8" Double Layer (Serves 12-15)'},{value:80,label:'10" Triple Layer (Serves 20-25) - $80',short:'10" Triple Layer (Serves 20-25)'}];
const flavors = [{value:0,label:'Classic Vanilla Bean'},{value:5,label:'Belgian Dark Chocolate (+$5)'},{value:5,label:'Red Velvet (+$5)'},{value:8,label:'Matcha Green Tea (+$8)'}];
const fillings = [{value:0,label:'Vanilla Buttercream'},{value:4,label:'Fresh Strawberry Compote (+$4)'},{value:6,label:'Salted Caramel Ganache (+$6)'},{value:6,label:'Espresso Cream (+$6)'}];
const money = value => `$${Number(value).toFixed(2)}`;

function App() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [openFaq, setOpenFaq] = useState(-1);
  const [size, setSize] = useState(50);
  const [flavor, setFlavor] = useState(0);
  const [filling, setFilling] = useState(0);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const customPrice = Number(size) + Number(flavor) + Number(filling);
  const selectedSize = sizes.find(x => x.value === Number(size));
  const selectedFlavor = flavors.find(x => x.value === Number(flavor));
  const selectedFilling = fillings.find(x => x.value === Number(filling));
  const filteredCakes = useMemo(() => cakes.filter(c => (category === 'all' || c.category === category) && `${c.name} ${c.desc} ${c.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const toast = text => {
    const id = Date.now() + Math.random();
    setToasts(old => [...old, {id, text}]);
    window.setTimeout(() => setToasts(old => old.filter(t => t.id !== id)), 2800);
  };
  const addItem = item => {
    setCart(old => {
      const existing = old.find(x => x.id === item.id);
      return existing ? old.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x) : [...old, {...item, qty: 1}];
    });
    toast('Item added to cart!');
  };
  const changeQty = (id, delta) => setCart(old => old.map(x => x.id === id ? {...x, qty: x.qty + delta} : x).filter(x => x.qty > 0));
  const addCustom = () => {
    addItem({id: `custom-${Date.now()}`, name: `Custom Cake${message.trim() ? ` ("${message.trim()}")` : ''}`, price: customPrice});
    setCartOpen(true); setCheckout(false);
  };
  const submitOrder = event => {
    event.preventDefault();
    if (!cart.length) return toast('Your cart is empty.');
    toast(`Thank you, ${customerName}! Your order has been placed.`);
    setCart([]); setCartOpen(false); setCheckout(false); setCustomerName(''); setAddress('');
  };

  return <>
    <div className="toast-container" aria-live="polite">{toasts.map(t => <div className="toast" key={t.id}>✓ {t.text}</div>)}</div>
    <header><nav className="navbar"><a href="#home" className="logo">🍰 Sweet Layers</a><ul className="nav-links"><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#menu">Menu</a></li><li><a href="#custom">Custom Order</a></li><li><a href="#faq">FAQ</a></li></ul><button className="cart-icon" onClick={() => {setCartOpen(true);setCheckout(false);}}>🛒 Cart <span className="cart-count">{itemCount}</span></button></nav></header>

    <section className="hero" id="home"><h1>Artisanal Cakes Crafted with Passion</h1><p>Handmade daily using organic local ingredients, Belgian chocolates, and fresh seasonal fruits.</p><div><a href="#menu" className="btn">Explore Menu</a><a href="#custom" className="btn btn-secondary">Design Custom Cake</a></div></section>

    <section id="about" className="about-section"><div className="container"><h2>About Our Bakery</h2><p className="about-lead">Crafting artisanal cakes with passion, precision, and the finest local ingredients since 2015.</p><div className="about-grid"><div className="about-card"><h3>Fresh Ingredients</h3><p>We source 100% organic berries, premium Belgian chocolate, and farm-fresh dairy every morning.</p></div><div className="about-card"><h3>Baked Daily</h3><p>Every cake is baked from scratch daily by our master pastry chefs to guarantee maximum quality.</p></div></div></div></section>

    <section id="menu"><h2 className="section-title">Our Signature Collections</h2><p className="section-subtitle">Pick from our freshly baked daily classics or seasonal specials.</p><div className="controls"><input type="text" className="search-box" placeholder="Search cakes..." value={search} onChange={e => setSearch(e.target.value)} /><div className="filters">{filters.map(f => <button key={f} className={`filter-btn ${category === f ? 'active' : ''}`} onClick={() => setCategory(f)}>{f[0].toUpperCase()+f.slice(1)}</button>)}</div></div><div className="catalog">{filteredCakes.length ? filteredCakes.map(cake => <article className="cake-card" key={cake.id}><div className="cake-img-wrapper"><img className="cake-img" src={cake.image} alt={cake.name} onError={e => {e.currentTarget.style.display='none';}}/><div className="dietary-tags">{cake.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div><div className="cake-details"><span className="cake-badge">{cake.category}</span><h3 className="cake-title">{cake.name}</h3><p className="cake-desc">{cake.desc}</p><div className="cake-bottom"><span className="price">{money(cake.price)}</span><button className="btn add-btn" onClick={() => addItem(cake)}>Add to Cart</button></div></div></article>) : <p className="empty-results">No cakes found. Try another search.</p>}</div></section>

    <section id="custom"><h2 className="section-title">Build Your Custom Cake</h2><p className="section-subtitle">Design a personalized cake for your special occasion in real-time.</p><div className="builder-section"><div className="builder-grid"><form onSubmit={e => e.preventDefault()}><div className="form-group"><label htmlFor="cakeSize">Select Size &amp; Servings</label><select id="cakeSize" value={size} onChange={e => setSize(Number(e.target.value))}>{sizes.map(x => <option value={x.value} key={x.value}>{x.label}</option>)}</select></div><div className="form-group"><label htmlFor="cakeFlavor">Sponge Base</label><select id="cakeFlavor" value={flavor} onChange={e => setFlavor(Number(e.target.value))}>{flavors.map((x,i) => <option value={x.value} key={i}>{x.label}</option>)}</select></div><div className="form-group"><label htmlFor="cakeFilling">Filling Layers</label><select id="cakeFilling" value={filling} onChange={e => setFilling(Number(e.target.value))}>{fillings.map((x,i) => <option value={x.value} key={i}>{x.label}</option>)}</select></div><div className="form-group"><label htmlFor="customMessage">Custom Inscription / Pipe Text</label><input id="customMessage" value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g., Happy Birthday Sarah!" /></div></form><div className="custom-summary"><div><h3>Estimated Summary</h3><p style={{marginTop:'1rem',color:'#555'}}>{selectedSize?.short}, {selectedFlavor?.label.split(' (')[0]} Base, {selectedFilling?.label.split(' (')[0]} Filling.</p></div><div><h2 style={{marginBottom:'1rem',color:'var(--primary)'}}>{money(customPrice)}</h2><button type="button" className="btn" style={{width:'100%'}} onClick={addCustom}>Add Custom Order to Cart</button></div></div></div></div></section>

    <section id="faq"><h2 className="section-title">Frequently Asked Questions</h2><p className="section-subtitle">Everything you need to know about our ordering process.</p><div style={{maxWidth:800,margin:'0 auto'}}>{[{q:'How far in advance should I place custom orders?',a:'We recommend placing custom cake orders at least 48 to 72 hours in advance to guarantee availability and specific design requests.'},{q:'Do you offer gluten-free or allergen-safe options?',a:'Yes! We offer specialized Gluten-Free and Nut-Free options. Look for the tags on our catalog menu. Note that all items are baked in a shared kitchen.'},{q:'What is your delivery policy?',a:'We offer local courier delivery within a 15-mile radius for a flat $10 fee, or free store pickup during business hours.'}].map((item,i)=><div className="faq-item" key={item.q}><button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>{item.q}<span>{openFaq === i ? '−' : '+'}</span></button><div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>{item.a}</div></div>)}</div></section>

    {cartOpen && <div className="modal open" onClick={e => {if(e.target === e.currentTarget) setCartOpen(false);}}><div className="modal-content"><button className="close-btn" aria-label="Close cart" onClick={() => setCartOpen(false)}>&times;</button>{!checkout ? <><h2 style={{marginBottom:'1.5rem'}}>Your Shopping Cart</h2><div>{cart.length ? cart.map(item => <div className="cart-item" key={item.id}><div className="cart-item-info"><strong>{item.name}</strong><p>{money(item.price)} each</p></div><div className="qty-controls"><button className="qty-btn" onClick={() => changeQty(item.id,-1)} aria-label="Decrease quantity">−</button><span>{item.qty}</span><button className="qty-btn" onClick={() => changeQty(item.id,1)} aria-label="Increase quantity">+</button></div></div>) : <p>Your cart is empty.</p>}</div><hr style={{margin:'1.5rem 0'}}/><div style={{display:'flex',justifyContent:'space-between',fontWeight:'bold',fontSize:'1.2rem',marginBottom:'1.5rem'}}><span>Total:</span><span>{money(cartTotal)}</span></div><button className="btn" style={{width:'100%'}} onClick={() => cart.length ? setCheckout(true) : toast('Add a cake before checkout.')}>Proceed to Checkout</button></> : <><h2 style={{marginBottom:'1.5rem'}}>Order Details</h2><form onSubmit={submitOrder}><div className="form-group"><label htmlFor="customerName">Full Name</label><input id="customerName" required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe" /></div><div className="form-group"><label htmlFor="address">Delivery Address or Store Pickup</label><input id="address" required value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Bakery Lane or Store Pickup" /></div><div style={{display:'flex',gap:'1rem'}}><button type="button" className="btn btn-secondary" style={{color:'var(--dark)',borderColor:'#ccc',flex:1}} onClick={() => setCheckout(false)}>Back</button><button type="submit" className="btn" style={{flex:2}}>Place Order</button></div></form></>}</div></div>}

    <footer><div className="footer-grid"><div className="footer-col"><a href="#home" className="logo" style={{color:'var(--white)'}}>🍰 Sweet Layers</a><p style={{marginTop:'1rem',color:'#aaa'}}>Artisanal handcrafted cakes for every milestone.</p></div><div className="footer-col"><h4>Quick Links</h4><ul><li><a href="#home">Home</a></li><li><a href="#menu">Menu</a></li><li><a href="#custom">Custom Order</a></li><li><a href="#faq">FAQ</a></li></ul></div><div className="footer-col"><h4>Hours &amp; Contact</h4><ul><li>Mon - Sat: 8:00 AM - 7:00 PM</li><li>Sunday: 9:00 AM - 4:00 PM</li><li>Email: hello@sweetlayersbakery.com</li></ul></div></div><div className="copyright"><p>© 2026 Sweet Layers Bakery. All Rights Reserved.</p></div></footer>
  </>;
}
export default App;
