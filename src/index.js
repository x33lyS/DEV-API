import { app } from './app.js';
import { logger } from './common/logger.config.js';
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Server is running on port ${port}`));
