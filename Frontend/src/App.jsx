import { Route, Routes } from 'react-router-dom';
import './App.css';
import bg from './assets/background.png'; // ✅ Background from assets
import ChatPage from './pages/ChatPage';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',     // ✅ Full screen width
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
