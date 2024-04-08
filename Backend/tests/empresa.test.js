const supertest = require('supertest');
const { app } = require('../src/index');
const api = supertest(app);
const { db } = require('../src/config/config');
const {upload} = require('../src/config/s3config');
const fs = require('fs');
const path = require('path');

jest.mock('../src/config/config'); // Mock del módulo 'db'
//jest.mock('../src/config/s3config'); // Mock del módulo 's3'

describe('Pruebas unitarias para el archivo index.js', () => {
  it('debe responder con "Hello, World!" en la ruta principal', async () => {
    const response = await api.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('Post /api/empresa/reportes/historialPedidos', () => {

    afterEach(() => {
        jest.clearAllMocks();
      });

    it('debe devolver el historial de pedidos correctamente', async () => {
        
        // Mock de los resultados de las consultas
        const mockResults = [
            // Resultado de la consulta sqlCorreo
            [{ idEmpresa: 1 }],
            // Resultado de la consulta sqlListas
            [{ idListaPedidos: 1 }, { idListaPedidos: 2 }],
            // Resultado de la consulta sqlPedidoProducto para la lista 1
            [{ idProducto: 1, nombreProducto: 'Producto 1' }],
            // Resultado de la consulta sqlPedidoCombo para la lista 1
            [{ idCombo: 1, nombreCombo: 'Combo 1' }],
            // Resultado de la consulta sqlPedidoProducto para la lista 2
            [{ idProducto: 2, nombreProducto: 'Producto 2' }],
            // Resultado de la consulta sqlPedidoCombo para la lista 2
            [{ idCombo: 2, nombreCombo: 'Producto 2' }],
        ];

        // Mock de la función connection.query
        db.mockImplementation(() => {
            return {
            query: jest.fn((query, params, callback) => {
                const index = mockResults.findIndex((results) => results === null);
                if (index !== -1) {
                // Si hay un resultado nulo, se simula un error
                callback(new Error('Mocked error'), null);
                } else {
                callback(null, mockResults.shift());
                }
            }),
            end: jest.fn()
            };
        });

            const correo = 'correo@gmail.com';
            const response = await api
            .post('/api/empresa/reportes/historialPedidos')
            .send({ correo });

            // Verificar la respuesta recibida
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Historial de pedidos obtenido correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

    it("Debe devolver un error 500 si la consulta sqlCorreo falla", async () => {
        // Mock de la función connection.query
        db.mockImplementation(() => {
            return {
            query: jest.fn((query, params, callback) => {
                callback(new Error('Mocked error'), null);
            }),
            end: jest.fn()
            };
        });

        const correo = 'correo@gmail.com';
            const response = await api
            .post('/api/empresa/reportes/historialPedidos')
            .send({ correo });

            // Verificar la respuesta recibida
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error en el servidor');
    });
});

describe('POST /empresa/reportes/productosVendidos', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('debería devolver el combo correctamente', async() => {
    // Mock de los resultados de las consultas
  const mockResults = [
    // Resultado de la consulta sqlCorreo
    [{ idEmpresa: 1 }],
    // Resultado de la consulta sqlQuery
    [
      {
        idProducto: null,
        idCombo: 1,
        total: 10
      }
    ],
    // Resultado de la consulta sqlProducto (no se usará en este caso)
    [],
    // Resultado de la consulta sqlCombo
    [
      {
        nombreCombo: 'Combo de prueba',
        foto: 'foto_combo.jpg'
      }
    ]
  ];

  // Mock de la función connection.query
  db.mockImplementation(() => {
    let queryCount = 0; // Variable para realizar el seguimiento de la cantidad de consultas realizadas

    return {
      query: jest.fn((query, params, callback) => {
        callback(null, mockResults[queryCount]);
        queryCount++; // Incrementa el contador después de cada consulta
      }),
      end: jest.fn()
    };
  });

  // Realizar la solicitud POST a /empresa/reportes/productosVendidos
  await api
    .post('/api/empresa/reportes/productosVendidos')
    .send({ correo: 'ejemplo@empresa.com' })
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual({
        message: 'Combo obtenido correctamente',
        data: {},

        tipo: 'combo',
      });
    })
    });

    it('debería devolver el producto más vendido correctamente', async () => {
        // Mock de los resultados de las consultas
        const mockResults = [
          // Resultado de la consulta sqlCorreo
          [{ idEmpresa: 1 }],
          // Resultado de la consulta sqlQuery
          [
            {
              idProducto: 1,
              idCombo: null,
              total: 20
            }
          ],
          // Resultado de la consulta sqlProducto
          [
            {
              nombreProducto: 'Producto de prueba',
              foto: 'foto_producto.jpg'
            }
          ],
          // Resultado de la consulta sqlCombo (no se usará en este caso)
          []
        ];
      
        // Mock de la función connection.query
        db.mockImplementation(() => {
          let queryCount = 0; // Variable para realizar el seguimiento de la cantidad de consultas realizadas
      
          return {
            query: jest.fn((query, params, callback) => {
                queryCount++; // Incrementa el contador después de cada consulta
              callback(null, mockResults[queryCount-1]);
            }),
            end: jest.fn()
          };
        });
      
        // Realizar la solicitud POST a /empresa/reportes/productosVendidos
        const res = await api
        .post('/api/empresa/reportes/productosVendidos')
        .send({ correo: 'ejemplo@empresa.com' })
        .expect(200);

        expect(res.body).toEqual({
        message: 'Combo obtenido correctamente',
        data: {
        nombre: 'Producto de prueba',
        foto: 'foto_producto.jpg',
        total: 20
        },
        tipo: 'producto',
        total: 20
        });
      });
});

describe('POST /api/empresaCategory', () => {
    

  it('debería devolver el resultado esperado', async () => {
    // Configurar el mock para devolver los resultados esperados
    const mockResults = [
        [{ idEmpresa: 1, nombre: 'Empresa 1', categoria: 'Categoría 1' }],
        [{ idCategoria: 1, nombre: 'Categoría 1' }],
        [{ departamento: 1, ciudad: 1}]
    ];

    db.mockImplementation(() => {
      return {
        query: jest.fn((query, params, callback) => {
        
              callback(null, mockResults.shift());
        }),
        end: jest.fn()
      };
    });

    await api
      .post('/api/empresaCategory')
      .send({ idEmpresa: 1 })
      .expect(200)
      
  });

  it('debería devolver un mensaje de error para una empresa inexistente', async () => {
    // Configurar el mock para devolver un resultado nulo para la empresa
    const mockResults = [
      null,
      [{ idCategoria: 1, nombre: 'Categoría 1' }]
    ];

    await api
      .post('/api/empresaCategory')
      .send({ idEmpresa: 2 })
      .expect(500)
      
  });

  it('debería devolver un mensaje de error para una categoría inexistente', async () => {
    // Configurar el mock para devolver un resultado nulo para la categoría
    const mockResults = [
      [{ idEmpresa: 1, nombre: 'Empresa 1', categoria: 'Categoría 1' }],
      null
    ];

    await api
      .post('/api/empresaCategory')
      .send({ idEmpresa: 1 })
      .expect(500)
  });

});

describe('GET /api/empresa/reportes', () => {
    beforeEach(() => {
      // Configurar el mock para devolver el resultado esperado
      const mockResult = [{ totalVentas: 1000 }];
  
      db.mockImplementation(() => {
        return {
          query: jest.fn((query, params, callback) => {
            callback(null, mockResult.shift());
          }),
          end: jest.fn()
        };
      });
    });
  
    it('debería devolver el código de estado 200', async () => {
      await api
        .get('/api/getEmpresa')
        .expect(200);
    });
  });


  describe('GET /api/getCategorias', () => {
    it('debería obtener las categorías correctamente', async () => {
      // Establecer el estado inicial de la base de datos
      // ... (si es necesario)
  
      // Establecer el resultado esperado de la consulta a la base de datos
      const expectedCategorias = [{ id: 1, nombre: 'Categoría 1' }, { id: 2, nombre: 'Categoría 2' }];
  
      // Mockear la función de conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, callback) => {
          callback(null, expectedCategorias);
        },
        end: jest.fn(),
      }));
  
      // Hacer la solicitud GET a /api/getCategorias
      const response = await api
        .get('/api/getCategorias')
        .expect(200);
  
      // Verificar la respuesta
      expect(response.body.message).toBe('Categorias encontradas');
      expect(response.body.categorias).toEqual(expectedCategorias);
  
      // Verificar si la función de conexión a la base de datos fue llamada
      //expect(db).toHaveBeenCalledTimes(1);
    });
  
    // Otras pruebas...
  
  });

  describe('POST /api/loginEmpresa', () => {
    it('debería realizar el inicio de sesión correctamente', async () => {
      // Establecer el estado inicial de la base de datos
      // ... (si es necesario)
  
      // Datos de ejemplo para la solicitud de inicio de sesión
      const loginData = {
        correo: 'ejemplo@empresa.com',
        password: 'admin',
      };
  
      // Mockear la función de conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, params, callback) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
          if (query === 'SELECT correo, nombre, password, estado FROM Empresa WHERE correo = ?') {
            const correo = params[0];
            // Simular resultado de la consulta
            if (correo == loginData.correo) {
              const result = [{
                correo: 'ejemplo@empresa.com',
                nombre: 'Empresa de ejemplo',
                password: '21232f297a57a5a743894a0e4a801fc3', // 'contraseña' en MD5
                estado: 1,
              }];
              callback(null, result);
            } else {
              callback(null, []);
            }
          } else {
            // Simular otras consultas
            // ...
          }
        },
        end: jest.fn(),
      }));
  
      // Hacer la solicitud POST a /api/loginEmpresa
      const response = await api
        .post('/api/loginEmpresa')
        .send(loginData)
        .expect(200);
  
      // Verificar la respuesta
      expect(response.body.access).toBe(true);
      expect(response.body.nombre).toBe('Empresa de ejemplo');
      expect(response.body.correo).toBe('ejemplo@empresa.com');
      expect(response.body.message).toBe('Acceso concedido');
      expect(response.body.token).toBeDefined();
    });

    it('debería realizar el inicio de sesión inautorizado', async () => {
        // Establecer el estado inicial de la base de datos
        // ... (si es necesario)
    
        // Datos de ejemplo para la solicitud de inicio de sesión
        const loginData = {
          correo: 'ejemplo@empresa.com',
          password: 'admin',
        };
    
        // Mockear la función de conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, params, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            if (query === 'SELECT correo, nombre, password, estado FROM Empresa WHERE correo = ?') {
              const correo = params[0];
              // Simular resultado de la consulta
              if (correo == loginData.correo) {
                const result = [{
                  correo: 'ejemplo@empresa.com',
                  nombre: 'Empresa de ejemplo',
                  password: 'admin', // 'contraseña' en MD5
                  estado: 1,
                }];
                callback(null, result);
              } else {
                callback(null, []);
              }
            } else {
              // Simular otras consultas
              // ...
            }
          },
          end: jest.fn(),
        }));
    
        // Hacer la solicitud POST a /api/loginEmpresa
        const response = await api
          .post('/api/loginEmpresa')
          .send(loginData)
          .expect(401);
    
        // Verificar la respuesta
        expect(response.body.access).toBe(false);
        expect(response.body.message).toBe('El correo o la contraseña son incorrectos');
      });
  
      it('debería realizar el inicio de sesión inautorizado por admin', async () => {
        // Establecer el estado inicial de la base de datos
        // ... (si es necesario)
    
        // Datos de ejemplo para la solicitud de inicio de sesión
        const loginData = {
          correo: 'ejemplo@empresa.com',
          password: 'admin',
        };
    
        // Mockear la función de conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, params, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            if (query === 'SELECT correo, nombre, password, estado FROM Empresa WHERE correo = ?') {
              const correo = params[0];
              // Simular resultado de la consulta
              if (correo == loginData.correo) {
                const result = [{
                  correo: 'ejemplo@empresa.com',
                  nombre: 'Empresa de ejemplo',
                  password: '21232f297a57a5a743894a0e4a801fc3', // 'contraseña' en MD5
                  estado: 0,
                }];
                callback(null, result);
              } else {
                callback(null, []);
              }
            }
          },
          end: jest.fn(),
        }));
    
        // Hacer la solicitud POST a /api/loginEmpresa
        const response = await api
          .post('/api/loginEmpresa')
          .send(loginData)
          .expect(401);
    
        // Verificar la respuesta
        expect(response.body.access).toBe(false);
        expect(response.body.message).toBe('Empresa no ha sido aprobada por el administrador');
      });

  
  });

  describe('GET /api/getDepartamentos', () => {
    it('debería obtener los departamentos correctamente', async () => {
      // Establecer el estado inicial de la base de datos
      // ... (si es necesario)
  
      // Mockear la función de conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, callback) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
          if (query === 'SELECT * FROM Departamento') {
            // Simular resultado de la consulta
            const result = [
              { id: 1, nombre: 'Departamento 1' },
              { id: 2, nombre: 'Departamento 2' },
              // ...
            ];
            callback(null, result);
          } else {
            // Simular otras consultas
            // ...
          }
        },
        end: jest.fn(),
      }));
  
      // Hacer la solicitud GET a /api/getDepartamentos
      const response = await api
        .get('/api/getDepartamentos')
        .expect(200);
  
      // Verificar la respuesta
      expect(response.body.message).toBe('Departamentos obtenidos correctamente');
      expect(response.body.data).toHaveLength(2); // Ajusta el número según la cantidad de departamentos simulados
    });
  
    it('debería obtener los departamentos con error', async () => {
        // Establecer el estado inicial de la base de datos
        // ... (si es necesario)
    
        // Mockear la función de conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            if (query === 'SELECT * FROM Departamento') {
              callback(new Error("Mockup Error"));
            } else {
            }
          },
          end: jest.fn(),
        }));
    
        // Hacer la solicitud GET a /api/getDepartamentos
        const response = await api
          .get('/api/getDepartamentos')
          .expect(500);
    
        // Verificar la respuesta
        expect(response.body.message).toBe('Error al obtener los departamentos'); // Ajusta el número según la cantidad de departamentos simulados
      });
  
  });


  describe('GET /api/getMunicipios', () => {
    it('debería obtener los municipios correctamente', async () => {
      // Establecer el estado inicial de la base de datos
      // ... (si es necesario)
  
      // Mockear la función de conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, params, callback) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
          if (query === 'SELECT * FROM Municipio WHERE departamento = ?') {
            // Verificar los parámetros de la consulta y devolver los datos correspondientes
            if (params[0] === 'Departamento 1') {
              // Simular resultado de la consulta
              const result = [
                { id: 1, nombre: 'Municipio 1' },
                { id: 2, nombre: 'Municipio 2' },
                // ...
              ];
              callback(null, result);
            } else {
              // Simular otra consulta con parámetros diferentes
              // ...
            }
          } else {
            // Simular otras consultas
            // ...
          }
        },
        end: jest.fn(),
      }));
  
      // Hacer la solicitud GET a /api/getMunicipios con el parámetro departamento
      const departamento = 'Departamento 1'; // Ajusta el departamento según tu caso
      const response = await api
        .get('/api/getMunicipios')
        .query({ departamento })
        .expect(200);
  
      // Verificar la respuesta
      expect(response.body.message).toBe('Municipios obtenidos correctamente');
      expect(response.body.data).toHaveLength(2); // Ajusta el número según la cantidad de municipios simulados

    });
  
    it('debería obtener los municipios con error', async () => {
        // Establecer el estado inicial de la base de datos
        // ... (si es necesario)
    
        // Mockear la función de conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, params, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            if (query === 'SELECT * FROM Municipio WHERE departamento = ?') {
              // Verificar los parámetros de la consulta y devolver los datos correspondientes
              if (params[0] === 'Departamento 1') {
                callback(new Error("Mockup Error"), null);
              }
            }
          },
          end: jest.fn(),
        }));
    
        // Hacer la solicitud GET a /api/getMunicipios con el parámetro departamento
        const departamento = 'Departamento 1'; // Ajusta el departamento según tu caso
        const response = await api
          .get('/api/getMunicipios')
          .query({ departamento })
          .expect(500);
    
        // Verificar la respuesta
        expect(response.body.message).toBe('Error al obtener los municipios');
  
      });
  
  });

  describe('POST /api/empresa/deliveryRequest', () => {
    it('debería devolver las solicitudes de entrega correctamente', async () => {
      // Define los datos de prueba para el cuerpo de la solicitud
      const requestData = {
        empresa: 'ID_EMPRESA',
        departamento: 'ID_DEPARTAMENTO',
        municipio: 'ID_MUNICIPIO',
      };
  
      db.mockImplementation(() => ({
        query: (query, callback) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
          const result = [
            {
                idListaPedidos: 1,
                descripcion: 'Descripcion',
                departamento: 'Departamento',
                municipio: 'Municipio',
                direccion: 'Direccion',
                fecha: 'Fecha',
                nombre: 'Nombre',
                precio: 1000
            }
          ]
        callback(null, result);
        },
        end: jest.fn(),
      }));

      // Realiza la solicitud POST a la ruta /api/empresa/deliveryRequest utilizando await api
      const response = await api
        .post('/api/empresa/deliveryRequest')
        .send(requestData)
        .expect(200);
  
      // Verifica la estructura y los datos del cuerpo de la respuesta
      expect(response.body).toHaveProperty('orders');
      expect(response.body.orders).toBeInstanceOf(Array);
      
    });
  
    it('debería devolver las solicitudes de entrega incorrectamente', async () => {
        // Define los datos de prueba para el cuerpo de la solicitud
        const requestData = {
          empresa: 'ID_EMPRESA',
          departamento: 'ID_DEPARTAMENTO',
          municipio: 'ID_MUNICIPIO',
        };
    
        db.mockImplementation(() => ({
          query: (query, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
          callback(new Error("Mockup Error"), null);
          },
          end: jest.fn(),
        }));
  
        // Realiza la solicitud POST a la ruta /api/empresa/deliveryRequest utilizando await api
        const response = await api
          .post('/api/empresa/deliveryRequest')
          .send(requestData)
          .expect(500);
    
        // Verifica la estructura y los datos del cuerpo de la respuesta
        expect(response.body).toHaveProperty('error');
        expect(response.body.message).toBe('Error al obtener las solicitudes.');
        
      });
  });

  describe('POST /api/empresa/approveOrder', () => {
    it('debería aprobar la solicitud correctamente', async () => {
      // Define los datos de prueba para el cuerpo de la solicitud
      const requestData = {
        id: 'ID_SOLICITUD',
        estado: 'ESTADO_APROBADO',
      };
  
      db.mockImplementation(() => ({
        query: (query, callback) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
        callback(null, null);
        },
        end: jest.fn(),
      }));

      // Realiza la solicitud POST a la ruta /api/empresa/approveOrder utilizando await api
      const response = await api
        .post('/api/empresa/approveOrder')
        .send(requestData)
        .expect(200);
  
      
      expect(response.body).toHaveProperty('message', 'Solicitud aprobada');
      
    });
  

    it('debería aprobar la solicitud incorrectamente', async () => {
        // Define los datos de prueba para el cuerpo de la solicitud
        const requestData = {
          id: 'ID_SOLICITUD',
          estado: 'ESTADO_APROBADO',
        };
    
        db.mockImplementation(() => ({
          query: (query, callback) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
          callback(new Error("Mockup Error"), null);
          },
          end: jest.fn(),
        }));
  
        // Realiza la solicitud POST a la ruta /api/empresa/approveOrder utilizando await api
        const response = await api
          .post('/api/empresa/approveOrder')
          .send(requestData)
          .expect(500);
    
        expect(response.body).toHaveProperty('message', 'Error al aprobar la solicitud');
        expect(response.body).toHaveProperty('error');
        
      });
  });

  describe('Post /api/registrarEmpresa', () => {

    it('Debe registrar una nueva DireccionEmpresa', async () => {
        // Simula una solicitud HTTP POST a /api/registrarEmpresa con los datos necesarios
        const imagePath = path.join(__dirname, 'imagen.jpg');
      fs.writeFileSync(imagePath, 'contenido de la imagen');
  
  
      db.mockImplementation(() => ({
          query: (query, params, callback) => {        
              if(query.includes('SELECT e.idEmpresa, e.nombre, e.correo, d.idDepartamento, d.idCiudad FROM Empresa e')){
                  callback(null, [
                      {
                          idEmpresa: 1,
                          nombre: 'Empresa de Prueba',
                          correo: 'correo',
                          idDepartamento: 1,
                          idCiudad: 1                        
                      }
                  ]);
              }else if(query.includes('INSERT INTO Empresa')){
                  callback(null, {insertId:1});
              }else if(query.includes('INSERT INTO DireccionEmpresa')){
                  callback(null, {insertId:2});
              }
          },
          end: jest.fn(),
        }));
      
        const response = await api
          .post('/api/registrarEmpresa')
          .field('nombreEmpresa', 'Empresa de Prueba')
          .field('correo', 'empresa@prueba.com')
          .field('password', 'contraseña123')
          .field('departamento', 'Departamento')
          .field('municipio', 'Municipio')
          .field('descripcion', 'Descripción de la empresa')
          .field('direccion', 'Dirección de la empresa')
          .attach('autenticidad', imagePath, 'autenticidad')
          .attach('registro', imagePath, 'registro')
          .attach('permiso', imagePath, 'permiso')
          .attach('logo', imagePath, 'logo');
      // Elimina el archivo temporal
      fs.unlinkSync(imagePath);
        // Verifica el código de respuesta y la respuesta del servidor
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Se agregó una nueva direccion a la empresa existente');
        expect(response.body.data).toBeDefined();
      });

      it('Debe registrar una nueva Empresa y DireccionEmpresa', async () => {
        // Simula una solicitud HTTP POST a /api/registrarEmpresa con los datos necesarios
        const imagePath = path.join(__dirname, 'imagen.jpg');
      fs.writeFileSync(imagePath, 'contenido de la imagen');
  
  
      db.mockImplementation(() => ({
          query: (query, params, callback) => {        
              if(query.includes('SELECT e.idEmpresa, e.nombre, e.correo, d.idDepartamento, d.idCiudad FROM Empresa e')){
                  callback(null, []);
              }else if(query.includes('INSERT INTO Empresa')){
                  callback(null, {insertId:1});
              }else if(query.includes('INSERT INTO DireccionEmpresa')){
                  callback(null, {insertId:2});
              }
          },
          end: jest.fn(),
        }));
      
        const response = await api
          .post('/api/registrarEmpresa')
          .field('nombreEmpresa', 'Empresa de Prueba')
          .field('correo', 'empresa@prueba.com')
          .field('password', 'contraseña123')
          .field('departamento', 'Departamento')
          .field('municipio', 'Municipio')
          .field('descripcion', 'Descripción de la empresa')
          .field('direccion', 'Dirección de la empresa')
          .attach('autenticidad', imagePath, 'autenticidad')
          .attach('registro', imagePath, 'registro')
          .attach('permiso', imagePath, 'permiso')
          .attach('logo', imagePath, 'logo');
      // Elimina el archivo temporal
      fs.unlinkSync(imagePath);
        // Verifica el código de respuesta y la respuesta del servidor
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Empresa registrada correctamente');
        expect(response.body.data).toBeDefined();
      });
  });

  

 /* describe('POST /api/addCategoria', () => {
    it('debería agregar una categoría correctamente', async () => {
      // Define los datos de prueba para el formulario FormData
      const categoriaData = {
        categoria: 'Nombre de la categoría',
        name: 'Nombre del archivo',
        imagen: 'RUTA_IMAGEN', // Reemplaza con la ruta correcta de tu imagen de prueba
      };
  
    upload.mockImplementation(() => ({
        single: jest.fn((name) => {}),
        fields: jest.fn((fields) => {}),
        fileFilter: (req, file, cb) => {
            // Define un valor predeterminado para req.file.location si no se proporciona en la prueba
            if (!file.location) {
              file.location = 'RUTA_IMAGEN_POR_DEFECTO';
            }
            cb(null, true);
          },
    }));

    let formData = new FormData();
    formData.append('categoria', categoriaData.categoria);
    formData.append('name', categoriaData.categoria);
    formData.append('imagen', categoriaData.categoria);
      // Realiza la solicitud POST a la ruta /api/addCategoria utilizando await api
      const response = await api
        .post('/api/addCategoria')
        .send(formData)
        .expect(200);
    
      // Verifica la estructura y los datos del cuerpo de la respuesta
      expect(response.body).toHaveProperty('access', true);
      expect(response.body).toHaveProperty('message', 'Categoria agregada');
      // Agrega más aserciones según los datos esperados de la respuesta
  
      // Realiza las aserciones adicionales según sea necesario
    });
  
    // Agrega más pruebas unitarias según sea necesario
  });*/

  