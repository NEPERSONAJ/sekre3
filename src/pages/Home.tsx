import React from 'react';
import { Box, Typography, Button, Grid, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: <AutoFixHighIcon sx={{ fontSize: 40 }} />,
    title: 'Генерация изображений',
    description: 'Создавайте уникальные изображения с помощью ИИ',
    path: '/image',
  },
  {
    icon: <TextFieldsIcon sx={{ fontSize: 40 }} />,
    title: 'Генерация текста',
    description: 'Получайте креативные тексты для любых целей',
    path: '/text',
  },
];

export default function Home() {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        textAlign: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <motion.div variants={itemVariants}>
        <SmartToyIcon
          sx={{
            fontSize: 80,
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: '50%',
            padding: '16px',
            boxShadow: `0 0 40px ${theme.palette.primary.main}40`,
          }}
        />
      </motion.div>

      <Typography
        component={motion.h1}
        variants={itemVariants}
        variant="h2"
        sx={{
          mb: 2,
          fontWeight: 700,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: `0 0 20px ${theme.palette.primary.main}40`,
        }}
      >
        ChatGPTi
      </Typography>

      <Typography
        component={motion.h2}
        variants={itemVariants}
        variant="h5"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
      >
        Мощный инструмент для генерации изображений и текста с помощью искусственного интеллекта
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ mb: 6 }}
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                p: 3,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 32px 0 ${theme.palette.primary.main}20`,
                  border: `1px solid ${theme.palette.primary.main}40`,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              <Button
                component={RouterLink}
                to={feature.path}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                Попробовать
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography
        component={motion.div}
        variants={itemVariants}
        color="text.secondary"
        sx={{ opacity: 0.7 }}
      >
        Powered by ChatGPT API • Beta Version
      </Typography>
    </Box>
  );
}
