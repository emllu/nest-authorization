-- CreateTable
CREATE TABLE `resettoken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userid` INTEGER NOT NULL,
    `expiredate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resettoken_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
