CREATE TABLE Customers(
	id int NOT NULL AUTO_INCREMENT, 
	customer_first_name varchar(20) NOT NULL,
	customer_last_name varchar(20) NOT NULL,
	customer_street varchar(20),
	customer_city varchar(20),
	customer_state varchar(2),
	customer_zip varchar(5),
	customer_phone varchar(10),
	emergency_phone varchar(10),
	PRIMARY KEY(id),
	CONSTRAINT full_name UNIQUE(customer_first_name, customer_last_name)
);

CREATE TABLE Service_Types(
	id int NOT NULL AUTO_INCREMENT, 
	label varchar(20) NOT NULL,
	cost int NOT NULL,
	description varchar(255),
	PRIMARY KEY(id),
	CONSTRAINT UNIQUE(label)
);

CREATE TABLE Guided_Tour_Types(
	id int NOT NULL AUTO_INCREMENT, 
	label varchar(20) NOT NULL,
	meet_time time NOT NULL,
	cost int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT UNIQUE(label)
);

CREATE TABLE Specific_Tours(
	id int NOT NULL AUTO_INCREMENT, 
	date date NOT NULL,
	type_number int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(type_number) REFERENCES Guided_Tour_Types(id)
);

CREATE TABLE Purchases(
	id int NOT NULL AUTO_INCREMENT, 
	purchase_date date NOT NULL,
	customer_id int NOT NULL, 	
	PRIMARY KEY(id),
	FOREIGN KEY(customer_id) REFERENCES Customers(id)
);

CREATE TABLE Tours_Tour_Types(
	id int NOT NULL AUTO_INCREMENT, 
	tour_id int NOT NULL,
	type_id int NOT NULL, 	
	PRIMARY KEY(id),
	FOREIGN KEY(tour_id) REFERENCES Specific_Tours(id),
	FOREIGN KEY(type_id) REFERENCES Guided_Tour_Types(id),
	CONSTRAINT UNIQUE(tour_id, type_id)
);

CREATE TABLE Purchases_Tours(
	id int NOT NULL AUTO_INCREMENT, 
	purchase_id int NOT NULL,
	tour_id int NOT NULL, 	
	PRIMARY KEY(id),
	FOREIGN KEY(tour_id) REFERENCES Specific_Tours(id),
	FOREIGN KEY(purchase_id) REFERENCES Purchases(id),
	CONSTRAINT UNIQUE(tour_id, purchase_id)
);

CREATE TABLE Purchases_Service_Types(
	id int NOT NULL AUTO_INCREMENT, 
	purchase_id int NOT NULL,
	service_id int NOT NULL, 	
	quantity int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(service_id) REFERENCES Service_Types(id),
	FOREIGN KEY(purchase_id) REFERENCES Purchases(id),
	CONSTRAINT UNIQUE(service_id, purchase_id)
);
