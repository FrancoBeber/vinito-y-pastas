import { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/AuthPage';

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

const MOCK_CAROUSEL = [
  {
    image: 'images/vineyard.png',
    title: 'Vinos de Altura',
    subtitle: 'Descubrí la pureza de los viñedos mendocinos a los pies de los Andes.',
    btnText: 'Explorar Vinos'
  },
  {
    image: 'images/cellar.png',
    title: 'El Arte de la Guarda',
    subtitle: 'Barricas seleccionadas que descansan en silencio para lograr la máxima complejidad.',
    btnText: 'Ver Selección'
  },
  {
    image: 'images/cover.webp',
    title: 'Maridajes Gourmet',
    subtitle: 'El encuentro perfecto entre un gran vino y pastas artesanales.',
    btnText: 'Ver Catálogo'
  }
];

const MOCK_HOMEPAGE_REVIEWS = [
  { author: 'María L.', rating: 5, text: 'Excelente servicio y la selección de vinos es insuperable. El Rutini Malbec llegó impecable y a tiempo.' },
  { author: 'Juan P.', rating: 5, text: 'La combinación de pastas frescas y vinos seleccionados hace que cada cena familiar sea única. Altamente recomendados.' },
  { author: 'Sofía M.', rating: 4, text: 'Muy buena atención y los envíos al interior son rápidos. Compré Chandon para un brindis y todo excelente.' }
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

const getImageUrl = (url) => {
  if (!url) return '';
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${import.meta.env.BASE_URL || '/'}${cleanUrl}`;
};

function App() {
  // Product Detail Route State
  const [selectedProductId, setSelectedProductId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('product');
  });
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vyp_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  // Navigation states
  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('product') ? 'store' : 'home';
  });

  const navigateTo = (view, categoryId = '', wineryName = '') => {
    setSelectedProductId(null);
    setCurrentView(view);
    setSelectedCategory(categoryId);
    setSelectedWinery(wineryName);
    // Clear other search filters when navigating
    if (view === 'home') {
      setSearch('');
      setSelectedWinery('');
      setMinPrice('');
      setMaxPrice('');
    }
    // Clean URL query parameters
    window.history.pushState(null, '', window.location.pathname);
  };

  // Homepage Carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [homeReviewIndex, setHomeReviewIndex] = useState(0);

  // Auto-play carousels
  useEffect(() => {
    if (currentView !== 'home' || selectedProductId) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % MOCK_CAROUSEL.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentView, selectedProductId]);

  useEffect(() => {
    if (currentView !== 'home' || selectedProductId) return;
    const interval = setInterval(() => {
      setHomeReviewIndex(prev => (prev + 1) % MOCK_HOMEPAGE_REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentView, selectedProductId]);

  // Set review author name if user logs in
  useEffect(() => {
    if (user && user.name) {
      setReviewName(user.name);
    }
  }, [user]);

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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vinosOpen, setVinosOpen] = useState(true);
  const [bodegasOpen, setBodegasOpen] = useState(false);
  const [cuentaOpen, setCuentaOpen] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('vyp_user', JSON.stringify(userData));
    setCurrentView('store');
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('vyp_user');
    setSidebarOpen(false);
  };

  // Fetch categories and wineries once on mount
  useEffect(() => {
    if (currentView === 'auth') return;
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
  }, [currentView]);

  // Fetch filtered products when filters change
  useEffect(() => {
    if (currentView === 'auth') return;
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
  }, [search, selectedCategory, selectedWinery, minPrice, maxPrice, currentView]);

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

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownOpen && !e.target.closest('.user-profile-container')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [profileDropdownOpen]);

  // Fetch details and reviews if on the single product page
  useEffect(() => {
    if (!selectedProductId) return;
    const fetchSingleProduct = async () => {
      setDetailLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${selectedProductId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDetailProduct(data);

        // Fetch reviews
        const revRes = await fetch(`http://localhost:5000/api/products/${selectedProductId}/reviews`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData);
        }
      } catch (err) {
        console.warn('Backend offline o error, buscando en productos simulados.');
        const mock = MOCK_PRODUCTS.find(p => p.id === selectedProductId);
        if (mock) {
          setDetailProduct(mock);
          // Default mock reviews
          setReviews([
            {
              id: 'mock-1',
              author_name: 'Carlos M.',
              rating: 5,
              comment: 'Excelente vino, gran cuerpo y notas aromáticas exquisitas. Altamente recomendado.',
              created_at: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
              id: 'mock-2',
              author_name: 'Valeria R.',
              rating: 4,
              comment: 'Muy rico vino y excelente presentación. Ideal para regalar.',
              created_at: new Date(Date.now() - 86400000 * 5).toISOString()
            }
          ]);
        } else {
          setDetailError('El vino seleccionado no fue encontrado.');
        }
      } finally {
        setDetailLoading(false);
      }
    };
    fetchSingleProduct();
  }, [selectedProductId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewRating) {
      alert('Por favor, ingresa tu nombre y una calificación.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${selectedProductId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
          user_id: user ? user.id : null
        })
      });

      if (!res.ok) throw new Error();
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
      alert('¡Gracias por dejar tu reseña!');
    } catch (err) {
      console.warn('Error al guardar la reseña en el servidor, agregando de forma local.');
      const localReview = {
        id: `local-${Date.now()}`,
        author_name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        created_at: new Date().toISOString()
      };
      setReviews(prev => [localReview, ...prev]);
      setReviewComment('');
      alert('Reseña agregada localmente (Simulación)');
    }
  };

  // Product Detail rendering handled inline in main shell

  // If view is auth, render the auth page
  if (currentView === 'auth') {
    return <AuthPage onLogin={handleLogin} onBack={() => setCurrentView('store')} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar Navigation */}
      <nav className={`sidebar-nav ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={getImageUrl('images/logo.webp')} alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand">Vinito y Pastas</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">✕</button>
        </div>

        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); navigateTo('home'); setSidebarOpen(false); }}>
              <span className="sidebar-icon">🏠</span>Inicio
            </a>
          </li>

          <li className="sidebar-item has-submenu">
            <a href="#vinos" onClick={(e) => { e.preventDefault(); setVinosOpen(!vinosOpen); }}>
              <span className="sidebar-icon">🍷</span>Vinos
              <span className={`submenu-arrow ${vinosOpen ? 'open' : ''}`}>›</span>
            </a>
            {vinosOpen && (
              <ul className="sidebar-submenu">
                <li><a href="#todos-vinos" onClick={(e) => { e.preventDefault(); navigateTo('store', '', ''); setSidebarOpen(false); }}>Ver Todos</a></li>
                <li><a href="#tintos" onClick={(e) => { e.preventDefault(); navigateTo('store', '1', ''); setSidebarOpen(false); }}>Tintos</a></li>
                <li><a href="#blancos" onClick={(e) => { e.preventDefault(); navigateTo('store', '2', ''); setSidebarOpen(false); }}>Blancos</a></li>
                <li><a href="#rosados" onClick={(e) => { e.preventDefault(); navigateTo('store', '3', ''); setSidebarOpen(false); }}>Rosados</a></li>
                <li><a href="#espumantes" onClick={(e) => { e.preventDefault(); navigateTo('store', '4', ''); setSidebarOpen(false); }}>Espumantes</a></li>
              </ul>
            )}
          </li>

          <li className="sidebar-item has-submenu">
            <a href="#bodegas" onClick={(e) => { e.preventDefault(); setBodegasOpen(!bodegasOpen); }}>
              <span className="sidebar-icon">🏛️</span>Bodegas
              <span className={`submenu-arrow ${bodegasOpen ? 'open' : ''}`}>›</span>
            </a>
            {bodegasOpen && (
              <ul className="sidebar-submenu">
                <li><a href="#todas-bodegas" onClick={(e) => { e.preventDefault(); navigateTo('store', '', ''); setSidebarOpen(false); }}>Ver Todas</a></li>
                {wineries.map(winery => (
                  <li key={winery}>
                    <a href={`#${winery.replace(/\s+/g, '-').toLowerCase()}`} onClick={(e) => { e.preventDefault(); navigateTo('store', '', winery); setSidebarOpen(false); }}>
                      {winery}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="sidebar-item">
            <a href="#combos" onClick={(e) => { e.preventDefault(); alert('¡Próximamente!'); }}>
              <span className="sidebar-icon">🎁</span>Combos y Regalos
            </a>
          </li>

          <li className="sidebar-item">
            <a href="#ofertas" onClick={(e) => { e.preventDefault(); navigateTo('home'); setSidebarOpen(false); setTimeout(() => { document.querySelector('.section-divider')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>
              <span className="sidebar-icon">🏷️</span>Ofertas
            </a>
          </li>

          <li className="sidebar-item">
            <a href="#favoritos" onClick={(e) => { e.preventDefault(); alert('¡Próximamente!'); }}>
              <span className="sidebar-icon">❤️</span>Favoritos
            </a>
          </li>

          <li className="sidebar-item has-submenu">
            <a href="#cuenta" onClick={(e) => { e.preventDefault(); setCuentaOpen(!cuentaOpen); }}>
              <span className="sidebar-icon">👤</span>Mi Cuenta
              <span className={`submenu-arrow ${cuentaOpen ? 'open' : ''}`}>›</span>
            </a>
            {cuentaOpen && (
              <ul className="sidebar-submenu">
                <li><a href="#pedidos" onClick={(e) => { e.preventDefault(); alert('¡Próximamente!'); }}>Mis pedidos</a></li>
                <li><a href="#direcciones" onClick={(e) => { e.preventDefault(); alert('¡Próximamente!'); }}>Mis direcciones</a></li>
                <li><a href="#misfavoritos" onClick={(e) => { e.preventDefault(); alert('¡Próximamente!'); }}>Mis favoritos</a></li>
                {user ? (
                  <li><a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Cerrar sesión</a></li>
                ) : (
                  <li>
                    <a href="#login" onClick={(e) => { e.preventDefault(); setCurrentView('auth'); setSidebarOpen(false); }}>
                      Iniciar sesión / Registrarse
                    </a>
                  </li>
                )}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Top Header Bar */}
      <header className="app-header">
        <div className="header-left">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
            <span></span><span></span><span></span>
          </button>
          <div className="logo-block" style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <img src={getImageUrl('images/logo.webp')} alt="Vinito y Pastas Logo" className="logo-img" />
            <div className="logo-text">
              <h1>VINITO <span>y</span> PASTAS</h1>
              <div className="logo-subtitle">Vinos Gourmet</div>
              <div className="logo-slogan">Brindemos por los pequeños grandes momentos</div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-icon-btn" aria-label="Buscar" onClick={() => alert("Usa el panel de búsqueda lateral")}>🔍</button>
          
          {/* Dropdown Container */}
          <div className="user-profile-container">
            <button className="header-icon-btn user-greeting" aria-label="Mi Perfil" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              👤 {user && <span className="user-name-badge">{user.name?.split(' ')[0]}</span>}
            </button>
            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  {user ? (
                    <>
                      <div className="profile-user-name">{user.name}</div>
                      <div className="profile-user-email">{user.email}</div>
                    </>
                  ) : (
                    <div className="profile-guest-title">Invitado</div>
                  )}
                </div>
                <div className="profile-dropdown-divider" />
                <ul className="profile-dropdown-list">
                  <li><a href="#pedidos" onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); alert('¡Próximamente!'); }}>Mis pedidos</a></li>
                  <li><a href="#direcciones" onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); alert('¡Próximamente!'); }}>Mis direcciones</a></li>
                  <li><a href="#misfavoritos" onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); alert('¡Próximamente!'); }}>Mis favoritos</a></li>
                  <div className="profile-dropdown-divider" />
                  {user ? (
                    <li>
                      <a href="#logout" className="profile-logout-btn" onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); handleLogout(); }}>
                        Cerrar sesión
                      </a>
                    </li>
                  ) : (
                    <li>
                      <a href="#login" className="profile-login-btn" onClick={(e) => { e.preventDefault(); setProfileDropdownOpen(false); setCurrentView('auth'); }}>
                        Iniciar sesión / Registrarse
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <button className="header-icon-btn cart-indicator" aria-label="Ver carrito">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>


      {/* Section Divider for views other than Home */}
      {!selectedProductId && currentView !== 'home' && (
        <div className="section-divider">
          <h2>Nuestros Vinos</h2>
        </div>
      )}

      {/* Main Content Area */}
      {selectedProductId ? (
        <main className="detail-container">
          {detailLoading ? (
            <div className="detail-loading-state">
              <div className="loading-spinner"></div>
              Cargando detalles del vino...
            </div>
          ) : detailError || !detailProduct ? (
            <div className="detail-empty-state">
              <h2>Error</h2>
              <p>{detailError || 'Vino no encontrado'}</p>
              <a 
                href={`${window.location.pathname}`} 
                className="btn-back-catalog"
                onClick={(e) => { e.preventDefault(); navigateTo('store'); }}
              >
                Volver al catálogo
              </a>
            </div>
          ) : (
            <div className="detail-view-layout">
              <a 
                href={`${window.location.pathname}`}
                className="detail-breadcrumb"
                onClick={(e) => { e.preventDefault(); navigateTo('store'); }}
              >
                ← Volver al catálogo
              </a>

              <div className="product-detail-content">
                {/* Product Image */}
                <div className="product-detail-image-box">
                  <span className="detail-category-tag">
                    {detailProduct.category_name || (detailProduct.category_id === 1 ? 'Tinto' : detailProduct.category_id === 2 ? 'Blanco' : detailProduct.category_id === 3 ? 'Rosado' : 'Espumante')}
                  </span>
                  <img src={getImageUrl(detailProduct.image_url)} alt={detailProduct.name} />
                </div>

                {/* Product Details Block */}
                <div className="product-detail-info-box">
                  <span className="detail-winery">{detailProduct.winery}</span>
                  <h1 className="detail-title">{detailProduct.name}</h1>
                  <p className="detail-desc">{detailProduct.description}</p>
                  
                  <div className="detail-divider"></div>
                  
                  <div className="detail-price-stock">
                    <div>
                      <div className="detail-price">
                        ${parseFloat(detailProduct.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`detail-stock ${detailProduct.stock <= 5 ? 'low-stock' : ''}`}>
                        Stock disponible: {detailProduct.stock} unidades
                      </div>
                    </div>
                  </div>

                  <div className="detail-actions">
                    <button 
                      className="btn-detail-add"
                      disabled={detailProduct.stock === 0}
                      onClick={() => addToCart(detailProduct)}
                    >
                      {detailProduct.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                    </button>
                    <a 
                      href={`${window.location.pathname}`}
                      className="btn-back-catalog"
                      onClick={(e) => { e.preventDefault(); navigateTo('store'); }}
                    >
                      Volver al catálogo
                    </a>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <section className="product-reviews-container">
                <h2 className="reviews-section-title">Reseñas de Clientes</h2>
                
                <div className="reviews-layout">
                  {/* Reviews List */}
                  <div className="reviews-list-block">
                    {reviews.length === 0 ? (
                      <div className="no-reviews-state">
                        Aún no hay opiniones para este vino. ¡Dejá tu reseña más abajo!
                      </div>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="review-card-item">
                          <div className="review-card-header">
                            <span className="review-card-author">{review.author_name}</span>
                            <span className="review-card-rating">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                            <span className="review-card-date">
                              {new Date(review.created_at).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="review-card-comment">{review.comment}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="add-review-form-block">
                    <form onSubmit={handleReviewSubmit} className="add-review-form">
                      <h3>Dejar una Reseña</h3>
                      
                      <div className="review-form-group">
                        <label htmlFor="review-author">Nombre</label>
                        <input 
                          type="text" 
                          id="review-author"
                          placeholder="Tu nombre..."
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                        />
                      </div>

                      <div className="review-form-group">
                        <label>Calificación</label>
                        <div className="rating-selector-stars">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button
                              type="button"
                              key={num}
                              className={`star-btn ${reviewRating >= num ? 'star-filled' : 'star-empty'}`}
                              onClick={() => setReviewRating(num)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="review-form-group">
                        <label htmlFor="review-comment">Comentario</label>
                        <textarea 
                          id="review-comment"
                          rows="4"
                          placeholder="¿Qué te pareció este vino?..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn-submit-review">
                        Enviar Opinión
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      ) : currentView === 'home' ? (
        <main className="home-container">
          {/* Hero Carousel */}
          <section className="home-carousel">
            {MOCK_CAROUSEL.map((slide, idx) => (
              <div 
                key={idx} 
                className={`carousel-slide ${carouselIndex === idx ? 'active' : ''}`}
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${getImageUrl(slide.image)})` }}
              >
                <div className="carousel-content">
                  <h2 className="carousel-title">{slide.title}</h2>
                  <p className="carousel-subtitle">{slide.subtitle}</p>
                  <button className="btn-carousel" onClick={() => navigateTo('store')}>
                    {slide.btnText}
                  </button>
                </div>
              </div>
            ))}
            
            {/* Carousel dots */}
            <div className="carousel-dots">
              {MOCK_CAROUSEL.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`dot ${carouselIndex === idx ? 'active' : ''}`}
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Section Divider */}
          <div className="section-divider">
            <h2>Ofertas Destacadas</h2>
          </div>

          {/* Ofertas Grid */}
          <section className="home-offers-grid">
            <div className="products-grid">
              {(products.length > 0 ? products : MOCK_PRODUCTS).slice(0, 3).map(product => {
                const discountPrice = parseFloat(product.price);
                const originalPrice = discountPrice * 1.15;
                return (
                  <article 
                    key={product.id} 
                    className="wine-card"
                    onClick={(e) => {
                      if (e.target.closest('.btn-add-cart')) return;
                      const url = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
                      window.open(url, '_blank');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wine-card-image">
                      <span className="wine-category-tag offer-badge">OFERTA 15% OFF</span>
                      <img src={getImageUrl(product.image_url)} alt={product.name} />
                    </div>
                    <div className="wine-info">
                      <span className="wine-winery">{product.winery}</span>
                      <h3 className="wine-title">{product.name}</h3>
                      <p className="wine-desc">{product.description}</p>
                      <div className="wine-footer">
                        <div>
                          <div className="wine-price-discount-group">
                            <span className="original-price-crossed">${originalPrice.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                            <span className="wine-price-offer">${discountPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                          </div>
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
                );
              })}
            </div>
          </section>

          {/* Section Divider */}
          <div className="section-divider">
            <h2>Novedades y Eventos</h2>
          </div>

          {/* Novedades Block */}
          <section className="home-news-section">
            <div className="news-grid">
              <div className="news-card">
                <div className="news-img-box">
                  <img src={getImageUrl('images/catena_cabernet.webp')} alt="Cosechas nuevas" />
                </div>
                <div className="news-info">
                  <h3>Nuevas Añadas Exclusivas</h3>
                  <p>Llegaron las cosechas más esperadas del año de Catena Zapata y El Enemigo. Añadas excepcionales con puntuaciones sobresalientes de críticos internacionales, ideales para coleccionistas.</p>
                </div>
              </div>
              <div className="news-card">
                <div className="news-img-box">
                  <img src={getImageUrl('images/luigi_chardonnay.webp')} alt="Cata de vinos" />
                </div>
                <div className="news-info">
                  <h3>Catas Privadas en Cava</h3>
                  <p>Formá parte de nuestros encuentros mensuales de degustación dirigidos por destacados sommeliers. Una oportunidad única para aprender sobre maridaje, notas de cata y la historia de las bodegas.</p>
                </div>
              </div>
              <div className="news-card">
                <div className="news-img-box">
                  <img src={getImageUrl('images/salentein_rose.webp')} alt="Vinos y Pastas" />
                </div>
                <div className="news-info">
                  <h3>Maridajes y Pastas del Chef</h3>
                  <p>Descubrí el secreto culinario de combinar pastas de sémola de trigo candeal con vinos de guarda. Te aconsejamos la mejor opción para realzar cada salsa y textura.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="section-divider">
            <h2>Opiniones de Nuestros Clientes</h2>
          </div>

          {/* Reviews Carousel */}
          <section className="home-reviews-carousel">
            <div className="reviews-carousel-container">
              {MOCK_HOMEPAGE_REVIEWS.map((rev, idx) => (
                <div 
                  key={idx} 
                  className={`home-review-slide ${homeReviewIndex === idx ? 'active' : ''}`}
                >
                  <div className="home-review-stars">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="home-review-text">"{rev.text}"</p>
                  <span className="home-review-author">— {rev.author}</span>
                </div>
              ))}
            </div>
            
            {/* Reviews dots */}
            <div className="carousel-dots">
              {MOCK_HOMEPAGE_REVIEWS.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`dot ${homeReviewIndex === idx ? 'active' : ''}`}
                  onClick={() => setHomeReviewIndex(idx)}
                  aria-label={`Ir a reseña ${idx + 1}`}
                />
              ))}
            </div>
          </section>
        </main>
      ) : (
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
                <article 
                  key={product.id} 
                  className="wine-card"
                  onClick={(e) => {
                    // Prevent opening detail page when clicking Add to Cart
                    if (e.target.closest('.btn-add-cart')) return;
                    const url = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
                    window.open(url, '_blank');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="wine-card-image">
                    <span className="wine-category-tag">{product.category_name}</span>
                    <img src={getImageUrl(product.image_url)} alt={product.name} />
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
      )}

      {/* Bottom Features Bar */}
      <footer className="features-bar">
        <div className="features-row">
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
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://wa.me/5491100000000?text=Hola!%20Quiero%20consultar%20sobre%20los%20vinos" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

        <div className="footer-copy">
          <p>© 2026 Vinito y Pastas — Vinos Gourmet. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5491100000000?text=Hola!%20Quiero%20consultar%20sobre%20los%20vinos"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chatear por WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );
}

export default App;
