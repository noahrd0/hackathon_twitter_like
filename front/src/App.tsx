import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import TweetList from './components/TweetList.tsx';
import TweetDetail from './components/TweetDetails.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';

// Styles personnalisés pour imiter Twitter
const customStyles = `
  :root {
    --ipssi-blue: #15202b;
    --ipssi-light-blue: #1DA1F2;
    --ipssi-text: #ffffff;
    --ipssi-border: #38444d;
    --ipssi-bg: #192734;
  }
  
  body {
    background-color: var(--ipssi-bg);
    color: var(--ipssi-text);
  }
  
  .ipssi-navbar {
    background-color: var(--ipssi-blue) !important;
    color: var(--ipssi-text);
    border-bottom: 1px solid var(--ipssi-border);
  }
  
  .ipssi-navbar .navbar-brand {
    color: var(--ipssi-text);
    font-weight: bold;
  }
  
  .ipssi-btn-primary {
    background-color: var(--ipssi-light-blue);
    border-color: var(--ipssi-light-blue);
  }
  
  .ipssi-btn-outline {
    color: var(--ipssi-light-blue);
    border-color: var(--ipssi-light-blue);
  }
  
  .ipssi-sidebar {
    background-color: var(--ipssi-blue);
    border-right: 1px solid var(--ipssi-border);
  }
  
  .ipssi-sidebar .nav-link {
    color: var(--ipssi-text);
    font-size: 18px;
    padding: 12px 16px;
    border-radius: 30px;
    margin-bottom: 8px;
  }
  
  .ipssi-sidebar .nav-link:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
  
  .ipssi-main {
    background-color: var(--ipssi-bg);
    border-left: 1px solid var(--ipssi-border);
    border-right: 1px solid var(--ipssi-border);
  }
  
  .ipssi-search {
    background-color: var(--ipssi-bg);
    border-radius: 20px;
    border: 1px solid var(--ipssi-border);
    color: var(--ipssi-text);
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
`;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Injecter les styles personnalisés */}
      <style>{customStyles}</style>
      
      {/* Barre de navigation */}
      <Navbar expand="lg" className="ipssi-navbar px-3 shadow-sm">
        <Navbar.Brand as={Link} to="/">
          <span className="fs-4">𝕀</span> IPSSI
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
          <div>
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
          {/* Menu latéral */}
          <Col md={3} className="ipssi-sidebar vh-100 p-4">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="mb-2">
                <i className="bi bi-house-door-fill ipssi-icon"></i> Accueil
              </Nav.Link>
              <Nav.Link as={Link} to="/notifications" className="mb-2">
                <i className="bi bi-bell ipssi-icon"></i> Notifications
                <Badge bg="danger" className="ms-2">5</Badge>
              </Nav.Link>
              <Nav.Link as={Link} to="/bookmarks" className="mb-2">
                <i className="bi bi-bookmark ipssi-icon"></i> Signets
              </Nav.Link>
              <Nav.Link as={Link} to="/profile" className="mb-2">
                <i className="bi bi-person ipssi-icon"></i> Profil
              </Nav.Link>
              
              <Button 
                variant="primary" 
                className="ipssi-btn-primary ipssi-post-btn mt-3 w-100"
              >
                Publier
              </Button>
            </Nav>
          </Col>
          
          {/* Contenu principal */}
          <Col md={6} className="ipssi-main p-0">
            <div className="border-bottom p-3">
              <h5 className="mb-0 fw-bold">Accueil</h5>
            </div>
            <div className="p-3">
              {children}
            </div>
          </Col>
          
          {/* Colonne de tendances (comme sur Twitter) */}
          <Col md={3} className="p-3">
            <div className="bg-dark rounded p-3 mb-3">
              <h6 className="mb-3 fw-bold">Tendances pour vous</h6>
              <div className="mb-3">
                <small className="text-muted">Tendance en France</small>
                <p className="mb-0 fw-bold">#IPSSI2025</p>
                <small className="text-muted">8 542 posts</small>
              </div>
              <div className="mb-3">
                <small className="text-muted">Technologie · Tendance</small>
                <p className="mb-0 fw-bold">React.js</p>
                <small className="text-muted">5 234 posts</small>
              </div>
              <div className="mb-3">
                <small className="text-muted">Éducation</small>
                <p className="mb-0 fw-bold">École IPSSI</p>
                <small className="text-muted">3 128 posts</small>
              </div>
            </div>
            
            <div className="bg-dark rounded p-3">
              <h6 className="mb-3 fw-bold">Suggestions</h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-2">
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">IPSSI Paris</p>
                    <small className="text-muted">@ipssi_paris</small>
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
                    <small className="text-muted">@ipssi_tech</small>
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
      <Layout>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/' element={<TweetList />} />
          <Route path='/tweet/:tweetId' element={<TweetDetail tweetId={useParams().tweetId} />} />
          <Route path='/register' element={<RegisterForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;