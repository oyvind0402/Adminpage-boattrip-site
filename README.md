# Holbergs Båter - Admin Panel

The admin user uses an email and a password: "admin@admin.com - Admin1". 

## Before running

When running the project with IIS Express through Visual Studio Community/Pro, dependencies are installed automatically.

If, however, you need to install them manually, do: 

`$ cd SemesterOppgave2/ClientApp` from the root folder

`$ npm install`

At times, two dependencies will not be installed automatically, despite being in `package.json`. If that happens, do:

`$ npm install --save @ng-bootstrap/ng-bootstrap@5` which is needed for the Modals that we use in conjunction with deleting different values in the database

`$ npm install --save ngx-cookie-service@2.1.0` to install the package that handles session cookies in Angular projects.

## Running the project

Please, be patient, as it will take some time for the project to load.

## Functionality choices 
### Cascading deletion
To be able to delete rows/objects that are used as a foreign key in another table, cascading deletion needs to be enabled in the database. For customers, for example, it entails deleting both the customer and all orders it is a part of, which we thought would be a desirable feature for an administrator. However, we thought that this would be problematic for our database when it comes to, for instance, deleting a postplace, because that would entail deleting every customer and terminal that postplace is a part of. Consequently, that would also delete every order the deleted customer is a part of, as well as every route the terminal is a part of. In summary, it would snowball out of control.

We have thus turned cascading deletion off for post places, terminals, boats, routes and orders. Instead, the user will be notified if they are trying to delete an entity in the database that is a part of another table as a foreign key (except for customers).

### No new order
We decided that there should not be a possibility to save a new order as an admin, because we believe that functionality should be strictly for the customer. 

### No editing of foreign-key data
We also made it so that when you click to edit a route or an order - you can only edit the route and order specific values. If the admin wishes to edit the customer of an order it can just go to customers to edit that specific customer and it will also be edited in the order automatically.
