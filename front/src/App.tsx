import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import TweetList from './components/TweetList.tsx';
import TweetDetail from './components/TweetDetails.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Barre de navigation */}
      <Navbar bg="light" expand="lg" className="px-3 shadow-sm">
        <Navbar.Brand as={Link} to="/">Twitter Clone</Navbar.Brand>
        <Form className="d-flex mx-auto">
          <FormControl type="search" placeholder="Rechercher" className="me-2" />
          <Button variant="outline-primary">🔍</Button>
        </Form>
        <div>
          <Button as={Link} to="/login" variant="outline-primary" className="me-2">Se connecter</Button>
          <Button as={Link} to="/register" variant="primary">S'inscrire</Button>
        </div>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Menu latéral */}
          <Col md={3} className="border-end vh-100 p-4">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/">🏠 Accueil</Nav.Link>
              <Nav.Link as={Link} to="/profile">👤 Profil</Nav.Link>
            </Nav>
          </Col>

          {/* Contenu principal */}
          <Col md={9} className="p-4">
            {children}
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
