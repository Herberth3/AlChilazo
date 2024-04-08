-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

-- -----------------------------------------------------
-- Schema alchilazodb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema alchilazodb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `alchilazodb` ;
CREATE SCHEMA IF NOT EXISTS `alchilazodb` DEFAULT CHARACTER SET utf8 ;
USE `alchilazodb` ;

-- -----------------------------------------------------
-- Table `alchilazodb`.`Departamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Departamento` (
  `idDepartamento` INT NOT NULL AUTO_INCREMENT,
  `departamento` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idDepartamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Municipio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Municipio` (
  `idMunicipio` INT NOT NULL AUTO_INCREMENT,
  `municipio` VARCHAR(100) NOT NULL,
  `departamento` INT NOT NULL,
  PRIMARY KEY (`idMunicipio`),
  INDEX `fk_repartidor_departamento_departamento_idx` (`departamento` ASC) VISIBLE,
  CONSTRAINT `fk_Municipio_Departamento_departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Repartidor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Repartidor` (
  `idrepartidor` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(75) NOT NULL,
  `apellido` VARCHAR(75) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(8) NOT NULL,
  `departamento` INT NOT NULL,
  `ciudad` INT NOT NULL,
  `nit` VARCHAR(13) NOT NULL,
  `cv` VARCHAR(250) NOT NULL,
  `estado` INT NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`idrepartidor`),
  INDEX `fk_repartidor_departamento_departamento_idx` (`departamento` ASC) VISIBLE,
  INDEX `fk_repartidor_ciudad_ciudad_idx` (`ciudad` ASC) VISIBLE,
  CONSTRAINT `fk_repartidor_ciudad_ciudad`
    FOREIGN KEY (`ciudad`)
    REFERENCES `alchilazodb`.`Municipio` (`idMunicipio`),
  CONSTRAINT `fk_repartidor_departamento_departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Calificacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Calificacion` (
  `idcalificacion` INT NOT NULL AUTO_INCREMENT,
  `cant_envios` INT NULL DEFAULT NULL,
  `total_puntos` INT NULL DEFAULT NULL,
  `repartidor_idrepartidor` INT NOT NULL,
  PRIMARY KEY (`idcalificacion`),
  INDEX `fk_calificacion_repartidor1_idx` (`repartidor_idrepartidor` ASC) VISIBLE,
  CONSTRAINT `fk_calificacion_repartidor1`
    FOREIGN KEY (`repartidor_idrepartidor`)
    REFERENCES `alchilazodb`.`Repartidor` (`idrepartidor`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Estados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Estados` (
  `idEstado` INT NOT NULL,
  `nombreEstado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(250) NOT NULL,
  `tarjeta` VARCHAR(20) NOT NULL,
  `celular` VARCHAR(8) NOT NULL,
  `departamento` INT NOT NULL,
  `ciudad` INT NOT NULL,
  `estado` INT NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusuario`),
  INDEX `fk_usuario_departamento_departamento_idx` (`departamento` ASC) VISIBLE,
  INDEX `fk_usuario_ciudad_ciudad_idx` (`ciudad` ASC) VISIBLE,
  INDEX `fk_usuario_Estados_estado_idx` (`estado` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_ciudad_ciudad`
    FOREIGN KEY (`ciudad`)
    REFERENCES `alchilazodb`.`Municipio` (`idMunicipio`),
  CONSTRAINT `fk_usuario_departamento_departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`),
  CONSTRAINT `fk_usuario_Estados_estado`
    FOREIGN KEY (`estado`)
    REFERENCES `alchilazodb`.`Estados` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Carrito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Carrito` (
  `idcarrito` INT NOT NULL AUTO_INCREMENT,
  `idusuario` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `precioTotal` DOUBLE(10,2) NULL,
  `estado` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idcarrito`),
  INDEX `fk_carrito_usuario_idusuario_idx` (`idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_carrito_usuario_idusuario`
    FOREIGN KEY (`idusuario`)
    REFERENCES `alchilazodb`.`Usuario` (`idusuario`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Categoria` (
  `idCategoria` INT NOT NULL AUTO_INCREMENT,
  `categoria` VARCHAR(200) NOT NULL,
  `foto` TEXT NOT NULL,
  PRIMARY KEY (`idCategoria`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Comisiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Comisiones` (
  `idcomisiones` INT NOT NULL AUTO_INCREMENT,
  `comision` DECIMAL(10,2) NOT NULL,
  `repartidor_idrepartidor` INT NOT NULL,
  `idcarrito` INT NOT NULL,
  PRIMARY KEY (`idcomisiones`),
  INDEX `fk_comisiones_repartidor1_idx` (`repartidor_idrepartidor` ASC) VISIBLE,
  INDEX `fk_comisiones_carrito_idcarrito_idx` (`idcarrito` ASC) VISIBLE,
  CONSTRAINT `fk_comisiones_repartidor1`
    FOREIGN KEY (`repartidor_idrepartidor`)
    REFERENCES `alchilazodb`.`Repartidor` (`idrepartidor`),
  CONSTRAINT `fk_comisiones_carrito_idcarrito`
    FOREIGN KEY (`idcarrito`)
    REFERENCES `alchilazodb`.`Carrito` (`idcarrito`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Empresa` (
  `idEmpresa` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(125) NOT NULL,
  `estado` INT NOT NULL,
  `descripcion` VARCHAR(200) NULL DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `url` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`idEmpresa`),
  INDEX `fk_Empresa_Estados_idx` (`estado` ASC) VISIBLE,
  CONSTRAINT `fk_Empresa_Estados`
    FOREIGN KEY (`estado`)
    REFERENCES `alchilazodb`.`Estados` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`DireccionEmpresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`DireccionEmpresa` (
  `idDireccion` INT NOT NULL AUTO_INCREMENT,
  `idEmpresa` INT NOT NULL,
  `idDepartamento` INT NOT NULL,
  `idCiudad` INT NOT NULL,
  `direccion` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`idDireccion`, `idEmpresa`),
  INDEX `fk_direccionEmpresa_departamento_departamento_idx` (`idDepartamento` ASC) VISIBLE,
  INDEX `fk_direccionEmpresa_ciudad_ciudad_idx` (`idCiudad` ASC) VISIBLE,
  INDEX `fk_direccionEmpresa_empresa_empresa_idx` (`idEmpresa` ASC) VISIBLE,
  CONSTRAINT `fk_direccionEmpresa_ciudad_ciudad`
    FOREIGN KEY (`idCiudad`)
    REFERENCES `alchilazodb`.`Municipio` (`idMunicipio`),
  CONSTRAINT `fk_direccionEmpresa_departamento_departamento`
    FOREIGN KEY (`idDepartamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`),
  CONSTRAINT `fk_direccionEmpresa_empresa_empresa`
    FOREIGN KEY (`idEmpresa`)
    REFERENCES `alchilazodb`.`Empresa` (`idEmpresa`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Lista_Pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Lista_Pedidos` (
  `idListaPedidos` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NULL DEFAULT NULL,
  `departamento` INT NULL DEFAULT NULL,
  `municipio` INT NULL DEFAULT NULL,
  `direccion` VARCHAR(450) NULL DEFAULT NULL,
  `estado` INT NULL,
  `calificacion` INT NULL DEFAULT NULL,
  `fecha` DATE NOT NULL,
  `repartidor` INT NULL DEFAULT NULL,
  `descripcion_cancelado` VARCHAR(300) NULL DEFAULT NULL,
  `empresa` INT NULL,
  `precio` DOUBLE(10,2) NULL DEFAULT 0,
  `carrito` INT NOT NULL,
  PRIMARY KEY (`idListaPedidos`),
  INDEX `fk_lista_solicitud_pedido_repartidor1_idx` (`repartidor` ASC) VISIBLE,
  INDEX `fk_lista_solicitud_pedido_departamento_departamento_idx` (`departamento` ASC) VISIBLE,
  INDEX `fk_lista_solicitud_pedido_ciudad_ciudad_idx` (`municipio` ASC) VISIBLE,
  INDEX `fk_lista_solicitud_pedido_Estados_idEstado_idx` (`estado` ASC) VISIBLE,
  INDEX `fk_Lista_Pedido_Empresa_empresa_idx` (`empresa` ASC) VISIBLE,
  INDEX `fk_Lista_Pedido_Carrito_carrito_idx` (`carrito` ASC) VISIBLE,
  CONSTRAINT `fk_Lista_Pedido_Municipio`
    FOREIGN KEY (`municipio`)
    REFERENCES `alchilazodb`.`Municipio` (`idMunicipio`),
  CONSTRAINT `fk_Lista_Pedido_Departamento_departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`),
  CONSTRAINT `fk_Lista_Pedido_Repartidor_repartidor`
    FOREIGN KEY (`repartidor`)
    REFERENCES `alchilazodb`.`Repartidor` (`idrepartidor`),
  CONSTRAINT `fk_Lista_Pedido_Estados_estado`
    FOREIGN KEY (`estado`)
    REFERENCES `alchilazodb`.`Estados` (`idEstado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lista_Pedido_Empresa_empresa`
    FOREIGN KEY (`empresa`)
    REFERENCES `alchilazodb`.`Empresa` (`idEmpresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lista_Pedido_Carrito_carrito`
    FOREIGN KEY (`carrito`)
    REFERENCES `alchilazodb`.`Carrito` (`idcarrito`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Combo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Combo` (
  `idCombo` INT NOT NULL AUTO_INCREMENT,
  `nombreCombo` VARCHAR(125) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `foto` TEXT NOT NULL,
  `oferta` TINYINT(1) NOT NULL,
  `categoria` INT NULL,
  PRIMARY KEY (`idCombo`),
  INDEX `fx_combo_categoria_idCategoria_idx` (`categoria` ASC) VISIBLE,
  CONSTRAINT `fx_combo_categoria_idCategoria`
    FOREIGN KEY (`categoria`)
    REFERENCES `alchilazodb`.`Categoria` (`idCategoria`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Producto` (
  `idProducto` INT NOT NULL AUTO_INCREMENT,
  `nombreProducto` VARCHAR(45) NULL DEFAULT NULL,
  `categoria` INT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `empresa` INT NULL,
  `descripcion` VARCHAR(450) NOT NULL,
  `foto` TEXT NOT NULL,
  `oferta` TINYINT(1) NOT NULL,
  PRIMARY KEY (`idProducto`),
  INDEX `fk_producto_empresa_idx` (`empresa` ASC) VISIBLE,
  INDEX `fk_producto_categoria_categoria_idx` (`categoria` ASC) VISIBLE,
  CONSTRAINT `fk_producto_categoria_categoria`
    FOREIGN KEY (`categoria`)
    REFERENCES `alchilazodb`.`Categoria` (`idCategoria`)
    ON DELETE SET NULL,
  CONSTRAINT `fk_producto_empresa`
    FOREIGN KEY (`empresa`)
    REFERENCES `alchilazodb`.`Empresa` (`idEmpresa`)
    ON DELETE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`RelacionComboProducto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`RelacionComboProducto` (
  `idRelacion` INT NOT NULL AUTO_INCREMENT,
  `idCombo` INT NOT NULL,
  `idProducto` INT NOT NULL,
  PRIMARY KEY (`idRelacion`),
  INDEX `fk_oferta_productoOferta_producto_idx` (`idProducto` ASC) VISIBLE,
  INDEX `fk_Combo_Producto_idCombo_idx` (`idCombo` ASC) VISIBLE,
  CONSTRAINT `fk_RelacionComboProducto_Combo_idCombo`
    FOREIGN KEY (`idCombo`)
    REFERENCES `alchilazodb`.`Combo` (`idCombo`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_RelacionComboProducto_Producto_idProducto`
    FOREIGN KEY (`idProducto`)
    REFERENCES `alchilazodb`.`Producto` (`idProducto`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Pedido` (
  `idPedido` INT NOT NULL AUTO_INCREMENT,
  `idlista_solicitud_pedido` INT NOT NULL,
  `idProducto` INT NULL,
  `idCombo` INT NULL,
  `cantidad` INT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `descripcion` VARCHAR(250) NULL DEFAULT NULL,
  PRIMARY KEY (`idPedido`, `idlista_solicitud_pedido`),
  INDEX `fk_pedido_lista_solicitud_pedido_idx` (`idlista_solicitud_pedido` ASC) VISIBLE,
  INDEX `fk_pedido_producto_idx` (`idProducto` ASC) VISIBLE,
  INDEX `fk_pedido_combo_idx` (`idCombo` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_lista_solicitud_pedido`
    FOREIGN KEY (`idlista_solicitud_pedido`)
    REFERENCES `alchilazodb`.`Lista_Pedidos` (`idListaPedidos`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_pedido_producto`
    FOREIGN KEY (`idProducto`)
    REFERENCES `alchilazodb`.`Producto` (`idProducto`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_pedido_combo`
    FOREIGN KEY (`idCombo`)
    REFERENCES `alchilazodb`.`Combo` (`idCombo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`PreferenciaDirecciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`PreferenciaDirecciones` (
  `idpreferencia_direcciones` INT NOT NULL AUTO_INCREMENT,
  `direccion` VARCHAR(450) NULL DEFAULT NULL,
  `usuario` INT NOT NULL,
  `departamento` INT NOT NULL,
  `municipio` INT NOT NULL,
  PRIMARY KEY (`idpreferencia_direcciones`, `usuario`),
  INDEX `fk_preferencia_direcciones_usuario1_idx` (`usuario` ASC) VISIBLE,
  INDEX `fk_PreferenciaDirecciones_Departamento_departamento_idx` (`departamento` ASC) VISIBLE,
  INDEX `fk_PreferenciaDirecciones_municipio_municipio_idx` (`municipio` ASC) VISIBLE,
  CONSTRAINT `fk_PreferenciaDirecciones_Usuario_usuario`
    FOREIGN KEY (`usuario`)
    REFERENCES `alchilazodb`.`Usuario` (`idusuario`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_PreferenciaDirecciones_Departamento_departamento`
    FOREIGN KEY (`departamento`)
    REFERENCES `alchilazodb`.`Departamento` (`idDepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PreferenciaDirecciones_municipio_municipio`
    FOREIGN KEY (`municipio`)
    REFERENCES `alchilazodb`.`Municipio` (`idMunicipio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Tarjetas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Tarjetas` (
  `idtarjetas` INT NOT NULL AUTO_INCREMENT,
  `tarjeta` VARCHAR(15) NOT NULL,
  `usuario` INT NOT NULL,
  `tipoTarjeta` VARCHAR(15) NOT NULL,
  `entidadTarjeta` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`idtarjetas`),
  INDEX `fk_tarjetas_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Tarjetas_Usuario_usuario`
    FOREIGN KEY (`usuario`)
    REFERENCES `alchilazodb`.`Usuario` (`idusuario`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Licencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Licencia` (
  `idtrasporte` INT NOT NULL AUTO_INCREMENT,
  `num_licencia` VARCHAR(15) NOT NULL,
  `tipo_licencia` VARCHAR(1) CHARACTER SET 'ascii' NOT NULL,
  `repartidor` INT NOT NULL,
  PRIMARY KEY (`idtrasporte`),
  INDEX `fk_trasporte_repartidor1_idx` (`repartidor` ASC) VISIBLE,
  CONSTRAINT `fk_Licencia_Repartidor_repartidor`
    FOREIGN KEY (`repartidor`)
    REFERENCES `alchilazodb`.`Repartidor` (`idrepartidor`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Transporte`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Transporte` (
  `idRepartidor` INT NOT NULL AUTO_INCREMENT,
  `transportePropio` TINYINT NOT NULL,
  PRIMARY KEY (`idRepartidor`),
  CONSTRAINT `fk_Usuario_Transporte_idUsuario`
    FOREIGN KEY (`idRepartidor`)
    REFERENCES `alchilazodb`.`Repartidor` (`idrepartidor`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Existencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Existencias` (
  `idProducto` INT NOT NULL,
  `idDireccion` INT NOT NULL,
  `existencias` INT NULL,
  `limitado` TINYINT NOT NULL,
  PRIMARY KEY (`idProducto`, `idDireccion`),
  INDEX `fk_Existencia_Direccion_idDireccion_idx` (`idDireccion` ASC) VISIBLE,
  CONSTRAINT `fk_Existencia_Producto_idProducto`
    FOREIGN KEY (`idProducto`)
    REFERENCES `alchilazodb`.`Producto` (`idProducto`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Existencia_Direccion_idDireccion`
    FOREIGN KEY (`idDireccion`)
    REFERENCES `alchilazodb`.`DireccionEmpresa` (`idDireccion`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `alchilazodb`.`Cupon`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alchilazodb`.`Cupon` (
  `idCupon` INT NOT NULL AUTO_INCREMENT,
  `numeroCupon` VARCHAR(50) NOT NULL,
  `valorPorciento` INT GENERATED ALWAYS AS (15) VIRTUAL,
  `canjeado` TINYINT NOT NULL,
  `idusuario` INT NOT NULL,
  PRIMARY KEY (`idCupon`),
  INDEX `fk_cupon_usuario_idusuario_idx` (`idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_cupon_usuario_idusuario`
    FOREIGN KEY (`idusuario`)
    REFERENCES `alchilazodb`.`Usuario` (`idusuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
-- begin attached script 'script'
USE alchilazodb;
INSERT INTO Departamento (idDepartamento, departamento) VALUES(1, 'Guatemala');
INSERT INTO Municipio (municipio, departamento) VALUES('Mixco', 1);
INSERT INTO Municipio (municipio, departamento) VALUES('Chinutla', 1);
INSERT INTO Municipio (municipio, departamento) VALUES('Guatemala', 1);

INSERT INTO Departamento (idDepartamento, departamento) VALUES(2, 'Quetzaltenango');
INSERT INTO Municipio (municipio, departamento) VALUES('San Mateo',2);
INSERT INTO Municipio (municipio, departamento) VALUES('Quetzaltenango',2);
INSERT INTO Municipio (municipio, departamento) VALUES('El Palmar', 2);

INSERT INTO Estados (idEstado, nombreEstado) VALUES(0, 'Esperando Administracion');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(1, 'Disponible');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(2, 'Ocupado');

INSERT INTO Estados (idEstado, nombreEstado) VALUES(3, 'Creando Orden');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(4, 'Orden Aceptada');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(5, 'Orden Cancelada');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(6, 'Orden en Camino');
INSERT INTO Estados (idEstado, nombreEstado) VALUES(7, 'Orden Entregada');







-- end attached script 'script'