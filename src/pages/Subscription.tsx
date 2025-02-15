import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SubscriptionPlan } from '../types';

const plans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Месячная подписка',
    price: 499,
    duration: 1,
    features: [
      'Безлимитная генерация изображений',
      'Безлимитная генерация текста',
      'Доступ к премиум моделям',
      'Приоритетная поддержка',
    ],
    imageLimit: -1,
    textLimit: -1,
  },
  {
    id: 'quarterly',
    name: '3 месяца',
    price: 1299,
    duration: 3,
    features: [
      'Все преимущества месячной подписки',
      'Скидка 13%',
      'Эксклюзивные модели',
      'VIP поддержка',
    ],
    imageLimit: -1,
    textLimit: -1,
  },
  {
    id: 'yearly',
    name: 'Годовая подписка',
    price: 4499,
    duration: 12,
    features: [
      'Все преимущества квартальной подписки',
      'Скидка 25%',
      'Бета-доступ к новым функциям',
      'Персональный менеджер',
    ],
    imageLimit: -1,
    textLimit: -1,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Subscription: React.FC = () => {
  const handleSubscribe = (plan: SubscriptionPlan) => {
    // Здесь будет логика оплаты через Telegram
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify({
        action: 'subscribe',
        plan: plan.id,
      }));
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Выберите план подписки
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              component={motion.div}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {index === 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    zIndex: 1,
                  }}
                >
                  Популярный выбор
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ mb: 2, color: 'primary.main' }}
                >
                  {plan.price} ₽
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    /{plan.duration === 1 ? 'месяц' : `${plan.duration} мес.`}
                  </Typography>
                </Typography>

                <List dense>
                  {plan.features.map((feature, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSubscribe(plan)}
                  sx={{
                    background: index === 1 ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' : undefined,
                  }}
                >
                  Выбрать план
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Subscription;
