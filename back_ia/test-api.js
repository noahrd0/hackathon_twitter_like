// test-api.js - Script pour tester rapidement l'API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    // 1. Test de la route principale
    console.log('Test de la route principale...');
    const homeResponse = await fetch(`${BASE_URL}/`);
    const homeData = await homeResponse.json();
    console.log('✅ Route principale:', homeData);

    // 2. Créer un utilisateur de test
    console.log('\nCréation d\'un utilisateur de test...');
    const registerResponse = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerResponse.json();
    console.log('✅ Utilisateur créé:', registerData);

    // 3. Se connecter
    console.log('\nConnexion...');
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Connexion réussie, token JWT obtenu');

    // 4. Tester une route protégée
    console.log('\nTest d\'une route protégée...');
    const protectedResponse = await fetch(`${BASE_URL}/api/emotion/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const protectedData = await protectedResponse.json();
    console.log('✅ Accès à la route protégée:', protectedData);

    console.log('\n✅ Tous les tests ont réussi!');
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error);
  }
}

testAPI();