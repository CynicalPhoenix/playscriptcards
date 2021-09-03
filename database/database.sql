CREATE DATABASE dbScriptCards;
USE dbScriptCards;

CREATE TABLE tbCards (
    cardId INT PRIMARY KEY, /* id de la carta */

    cardAttack INT NOT NULL, /* ataque de la carta */
    cardHealth INT NOT NULL, /* vida de la carta */
    cardCost INT NOT NULL, /* coste de la carta */

    cardName VARCHAR(150) NOT NULL, /* nombre de la carta */
    cardDesciption VARCHAR(225) NOT NULL, /* documentación de la carta */
    cardComment VARCHAR(225) NOT NULL, /* comentario referencial a la cultura de internet */
    
    cardTypeId INT NOT NULL, /* hace referencia a la tabla tipos de carta */
    FOREIGN KEY (cardTypeId) REFERENCES tbCardsTypes(cardTypeId),

    cardLanguajeId INT NOT NULL, /* hace referencia a la tabla lenguajes de carta */
    FOREIGN KEY (cardLanguajeId) REFERENCES tbCardsTypes(cardLanguajeId)

    cardRarity INT NOT NULL, /* hace referencia a la tabla rareza de carta */
    FOREIGN KEY (cardRarityId) REFERENCES tbCardsTypes(cardRarityId)
);


CREATE TABLE tbCardTypes (
    cardTypeId INT PRIMARY KEY,
    cardTypeName VARCHAR(150) NOT NULL /*('Function', 'Object', 'Declaration', 'Statments', 'variables', 'numbers')*/
);

CREATE TABLE tbCardLanguajes (
    cardLanguajeId INT PRIMARY KEY,
    cardLanguajeName VARCHAR(150) NOT NULL, /*('javascript', 'php', 'python')*/
);

CREATE TABLE tbCardRarity (
    cardRarityId INT PRIMARY KEY,
    cardRarityName VARCHAR(150) NOT NULL, /*('Basic', 'Rare', 'SuperRare', 'Legendary')*/
);

CREATE TABLE tbUsers (
    userId INT PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    userEmail VARCHAR(150) NOT NULL,
    userPassword VARCHAR(30) NOT NULL,
    userBirth DATE NOT NULL, /* Fecha de nacimiento */

    userCountryId INT, /* hace referencia a la tabla país de usuario */
    FOREIGN KEY (userCountryId) REFERENCES tbUserCountry(userCountryId)
);

CREATE TABLE tbUserCountry (
    userCountryId INT PRIMARY KEY, /* paises */
    userCountryName VARCHAR(150)
);

CREATE TABLE tbUserCards (
    cardId INT NOT NULL, 
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId),
    userId INT NOT NULL, 
    FOREIGN KEY (userId) REFERENCES tbUsers(userId)
); /* Explicación: el usuario con id x va a tener la carta y */

CREATE TABLE tbDecks ( /* tabla de mazos */
    deckId INT PRIMARY KEY,
    deckName VARCHAR(150) NOT NULL,

    deckLanguaje1Id INT NOT NULL, /* Explicación: elas cartas solamente van a poder usar cartas de dos lenguajes distintos, 
                                  esta primera propiedad y la segunda es opcional */
    FOREIGN KEY (cardTypeId) REFERENCES tbCardsTypes(cardTypeId),
    deckLanguaje2Id INT,
    FOREIGN KEY (cardTypeId) REFERENCES tbCardsTypes(cardTypeId),

    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES tbUsers(userId)
);

CREATE TABLE tbDeckCards (
    deckId INT NOT NULL,
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId),
    cardId INT NOT NULL,
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId)
); /* Explicación: el mazo con id x va a tener la carta y */

CREATE TABLE tbUserStatistics (
    userGames INT DEFAULT 0,
    userLoses INT DEFAULT 0,
    userDraws INT DEFAULT 0,
    userWins INT DEFAULT 0,
    userElo INT DEFAULT 0,

    userId INT PRIMARY KEY,
    FOREIGN KEY (userId) REFERENCES tbUsers(userId)
);

CREATE TABLE tbArticles (
    articleId INT PRIMARY KEY AUTO_INCREMENT,
    articleRoute VARCHAR(50), /* la ruta html de la noticia donde se publicará */
    articleTitle VARCHAR(150), /* titulo del articulo */
    articleContent VARCHAR(250), /* ruta del contenido articulo */
    articleImage VARCHAR(250), /* ruta de la imagen articulo */
    articleDescription TEXT, /* ruta del contenido articulo */
    articleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /* fecha de publicación del articulo */
    UNIQUE(articleRoute)
); /* en realidad esto ya está en camino, el lunes le treremos este apartado ya hecho */

CREATE TABLE tbArticleEditor ( /*tabla con los diferentes usuarios que pueden cambiar los articulos */
    editorId INT PRIMARY KEY,
    editorUsername VARCHAR(30),
    editorPassword VARCHAR(30)
);

DESCRIBE tbArticles;
DROP TABLE tbArticles;
DROP TABLE tbArticleEditor;

INSERT INTO tbNewsEditor VALUES ('1', 'root', '1234');