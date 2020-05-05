CREATE TABLE Customers(
	id int NOT NULL AUTO_INCREMENT, 
	first_name varchar(20) NOT NULL,
	last_name varchar(20) NOT NULL,
	street varchar(20),
	city varchar(20),
	state varchar(2),
	zip varchar(5),
	phone varchar(10),
	emergency_phone varchar(10),
	PRIMARY KEY(id),
	CONSTRAINT full_name UNIQUE(first_name, last_name)
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
	label varchar(100) NOT NULL,
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

INSERT INTO Customers (first_name, last_name,
	street, city, state,
	zip, phone, emergency_phone) 
	VALUES ("Kevin",	"Hart",	"1472 170th",	"Los Angeles",	"CA",	"98504",	"4067824598",	"4025689852"),
("Jason",	"Statham",	"2390 98th",	"Hollywood",	"CA",	"98504",	"4068493823",	"4029586730"),
("Danny",	"DeVito",	"1482 170th",	"Hollywood",	"CA",	"98504",	"4067828372",	"4029587344"),
("Dwayne",	"Johnson",	"1222 140th",	"Santa Cruz",	"CA",	"98504",	"4060392938",	"4026789940"),
("Ice",	"Cube",	"209 98th",	"Los Angeles",	"CA",	"98509",	"4068950393",	"4029875093"),
("Tiffany",	"Haddish",	"444 96th",	"San Diego",	"CA",	"98509",	"4068950399",	"4029875055");

INSERT INTO Service_Types(label, cost, description) 
	VALUES ("Full Service","25000","Includes Fork and Shock service. Also includes drivetrain maintenance, brake maintenance and bearings inspection."),
	("Partial Service","6000","Includes drivetrain maintenance, brake maintenance and bearings inspection."),
	("Tube Change","500","Change tube or set up tubeless.");
	
INSERT INTO Guided_Tour_Types(label, meet_time, cost) 
	VALUES ("Full Day Expert", "09:00:00", "5495"),
	("Half Day Expert", "12:00:00", "3495"),
	("Full Day Intermediate", "09:00:00", "4995"),
	("Half Day Intermediate", "12:00:00", "2995"),
	("Full Day Beginner", "09:00:00", "4995"),
	("Half Day Beginner", "12:00:00", "2995");
	
INSERT INTO Specific_Tours(date, type_number) 
	VALUES ("2020-06-03", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert")),
	("2020-06-05", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert")),
	("2020-06-07", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert")),
	("2020-06-09", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert")),
	("2020-06-010", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert")),
	("2020-06-04", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-05", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-06", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-07", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-09", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-10", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert")),
	("2020-06-04", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-05", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-07", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-09", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-10", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-11", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Intermediate")),
	("2020-06-04", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-03", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-05", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-07", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-08", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-09", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-10", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate")),
	("2020-06-03", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-04", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-05", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-06", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-08", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-10", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-11", (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner")),
	("2020-06-03", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-04", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-06", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-08", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-09", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-10", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-01", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")),
	("2020-06-02", (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner"));
	
INSERT INTO Purchases(purchase_date, customer_id) 
	VALUES ("2020-05-02", (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),
	("2020-05-20", (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),
	("2020-05-09", (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),
	("2020-03-08", (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),
	("2020-03-10", (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito')),
	("2020-06-08", (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito'));
	
INSERT INTO Purchases_Tours(purchase_id, tour_id) 
	VALUES ((SELECT id FROM Purchases WHERE purchase_date = "2020-05-02" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-03" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-02" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-04" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Expert"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-20" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-05" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Intermediate"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-20" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-10" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-09" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-10" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-09" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-03" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Expert"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-03-08" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-06" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-03-10" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-06" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Full Day Beginner"))),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-03-10" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito')),(SELECT id FROM Specific_Tours WHERE date = "2020-06-10" AND type_number = (SELECT id FROM Guided_Tour_Types WHERE label ="Half Day Beginner")));
	
INSERT INTO Purchases_Service_Types(purchase_id, service_id, quantity) 
	VALUES ((SELECT id FROM Purchases WHERE purchase_date = "2020-05-02" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Kevin' AND last_name = 'Hart')),(SELECT id FROM Service_Types WHERE label = "Full Service"), "1"),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-05-09" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Jason' AND last_name = 'Statham')),(SELECT id FROM Service_Types WHERE label = "Partial Service"), "1"),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-03-10" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito')),(SELECT id FROM Service_Types WHERE label = "Tube Change"), "2"),
	((SELECT id FROM Purchases WHERE purchase_date = "2020-06-08" AND customer_id = (SELECT id FROM Customers WHERE first_name ='Danny' AND last_name = 'DeVito')),(SELECT id FROM Service_Types WHERE label = "Full Service"), "1");