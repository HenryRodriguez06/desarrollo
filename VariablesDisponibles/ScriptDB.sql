CREATE DATABASE `variablesdisponibles`

USE `variablesdisponibles`

CREATE TABLE `variablesdisponibles`.`cat_moneda` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cod_moneda` INT NOT NULL,
  `descripcion` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`));
  
DELIMITER $$
USE `variablesdisponibles`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertarMoneda`(IN cod_moneda INT, IN descripcion TEXT)
BEGIN
	
	INSERT INTO cat_moneda(cod_moneda, descripcion)
	values(cod_moneda, descripcion);
    
END$$

DELIMITER ;
;