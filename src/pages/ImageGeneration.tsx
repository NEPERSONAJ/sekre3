import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Alert,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { generateImage } from '../services/api';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ImageIcon from '@mui/icons-material/Image';

interface ImageGenerationResponse {
  url: string;
  status: 'success' | 'error';
  error?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await generateImage(prompt);
      if (response.status === 'error') {
        throw new Error(response.error || 'Произошла ошибка при генерации изображения');
      }
      setImageUrl(response.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
      }}
    >
      <Typography
        variant="h1"
        component={motion.h1}
        variants={itemVariants}
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem' },
          textAlign: 'center',
          mb: 2,
        }}
      >
        Генерация изображений
      </Typography>

      <Box
        component={motion.form}
        variants={itemVariants}
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: '100%',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Опишите изображение, которое хотите создать..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={loading || !prompt.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
          sx={{
            minWidth: { xs: '100%', sm: '180px' },
            height: { xs: '50px', sm: 'auto' },
          }}
        >
          {loading ? 'Создаём...' : 'Создать'}
        </Button>
      </Box>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            {error}
          </Alert>
        </motion.div>
      )}

      {!imageUrl && !loading && !error && (
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            py: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '2px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <ImageIcon sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.2)' }} />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Введите описание, и мы создадим изображение
          </Typography>
        </Box>
      )}

      {imageUrl && (
        <Card
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          sx={{
            overflow: 'hidden',
            boxShadow: `0 8px 32px 0 ${theme.palette.primary.main}20`,
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt="Сгенерированное изображение"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '600px',
              objectFit: 'contain',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
        </Card>
      )}
    </Box>
  );
}
