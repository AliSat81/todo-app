import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'todo-app-idealtech API documentation',
    version: '0.1.0',
    description: 'This is a node express mongoose todo-app in typescript',
    license: {
      name: 'MIT',
      url: 'https://github.com/AliSat81/todo-app.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
