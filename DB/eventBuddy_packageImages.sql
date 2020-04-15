-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: eventBuddy
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `packageImages`
--

DROP TABLE IF EXISTS `packageImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packageImages` (
  `imageID` int(11) NOT NULL AUTO_INCREMENT,
  `imageName` varchar(2000) NOT NULL,
  `location` varchar(2000) NOT NULL,
  `packageOwnerID` int(11) NOT NULL,
  `packageID` int(11) NOT NULL,
  PRIMARY KEY (`imageID`),
  UNIQUE KEY `packageImages_imageID_uindex` (`imageID`),
  UNIQUE KEY `packageImages_imageName_uindex` (`imageName`),
  UNIQUE KEY `packageImages_location_uindex` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packageImages`
--

LOCK TABLES `packageImages` WRITE;
/*!40000 ALTER TABLE `packageImages` DISABLE KEYS */;
INSERT INTO `packageImages` VALUES (1,'\"error.png\"','\"uploads/error.png\"',22,1),(2,'\"Screenshot.png\"','\"uploads/Screenshot.png\"',22,1),(3,'\"2020-04-09 19:44:49Screenshot.png\"','\"uploads/2020-04-09 19:44:49Screenshot.png\"',22,4),(4,'\"2020-04-09 19:44:49error.png\"','\"uploads/2020-04-09 19:44:49error.png\"',22,3);
/*!40000 ALTER TABLE `packageImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packages` (
  `packageID` int(11) NOT NULL AUTO_INCREMENT,
  `packageName` varchar(200) NOT NULL,
  `packageUniqueCode` varchar(50) NOT NULL,
  `packageAddedDate` date NOT NULL,
  `packagePrice` double NOT NULL,
  `packageDescription` varchar(3000) NOT NULL,
  `packageOwnerID` int(11) NOT NULL,
  `packageImages` varchar(1000) DEFAULT NULL,
  `packageStatus` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`packageID`),
  UNIQUE KEY `packages_pk` (`packageUniqueCode`,`packageOwnerID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,'ssss','1','2020-04-09',11,'sdsdf',22,NULL,0),(4,'ssss','2','2020-04-09',11,'sdsdf',22,NULL,0);
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(30) NOT NULL,
  `userPassword` varchar(30) NOT NULL,
  `companyName` varchar(80) NOT NULL,
  `registeredDate` date NOT NULL,
  `telephone` int(11) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `users_userEmail_uindex` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pasindu@gmail.com','12345','EventBuddy','2020-01-13',774448102);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'eventBuddy'
--

--
-- Dumping routines for database 'eventBuddy'
--
/*!50003 DROP PROCEDURE IF EXISTS `insert_images` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_images`(packageName VARCHAR(300), packageUniqueCode VARCHAR(100), packageAddedDate DATE, packagePrice DOUBLE, packageDescription VARCHAR(3000), packageOwnerID INT, images VARCHAR(500))
BEGIN
    declare i INT default 0;
START TRANSACTION;
   INSERT INTO packages(packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID) 
     VALUES(packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID);
  SET i = 0;
   WHILE i < JSON_LENGTH(images) DO
    INSERT INTO packageImages(imageName, location, packageOwnerID, packageID) 
	VALUES(JSON_EXTRACT(images,CONCAT( '$[', `i`, '].imageName')), JSON_EXTRACT(images,CONCAT( '$[', `i`, '].location')), packageOwnerID,LAST_INSERT_ID());
	SET i = i + 1;
   END WHILE;
COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_images_bkp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_images_bkp`(packageName VARCHAR(300), packageUniqueCode VARCHAR(100), packageAddedDate DATE, packagePrice DOUBLE, packageDescription VARCHAR(3000), packageOwnerID INT, imageName VARCHAR(500), location VARCHAR(1500))
BEGIN
START TRANSACTION;
   INSERT INTO packages(packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID) 
     VALUES(packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID);
     
   INSERT INTO packageImages(imageName, location, packageOwnerID, packageID) 
     VALUES(imageName, location, packageOwnerID,LAST_INSERT_ID());
COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-15 17:43:30
