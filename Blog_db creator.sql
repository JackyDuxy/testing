use Blog_db;
-- user: username(primary key), id, pswd, fullname
-- task: username(foreign key), img_list, text_list, num, id(primary key)
-- CREATE TABLE user (
--     username varchar(255) primary key,
--     pswd varchar(255) not null,
--     fullname varchar(255) not null,
--     num int
-- );

-- CREATE TABLE task (
--     id int primary key auto_increment,
--     username varchar(255) not null,
--     img_list varchar(255),
--     text_list varchar(255),
--     FOREIGN KEY (username) REFERENCES user(username)
-- );

-- below is removing the tables
-- drop table user;
-- drop table task;


-- Error Code: 1072. Key column 'username' doesn't exist in table
-- Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'Error Code: 1072. Key column 'username' doesn't exist in table' at line 1
-- Error Code: 3730. Cannot drop table 'user' referenced by a foreign key constraint 'task_ibfk_1' on table 'task'.
