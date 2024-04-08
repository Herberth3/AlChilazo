const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const port = 4000 || process.env.PORT;

// Configuración para analizar datos JSON en las solicitudes POST
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Evita que app.listen se ejecute durante las pruebas
if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

app.use("/api", routes)

module.exports = {app};
