-- --------------------------------------------------------
-- Host:                         localhost
-- Versione server:              10.6.21-MariaDB-ubu2004 - mariadb.org binary distribution
-- S.O. server:                  debian-linux-gnu
-- HeidiSQL Versione:            11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database tablebook
CREATE DATABASE IF NOT EXISTS `tablebook` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `tablebook`;

-- Dump della struttura di tabella tablebook.reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `idReservation` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `booker` int(10) unsigned NOT NULL COMMENT 'id dello user che ha prenotato',
  `when` datetime DEFAULT NULL COMMENT 'Per quando a prenotato',
  `guests` smallint(5) unsigned DEFAULT 1 COMMENT 'Numero ospiti',
  `note` tinytext DEFAULT NULL COMMENT 'Particolari richieste',
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bookStatus` enum('PENDENT','ACCEPTED','REYECTED','DELETED','ADMIN_CANCELLED') NOT NULL DEFAULT 'PENDENT' COMMENT '''PENDENT'',''ACCEPTED'',''REYECTED'',''DELETED'',''ADMIN_CANCELLED''',
  `assignedTable` int(10) unsigned DEFAULT NULL,
  `bookedFrom` int(10) unsigned NOT NULL COMMENT 'Se prenotato da web campo uguale a booker, altrimenti id di chi ha fatto la registrazione',
  PRIMARY KEY (`idReservation`),
  KEY `FK_reservation_table` (`assignedTable`),
  KEY `FK_reservation_user` (`booker`),
  KEY `FK_reservation_user_2` (`bookedFrom`),
  CONSTRAINT `FK_reservation_table` FOREIGN KEY (`assignedTable`) REFERENCES `table` (`idTable`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `FK_reservation_user` FOREIGN KEY (`booker`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `FK_reservation_user_2` FOREIGN KEY (`bookedFrom`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella tablebook.reservation: ~0 rows (circa)
DELETE FROM `reservation`;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;

-- Dump della struttura di tabella tablebook.table
CREATE TABLE IF NOT EXISTS `table` (
  `idTable` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tableName` tinytext DEFAULT NULL,
  `seatNumber` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `availableFrom` datetime NOT NULL DEFAULT current_timestamp(),
  `availableUntil` datetime DEFAULT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idTable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella tablebook.table: ~0 rows (circa)
DELETE FROM `table`;
/*!40000 ALTER TABLE `table` DISABLE KEYS */;
INSERT INTO `table` (`idTable`, `tableName`, `seatNumber`, `availableFrom`, `availableUntil`, `updated`) VALUES
	(1, 'primo', 4, '2025-02-08 20:37:01', NULL, '2025-02-08 20:37:01');
/*!40000 ALTER TABLE `table` ENABLE KEYS */;

-- Dump della struttura di tabella tablebook.user
CREATE TABLE IF NOT EXISTS `user` (
  `idUser` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` tinytext NOT NULL,
  `name` tinytext NOT NULL,
  `phone` tinytext NOT NULL COMMENT 'Opzione per autenticazione a due livelli',
  `password` tinytext NOT NULL COMMENT 'password: pbkdf2:sha256:1000000$xMG7L8wZqNOAfSwn$460614d6da0f0df7c8ee0bf879e461b4efd0c4922d31ce534fe10b38aeb08b06',
  `authorizedCode` smallint(6) DEFAULT 0 COMMENT 'Se NULL l''utente è autorizzato',
  `privilege` tinyint(4) NOT NULL DEFAULT 40 COMMENT 'OWNER=0, ADMIN=10, MANAGER=20, STAFF=30, USER=40',
  `adminNote` text DEFAULT NULL COMMENT 'Note dell''amministratore sul cliente',
  `updateDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`idUser`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING HASH,
  UNIQUE KEY `name` (`name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='Tabella con i dati utente';

-- Dump dei dati della tabella tablebook.user: ~2 rows (circa)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`idUser`, `email`, `name`, `phone`, `password`, `authorizedCode`, `privilege`, `adminNote`, `updateDate`, `deleted`) VALUES
	(1, 'owner', 'owner', '0000000', 'pbkdf2:sha256:1000000$xMG7L8wZqNOAfSwn$460614d6da0f0df7c8ee0bf879e461b4efd0c4922d31ce534fe10b38aeb08b06', NULL, 0, NULL, '2025-01-30 23:22:24', b'0'),
	(2, 'admin', 'admin', '0000000', 'pbkdf2:sha256:1000000$xMG7L8wZqNOAfSwn$460614d6da0f0df7c8ee0bf879e461b4efd0c4922d31ce534fe10b38aeb08b06', NULL, 10, NULL, '2025-01-30 23:22:40', b'0');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
