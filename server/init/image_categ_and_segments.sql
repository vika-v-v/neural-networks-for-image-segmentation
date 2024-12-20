PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Image_Undercateg (
  img_id INTEGER NOT NULL,
  undercateg_id INTEGER NOT NULL,
  FOREIGN KEY (img_id) REFERENCES Image(img_id),
  FOREIGN KEY (undercateg_id) REFERENCES Undercategory(ucateg_id),
  PRIMARY KEY (img_id, undercateg_id)
);
INSERT INTO Image_Undercateg VALUES(16,143);
INSERT INTO Image_Undercateg VALUES(22,143);
INSERT INTO Image_Undercateg VALUES(24,143);
INSERT INTO Image_Undercateg VALUES(24,146);
INSERT INTO Image_Undercateg VALUES(24,150);
INSERT INTO Image_Undercateg VALUES(24,182);
INSERT INTO Image_Undercateg VALUES(24,178);
INSERT INTO Image_Undercateg VALUES(24,170);
INSERT INTO Image_Undercateg VALUES(25,142);
INSERT INTO Image_Undercateg VALUES(25,146);
INSERT INTO Image_Undercateg VALUES(25,148);
INSERT INTO Image_Undercateg VALUES(25,181);
INSERT INTO Image_Undercateg VALUES(25,178);
INSERT INTO Image_Undercateg VALUES(25,167);
INSERT INTO Image_Undercateg VALUES(25,170);
INSERT INTO Image_Undercateg VALUES(30,145);
INSERT INTO Image_Undercateg VALUES(30,148);
INSERT INTO Image_Undercateg VALUES(30,180);
INSERT INTO Image_Undercateg VALUES(30,181);
INSERT INTO Image_Undercateg VALUES(30,178);
INSERT INTO Image_Undercateg VALUES(30,168);
INSERT INTO Image_Undercateg VALUES(30,171);
INSERT INTO Image_Undercateg VALUES(31,144);
INSERT INTO Image_Undercateg VALUES(31,181);
INSERT INTO Image_Undercateg VALUES(31,178);
INSERT INTO Image_Undercateg VALUES(31,169);
INSERT INTO Image_Undercateg VALUES(31,170);
INSERT INTO Image_Undercateg VALUES(32,144);
INSERT INTO Image_Undercateg VALUES(32,146);
INSERT INTO Image_Undercateg VALUES(32,148);
INSERT INTO Image_Undercateg VALUES(32,181);
INSERT INTO Image_Undercateg VALUES(32,175);
INSERT INTO Image_Undercateg VALUES(32,167);
INSERT INTO Image_Undercateg VALUES(32,169);
INSERT INTO Image_Undercateg VALUES(32,170);
INSERT INTO Image_Undercateg VALUES(34,144);
INSERT INTO Image_Undercateg VALUES(34,145);
INSERT INTO Image_Undercateg VALUES(34,148);
INSERT INTO Image_Undercateg VALUES(34,154);
INSERT INTO Image_Undercateg VALUES(34,188);
INSERT INTO Image_Undercateg VALUES(34,175);
INSERT INTO Image_Undercateg VALUES(34,170);
INSERT INTO Image_Undercateg VALUES(34,168);
INSERT INTO Image_Undercateg VALUES(62,145);
INSERT INTO Image_Undercateg VALUES(62,148);
INSERT INTO Image_Undercateg VALUES(27,145);
INSERT INTO Image_Undercateg VALUES(27,146);
INSERT INTO Image_Undercateg VALUES(27,148);
INSERT INTO Image_Undercateg VALUES(27,168);
INSERT INTO Image_Undercateg VALUES(27,171);
INSERT INTO Image_Undercateg VALUES(27,175);
INSERT INTO Image_Undercateg VALUES(27,178);
INSERT INTO Image_Undercateg VALUES(29,145);
INSERT INTO Image_Undercateg VALUES(29,165);
INSERT INTO Image_Undercateg VALUES(29,168);
INSERT INTO Image_Undercateg VALUES(29,170);
INSERT INTO Image_Undercateg VALUES(28,146);
INSERT INTO Image_Undercateg VALUES(28,168);
INSERT INTO Image_Undercateg VALUES(28,170);
INSERT INTO Image_Undercateg VALUES(27,141);
INSERT INTO Image_Undercateg VALUES(28,141);
INSERT INTO Image_Undercateg VALUES(29,141);
INSERT INTO Image_Undercateg VALUES(30,141);
INSERT INTO Image_Undercateg VALUES(60,141);
INSERT INTO Image_Undercateg VALUES(62,141);
INSERT INTO Image_Undercateg VALUES(63,143);
INSERT INTO Image_Undercateg VALUES(63,146);
INSERT INTO Image_Undercateg VALUES(63,148);
INSERT INTO Image_Undercateg VALUES(63,186);
INSERT INTO Image_Undercateg VALUES(63,175);
INSERT INTO Image_Undercateg VALUES(63,170);
INSERT INTO Image_Undercateg VALUES(67,142);
INSERT INTO Image_Undercateg VALUES(67,146);
INSERT INTO Image_Undercateg VALUES(67,148);
INSERT INTO Image_Undercateg VALUES(67,155);
INSERT INTO Image_Undercateg VALUES(10,197);
INSERT INTO Image_Undercateg VALUES(22,197);
INSERT INTO Image_Undercateg VALUES(24,197);
INSERT INTO Image_Undercateg VALUES(25,197);
INSERT INTO Image_Undercateg VALUES(29,197);
INSERT INTO Image_Undercateg VALUES(67,197);
INSERT INTO Image_Undercateg VALUES(68,142);
INSERT INTO Image_Undercateg VALUES(68,146);
INSERT INTO Image_Undercateg VALUES(68,148);
INSERT INTO Image_Undercateg VALUES(68,154);
INSERT INTO Image_Undercateg VALUES(68,167);
INSERT INTO Image_Undercateg VALUES(68,197);
INSERT INTO Image_Undercateg VALUES(70,144);
INSERT INTO Image_Undercateg VALUES(70,155);
INSERT INTO Image_Undercateg VALUES(70,187);
INSERT INTO Image_Undercateg VALUES(70,175);
INSERT INTO Image_Undercateg VALUES(70,171);
INSERT INTO Image_Undercateg VALUES(72,147);
INSERT INTO Image_Undercateg VALUES(72,154);
INSERT INTO Image_Undercateg VALUES(72,169);
INSERT INTO Image_Undercateg VALUES(72,168);
INSERT INTO Image_Undercateg VALUES(73,141);
INSERT INTO Image_Undercateg VALUES(73,202);
INSERT INTO Image_Undercateg VALUES(73,167);
INSERT INTO Image_Undercateg VALUES(74,147);
INSERT INTO Image_Undercateg VALUES(74,169);
INSERT INTO Image_Undercateg VALUES(75,147);
INSERT INTO Image_Undercateg VALUES(75,164);
INSERT INTO Image_Undercateg VALUES(75,168);
INSERT INTO Image_Undercateg VALUES(75,174);
INSERT INTO Image_Undercateg VALUES(76,147);
INSERT INTO Image_Undercateg VALUES(76,164);
INSERT INTO Image_Undercateg VALUES(76,168);
INSERT INTO Image_Undercateg VALUES(76,174);
INSERT INTO Image_Undercateg VALUES(77,147);
INSERT INTO Image_Undercateg VALUES(77,164);
INSERT INTO Image_Undercateg VALUES(77,174);
INSERT INTO Image_Undercateg VALUES(77,183);
INSERT INTO Image_Undercateg VALUES(16,149);
INSERT INTO Image_Undercateg VALUES(22,149);
INSERT INTO Image_Undercateg VALUES(78,143);
INSERT INTO Image_Undercateg VALUES(78,146);
INSERT INTO Image_Undercateg VALUES(78,149);
INSERT INTO Image_Undercateg VALUES(78,156);
INSERT INTO Image_Undercateg VALUES(79,149);
INSERT INTO Image_Undercateg VALUES(79,188);
INSERT INTO Image_Undercateg VALUES(79,169);
INSERT INTO Image_Undercateg VALUES(80,149);
INSERT INTO Image_Undercateg VALUES(80,154);
INSERT INTO Image_Undercateg VALUES(80,155);
INSERT INTO Image_Undercateg VALUES(80,175);
INSERT INTO Image_Undercateg VALUES(81,142);
INSERT INTO Image_Undercateg VALUES(81,150);
INSERT INTO Image_Undercateg VALUES(81,188);
INSERT INTO Image_Undercateg VALUES(81,167);
INSERT INTO Image_Undercateg VALUES(82,150);
INSERT INTO Image_Undercateg VALUES(82,155);
INSERT INTO Image_Undercateg VALUES(82,169);
INSERT INTO Image_Undercateg VALUES(83,150);
INSERT INTO Image_Undercateg VALUES(83,155);
INSERT INTO Image_Undercateg VALUES(83,167);
INSERT INTO Image_Undercateg VALUES(84,146);
INSERT INTO Image_Undercateg VALUES(84,143);
INSERT INTO Image_Undercateg VALUES(84,157);
INSERT INTO Image_Undercateg VALUES(84,175);
INSERT INTO Image_Undercateg VALUES(84,168);
INSERT INTO Image_Undercateg VALUES(84,169);
INSERT INTO Image_Undercateg VALUES(85,157);
INSERT INTO Image_Undercateg VALUES(85,188);
INSERT INTO Image_Undercateg VALUES(85,169);
INSERT INTO Image_Undercateg VALUES(85,168);
INSERT INTO Image_Undercateg VALUES(86,142);
INSERT INTO Image_Undercateg VALUES(86,154);
INSERT INTO Image_Undercateg VALUES(86,155);
INSERT INTO Image_Undercateg VALUES(86,157);
INSERT INTO Image_Undercateg VALUES(86,168);
INSERT INTO Image_Undercateg VALUES(86,169);
INSERT INTO Image_Undercateg VALUES(87,142);
INSERT INTO Image_Undercateg VALUES(87,146);
INSERT INTO Image_Undercateg VALUES(87,148);
INSERT INTO Image_Undercateg VALUES(87,155);
INSERT INTO Image_Undercateg VALUES(87,186);
INSERT INTO Image_Undercateg VALUES(87,178);
INSERT INTO Image_Undercateg VALUES(87,168);
INSERT INTO Image_Undercateg VALUES(88,145);
INSERT INTO Image_Undercateg VALUES(88,150);
INSERT INTO Image_Undercateg VALUES(88,155);
INSERT INTO Image_Undercateg VALUES(88,157);
INSERT INTO Image_Undercateg VALUES(88,176);
INSERT INTO Image_Undercateg VALUES(88,168);
INSERT INTO Image_Undercateg VALUES(89,142);
INSERT INTO Image_Undercateg VALUES(89,155);
INSERT INTO Image_Undercateg VALUES(89,202);
INSERT INTO Image_Undercateg VALUES(89,188);
INSERT INTO Image_Undercateg VALUES(89,168);
INSERT INTO Image_Undercateg VALUES(89,169);
INSERT INTO Image_Undercateg VALUES(90,150);
INSERT INTO Image_Undercateg VALUES(90,202);
INSERT INTO Image_Undercateg VALUES(90,186);
INSERT INTO Image_Undercateg VALUES(90,171);
INSERT INTO Image_Undercateg VALUES(91,142);
INSERT INTO Image_Undercateg VALUES(91,146);
INSERT INTO Image_Undercateg VALUES(91,150);
INSERT INTO Image_Undercateg VALUES(91,202);
INSERT INTO Image_Undercateg VALUES(91,167);
INSERT INTO Image_Undercateg VALUES(91,183);
INSERT INTO Image_Undercateg VALUES(69,143);
INSERT INTO Image_Undercateg VALUES(69,146);
INSERT INTO Image_Undercateg VALUES(69,154);
INSERT INTO Image_Undercateg VALUES(69,155);
INSERT INTO Image_Undercateg VALUES(69,175);
INSERT INTO Image_Undercateg VALUES(92,184);
INSERT INTO Image_Undercateg VALUES(92,167);
INSERT INTO Image_Undercateg VALUES(92,169);
INSERT INTO Image_Undercateg VALUES(92,174);
INSERT INTO Image_Undercateg VALUES(92,201);
INSERT INTO Image_Undercateg VALUES(93,142);
INSERT INTO Image_Undercateg VALUES(93,188);
INSERT INTO Image_Undercateg VALUES(93,184);
INSERT INTO Image_Undercateg VALUES(93,168);
INSERT INTO Image_Undercateg VALUES(93,169);
INSERT INTO Image_Undercateg VALUES(94,141);
INSERT INTO Image_Undercateg VALUES(94,184);
INSERT INTO Image_Undercateg VALUES(94,170);
INSERT INTO Image_Undercateg VALUES(95,184);
INSERT INTO Image_Undercateg VALUES(95,188);
INSERT INTO Image_Undercateg VALUES(95,173);
INSERT INTO Image_Undercateg VALUES(96,143);
INSERT INTO Image_Undercateg VALUES(96,150);
INSERT INTO Image_Undercateg VALUES(96,167);
INSERT INTO Image_Undercateg VALUES(96,169);
INSERT INTO Image_Undercateg VALUES(97,141);
INSERT INTO Image_Undercateg VALUES(97,147);
INSERT INTO Image_Undercateg VALUES(97,175);
INSERT INTO Image_Undercateg VALUES(68,185);
INSERT INTO Image_Undercateg VALUES(84,185);
INSERT INTO Image_Undercateg VALUES(88,185);
INSERT INTO Image_Undercateg VALUES(96,185);
INSERT INTO Image_Undercateg VALUES(97,185);
INSERT INTO Image_Undercateg VALUES(98,144);
INSERT INTO Image_Undercateg VALUES(98,187);
INSERT INTO Image_Undercateg VALUES(98,176);
INSERT INTO Image_Undercateg VALUES(99,141);
INSERT INTO Image_Undercateg VALUES(99,149);
INSERT INTO Image_Undercateg VALUES(99,187);
INSERT INTO Image_Undercateg VALUES(99,169);
INSERT INTO Image_Undercateg VALUES(99,172);
INSERT INTO Image_Undercateg VALUES(100,155);
INSERT INTO Image_Undercateg VALUES(100,187);
INSERT INTO Image_Undercateg VALUES(100,176);
INSERT INTO Image_Undercateg VALUES(100,169);
INSERT INTO Image_Undercateg VALUES(101,149);
INSERT INTO Image_Undercateg VALUES(101,176);
INSERT INTO Image_Undercateg VALUES(101,168);
INSERT INTO Image_Undercateg VALUES(102,141);
INSERT INTO Image_Undercateg VALUES(102,177);
INSERT INTO Image_Undercateg VALUES(102,169);
INSERT INTO Image_Undercateg VALUES(103,177);
INSERT INTO Image_Undercateg VALUES(103,169);
INSERT INTO Image_Undercateg VALUES(103,170);
INSERT INTO Image_Undercateg VALUES(103,183);
INSERT INTO Image_Undercateg VALUES(104,184);
INSERT INTO Image_Undercateg VALUES(104,177);
INSERT INTO Image_Undercateg VALUES(105,147);
INSERT INTO Image_Undercateg VALUES(105,165);
INSERT INTO Image_Undercateg VALUES(105,174);
INSERT INTO Image_Undercateg VALUES(106,147);
INSERT INTO Image_Undercateg VALUES(106,165);
INSERT INTO Image_Undercateg VALUES(106,174);
INSERT INTO Image_Undercateg VALUES(107,165);
INSERT INTO Image_Undercateg VALUES(107,169);
INSERT INTO Image_Undercateg VALUES(107,171);
INSERT INTO Image_Undercateg VALUES(108,143);
INSERT INTO Image_Undercateg VALUES(108,154);
INSERT INTO Image_Undercateg VALUES(108,166);
INSERT INTO Image_Undercateg VALUES(108,169);
INSERT INTO Image_Undercateg VALUES(109,166);
INSERT INTO Image_Undercateg VALUES(109,174);
INSERT INTO Image_Undercateg VALUES(110,154);
INSERT INTO Image_Undercateg VALUES(110,166);
INSERT INTO Image_Undercateg VALUES(110,173);
INSERT INTO Image_Undercateg VALUES(111,175);
INSERT INTO Image_Undercateg VALUES(111,172);
INSERT INTO Image_Undercateg VALUES(112,168);
INSERT INTO Image_Undercateg VALUES(112,175);
INSERT INTO Image_Undercateg VALUES(112,172);
INSERT INTO Image_Undercateg VALUES(113,184);
INSERT INTO Image_Undercateg VALUES(113,173);
INSERT INTO Image_Undercateg VALUES(114,188);
INSERT INTO Image_Undercateg VALUES(114,173);
INSERT INTO Image_Undercateg VALUES(115,142);
INSERT INTO Image_Undercateg VALUES(115,167);
INSERT INTO Image_Undercateg VALUES(115,196);
INSERT INTO Image_Undercateg VALUES(116,178);
INSERT INTO Image_Undercateg VALUES(116,196);
INSERT INTO Image_Undercateg VALUES(117,174);
INSERT INTO Image_Undercateg VALUES(117,201);
INSERT INTO Image_Undercateg VALUES(118,187);
INSERT INTO Image_Undercateg VALUES(118,174);
INSERT INTO Image_Undercateg VALUES(118,201);
INSERT INTO Image_Undercateg VALUES(71,144);
INSERT INTO Image_Undercateg VALUES(71,155);
INSERT INTO Image_Undercateg VALUES(71,169);
INSERT INTO Image_Undercateg VALUES(71,172);
INSERT INTO Image_Undercateg VALUES(119,201);
INSERT INTO Image_Undercateg VALUES(119,200);
INSERT INTO Image_Undercateg VALUES(120,200);
INSERT INTO Image_Undercateg VALUES(121,172);
INSERT INTO Image_Undercateg VALUES(121,200);
INSERT INTO Image_Undercateg VALUES(122,199);
INSERT INTO Image_Undercateg VALUES(123,199);
INSERT INTO Image_Undercateg VALUES(124,199);
INSERT INTO Image_Undercateg VALUES(125,143);
INSERT INTO Image_Undercateg VALUES(125,146);
INSERT INTO Image_Undercateg VALUES(10,203);
INSERT INTO Image_Undercateg VALUES(16,203);
INSERT INTO Image_Undercateg VALUES(70,203);
INSERT INTO Image_Undercateg VALUES(72,203);
INSERT INTO Image_Undercateg VALUES(126,142);
INSERT INTO Image_Undercateg VALUES(126,143);
INSERT INTO Image_Undercateg VALUES(126,144);
INSERT INTO Image_Undercateg VALUES(126,146);
INSERT INTO Image_Undercateg VALUES(126,203);
INSERT INTO Image_Undercateg VALUES(27,205);
INSERT INTO Image_Undercateg VALUES(28,205);
INSERT INTO Image_Undercateg VALUES(60,205);
INSERT INTO Image_Undercateg VALUES(62,205);
INSERT INTO Image_Undercateg VALUES(16,208);
INSERT INTO Image_Undercateg VALUES(24,208);
INSERT INTO Image_Undercateg VALUES(28,208);
INSERT INTO Image_Undercateg VALUES(22,212);
INSERT INTO Image_Undercateg VALUES(69,212);
INSERT INTO Image_Undercateg VALUES(73,212);
INSERT INTO Image_Undercateg VALUES(78,212);
CREATE TABLE Processed_Image (
  lbl_name TEXT NOT NULL,
  lbl_color TEXT NOT NULL,
  score INTEGER,
  pimg_base64 TEXT,
  img_id INTEGER NOT NULL,
  nn_id INTEGER NOT NULL,
  FOREIGN KEY (img_id) REFERENCES Image(img_id),
  FOREIGN KEY (nn_id) REFERENCES Neural_Network(nn_id),
  PRIMARY KEY (img_id, lbl_name, nn_id)
);
COMMIT;