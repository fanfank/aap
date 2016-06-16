create table `aap_lefter` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'lefter id',
    `name` varchar(256) NOT NULL COMMENT 'lefter record name',
    `components` text NOT NULL COMMENT 'lefter components, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user the last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `op_user` (`op_user`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save lefter records';
