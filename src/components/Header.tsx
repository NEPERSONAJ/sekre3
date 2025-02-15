import React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const navigation = [
  { path: '/image', label: 'Изображения', icon: <AutoFixHighIcon /> },
  { path: '/text', label: 'Текст', icon: <TextFieldsIcon /> },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <SmartToyIcon
              sx={{
                fontSize: 32,
                mr: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '50%',
                padding: '4px',
                boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
              }}
            />
          </motion.div>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
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
              variant="caption"
              sx={{
                ml: 1,
                opacity: 0.7,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              beta
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navigation.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              color={isActive(item.path) ? 'secondary' : 'inherit'}
              startIcon={!isMobile && item.icon}
              sx={{
                minWidth: isMobile ? 'auto' : 100,
                px: isMobile ? 1 : 2,
                position: 'relative',
                '&:after': isActive(item.path)
                  ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 4,
                      right: 4,
                      height: '2px',
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      borderRadius: '4px',
                    }
                  : {},
              }}
            >
              {isMobile ? (
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{ p: 0 }}
                >
                  {item.icon}
                </IconButton>
              ) : (
                item.label
              )}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
