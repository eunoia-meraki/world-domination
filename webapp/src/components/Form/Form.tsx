import {
  Shield,
  Park,
  RocketLaunch,
  Close,
  BlurOn,
  Rocket,
  AttachMoney,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  CssBaseline,
} from '@mui/material';

import type { FC } from 'react';

export const Form: FC = () => (
  <Box
    component="main"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      backgroundColor: theme =>
        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    }}
  >
    <CssBaseline />
    <Container
      component="form"
      maxWidth="md"
      noValidate
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      <Stack spacing={2}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1976d2',
            height: 100,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
            }}
          >
              World domination
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="h6">Раунд 6 из 6</Typography>
          <Typography>Чтобы отдать приказы, заполните и отправьте анкету.</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">Укажите название вашей страны*</Typography>
          <FormControl sx={{ m: 1, width: '50%' }}>
            <InputLabel id="choose-label">Выбрать</InputLabel>
            <Select labelId="choose-label" id="choose-label" value="" label="Выбрать">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Россия</MenuItem>
              <MenuItem value={21}>США</MenuItem>
              <MenuItem value={22}>Китай</MenuItem>
              <MenuItem value={22}>Германия</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AttachMoney />
            <Typography variant="h6">Инвестировать средства в развитие городов</Typography>
          </Stack>
          <Typography>
              Вы можете инвестировать по 150 у.е. на каждый город за один раунд. Каждая инвестиция
              повышает доходность города на 20%. Развивать город можно не только до 100%, но и выше.
              Впишите названия городов, которые вы хотите разивать.
          </Typography>
          <TextField
            id="answer"
            name="answer"
            label="Ваш ответ"
            variant="standard"
            sx={{ width: '50%' }}
          />
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Shield />
            <Typography variant="h6">Защитить города ядерными щитами</Typography>
          </Stack>
          <Typography>
              Постройка щита стоит 300 у.е. Щит может защитить только от одного ядерного удара.
              После удара щит разрушается. Одновременно два щита над одним городом построить нельзя.
              Впишите названия ваших городов, которые вы хотите защитить.
          </Typography>
          <TextField
            id="answer"
            name="answer"
            label="Ваш ответ"
            variant="standard"
            sx={{ width: '50%' }}
          />
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Park />
            <Typography variant="h6">Реализовать экологическую программу</Typography>
          </Stack>
          <Typography>
              Экологическая программа обойдется вам в 200 у.е. и улучшит экологию на всей планете на
              15%.
          </Typography>
          <FormControlLabel control={<Checkbox color="primary" />} label="Улучшить экологию" />
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <BlurOn />
            <Typography variant="h6">Приступить к разработке ядерной технологии</Typography>
          </Stack>
          <Typography>Разаработка ядерной технологии обойдется вам в 500 у.е.</Typography>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Разработать ядерную технологию"
          />
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Rocket />
            <Typography variant="h6">Произвести ядерные бомбы</Typography>
          </Stack>
          <Typography>
              Производить ядерные бомбы можно только при условии, что вы обладаете ядерной
              технологией. Производство каждой бомбы обойдется вам в 150 у.е. Вы можете производить
              не более трех бомб за раунд. Сколько бомб вы хотите произвести?
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="0"
            name="radio-buttons-group"
          >
            <FormControlLabel value="0" control={<Radio />} label="0" />
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
          </RadioGroup>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <RocketLaunch />
            <Typography variant="h6">Нанести ядерные удары</Typography>
          </Stack>
          <Typography>
              Вы можете наносить ядерные удары, если у вас есть в наличии ядерные бомбы. За один ход
              вы можете нанести не более одного удара по одному городу. Если город не защищен щитом,
              он будет уничтожен. Впишите названия городов, по которым вы хотите нанести удар.
          </Typography>
          <TextField
            id="answer"
            name="answer"
            label="Ваш ответ"
            variant="standard"
            sx={{ width: '50%' }}
          />
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Close />
            <Typography variant="h6">Наложить санкции</Typography>
          </Stack>
          <Typography>
              Санкции снижают доходы государства на 10%. Срок действия санкций - 1 раунд. Поставьте
              галочку напротив страны, на которую вы хотите наложить санкции.
          </Typography>
          <FormControlLabel control={<Checkbox color="primary" />} label="Россия" />
          <FormControlLabel control={<Checkbox color="primary" />} label="США" />
          <FormControlLabel control={<Checkbox color="primary" />} label="Китай" />
          <FormControlLabel control={<Checkbox color="primary" />} label="Германия" />
        </Paper>
      </Stack>
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Отправить
      </Button>
    </Container>
  </Box>
);
