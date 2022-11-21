import YAML from 'yamljs';

export const swaggerConfig = YAML.load('./src/doc.yaml');
