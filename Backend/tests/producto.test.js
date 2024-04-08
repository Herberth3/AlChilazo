const supertest = require('supertest');
const { app } = require('../src/index');
const api = supertest(app);
const { db } = require('../src/config/config');
const {upload} = require('../src/config/s3config');
const fs = require('fs');
const path = require('path');

jest.mock('../src/config/config'); // Mock del módulo 'db'

describe('POST /api/modifyProduct', () => {
    it('debería modificar un producto correctamente', async () => {
      // Define los datos de prueba para el cuerpo de la solicitud
      const requestData = {
        idProducto: 123, // Reemplaza con el ID de producto válido
        nombreProducto: 'Nuevo nombre',
        categoria: 1, // Reemplaza con la categoría válida
        precio: 10.99,
        descripcion: 'Nueva descripción',
        foto: 'ruta_de_la_imagen.jpg', // Reemplaza con la ruta correcta de la imagen
        oferta: 0,
        productos: [1, 2, 3], // Reemplaza con los IDs de productos válidos para un combo
        combo: true,
      };
  
      const mockRows = [
        [{}]
      ]

      db.mockImplementation(() => ({

        
        query: (query, ...params) => {
          // Verificar el tipo de consulta y devolver los datos correspondientes
          const callback = params.pop();
          if (query.includes('UPDATE Combo')) {
            callback(null, { result: 'Combo modificado' });
          } else if (query.includes('DELETE FROM RelacionComboProducto')) {
            callback(null, { result: 'Relación de productos eliminada' });
          } else if (query.includes('INSERT INTO RelacionComboProducto')) {
            callback(null, { result: 'Relación de productos agregada' });
          } else if (query.includes('UPDATE Producto')) {
            callback(null, { result: 'Producto modificado' });
          } else {
            callback('Error en la consulta');
          }
        },
        end: jest.fn(),
      }));


      // Realiza la solicitud POST a la ruta /api/modifyProduct utilizando await api
      const response = await api
        .post('/api/modifyProduct')
        .send(requestData)
        .expect(200);
  
      // Verifica la estructura y los datos del cuerpo de la respuesta
      expect(response.body).toHaveProperty('modify', true);
      expect(response.body).toHaveProperty('message', 'Combo modificado Correctamente');
      // Agrega más aserciones según los datos esperados de la respuesta
  
      // Realiza las aserciones adicionales según sea necesario
    });
  
    it('debería modificar un producto incorrectamente', async () => {
        // Define los datos de prueba para el cuerpo de la solicitud
        const requestData = {
          idProducto: 123, // Reemplaza con el ID de producto válido
          nombreProducto: 'Nuevo nombre',
          categoria: 1, // Reemplaza con la categoría válida
          precio: 10.99,
          descripcion: 'Nueva descripción',
          foto: 'ruta_de_la_imagen.jpg', // Reemplaza con la ruta correcta de la imagen
          oferta: 0,
          productos: [1, 2, 3], // Reemplaza con los IDs de productos válidos para un combo
          combo: true,
        };
  
        db.mockImplementation(() => ({
          query: (query, ...params) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            const callback = params.pop();
            if (query.includes('UPDATE Combo')) {
              callback(new Error("Mockup Error"), null);
            } else if (query.includes('DELETE FROM RelacionComboProducto')) {
              callback(null, { result: 'Relación de productos eliminada' });
            } else if (query.includes('INSERT INTO RelacionComboProducto')) {
              callback(null, { result: 'Relación de productos agregada' });
            } else if (query.includes('UPDATE Producto')) {
              callback(null, { result: 'Producto modificado' });
            } else {
              callback('Error en la consulta');
            }
          },
          end: jest.fn(),
        }));
  
  
        // Realiza la solicitud POST a la ruta /api/modifyProduct utilizando await api
        const response = await api
          .post('/api/modifyProduct')
          .send(requestData)
          .expect(500);
    
        // Verifica la estructura y los datos del cuerpo de la respuesta
        expect(response.body).toHaveProperty('modify', false);
        expect(response.body).toHaveProperty('message', 'Error en modify Product');
        expect(response.body).toHaveProperty('error');
        // Agrega más aserciones según los datos esperados de la respuesta
    
        // Realiza las aserciones adicionales según sea necesario
      });

      it('debería modificar un producto incorrectamente', async () => {
        // Define los datos de prueba para el cuerpo de la solicitud
        const requestData = {
          idProducto: 123, // Reemplaza con el ID de producto válido
          nombreProducto: 'Nuevo nombre',
          categoria: 1, // Reemplaza con la categoría válida
          precio: 10.99,
          descripcion: 'Nueva descripción',
          foto: 'ruta_de_la_imagen.jpg', // Reemplaza con la ruta correcta de la imagen
          oferta: 0,
          productos: [1, 2, 3], // Reemplaza con los IDs de productos válidos para un combo
          combo: false,
        };
  
        db.mockImplementation(() => ({
          query: (query, ...params) => {
            // Verificar el tipo de consulta y devolver los datos correspondientes
            const callback = params.pop();
            if (query.includes('UPDATE Producto')) {
              callback(null, {updateRow: 1});
            }
          },
          end: jest.fn(),
        }));
  
  
        // Realiza la solicitud POST a la ruta /api/modifyProduct utilizando await api
        const response = await api
          .post('/api/modifyProduct')
          .send(requestData)
          .expect(200);
    
        // Verifica la estructura y los datos del cuerpo de la respuesta
        expect(response.body).toHaveProperty('modify', true);
        expect(response.body).toHaveProperty('message', 'Producto modificado correctamente.');
      });
  });

  describe('getProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should retrieve a product by ID', async () => {
        const result = [
            {
              id: 1,
              nombreProducto: 'Producto 1',
              idCategoria: 2,
              categoria: 'Categoría 2',
              fotoCategoria: 'foto_categoria.png',
              precio: 10,
              empresa: 'Empresa 1',
              descripcion: 'Descripción del producto',
              foto: 'foto_producto.png',
              oferta: 0
            }
          ];

      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null, result);
        },
        end: jest.fn(),
      }));

  
      // Act
      const response = await api
                .post('/api/getProduct')
                .send({id: 1, combo: 0})
                .expect(200);

        expect(response.body).toHaveProperty('producto', result[0]);
    });

    it('should create an error', async () => {

      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(new Error("Mockup Error"), null);
        },
        end: jest.fn(),
      }));

  
      // Act
      const response = await api
                .post('/api/getProduct')
                .send({id: 1, combo: 0})
                .expect(500);

        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
    });
  });

  describe('Post /api/insertExistencia', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should insert a new existencia', async () => {
      // Arrange
      const req = {
        body: {
          existencias: 10,
          limitado: 1,
          idProducto: 1,
          idDireccion: 2,
          creado: false
        }
      };
  
      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null, {resultId: 1});
        },
        end: jest.fn(),
      }));
      
      // Act
      const res = await api
                .post('/api/insertExistencia')
                .send(req.body)
                .expect(200);
      expect(res.body).toHaveProperty('message', 'Existencia Insertada');
      // Assert
     /* expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Existencia Insertada'
      });*/
    });
  
    it('should update an existing existencia', async () => {
      // Arrange
      const req = {
        body: {
          existencias: 20,
          limitado: 0,
          idProducto: 1,
          idDireccion: 2,
          creado: true
        }
      };
      /*const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      };*/
  
      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null, {affectedRows: 1});
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api
                .post('/api/insertExistencia')
                .send(req.body)
                .expect(200);
    expect(response.body).toHaveProperty('message', 'Existencia Insertada');
      // Assert
      /*expect(productoController.db).toHaveBeenCalledTimes(1);
      expect(productoController.db().query).toHaveBeenCalledTimes(1);
      expect(productoController.db().query).toHaveBeenCalledWith(
        `UPDATE Existencias SET existencias=${req.body.existencias}, limitado=${req.body.limitado}`,
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Existencia Insertada'
      });*/
    });
    it('should update an existing existencia', async () => {
        // Arrange
        const req = {
          body: {
            existencias: 20,
            limitado: 0,
            idProducto: 1,
            idDireccion: 2,
            creado: true
          }
        };
        /*const res = {
          status: jest.fn(() => res),
          send: jest.fn()
        };*/
    
        db.mockImplementation(() => ({
          query: (query, callback) => {        
                callback(new Error("Error Mockup"), null);
          },
          end: jest.fn(),
        }));
    
        // Act
        const response = await api
                  .post('/api/insertExistencia')
                  .send(req.body)
                  .expect(500);
      expect(response.body).toHaveProperty('message', 'Error en el servidor');
      expect(response.body).toHaveProperty('error');
      });
  });

  describe('Post /api/obtenerDirecciones', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should retrieve the directions for a given correo', async () => {
      // Arrange
      const req = {
        body: {
          correo: 'example@example.com'
        }
      };
  
      const mockResult = [
        {
            idDireccion: 1,
            idDepartamento: 1,
            departamento: 'Departamento 1',
            idCiudad: 1,
            municipio: 'Municipio 1'
        }
    ]

      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null, mockResult);
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api
                    .post('/api/obtenerDirecciones')
                    .send(req.body)
                    .expect(200);
  
      // Assert
      expect(response.body).toEqual({
        direcciones: mockResult
      });
    });

    it('should retrieve the directions for a given correo', async () => {
        // Arrange
        const req = {
          body: {
            correo: 'example@example.com'
          }
        };
  
        db.mockImplementation(() => ({
          query: (query, callback) => {        
                callback(new Error("Mockup Error"), null);
          },
          end: jest.fn(),
        }));
    
        // Act
        const response = await api
                      .post('/api/obtenerDirecciones')
                      .send(req.body)
                      .expect(500);
    
        // Assert
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
      });
  });

  describe('Post /api/obtenerExistencias', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should retrieve the existencias for a given idDireccion and idProducto', async () => {
      // Arrange
      const req = {
        body: {
          idDireccion: 1,
          idProducto: 2
        }
      };
  
      // Configurar el mock de la función db() para devolver la conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null,[]);
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api.post('/api/obtenerExistencias').send(req.body);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        existencia: []
      });
    });

    it('should retrieve error from existencias', async () => {
        // Arrange
        const req = {
          body: {
            idDireccion: 1,
            idProducto: 2
          }
        };
    
        // Configurar el mock de la función db() para devolver la conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, callback) => {        
                callback(new Error('mockup error'),null);
          },
          end: jest.fn(),
        }));
    
        // Act
        const response = await api.post('/api/obtenerExistencias').send(req.body);
    
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
      });
  });

  describe('deleteProducto', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should delete a product by id', async () => {
      // Arrange
      const req = {
        body: {
          id: 1,
          combo: false
        }
      };
  
      // Configurar el mock de la función db() para devolver la conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null,{});
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api.post('/api/deleteProduct').send(req.body);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Producto eliminado correctamente",
        deleted: true
      });
    });

    it('should retrieve error at delete a product by id', async () => {
        // Arrange
        const req = {
          body: {
            id: 1,
            combo: false
          }
        };
    
        // Configurar el mock de la función db() para devolver la conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, callback) => {        
                callback(new Error('mockup error'),null);
          },
          end: jest.fn(),
        }));
    
        // Act
        const response = await api.post('/api/deleteProduct').send(req.body);
    
        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('deleted', false);
      });
  
    it('should delete a combo by id', async () => {
      // Arrange
      const req = {
        body: {
          id: 1,
          combo: true
        }
      };
  
      // Configurar el mock de la función db() para devolver la conexión a la base de datos
      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null,{});
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api.post('/api/deleteProduct').send(req.body);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Producto eliminado correctamente",
        deleted: true
      });
    });

    it('should retrieve error at delete a combo by id', async () => {
        // Arrange
        const req = {
          body: {
            id: 1,
            combo: true
          }
        };
    
        // Configurar el mock de la función db() para devolver la conexión a la base de datos
        db.mockImplementation(() => ({
          query: (query, callback) => {        
                callback(new Error("mockup error"),null);
          },
          end: jest.fn(),
        }));
    
        // Act
        const response = await api.post('/api/deleteProduct').send(req.body);
    
        // Assert
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('deleted', false);
      });
  });

  describe('Post /api/getProductosCombo', () => {  
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('should retrieve products for a given combo id', async () => {
      // Arrange
      const req = {
        body: {
          idCombo: 1
        }
      };
  
      const expectedResult = [
        {
          idCombo: 1,
          nombreCombo: 'Combo 1',
          idProducto: 1,
          nombreProducto: 'Producto 1',
          categoria: 'Categoría 1',
          precio: 10,
          empresa: 'Empresa 1',
          descripcion: 'Descripción 1',
          foto: 'foto1.jpg',
          oferta: false
        },
        {
          idCombo: 1,
          nombreCombo: 'Combo 1',
          idProducto: 2,
          nombreProducto: 'Producto 2',
          categoria: 'Categoría 2',
          precio: 20,
          empresa: 'Empresa 2',
          descripcion: 'Descripción 2',
          foto: 'foto2.jpg',
          oferta: true
        }
      ];

      db.mockImplementation(() => ({
        query: (query, callback) => {        
              callback(null,expectedResult);
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api.post('/api/getProductosCombo').send(req.body);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        productos: expectedResult
      });
    });
  
    it('should handle error when retrieving products for a combo', async () => {
      // Arrange
      const req = {
        body: {
          idCombo: 1
        }
      };
  
      const errorMessage = 'Error en el servidor';
  
      db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(new Error(errorMessage), null);
        },
        end: jest.fn(),
      }));
  
      // Act
      const response = await api.post('/api/getProductosCombo').send(req.body);
  
      // Assert
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', errorMessage);
        expect(response.body).toHaveProperty('error')
        expect(response.body).toHaveProperty('deleted')
    });    
});

describe('Post /api/getProductosCombo', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('Debe devolver los productos de un combo dado su ID', async () => {
      const idCombo = 123; // ID del combo a consultar
  
      db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(null,[{ id:idCombo, nombreCombo: 'Combo 1'}]);
        },
        end: jest.fn(),
      }));

      // Realiza una solicitud POST a la ruta /api/getProductosCombo con el ID del combo
      const response = await api
        .post('/api/getProductosCombo')
        .send({ idCombo });
  
      // Verifica el código de estado de la respuesta
      expect(response.status).toBe(200);
  
      // Verifica la estructura y los datos de la respuesta
      expect(response.body).toHaveProperty('productos');
      expect(Array.isArray(response.body.productos)).toBe(true);
      // ... Verifica otros aspectos de la respuesta según tus requisitos
  
      // También puedes realizar aserciones más específicas en los datos devueltos
      // Por ejemplo, puedes verificar si el resultado contiene ciertos productos
  
      const productos = response.body.productos;
      expect(productos.length).toBeGreaterThan(0);
      expect(productos[0]).toHaveProperty('id', idCombo);
      // ... Realiza más aserciones según sea necesario
    });
  
    it('Should retrieve error while trying to get products from comb', async () => {
        const idCombo = 123; // ID del combo a consultar
    
        db.mockImplementation(() => ({
          query: (query, callback) => {        
              callback(new Error("Mockup Error"),null);
          },
          end: jest.fn(),
        }));
  
        // Realiza una solicitud POST a la ruta /api/getProductosCombo con el ID del combo
        const response = await api
          .post('/api/getProductosCombo')
          .send({ idCombo });
    
        // Verifica el código de estado de la respuesta
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
      });
  });


  describe('Post /api/getProductosEmpresa', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it('Debe devolver los productos de una empresa dada su ID', async () => {
      // Simula la función db() utilizando jest.spyOn y mockImplementation
  
      const empresa = 'nombreEmpresa'; // Nombre de la empresa a consultar
  

      db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(null,[{id: 1, nombreProducto: 'Producto 1', categoria: 'Categoría 1', idCategoria: 1}]);
        },
        end: jest.fn(),
      }));
      
      const response = await api
        .post('/api/getProductosEmpresa')
        .send({ empresa });
  
      // Verifica el código de estado de la respuesta
      expect(response.status).toBe(200);
  
      // Verifica la estructura y los datos de la respuesta
      expect(response.body).toHaveProperty('productos');
      expect(Array.isArray(response.body.productos)).toBe(true);
      // ... Verifica otros aspectos de la respuesta según tus requisitos
  
      // También puedes realizar aserciones más específicas en los datos devueltos
      // Por ejemplo, puedes verificar si el resultado contiene ciertos productos
  
      const productos = response.body.productos;
      expect(productos.length).toBeGreaterThan(0);
      expect(productos[0]).toHaveProperty('nombreProducto', 'Producto 1');
      
    });
  
    it('Debe devolver error en los productos de una empresa dada su ID', async () => {
        // Simula la función db() utilizando jest.spyOn y mockImplementation
    
        const empresa = 'nombreEmpresa'; // Nombre de la empresa a consultar
        db.mockImplementation(() => ({
          query: (query, callback) => {        
              callback(new Error("Mockup Error"),null);
          },
          end: jest.fn(),
        }));
        
        const response = await api
          .post('/api/getProductosEmpresa')
          .send({ empresa });
    
        // Verifica el código de estado de la respuesta
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error en el servidor');
        expect(response.body).toHaveProperty('error');
        
      });
  });
  
  describe('Post /api/insertCombo', () => {
  
    it('Debe insertar el combo correctamente', async () => {
       // Crea una ruta de archivo temporal para la imagen de prueba
        const imagePath = path.join(__dirname, 'imagen.jpg');
        fs.writeFileSync(imagePath, 'contenido de la imagen');

        db.mockImplementation(() => ({
            query: (query, callback) => {
                if(query.includes('INSERT INTO Combo')){
                    callback(null,{insertId: 1});
                }else if(query.includes('INSERT INTO RelacionComboProducto')){
                    callback(null,{insertId: 'combo'});
                }
                
            },
            end: jest.fn(),
          }));
        // Simula una solicitud HTTP POST a /api/insertProduct con los datos del producto y la imagen adjunta
        const response = await api
        .post('/api/insertCombo')
        .field('idCategoria', '1')
        .field('nombre', 'Producto de prueba')
        .field('precio', '10.99')
        .field('oferta', '0')
        .field('descripcion', 'Descripción del producto')
        .field('productos', [1,2])
        .attach('imagen', imagePath);

        // Elimina el archivo temporal
        fs.unlinkSync(imagePath);
      // Verifica el código de respuesta y la respuesta del servidor
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Combo agregado con exito');
      expect(response.body.inserted).toBe(true);
      expect(response.body.idCombo).toBeDefined();
    });

    it('Falla en insertar el combo', async () => {
        // Crea una ruta de archivo temporal para la imagen de prueba
         const imagePath = path.join(__dirname, 'imagen.jpg');
         fs.writeFileSync(imagePath, 'contenido de la imagen');
 
         db.mockImplementation(() => ({
             query: (query, callback) => {
                 if(query.includes('INSERT INTO Combo')){
                     callback(new Error("Mocked Error Insert Combo"),{insertId: 1});
                 }else if(query.includes('INSERT INTO RelacionComboProducto')){
                     callback(null,{insertId: 'combo'});
                 }
                 
             },
             end: jest.fn(),
           }));
         // Simula una solicitud HTTP POST a /api/insertProduct con los datos del producto y la imagen adjunta
         const response = await api
         .post('/api/insertCombo')
         .field('idCategoria', '1')
         .field('nombre', 'Producto de prueba')
         .field('precio', '10.99')
         .field('oferta', '0')
         .field('descripcion', 'Descripción del producto')
         .field('productos', [1,2])
         .attach('imagen', imagePath);
 
         // Elimina el archivo temporal
         fs.unlinkSync(imagePath);
       // Verifica el código de respuesta y la respuesta del servidor
       expect(response.status).toBe(500);
     });

     it('Falla en insertar en RelacionComboProducto', async () => {
        // Crea una ruta de archivo temporal para la imagen de prueba
         const imagePath = path.join(__dirname, 'imagen.jpg');
         fs.writeFileSync(imagePath, 'contenido de la imagen');
 
         db.mockImplementation(() => ({
             query: (query, callback) => {
                 if(query.includes('INSERT INTO Combo')){
                     callback(null,{insertId: 1});
                 }else if(query.includes('INSERT INTO RelacionComboProducto')){
                     callback(new Error("Mockup Error in query 2"),{insertId: 'combo'});
                 }
                 
             },
             end: jest.fn(),
           }));
         // Simula una solicitud HTTP POST a /api/insertProduct con los datos del producto y la imagen adjunta
         const response = await api
         .post('/api/insertCombo')
         .field('idCategoria', '1')
         .field('nombre', 'Producto de prueba')
         .field('precio', '10.99')
         .field('oferta', '0')
         .field('descripcion', 'Descripción del producto')
         .field('productos', [1,2])
         .attach('imagen', imagePath);
 
         // Elimina el archivo temporal
         fs.unlinkSync(imagePath);
       // Verifica el código de respuesta y la respuesta del servidor
       expect(response.status).toBe(500);
     });

    it('Fallo en el try catch', async () => {
        // Crea una ruta de archivo temporal para la imagen de prueba
         const imagePath = path.join(__dirname, 'imagen.jpg');
         fs.writeFileSync(imagePath, 'contenido de la imagen');
         // Simula una solicitud HTTP POST a /api/insertProduct con los datos del producto y la imagen adjunta
         const response = await api
         .post('/api/insertCombo')
         .field('idCategoria', '1')
         .field('nombre', 'Producto de prueba')
         .field('precio', '10.99')
         .field('oferta', '0')
         .field('descripcion', 'Descripción del producto')
         .field('productos', [1,2])
         .attach('imagen', imagePath);
 
         // Elimina el archivo temporal
         fs.unlinkSync(imagePath);
       // Verifica el código de respuesta y la respuesta del servidor
       expect(response.status).toBe(500);
     });
  
    
  });
  
  describe('Post /api/insertProduct', () => {
  
    it('Debe insertar un producto correctamente', async () => {
       // Crea una ruta de archivo temporal para la imagen de prueba
        const imagePath = path.join(__dirname, 'imagen.jpg');
        fs.writeFileSync(imagePath, 'contenido de la imagen');

        db.mockImplementation(() => ({
            query: (query, callback) => {        
                callback(null,{insertId: 1});
            },
            end: jest.fn(),
          }));
        // Simula una solicitud HTTP POST a /api/insertProduct con los datos del producto y la imagen adjunta
        const response = await api
        .post('/api/insertProduct')
        .field('idCategoria', '1')
        .field('nombre', 'Producto de prueba')
        .field('precio', '10.99')
        .field('empresa', '1')
        .field('oferta', '0')
        .field('descripcion', 'Descripción del producto')
        .attach('imagen', imagePath);

        // Elimina el archivo temporal
        fs.unlinkSync(imagePath);
      // Verifica el código de respuesta y la respuesta del servidor
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Producto agregado con exito');
      expect(response.body.inserted).toBe(true);
      expect(response.body.idProducto).toBeDefined();
    });
  
    it('Debe manejar correctamente los errores', async () => {
       // Crea una ruta de archivo temporal para la imagen de prueba
    const imagePath = path.join(__dirname, 'imagen.jpg');
    fs.writeFileSync(imagePath, 'contenido de la imagen');


    db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(new Error("Mockup Error"),null);
        },
        end: jest.fn(),
      }));
    // Simula una solicitud HTTP POST a /api/insertProduct con datos incorrectos y la imagen adjunta
    const response = await api
      .post('/api/insertProduct')
      .field('idCategoria', '1')
      .field('nombre', 'Producto de prueba')
      .field('precio', 'abc') // Precio incorrecto
      .field('empresa', '1')
      .field('oferta', '0')
      .field('descripcion', 'Descripción del producto')
      .attach('imagen', imagePath);

    // Elimina el archivo temporal
    fs.unlinkSync(imagePath);

    // Verifica el código de respuesta y la respuesta del servidor
    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe('Error en el servidor');
    });
  });

  describe('Get /api/getProductos', () => {
  
    it('Debe obtener una lista de productos correctamente', async () => {
      // Simula una solicitud HTTP GET a /api/getProductos
      db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(null, []);
        },
        end: jest.fn(),
      }));
      const response = await api.get('/api/getProductos');
      // Verifica el código de respuesta y la respuesta del servidor
      expect(response.status).toBe(200);
      expect(response.body.productos).toBeDefined();
      expect(response.body.message).toBe('Productos Encontrados');
    });
  
    it('Debe manejar correctamente los errores', async () => {
      db.mockImplementation(() => ({
        query: (query, callback) => {        
            callback(new Error("Mockup Error"),null);
        },
        end: jest.fn(),
      }));
  
      // Simula una solicitud HTTP GET a /api/getProductos
      const response = await api.get('/api/getProductos');
  
      // Verifica el código de respuesta y la respuesta del servidor
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toBe('Error en el servidor');
    });
  });