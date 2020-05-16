--Customer Section
--Add a Customer. 
--NOTE the values that are used will be appened to the string based on what the user has entered. 
--The input values will be added to the Array corresponding to the ? in the query formatter
INSERT INTO Customers(first_name, last_name, street, city, state, zip, phone, emergency_phone) VALUES (?)
INSERT INTO Customers(first_name, last_name, street, city, state, zip, phone) VALUES (?)
INSERT INTO Customers(first_name, last_name, street, city, state, zip) VALUES (?)
INSERT INTO Customers(first_name, last_name, street, city, state) VALUES (?)

--Update Customer
UPDATE Customers SET first_name=?, last_name=?, street=?, city=?, state=?, zip=?, phone=?, emergency_phone=? WHERE id = ?

--View Customers
SELECT id, first_name, last_name, street, city, state, zip, phone, emergency_phone FROM Customers
--View Customers Filtered. 
--This is used when the filter button is used. The where statement is appeneded and is based on what the customer wants to filter on
SELECT id, first_name, last_name, street, city, state, zip, phone, emergency_phone FROM Customers WHERE phone = ? AND Customers.first_name = ? AND Customers.last_name = ?



