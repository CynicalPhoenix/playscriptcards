CREATE DATABASE dbScriptCards;
USE dbScriptCards;

CREATE TABLE tbCards (
    cardId INT PRIMARY KEY,

    cardAttack INT NOT NULL,
    cardHealth INT NOT NULL,
    cardCost INT NOT NULL,

    cardName VARCHAR(150) NOT NULL,
    cardDesciption VARCHAR(225) NOT NULL,
    cardComment VARCHAR(225) NOT NULL,
    
    cardTypeId INT NOT NULL,
    FOREIGN KEY (cardTypeId) REFERENCES tbCardTypes(cardTypeId),

    cardLanguajeId INT NOT NULL,
    FOREIGN KEY (cardLanguajeId) REFERENCES tbCardLanguajes(cardLanguajeId),

    cardRarity INT NOT NULL,
    FOREIGN KEY (cardRarityId) REFERENCES tbCardsRarity(cardRarityId)
);


CREATE TABLE tbCardTypes (
    cardTypeId INT PRIMARY KEY,
    cardTypeName VARCHAR(150) NOT NULL
);

CREATE TABLE tbCardLanguajes (
    cardLanguajeId INT PRIMARY KEY,
    cardLanguajeName VARCHAR(150) NOT NULL
);

CREATE TABLE tbCardRarity (
    cardRarityId INT PRIMARY KEY,
    cardRarityName VARCHAR(150) NOT NULL
);

CREATE TABLE tbUsers (
    userId INT PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    userEmail VARCHAR(150) NOT NULL,
    userPassword VARCHAR(30) NOT NULL,
    userBirth DATE NOT NULL,

    userCountryId INT,
    FOREIGN KEY (userCountryId) REFERENCES tbUserCountry(userCountryId)
);

CREATE TABLE tbUserCountry (
    userCountryId INT PRIMARY KEY,
    userCountryName VARCHAR(150)
);

CREATE TABLE tbUserCards (
    cardId INT NOT NULL, 
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId),
    userId INT NOT NULL, 
    FOREIGN KEY (userId) REFERENCES tbUsers(userId)
);

CREATE TABLE tbDecks (
    deckId INT PRIMARY KEY,
    deckName VARCHAR(150) NOT NULL,

    deckLanguaje1Id INT NOT NULL,
    FOREIGN KEY (cardLanguaje1Id) REFERENCES tbCardLanguajes(cardLanguajeId),
    deckLanguaje2Id INT,
    FOREIGN KEY (cardLanguaje2Id) REFERENCES tbCardLanguajes(cardLanguajeId),

    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES tbUsers(userId)
);

CREATE TABLE tbDeckCards (
    deckId INT NOT NULL,
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId),
    cardId INT NOT NULL,
    FOREIGN KEY (cardId) REFERENCES tbCards(cardId)
);

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
    articleRoute VARCHAR(50),
    articleTitle VARCHAR(150),
    articleContent VARCHAR(250),
    articleImage VARCHAR(250),
    articleDescription TEXT,
    articleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(articleRoute)
);

CREATE TABLE tbArticleEditor (
    editorId INT PRIMARY KEY,
    editorUsername VARCHAR(30),
    editorPassword VARCHAR(30)
);

DESCRIBE tbArticles;
DROP TABLE tbArticles;
DROP TABLE tbArticleEditor;

INSERT INTO tbNewsEditor VALUES ('1', 'root', '1234');