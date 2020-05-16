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


--Purchases Section
--View Purchases
SELECT Purchases.id, Purchases.purchase_date, Customers.first_name, Customers.last_name FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.id
--View Purchases Filtered
SELECT Purchases.id, Purchases.purchase_date, Customers.first_name, Customers.last_name FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.id WHERE Purchases.purchase_date = ? AND Customers.first_name = ? AND Customers.last_name = ?


--Delete Purchases
DELETE FROM Purchases WHERE id = ?
--Note Before this we will run
DELETE FROM Purchases_Service_Types WHERE purchase_id = ?
DELETE FROM Purchases_Tours WHERE purchase_id = ?

--Add Purchases
INSERT INTO Purchases(purchase_date, customer_id) OUTPUT Inserted.id VALUES (?)
--Directly after this we will run
--retrieve purchase_id. ANY ADVISE on how to do this better would be appreciated.
SELECT id FROM Purchases WHERE customer_id=? ORDER BY id DESC LIMIT 1
--add items to M:M tables of tours and service
INSERT INTO Purchases_Service_Types(purchase_id, service_id, quantity) VALUES (?)
INSERT INTO Purchases_Tours(purchase_id, tour_id) VALUES (?)

--Specific_Tours Section


