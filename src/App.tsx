import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ImageGeneration from './pages/ImageGeneration';
import TextGeneration from './pages/TextGeneration';
import theme from './theme';
import Home from './pages/Home';

// Анимированный градиентный фон
const GradientBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: 'radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
      },
    }}
  />
);

// Анимированные частицы
const Particles = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
    }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2,
        }}
      />
    ))}
  </Box>
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            background: '#000',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <GradientBackground />
          <Particles />
          <Header />
          <Container
            component={motion.main}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              pt: 4,
              pb: 8,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/image" element={<ImageGeneration />} />
              <Route path="/text" element={<TextGeneration />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
