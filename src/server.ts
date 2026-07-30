import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger.util';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT} in ${env.NODE_ENV} mode`);
});
