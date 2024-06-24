CREATE TABLE laporan (
    idlaporan INT(11) NOT NULL AUTO_INCREMENT,
    iduser INT(11) DEFAULT NULL,
    laporan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location VARCHAR(45) NOT NULL,
    description VARCHAR(100) NOT NULL,
    status ENUM('menunggu', 'diproses', 'selesai') DEFAULT 'menunggu',
    category ENUM('berat', 'sedang') DEFAULT 'sedang',
    photo VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (idlaporan),
    FOREIGN KEY (iduser) REFERENCES user(iduser)
);