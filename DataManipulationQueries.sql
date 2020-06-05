--Customer Section
--Add a Customer. 
--NOTE the values that are used will be appended to the string based on what the user has entered. 
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

--Remove specific Tour for a customer:
DELETE FROM Purchases_Tours WHERE purchase_id = ?

--Add Purchases
INSERT INTO Purchases(purchase_date, customer_id) VALUES (?)
--Directly after this we will run
--insert Service
INSERT INTO Purchases_Service_Types(purchase_id, service_id, quantity) VALUES (?)
--insert into purchase Tours
INSERT INTO Purchases_Tours(purchase_id, tour_id) VALUES (?)

--Specific_Tours Section
--View Specific_Tours. This also gets the number of people signed up
SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number GROUP BY Specific_Tours.id
--View Specific_Tours Filtered Where people are signed up
SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number WHERE Specific_Tours.date = ? AND Guided_Tour_Types.label = ? GROUP BY Specific_Tours.id HAVING signedUp > 0
--View Specific_Tours Filtered Where people are not signed up
SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number WHERE Specific_Tours.date = ? AND Guided_Tour_Types.label = ? GROUP BY Specific_Tours.id HAVING signedUp = 0

--View Your specific tours
SELECT Specific_Tours.id, Guided_Tour_Types.label, Specific_Tours.date, Guided_Tour_Types.meet_time FROM Purchases JOIN Purchases_Tours ON Purchases_Tours.purchase_id = Purchases.id JOIN Specific_Tours ON Specific_Tours.id = Purchases_Tours.tour_id JOIN Guided_Tour_Types ON Guided_Tour_Types.id =Specific_Tours.type_number WHERE Purchases.customer_id = ?

--Add specific_Tours
--If only a date is provided:
INSERT INTO Specific_Tours(date) VALUES (?)
--If a date and tour type is provided:
INSERT INTO Specific_Tours(date, type_number) VALUES (?)

--DELETE
--OUR CODE CHECKS THAT THERE IS NO ONE SIGNED UP PRIOR TO DELETE. THIS is checked both in the on the client side and on the server side.
DELETE FROM Specific_Tours WHERE id = ?
--Check prior to delete. If the signed up is >0 it won't delete.
SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number WHERE Specific_Tours.id = ?  GROUP BY Specific_Tours.id

--Guided_Tour_Types Section
--View:
Select * FROM Guided_Tour_Types

--Update Guided tour type:
--first check the label does not exist as another tour types label. It is ok if it is it's own
SELECT id FROM Guided_Tour_Types WHERE label = ?
--then update
UPDATE Guided_Tour_Types SET label = ?, meet_time = ?, cost = ? WHERE id = ?
--UpdateActiveProperty (This removes it as a possibility for purchase)
UPDATE Guided_Tour_Types SET active = ? WHERE id = ?

--ADD Guided tour type
--First check that the label doesn't already exist. 
SELECT id FROM Guided_Tour_Types WHERE label = ?
--Then insert:
INSERT INTO Guided_Tour_Types(label, meet_time, cost) VALUES (?)

--Service_Types Section
--view
Select * FROM Service_Types

--ADD Service type
--First check if label already exists. 
SELECT id FROM Service_Types WHERE label = ?
--next insert:
INSERT INTO Service_Types(label, description, cost) VALUES (?)

--update:
--First check label doesn't exist as another service:
SELECT id FROM Service_Types WHERE label = ?
--next update:
UPDATE Service_Types SET label = ?, description = ?, cost = ? WHERE id = ?

--Set Active variable. This controls what is allowed to be purchased:
UPDATE Service_Types SET active = ? WHERE id = ?




