PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Category (
  categ_id INTEGER PRIMARY KEY AUTOINCREMENT,
  categ_name TEXT NOT NULL UNIQUE,
  order_in_list INTEGER,
  description TEXT
);
INSERT INTO Category VALUES(35,'Age',1,NULL);
INSERT INTO Category VALUES(36,'Gender',1,NULL);
INSERT INTO Category VALUES(37,'Race',1,NULL);
INSERT INTO Category VALUES(38,'Accesoirs',1,NULL);
INSERT INTO Category VALUES(39,'Light amount',1,NULL);
INSERT INTO Category VALUES(40,'Facial Expression',1,NULL);
INSERT INTO Category VALUES(41,'Animals',1,NULL);
INSERT INTO Category VALUES(42,'Background',1,NULL);
INSERT INTO Category VALUES(43,'Amount of people',1,NULL);
INSERT INTO Category VALUES(44,'Special objects',1,NULL);
INSERT INTO Category VALUES(48,'Image styles',1,NULL);
CREATE TABLE Undercategory (
  ucateg_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ucateg_name TEXT NOT NULL,
  categ_id INTEGER NOT NULL,
  order_in_list INTEGER,
  descrption TEXT,
  FOREIGN KEY (categ_id) REFERENCES Category(categ_id)
);
INSERT INTO Undercategory VALUES(1,'Children',1,1,NULL);
INSERT INTO Undercategory VALUES(2,'Young Adults',1,2,NULL);
INSERT INTO Undercategory VALUES(3,'Adults',1,3,NULL);
INSERT INTO Undercategory VALUES(4,'Retirement age',1,4,NULL);
INSERT INTO Undercategory VALUES(5,'Single Person',4,1,NULL);
INSERT INTO Undercategory VALUES(6,'Couple of People',4,2,NULL);
INSERT INTO Undercategory VALUES(7,'Group of People',4,3,NULL);
INSERT INTO Undercategory VALUES(8,'Crowd',4,4,NULL);
INSERT INTO Undercategory VALUES(9,'No people',4,5,NULL);
INSERT INTO Undercategory VALUES(107,'1','add-category',1,NULL);
INSERT INTO Undercategory VALUES(108,'New Undercategory','add-category',2,NULL);
INSERT INTO Undercategory VALUES(141,'Child',35,1,NULL);
INSERT INTO Undercategory VALUES(142,'Teen',35,2,NULL);
INSERT INTO Undercategory VALUES(143,'Adult',35,3,NULL);
INSERT INTO Undercategory VALUES(144,'Elderly',35,4,NULL);
INSERT INTO Undercategory VALUES(145,'Male',36,1,NULL);
INSERT INTO Undercategory VALUES(146,'Female',36,2,NULL);
INSERT INTO Undercategory VALUES(147,'Other',36,3,NULL);
INSERT INTO Undercategory VALUES(148,'White',37,1,NULL);
INSERT INTO Undercategory VALUES(149,'Black',37,2,NULL);
INSERT INTO Undercategory VALUES(150,'Asian',37,3,NULL);
INSERT INTO Undercategory VALUES(154,'Hat',38,1,NULL);
INSERT INTO Undercategory VALUES(155,'Glasses',38,2,NULL);
INSERT INTO Undercategory VALUES(157,'Scarf',38,3,NULL);
INSERT INTO Undercategory VALUES(164,'Monkeys',41,1,NULL);
INSERT INTO Undercategory VALUES(165,'Dogs',41,2,NULL);
INSERT INTO Undercategory VALUES(166,'Horses',41,3,NULL);
INSERT INTO Undercategory VALUES(167,'Indoor',42,1,NULL);
INSERT INTO Undercategory VALUES(168,'Outdoor',42,2,NULL);
INSERT INTO Undercategory VALUES(169,'Complex',42,3,NULL);
INSERT INTO Undercategory VALUES(170,'Single person',43,1,NULL);
INSERT INTO Undercategory VALUES(171,'Two people',43,2,NULL);
INSERT INTO Undercategory VALUES(172,'Group of people',43,3,NULL);
INSERT INTO Undercategory VALUES(173,'Crowd',43,4,NULL);
INSERT INTO Undercategory VALUES(174,'No people',43,5,NULL);
INSERT INTO Undercategory VALUES(175,'Happy',40,1,NULL);
INSERT INTO Undercategory VALUES(176,'Sad',40,2,NULL);
INSERT INTO Undercategory VALUES(177,'Angry',40,3,NULL);
INSERT INTO Undercategory VALUES(178,'Usual',40,4,NULL);
INSERT INTO Undercategory VALUES(183,'Mirror',44,1,NULL);
INSERT INTO Undercategory VALUES(184,'Dark',39,1,NULL);
INSERT INTO Undercategory VALUES(185,'Light',39,2,NULL);
INSERT INTO Undercategory VALUES(186,'Normal',39,3,NULL);
INSERT INTO Undercategory VALUES(187,'Monochrome',39,4,NULL);
INSERT INTO Undercategory VALUES(188,'Complex',39,5,NULL);
INSERT INTO Undercategory VALUES(196,'T-Shirt with face',44,2,NULL);
INSERT INTO Undercategory VALUES(197,'Photos',48,1,NULL);
INSERT INTO Undercategory VALUES(199,'Stylized character',48,2,NULL);
INSERT INTO Undercategory VALUES(200,'Painting',48,3,NULL);
INSERT INTO Undercategory VALUES(201,'Statues',44,3,NULL);
INSERT INTO Undercategory VALUES(202,'Medical mask',38,4,NULL);
CREATE TABLE Neural_Network (
  nn_id INTEGER PRIMARY KEY AUTOINCREMENT,
  nn_name TEXT NOT NULL
);
INSERT INTO Neural_Network VALUES(1,'jonathandinu/face-parsing');
INSERT INTO Neural_Network VALUES(2,'mattmdjaga/segformer_b2_clothes');
INSERT INTO Neural_Network VALUES(3,'nvidia/segformer-b0-finetuned-ade-512-512');
COMMIT;
