-- Active: 1693594221059@@127.0.0.1@3306
DROP TABLE IF EXISTS Alert;
DROP TABLE IF EXISTS Log;
DROP TABLE IF EXISTS Trade;
DROP TABLE IF EXISTS Funding;

CREATE TABLE Log
(
    id        INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
    module    VARCHAR(255) NOT NULL,
    action    VARCHAR(255) NOT NULL,
    logLevel  VARCHAR(255) NOT NULL,
    context   TEXT,
    createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alert
(
    id         INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
    uid        DATETIME     NOT NULL UNIQUE,
    coin       VARCHAR(255) NOT NULL,
    side       VARCHAR(10)  NOT NULL,
    price      REAL         NOT NULL,
    rawMessage TEXT         NOT NULL,
    receivedAt DATETIME     NOT NULL,
    createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tradeComplete BOOLEAN       NOT NULL DEFAULT false, 
    delay      INTEGER      NOT NULL
);

CREATE TABLE Trade
(
    id                 INTEGER     NOT NULL PRIMARY KEY AUTOINCREMENT,
    baseCoin           TEXT        NOT NULL,
    symbol             TEXT        NOT NULL,
    side               VARCHAR(10) NOT NULL,
    margin             REAL,
    status             VARCHAR(50) NOT NULL,
    entryAlertId       INT         NOT NULL,
    entryAlertPrice    REAL,
    entryActualPrice   REAL,
    entryTradeFee      REAL,
    exitAlertId        INT,
    exitAlertPrice     REAL,
    exitActualPrice    REAL,
    exitTradeFee       REAL,
    entryWalletBalance REAL,
    exitWalletBalance  REAL,
    profit             REAL,
    actualProfit       REAL,
    createdAt          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entryAlertId) REFERENCES Alert (id),
    FOREIGN KEY (exitAlertId) REFERENCES Alert (id)
);

