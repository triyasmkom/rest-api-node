create database rest_api_si;
show databases;
use rest_api_si;

create table auth_user(
                          id int primary key not null auto_increment,
                          name varchar(100),
                          email varchar(100) unique,
                          password varchar(255),
                          createdAt timestamp default current_timestamp,
                          updatedAt timestamp on update current_timestamp
);
