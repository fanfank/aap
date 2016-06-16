create table `aap_item` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'item id',
    `name` varchar(256) NOT NULL COMMENT 'item record name',
    `item_type` varchar(32) NOT NULL COMMENT 'page for jumping to an aap page, form for opening a form, hyperlink for jumping to an external page',
    `display` varchar(512) NOT NULL COMMENT 'the display content of this item',
    `icon` varchar(4096) NOT NULL COMMENT 'icon type, see: http://ant.design/components/icon',
    `detail` text NOT NULL COMMENT 'the detail configuration of this item, a json string',
    `op_user` varchar(128) NOT NULL DEFAULT 'UNKNOWN_USER' COMMENT 'user that last modifies this record',
    `ctime` int(10) NOT NULL DEFAULT 0 COMMENT 'create timestamp',
    `mtime` int(10) NOT NULL DEFAULT 0 COMMENT 'last modifies timestamp',
    `ext` varchar(1024) NOT NULL DEFAULT '' COMMENT 'for future use',
    PRIMARY KEY (`id`),
    INDEX `name` (`name`),
    INDEX `item_type` (`item_type`),
    INDEX `ctime` (`ctime`),
    INDEX `mtime` (`mtime`),
    INDEX `op_user` (`op_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'save item records';
