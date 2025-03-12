import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import TweetList from './components/TweetList.tsx';
import TweetDetail from './components/TweetDetails.tsx';
import Profile from './components/Profile.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';

// Composant pour le menu latéral qui utilise le useLocation
function SidebarMenu() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Fonction pour déterminer si une route est active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') {
      return true;
    }
    return path !== '/' && currentPath.startsWith(path);
  };

  return (
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/" className={`mb-2 ${isActive('/') ? 'fw-bold' : ''}`}>
        <i className={`bi ${isActive('/') ? 'bi-house-door-fill' : 'bi-house-door'} ipssi-icon`}></i> Accueil
      </Nav.Link>
      <Nav.Link as={Link} to="/notifications" className={`mb-2 ${isActive('/notifications') ? 'fw-bold' : ''}`}>
        <i className={`bi ${isActive('/notifications') ? 'bi-bell-fill' : 'bi-bell'} ipssi-icon`}></i> Notifications
        <Badge bg="danger" className="ms-2">5</Badge>
      </Nav.Link>
      <Nav.Link as={Link} to="/bookmarks" className={`mb-2 ${isActive('/bookmarks') ? 'fw-bold' : ''}`}>
        <i className={`bi ${isActive('/bookmarks') ? 'bi-bookmark-fill' : 'bi-bookmark'} ipssi-icon`}></i> Signets
      </Nav.Link>
      <Nav.Link as={Link} to="/profile" className={`mb-2 ${isActive('/profile') ? 'fw-bold' : ''}`}>
        <i className={`bi ${isActive('/profile') ? 'bi-person-fill' : 'bi-person'} ipssi-icon`}></i> Profil
      </Nav.Link>
      
      <Button 
        variant="primary" 
        className="ipssi-btn-primary ipssi-post-btn mt-3 w-100"
      >
        Publier
      </Button>
    </Nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Fonction pour obtenir le titre de la page en fonction de l'URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Accueil';
    if (path === '/profile') return 'Profil';
    if (path === '/notifications') return 'Notifications';
    if (path === '/bookmarks') return 'Signets';
    if (path === '/login') return 'Connexion';
    if (path === '/register') return 'Inscription';
    if (path.startsWith('/tweet/')) return 'Tweet';
    return 'TwippsI.A';
  };

  const customStyles = `
    :root {
      --ipssi-blue: #15202b;
      --ipssi-light-blue: #1DA1F2;
      --ipssi-text: #ffffff;
      --ipssi-border: #38444d;
      --ipssi-bg: #192734;
    }
    
    /* Thème sombre (par défaut) */
    .theme-dark {
      --ipssi-bg-primary: #15202b;
      --ipssi-bg-secondary: #192734;
      --ipssi-text-primary: #ffffff;
      --ipssi-text-secondary: #8899a6;
      --ipssi-border-color: #38444d;
      --ipssi-highlight: #1DA1F2;
      --ipssi-card-bg: #22303c;
    }
    
    /* Thème clair */
    .theme-light {
      --ipssi-bg-primary: #ffffff;
      --ipssi-bg-secondary: #f7f9fa;
      --ipssi-text-primary: #14171a;
      --ipssi-text-secondary: #657786;
      --ipssi-border-color: #e1e8ed;
      --ipssi-highlight: #1DA1F2;
      --ipssi-card-bg: #ffffff;
    }
    
    body {
      background-color: var(--ipssi-bg-secondary);
      color: var(--ipssi-text-primary);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .ipssi-navbar {
      background-color: var(--ipssi-bg-primary) !important;
      color: var(--ipssi-text-primary);
      border-bottom: 1px solid var(--ipssi-border-color);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .ipssi-navbar .navbar-brand {
      color: var(--ipssi-text-primary);
      font-weight: bold;
    }
    
    .ipssi-btn-primary {
      background-color: var(--ipssi-highlight);
      border-color: var(--ipssi-highlight);
    }
    
    .ipssi-btn-outline {
      color: var(--ipssi-highlight);
      border-color: var(--ipssi-highlight);
    }
    
    .ipssi-sidebar {
      background-color: var(--ipssi-bg-primary);
      border-right: 1px solid var(--ipssi-border-color);
      transition: background-color 0.3s ease;
    }
    
    .ipssi-sidebar .nav-link {
      color: var(--ipssi-text-primary);
      font-size: 18px;
      padding: 12px 16px;
      border-radius: 30px;
      margin-bottom: 8px;
    }
    
    .ipssi-sidebar .nav-link:hover {
      background-color: rgba(29, 161, 242, 0.1);
    }
    
    .ipssi-sidebar .nav-link.fw-bold {
      color: var(--ipssi-highlight);
    }
    
    .ipssi-main {
      background-color: var(--ipssi-bg-secondary);
      border-left: 1px solid var(--ipssi-border-color);
      border-right: 1px solid var(--ipssi-border-color);
      transition: background-color 0.3s ease;
    }
    
    .ipssi-search {
      background-color: var(--ipssi-bg-secondary);
      border-radius: 20px;
      border: 1px solid var(--ipssi-border-color);
      color: var(--ipssi-text-primary);
    }
    
    .ipssi-post-btn {
      border-radius: 30px;
      padding: 10px 20px;
      font-weight: bold;
    }
    
    .ipssi-icon {
      font-size: 24px;
      margin-right: 10px;
    }
    
    .trend-card {
      background-color: var(--ipssi-card-bg);
      border: 1px solid var(--ipssi-border-color);
      transition: background-color 0.3s ease;
    }
    
    /* Correction pour le texte secondaire selon le thème */
    .theme-text-secondary {
      color: var(--ipssi-text-secondary) !important;
    }
    
    /* Icônes pour le sélecteur de thème */
    .theme-toggle-icon {
      font-size: 20px;
      cursor: pointer;
    }
  `;

  return (
    <>
      {/* Injecter les styles personnalisés */}
      <style>{customStyles}</style>
      
      {/* Barre de navigation */}
      <Navbar expand="lg" className="ipssi-navbar px-3 shadow-sm">
        <Navbar.Brand as={Link} to="/">
          <span className="fs-4">𝕀</span> TwippsI.A
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto">
            <FormControl 
              type="search" 
              placeholder="Rechercher sur IPSSI" 
              className="me-2 ipssi-search" 
            />
            <Button variant="outline-primary" className="ipssi-btn-outline rounded-circle">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
          <div className="d-flex align-items-center">
            {/* Bouton de toggle du thème */}
            <Button 
              variant="link" 
              className="me-3 p-1" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Passer au mode jour' : 'Passer au mode nuit'}
            >
              {theme === 'dark' ? (
                <i className="bi bi-sun-fill theme-toggle-icon text-warning"></i>
              ) : (
                <i className="bi bi-moon-fill theme-toggle-icon text-primary"></i>
              )}
            </Button>
            
            <Button as={Link} to="/login" variant="outline-primary" className="me-2 ipssi-btn-outline">
              Se connecter
            </Button>
            <Button as={Link} to="/register" variant="primary" className="ipssi-btn-primary">
              S'inscrire
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Menu latéral avec le composant SidebarMenu */}
          <Col md={3} className="ipssi-sidebar vh-100 p-4">
            <SidebarMenu />
          </Col>
          
          {/* Contenu principal */}
          <Col md={6} className="ipssi-main p-0">
            <div className="border-bottom p-3">
              <h5 className="mb-0 fw-bold">{getPageTitle()}</h5>
            </div>
            <div className="p-3">
              {children}
            </div>
          </Col>
          
          {/* Colonne de tendances (comme sur Twitter) */}
          <Col md={3} className="p-3">
            <div className="trend-card rounded p-3 mb-3">
              <h6 className="mb-3 fw-bold">Tendances pour vous</h6>
              <div className="mb-3">
                <small className="theme-text-secondary">Tendance en France</small>
                <p className="mb-0 fw-bold">#IPSSI2025</p>
                <small className="theme-text-secondary">8 542 posts</small>
              </div>
              <div className="mb-3">
                <small className="theme-text-secondary">Technologie · Tendance</small>
                <p className="mb-0 fw-bold">React.js</p>
                <small className="theme-text-secondary">5 234 posts</small>
              </div>
              <div className="mb-3">
                <small className="theme-text-secondary">Éducation</small>
                <p className="mb-0 fw-bold">École IPSSI</p>
                <small className="theme-text-secondary">3 128 posts</small>
              </div>
            </div>
            
            <div className="trend-card rounded p-3">
              <h6 className="mb-3 fw-bold">Suggestions</h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-2">
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">IPSSI Paris</p>
                    <small className="theme-text-secondary">@ipssi_paris</small>
                  </div>
                </div>
                <Button size="sm" variant="primary" className="ipssi-btn-primary rounded-pill">Suivre</Button>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-2">
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">IPSSI Tech</p>
                    <small className="theme-text-secondary">@ipssi_tech</small>
                  </div>
                </div>
                <Button size="sm" variant="primary" className="ipssi-btn-primary rounded-pill">Suivre</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><TweetList /></Layout>} />
        <Route path='/login' element={<Layout><LoginForm /></Layout>} />
        <Route path='/register' element={<Layout><RegisterForm /></Layout>} />
        <Route path='/profile' element={<Layout><Profile /></Layout>} />
        <Route path='/tweet/:tweetId' element={<Layout><TweetDetail /></Layout>} />
        <Route path='/notifications' element={<Layout><div>Notifications</div></Layout>} />
        <Route path='/bookmarks' element={<Layout><div>Signets</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;