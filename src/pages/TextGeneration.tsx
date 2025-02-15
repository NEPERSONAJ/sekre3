import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { generateText } from '../services/api';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CreateIcon from '@mui/icons-material/Create';

interface TextGenerationResponse {
  text: string;
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

export default function TextGeneration() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await generateText(prompt);
      if (response.status === 'error') {
        throw new Error(response.error || 'Произошла ошибка при генерации текста');
      }
      setGeneratedText(response.text);
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
        Генерация текста
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
          placeholder="Опишите текст, который хотите создать..."
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
          startIcon={loading ? <CircularProgress size={20} /> : <TextFieldsIcon />}
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

      {!generatedText && !loading && !error && (
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
          <CreateIcon sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.2)' }} />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Введите описание, и мы создадим текст
          </Typography>
        </Box>
      )}

      {generatedText && (
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={3}
          sx={{
            p: 3,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `0 8px 32px 0 ${theme.palette.primary.main}20`,
          }}
        >
          <Typography
            variant="body1"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              color: theme.palette.text.primary,
            }}
          >
            {generatedText}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
