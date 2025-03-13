import { BrowserRouter, Routes, Route, Link, useParams, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import TweetList from './components/TweetList.tsx';
import TweetDetail from './components/TweetDetails.tsx';
import Profile from './components/Profile.tsx';
import ProfileEdit from './components/ProfileEdit.tsx';
import BookmarksList from './components/BookmarksList.tsx';
import LogoutButton from './components/LogoutButton.tsx';
import SearchResults from './components/SearchTweet.tsx';
import Notifications from './components/Notifications.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';

function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  const [anger, setAnger] = useState(0);
  const [joy, setJoy] = useState(0);
  const [sadness, setSadness] = useState(0);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]); // Réexécuter quand l'URL change pour mettre à jour l'état d'authentification

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fonction pour obtenir le titre de la page
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Accueil';
      case '/notifications': return 'Notifications';
      case '/bookmarks': return 'Signets';
      case '/profile': return 'Profil';
      case '/login': return 'Connexion';
      case '/register': return 'Inscription';
      default: 
        if (location.pathname.startsWith('/tweet/')) return 'Tweet';
        return 'Accueil';
    }
  };

  // Fonction pour générer des émotions aléatoires
  const generateEmotions = () => {
    const newAnger = Math.floor(Math.random() * 100);
    const newJoy = Math.floor(Math.random() * 100);
    const newSadness = Math.floor(Math.random() * 100);

    // Normaliser pour que la somme fasse 100
    const total = newAnger + newJoy + newSadness;
    setAnger(Math.round((newAnger / total) * 100));
    setJoy(Math.round((newJoy / total) * 100));
    setSadness(Math.round((newSadness / total) * 100));
  };

  // Mettre à jour les émotions toutes les 5 secondes
  useEffect(() => {
    generateEmotions(); // Initialiser les émotions au premier rendu
    const interval = setInterval(generateEmotions, 5000); // Mettre à jour toutes les 5 secondes
    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage
  }, []);

  // Gestion du thème
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    
    .ipssi-sidebar .nav-link.active {
      color: var(--ipssi-highlight);
      background-color: rgba(29, 161, 242, 0.1);
      font-weight: bold;
    }
    
    .ipssi-sidebar .nav-link.active i {
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
    
    .theme-text-secondary {
      color: var(--ipssi-text-secondary) !important;
    }
    
    .theme-toggle-icon {
      font-size: 20px;
      cursor: pointer;
    }
    
    .mood-control {
      background-color: var(--ipssi-card-bg);
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
    }

    .mood-control .mood-emotion {
      font-size: 36px;
    }
    
    .mood-control .mood-bar {
      margin-top: 10px;
    }
    
    .mood-control .mood-bar span {
      font-size: 14px;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      
      <Navbar expand="lg" className="ipssi-navbar px-3 shadow-sm">
        <Navbar.Brand as={Link} to="/">
          <span className="fs-4">𝕀</span> TwippsI.A
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form className="d-flex mx-auto" onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input');
          const term = input?.value?.trim();
          if (term) {
            navigate(`/search/${encodeURIComponent(term)}`);
          }
        }}>
          <FormControl 
            type="search" 
            placeholder="Rechercher sur IPSSI" 
            className="me-2 ipssi-search" 
          />
          <Button variant="outline-primary" type="submit" className="ipssi-btn-outline rounded-circle">
            <i className="bi bi-search"></i>
          </Button>
        </Form>
          <div className="d-flex align-items-center">
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
            
            {isAuthenticated ? (
              // Afficher le bouton de déconnexion si l'utilisateur est authentifié
              <LogoutButton />
            ) : (
              // Afficher les boutons de connexion et d'inscription si l'utilisateur n'est pas authentifié
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2 ipssi-btn-outline">
                  Se connecter
                </Button>
                <Button as={Link} to="/register" variant="primary" className="ipssi-btn-primary">
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={2} className="ipssi-sidebar vh-100 p-4">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className={`mb-2 ${isActive('/') ? 'active' : ''}`}>
                <i className={`bi ${isActive('/') ? 'bi-house-door-fill' : 'bi-house-door'} ipssi-icon`}></i> Accueil
              </Nav.Link>
              <Nav.Link as={Link} to="/notifications" className={`mb-2 ${isActive('/notifications') ? 'active' : ''}`}>
                <i className={`bi ${isActive('/notifications') ? 'bi-bell-fill' : 'bi-bell'} ipssi-icon`}></i> Notifications
              </Nav.Link>
              <Nav.Link as={Link} to="/bookmarks" className={`mb-2 ${isActive('/bookmarks') ? 'active' : ''}`}>
                <i className={`bi ${isActive('/bookmarks') ? 'bi-bookmark-fill' : 'bi-bookmark'} ipssi-icon`}></i> Signets
              </Nav.Link>
              <Nav.Link as={Link} to="/profile" className={`mb-2 ${isActive('/profile') ? 'active' : ''}`}>
                <i className={`bi ${isActive('/profile') ? 'bi-person-fill' : 'bi-person'} ipssi-icon`}></i> Profil
              </Nav.Link>
            </Nav>
          </Col>
          
          <Col md={8} className="ipssi-main p-0">
            <div className="border-bottom p-3">
              <h5 className="mb-0 fw-bold">{getPageTitle()}</h5>
            </div>
            <div className="p-3">
              {children}
            </div>
          </Col>
          
          <Col md={2} className="p-3">
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
            
            {/* Mood Control */}
            <div className="mood-control">
              <h6 className="mb-3 fw-bold">Contrôleur d'Humeur</h6>
              <div className="mood-emotion">
                <span>😡</span> Colère: <span id="anger">{anger}%</span>
                <br />
                <span>😊</span> Joie: <span id="joy">{joy}%</span>
                <br />
                <span>😢</span> Tristesse: <span id="sadness">{sadness}%</span>
              </div>
              <div className="mood-bar">
                <div className="progress">
                  <div  
                    className="progress-bar bg-danger"
                    style={{ width: `${anger}%` }}
                    role="progressbar"
                  ></div>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${joy}%` }}
                    role="progressbar"
                  ></div>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${sadness}%` }}
                    role="progressbar"
                  ></div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

// Composant pour protéger les routes qui nécessitent une authentification
function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route path='/register' element={<RegisterForm />} />
              <Route path='/' element={
                <ProtectedRoute>
                  <TweetList />
                </ProtectedRoute>
              } />
              <Route path='/tweet/:tweetId' element={
                <ProtectedRoute>
                  <TweetDetail />
                </ProtectedRoute>
              } />
              <Route path='/search/:searchQuery' element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } />
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path='/profile/:username' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path='/profile/edit' element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              } />
              <Route path='/bookmarks' element={
                <ProtectedRoute>
                  <BookmarksList />
                </ProtectedRoute>
              } />
              <Route path='/notifications' element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;