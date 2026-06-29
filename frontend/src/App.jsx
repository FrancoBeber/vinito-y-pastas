import { useState, useEffect } from 'react';
import './App.css';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Tinto' },
  { id: 2, name: 'Blanco' },
  { id: 3, name: 'Rosado' },
  { id: 4, name: 'Espumante' }
];

const MOCK_WINERIES = [
  'Rutini Wines',
  'Catena Zapata',
  'Luigi Bosca',
  'El Enemigo',
  'Bodega Salentein',
  'Chandon',
  'Escorihuela Gascón'
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Rutini Malbec',
    description: 'Un clásico argentino de color rojo violáceo intenso. Notas de ciruelas maduras, cacao y vainilla aportadas por su crianza en roble francés.',
    price: 12500.00,
    stock: 45,
    category_id: 1,
    category_name: 'Tinto',
    image_url: '/images/rutini_malbec.webp',
    winery: 'Rutini Wines'
  },
  {
    id: '2',
    name: 'Catena Zapata Cabernet Sauvignon',
    description: 'Elegante y complejo, con notas de frutos rojos pequeños, pimienta negra y dejos florales. Excelente estructura en boca con taninos suaves.',
    price: 15200.00,
    stock: 30,
    category_id: 1,
    category_name: 'Tinto',
    image_url: '/images/catena_cabernet.webp',
    winery: 'Catena Zapata'
  },
  {
    id: '3',
    name: 'Luigi Bosca Chardonnay',
    description: 'De color amarillo brillante con reflejos dorados. Destaca por sus aromas a frutos tropicales, miel y un sutil toque de vainilla tostada.',
    price: 9800.00,
    stock: 25,
    category_id: 2,
    category_name: 'Blanco',
    image_url: '/images/luigi_chardonnay.webp',
    winery: 'Luigi Bosca'
  },
  {
    id: '4',
    name: 'El Enemigo Sémillon',
    description: 'Un blanco complejo y expresivo. Combina frescura cítrica con notas de frutos secos, miel y una textura untuosa y elegante.',
    price: 18900.00,
    stock: 15,
    category_id: 2,
    category_name: 'Blanco',
    image_url: '/images/enemigo_semillon.webp',
    winery: 'El Enemigo'
  },
  {
    id: '5',
    name: 'Salentein Reserve Rosé',
    description: 'Rosado de Malbec de color rosa pálido y brillante. Aromas intensos a frutos rojos frescos como cereza y frutilla, con final fresco y floral.',
    price: 8200.00,
    stock: 50,
    category_id: 3,
    category_name: 'Rosado',
    image_url: '/images/salentein_rose.webp',
    winery: 'Bodega Salentein'
  },
  {
    id: '6',
    name: 'Chandon Extra Brut',
    description: 'El espumante insignia de Argentina. De burbujas finas y persistentes, con aromas cítricos y a pan tostado. Fresco y equilibrado.',
    price: 7900.00,
    stock: 60,
    category_id: 4,
    category_name: 'Espumante',
    image_url: '/images/chandon_extra_brut.webp',
    winery: 'Chandon'
  },
  {
    id: '7',
    name: 'D.V. Catena Cabernet-Malbec',
    description: 'Blend de gran complejidad aromática. Se aprecian las notas de frutas negras del Cabernet combinadas con la redondez y frutos dulces del Malbec.',
    price: 14000.00,
    stock: 40,
    category_id: 1,
    category_name: 'Tinto',
    image_url: '/images/dv_catena_blend.webp',
    winery: 'Catena Zapata'
  },
  {
    id: '8',
    name: 'Familia Gascón Sauvignon Blanc',
    description: 'Joven y sumamente fresco. Destacan las notas de ruda, pomelo rosado y hierba recién cortada. Gran acidez y vivacidad.',
    price: 6800.00,
    stock: 35,
    category_id: 2,
    category_name: 'Blanco',
    image_url: '/images/gascon_sauvignon.webp',
    winery: 'Escorihuela Gascón'
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wineries, setWineries] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWinery, setSelectedWinery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Fetch categories and wineries once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await fetch('http://localhost:5000/api/categories');
        if (!catRes.ok) throw new Error();
        const catData = await catRes.json();
        setCategories(catData);

        const winRes = await fetch('http://localhost:5000/api/wineries');
        if (!winRes.ok) throw new Error();
        const winData = await winRes.json();
        setWineries(winData);
      } catch (error) {
        console.warn('Backend offline, usando categorías y bodegas simuladas.');
        setCategories(MOCK_CATEGORIES);
        setWineries(MOCK_WINERIES);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (selectedWinery) queryParams.append('winery', selectedWinery);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        const res = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.warn('Backend offline, filtrando localmente.');
        // Filter locally
        let filtered = [...MOCK_PRODUCTS];
        
        if (search) {
          const lower = search.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower));
        }
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory));
        }
        if (selectedWinery) {
          filtered = filtered.filter(p => p.winery === selectedWinery);
        }
        if (minPrice) {
          filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
        }
        
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    // Debounce product fetches on typing search to prevent excessive API requests
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedWinery, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedWinery('');
    setMinPrice('');
    setMaxPrice('');
  };

  const addToCart = (product) => {
    setCartCount(prev => prev + 1);
    alert(`¡"${product.name}" agregado al carrito! (Simulación)`);
  };


  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-block">
          <img src="/images/logo.webp" alt="Vinito y Pastas Logo" className="logo-img" />
          <div className="logo-text">
            <h1>VINITO <span>y</span> PASTAS</h1>
            <div className="logo-subtitle">Vinos Gourmet</div>
            <div className="logo-slogan">Brindemos por los pequeños grandes momentos</div>
          </div>
        </div>
        <nav>
          <ul className="nav-links">
            <li><a href="#inicio" onClick={(e) => e.preventDefault()}>Inicio</a></li>
            <li><a href="#catalog" className="active">Vinos</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("¡Próximamente más secciones!"); }}>Sobre Nosotros</a></li>
            <li><a href="#experiencias" onClick={(e) => { e.preventDefault(); alert("¡Próximamente más secciones!"); }}>Experiencias</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("¡Próximamente más secciones!"); }}>Contacto</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="header-icon-btn" aria-label="Buscar" onClick={() => alert("Usa el panel de búsqueda lateral")}>🔍</button>
          <button className="header-icon-btn" aria-label="Mi Perfil" onClick={() => alert("Iniciar sesión (Próximamente)")}>👤</button>
          <button className="header-icon-btn cart-indicator" aria-label="Ver carrito">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Cover / Hero Banner */}
      <section className="cover-section">
        <div className="cover-content">
          <h2>Vinos Seleccionados.<br />Momentos Inolvidables.</h2>
          <p>Descubrí nuestra selección de vinos gourmet de las mejores bodegas de Argentina.</p>
          <button className="btn-cover" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
            Ver Colección
          </button>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider">
        <h2>Nuestros Vinos</h2>
      </div>

      {/* Main Catalog Area */}
      <main className="catalog-container" id="catalog">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          {/* Search */}
          <div className="filter-section">
            <h3>Buscador</h3>
            <input 
              type="text" 
              placeholder="Buscar vino..." 
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Tipo de Vino</h3>
            <div className="filter-group">
              <label className="filter-option">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === ''} 
                  onChange={() => setSelectedCategory('')}
                />
                Todos
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === String(cat.id)} 
                    onChange={() => setSelectedCategory(String(cat.id))}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3>Rango de Precio</h3>
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="Min" 
                className="price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Wineries */}
          <div className="filter-section">
            <h3>Bodega</h3>
            <div className="filter-group">
              <label className="filter-option">
                <input 
                  type="radio" 
                  name="winery" 
                  checked={selectedWinery === ''} 
                  onChange={() => setSelectedWinery('')}
                />
                Todas
              </label>
              {wineries.map(winery => (
                <label key={winery} className="filter-option">
                  <input 
                    type="radio" 
                    name="winery" 
                    checked={selectedWinery === winery} 
                    onChange={() => setSelectedWinery(winery)}
                  />
                  {winery}
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button className="btn-clear" onClick={handleClearFilters}>
            Limpiar Filtros
          </button>
        </aside>

        {/* Catalog Grid View */}
        <section className="catalog-view">
          <div className="catalog-header">
            <span className="results-count">
              {loading ? 'Buscando vinos...' : `${products.length} vinos encontrados`}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              Cargando selección de vinos...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              No se encontraron vinos con los filtros seleccionados.
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <article key={product.id} className="wine-card">
                  <div className="wine-card-image">
                    <span className="wine-category-tag">{product.category_name}</span>
                    <img src={product.image_url} alt={product.name} />
                  </div>
                  <div className="wine-info">
                    <span className="wine-winery">{product.winery}</span>
                    <h3 className="wine-title">{product.name}</h3>
                    <p className="wine-desc">{product.description}</p>
                    <div className="wine-footer">
                      <div>
                        <div className="wine-price">${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
                        <div className={`wine-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
                          Stock: {product.stock} unidades
                        </div>
                      </div>
                      <button 
                        className="btn-add-cart" 
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product)}
                      >
                        {product.stock === 0 ? 'Sin Stock' : 'Añadir'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Features Bar */}
      <footer className="features-bar">
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <h4>Envíos a todo el país</h4>
          <p>Recibí tus vinos donde estés.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <h4>Compra 100% segura</h4>
          <p>Protegemos tus datos y tu compra.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🍾</span>
          <h4>Selección exclusiva</h4>
          <p>Vinos gourmet de las mejores bodegas argentinas.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💬</span>
          <h4>Atención personalizada</h4>
          <p>Estamos para ayudarte en lo que necesites.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
