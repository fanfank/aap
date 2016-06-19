create table `aap_form` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'form id',
    `name` varchar(256) NOT NULL COMMENT 'form record name',
    `post_api` varchar(4096) NOT NULL COMMENT 'which url to post to when the form submits',
    `content_type` varchar(1024) NOT NULL DEFAULT 'application/x-www-form-urlencoded;charset=utf-8' COMMENT 'content type of the post data',
    `components` text NOT NULL COMMENT 'form components, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modify timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save form records';
