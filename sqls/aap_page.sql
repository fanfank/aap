create table `aap_page` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'page id',
    `name` varchar(256) NOT NULL COMMENT 'page record name',
    `title` varchar(64) NOT NULL DEFAULT 'Unknown Page' COMMENT 'title of the page',
    `components` text NOT NULL COMMENT 'components of page, a json string',
    `content` text NOT NULL COMMENT 'content of page, a json string',
    `page_type` tinyint NOT NULL DEFAULT 1 COMMENT '1 for normal pages，2 for aap pages',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `page_type` (`page_type`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save page records';
