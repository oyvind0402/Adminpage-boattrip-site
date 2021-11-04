using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SemesterOppgave2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace SemesterOppgave2.DAL
{
    public class BoatTripRepository : IBoatTripRepository
    {
        private readonly BoatTripContext _db;
        private readonly ILogger<BoatTripRepository> _log;

        public BoatTripRepository(BoatTripContext db, ILogger<BoatTripRepository> log)
        {
            _db = db;
            _log = log;
        }

        //Customer methods:
        public async Task<List<Customer>> GetAllCustomers()
        {
            try
            {
                List<Customer> allCustomers = await _db.Customers.Select(c => new Customer
                {
                    Id = c.Id,
                    Firstname = c.Firstname,
                    Lastname = c.Lastname,
                    Street = c.Street,
                    Phonenr = c.Phonenr,
                    Email = c.Email,
                    ZipCode = c.Postplace.ZipCode,
                    City = c.Postplace.City
                }).ToListAsync();
                return allCustomers;
            }
            catch
            {
                return null;
            }
        }

        public async Task<Customer> GetOneCustomer(int id)
        {
            try
            {
                Customers customer = await _db.Customers.FindAsync(id);
                var fetchedCustomer = new Customer()
                {
                    Id = customer.Id,
                    Firstname = customer.Firstname,
                    Lastname = customer.Lastname,
                    Street = customer.Street,
                    Phonenr = customer.Phonenr,
                    Email = customer.Email,
                    ZipCode = customer.Postplace.ZipCode,
                    City = customer.Postplace.City
                };
                return fetchedCustomer;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SaveCustomer(Customer customer)
        {
            try
            {
                var newCustomer = new Customers
                {
                    Firstname = customer.Firstname,
                    Lastname = customer.Lastname,
                    Phonenr = customer.Phonenr,
                    Email = customer.Email,
                    Street = customer.Street
                };

                var checkPostPlace = await _db.PostPlaces.FindAsync(customer.ZipCode);
                //If the postplace doesnt already exist we create a new PostPlace
                if (checkPostPlace == null)
                {
                    var newPostPlace = new PostPlaces
                    {
                        ZipCode = customer.ZipCode,
                        City = customer.City,
                    };
                    newCustomer.Postplace = newPostPlace;
                }
                else
                {
                    newCustomer.Postplace = checkPostPlace;
                }
                _db.Customers.Add(newCustomer);
                await _db.SaveChangesAsync();
                _log.LogInformation("Customer with id: " + newCustomer.Id + " saved!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteCustomer(int id)
        {
            try
            {
                Customers customer = await _db.Customers.FindAsync(id);
                //If the customer is a part of any orders we also delete all the orders:
                var checkCustomersInOrder = await _db.Orders.Where(o => o.Customer == customer).ToListAsync();
                if(checkCustomersInOrder.Count < 1)
                {
                    _db.Customers.Remove(customer);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Customer with id: " + id + " deleted!");
                    return true;
                } else
                {
                    List<Customers> customers = new List<Customers>();
                    foreach(Orders order in checkCustomersInOrder)
                    {
                        if (!customers.Contains(order.Customer))
                        {
                            customers.Add(order.Customer);
                        }
                        _db.Orders.Remove(order);
                        _log.LogInformation("Order with id: " + order.Id + " deleted!"); 
                    }
                    foreach(Customers customer1 in customers)
                    {
                        _db.Customers.Remove(customer1);
                        _log.LogInformation("Customer with id: " + customer1.Id + " deleted!");
                    }
                    await _db.SaveChangesAsync();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditCustomer(Customer changedCustomer)
        {
            try
            {
                Customers customer = await _db.Customers.FindAsync(changedCustomer.Id);

                //If the zipcode changed when editing the customer
                if (customer.Postplace.ZipCode != changedCustomer.ZipCode)
                {
                    var checkPostPlace = await _db.PostPlaces.FindAsync(changedCustomer.ZipCode);
                    //If the postplace doesnt already exist we create a new PostPlace
                    if (checkPostPlace == null)
                    {
                        var newPostPlace = new PostPlaces
                        {
                            ZipCode = changedCustomer.ZipCode,
                            City = changedCustomer.City
                        };
                        customer.Postplace = newPostPlace;
                    }
                    else
                    {
                        customer.Postplace = checkPostPlace;
                    }
                }
                customer.Firstname = changedCustomer.Firstname;
                customer.Lastname = changedCustomer.Lastname;
                customer.Email = changedCustomer.Email;
                customer.Phonenr = changedCustomer.Phonenr;
                customer.Street = changedCustomer.Street;

                await _db.SaveChangesAsync();
                _log.LogInformation(customer.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        //PostPlace methods:
        public async Task<List<PostPlace>> GetAllPostPlaces()
        {
            try
            {
                List<PostPlace> AllPostPlaces = await _db.PostPlaces.Select(p => new PostPlace
                {
                    ZipCode = p.ZipCode,
                    City = p.City
                }).ToListAsync();
                return AllPostPlaces;
            } 
            catch
            {
                return null;
            }
        }

        public async Task<PostPlace> GetOnePostPlace(string zipCode)
        {
            try
            {
                PostPlaces postPlace = await _db.PostPlaces.FindAsync(zipCode);
                var fetchedPostPlace = new PostPlace()
                {
                    ZipCode = postPlace.ZipCode,
                    City = postPlace.City
                };
                return fetchedPostPlace;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SavePostPlace(PostPlace postPlace)
        {
            try
            {
                PostPlaces checkPostPlace = await _db.PostPlaces.FindAsync(postPlace.ZipCode);
                if(checkPostPlace == null)
                {
                    checkPostPlace = new PostPlaces
                    {
                        ZipCode = postPlace.ZipCode,
                        City = postPlace.City
                    };
                    _db.PostPlaces.Add(checkPostPlace);
                    await _db.SaveChangesAsync();
                    _log.LogInformation(postPlace.ToString() + " saved!");
                    return true;
                } else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeletePostPlace(string zipCode)
        {
            try
            {
                PostPlaces postPlace = await _db.PostPlaces.FindAsync(zipCode);
                //if post place is a part of Customer or Terminal you will not be able to delete it
                var checkPostPlaceInCustomer = await _db.Customers.FirstOrDefaultAsync(c => c.Postplace.ZipCode == postPlace.ZipCode);
                var checkPostPlaceInTerminal = await _db.Terminals.FirstOrDefaultAsync(t => t.TerminalAddress.ZipCode == postPlace.ZipCode);

                if(checkPostPlaceInCustomer ==null && checkPostPlaceInTerminal == null)
                {
                    _db.PostPlaces.Remove(postPlace);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Postplace with ZipCode: " + zipCode + " deleted!");
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditPostPlace(PostPlace changedPostPlace)
        {
            try
            {
                PostPlaces postPlace = await _db.PostPlaces.FindAsync(changedPostPlace.ZipCode);
                postPlace.City = changedPostPlace.City;
                await _db.SaveChangesAsync();
                _log.LogInformation(postPlace.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        //Boat methods:
        public async Task<List<Boat>> GetAllBoats()
        {
            try
            {
                List<Boat> AllBoats = await _db.Boats.Select(b => new Boat
                {
                    Id = b.Id,
                    BoatName = b.BoatName,
                    Capacity = b.Capacity,
                    TicketPrice = b.TicketPrice
                }).ToListAsync();
                return AllBoats;
            }
            catch
            {
                return null;
            }
        }

        public async Task<Boat> GetOneBoat(int id)
        {
            try
            {
                Boats boat = await _db.Boats.FindAsync(id);
                var fetchedBoat = new Boat()
                {
                    Id = boat.Id,
                    BoatName = boat.BoatName,
                    Capacity = boat.Capacity,
                    TicketPrice = boat.TicketPrice
                };
                return fetchedBoat;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SaveBoat(Boat boat)
        {
            try
            {
                var newBoat = await _db.Boats.FindAsync(boat.Id);
                //If it's a new boat - don't want to save the same boat twice:
                if(newBoat == null)
                {
                    newBoat = new Boats()
                    {
                        BoatName = boat.BoatName,
                        Capacity = boat.Capacity,
                        TicketPrice = boat.TicketPrice
                    };
                    _db.Boats.Add(newBoat);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Boat with id: " + newBoat.Id + " saved!");
                    return true;
                } 
                else
                {
                    return false;
                }        
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteBoat(int id)
        {
            try
            {
                Boats boat = await _db.Boats.FindAsync(id);

                var checkBoatInRoute = await _db.Routes.FirstOrDefaultAsync(r => r.Boat.BoatName == boat.BoatName);

                if(checkBoatInRoute == null)
                {
                    _db.Boats.Remove(boat);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Boat with id: " + id + " deleted!");
                    return true;
                }
                else
                {
                    return false;
                }

               
               
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditBoat(Boat changedBoat)
        {
            try
            {
                Boats boat = await _db.Boats.FindAsync(changedBoat.Id);
                boat.BoatName = changedBoat.BoatName;
                boat.Capacity = changedBoat.Capacity;
                boat.TicketPrice = changedBoat.TicketPrice;
                await _db.SaveChangesAsync();
                _log.LogInformation(changedBoat.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        //Terminal methods:

        public async Task<List<Terminal>> GetAllTerminals()
        {
            try
            {
                List<Terminal> AllTerminals = await _db.Terminals.Select(t => new Terminal
                {
                    Id = t.Id,
                    TerminalName = t.TerminalName,
                    Street = t.Street,
                    City = t.TerminalAddress.City,
                    ZipCode = t.TerminalAddress.ZipCode

                }).ToListAsync();
                return AllTerminals;
            }
            catch
            {
                return null;
            }

        }

        public async Task<Terminal> GetOneTerminal(int id)
        {
            try
            {
                Terminals terminal = await _db.Terminals.FindAsync(id);
                var fetchedTerminal = new Terminal()
                {
                    Id = terminal.Id,
                    TerminalName = terminal.TerminalName,
                    Street = terminal.Street,
                    City = terminal.TerminalAddress.City,
                    ZipCode = terminal.TerminalAddress.ZipCode
                };
                return fetchedTerminal;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SaveTerminal(Terminal terminal)
        {
            try
            {
                var newTerminal = await _db.Terminals.FindAsync(terminal.Id);
                if(newTerminal == null)
                {
                    var newPostplace = await _db.PostPlaces.FindAsync(terminal.ZipCode);
                    if(newPostplace == null)
                    {
                        newPostplace = new PostPlaces()
                        {
                            ZipCode = terminal.ZipCode,
                            City = terminal.City
                        };
                    }
                    newTerminal = new Terminals()
                    {
                        Id = terminal.Id,
                        TerminalName = terminal.TerminalName,
                        Street = terminal.Street,
                        TerminalAddress = newPostplace
                    };
                    _db.Terminals.Add(newTerminal);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Terminal with id: " + newTerminal.Id + " saved!");
                    return true;
                } else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteTerminal(int id)
        {
            try
            {
                var terminal = await _db.Terminals.FindAsync(id);
                var checkArrivalTerminalInRoute = await _db.Routes.FirstOrDefaultAsync(r => r.ArrivalPlace.TerminalName == terminal.TerminalName);
                var checkDepartureTerminalInRoute = await _db.Routes.FirstOrDefaultAsync(r => r.DeparturePlace.TerminalName == terminal.TerminalName);
                // checks if terminal is a part of routes to be able to delete
                if(checkArrivalTerminalInRoute== null && checkDepartureTerminalInRoute == null)
                {
                    _db.Terminals.Remove(terminal);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Terminal with id: " + id + " deleted!");
                    return true;

                }
                else
                {
                    return false;
                }

               
                
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditTerminal(Terminal terminal)
        {
            try
            {
                Terminals editedTerminal = await _db.Terminals.FindAsync(terminal.Id);
                editedTerminal.TerminalName = terminal.TerminalName;
                editedTerminal.Street = terminal.Street;

                var checkPostPlace = await _db.PostPlaces.FindAsync(terminal.ZipCode);
                if(checkPostPlace == null)
                {
                    checkPostPlace = new PostPlaces
                    {
                        City = terminal.City,
                        ZipCode = terminal.ZipCode
                    };
                    editedTerminal.TerminalAddress = checkPostPlace;
                } else
                {
                    editedTerminal.TerminalAddress = checkPostPlace;
                }
                await _db.SaveChangesAsync();
                _log.LogInformation(terminal.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        //Route methods:
        public async Task<List<Route>> GetAllRoutes()
        {
            try
            {
                List<Route> allRoutes = await _db.Routes.Select(r => new Route
                {
                    Id = r.Id,
                    DepartureTime = r.DepartureTime,
                    ArrivalTime = r.ArrivalTime,
                    TicketsLeft = r.TicketsLeft,
                    BoatName = r.Boat.BoatName,
                    Capacity = r.Boat.Capacity,
                    TicketPrice = r.Boat.TicketPrice,
                    ArrivalTerminalName = r.ArrivalPlace.TerminalName,
                    ArrivalTerminalCity = r.ArrivalPlace.TerminalAddress.City,
                    ArrivalTerminalStreet = r.ArrivalPlace.Street,
                    ArrivalTerminalZipCode = r.ArrivalPlace.TerminalAddress.ZipCode,
                    DepartureTerminalName = r.DeparturePlace.TerminalName,
                    DepartureTerminalCity = r.DeparturePlace.TerminalAddress.City,
                    DepartureTerminalStreet = r.DeparturePlace.Street,
                    DepartureTerminalZipCode = r.DeparturePlace.TerminalAddress.ZipCode
                }).ToListAsync();
                return allRoutes;
            }
            catch
            {
                return null;
            }
        }

        public async Task<Route> GetOneRoute(int id)
        {
            try
            {
                Routes route = await _db.Routes.FindAsync(id);
                var fetchedRoute = new Route()
                {
                    Id = route.Id,
                    DepartureTime = route.DepartureTime,
                    ArrivalTime = route.ArrivalTime,
                    TicketsLeft = route.TicketsLeft,
                    BoatName = route.Boat.BoatName,
                    Capacity = route.Boat.Capacity,
                    TicketPrice = route.Boat.TicketPrice,
                    ArrivalTerminalName = route.ArrivalPlace.TerminalName,
                    ArrivalTerminalCity = route.ArrivalPlace.TerminalAddress.City,
                    ArrivalTerminalStreet = route.ArrivalPlace.Street,
                    ArrivalTerminalZipCode = route.ArrivalPlace.TerminalAddress.ZipCode,
                    DepartureTerminalName = route.DeparturePlace.TerminalName,
                    DepartureTerminalCity = route.DeparturePlace.TerminalAddress.City,
                    DepartureTerminalStreet = route.DeparturePlace.Street,
                    DepartureTerminalZipCode = route.DeparturePlace.TerminalAddress.ZipCode
                };
                return fetchedRoute;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SaveRoute(Route route)
        {
            try
            {
                //Check to see if the departure terminal already exists, if it doesnt we create a new one:
                var checkDepTerminal = await _db.Terminals.FirstOrDefaultAsync(t => t.TerminalAddress.ZipCode == route.DepartureTerminalZipCode && t.TerminalName == route.DepartureTerminalName);
                if(checkDepTerminal == null)
                {
                    //Checking to see if the postplace in the departure terminal exists, if it doesnt we create a new one:
                    var checkDepPostPlace = await _db.PostPlaces.FindAsync(route.DepartureTerminalZipCode);
                    if(checkDepPostPlace == null)
                    {
                        checkDepPostPlace = new PostPlaces()
                        {
                            ZipCode = route.DepartureTerminalZipCode,
                            City = route.DepartureTerminalCity
                        };
                    }
                    checkDepTerminal = new Terminals()
                    {
                        TerminalName = route.DepartureTerminalName,
                        Street = route.DepartureTerminalStreet,
                        TerminalAddress = checkDepPostPlace
                    };
                }
                //Check to see if the arrival terminal already exists, if it doesnt we create a new one:
                var checkArrTerminal = await _db.Terminals.FirstOrDefaultAsync(t => t.TerminalAddress.ZipCode == route.ArrivalTerminalZipCode && t.TerminalName == route.ArrivalTerminalName);
                if(checkArrTerminal == null)
                {
                    //Checking to see if the postplace in the arrival terminal exists, if it doesnt we create a new one:
                    var checkArrPostPlace = await _db.PostPlaces.FindAsync(route.ArrivalTerminalZipCode);
                    if(checkArrPostPlace == null)
                    {
                        checkArrPostPlace = new PostPlaces()
                        {
                            ZipCode = route.ArrivalTerminalZipCode,
                            City = route.ArrivalTerminalCity
                        };
                    }
                    checkArrTerminal = new Terminals()
                    {
                        TerminalName = route.ArrivalTerminalName,
                        Street = route.ArrivalTerminalStreet,
                        TerminalAddress = checkArrPostPlace
                    };
                }
                //Checking to see if the boat exists, if it doesnt we create a new one:
                var checkBoat = await _db.Boats.FirstOrDefaultAsync(b => b.BoatName == route.BoatName);
                if(checkBoat == null)
                {
                    checkBoat = new Boats()
                    {
                        BoatName = route.BoatName,
                        Capacity = route.Capacity,
                        TicketPrice = route.TicketPrice
                    };
                }
                //Creating the new route with the above objects + values from the route parameter:
                var newRoute = new Routes()
                {
                    DepartureTime = route.DepartureTime,
                    ArrivalTime = route.ArrivalTime,
                    TicketsLeft = route.TicketsLeft,
                    Boat = checkBoat,
                    DeparturePlace = checkDepTerminal,
                    ArrivalPlace = checkArrTerminal
                };
                _db.Routes.Add(newRoute);
                await _db.SaveChangesAsync();
                _log.LogInformation("Route with id: " + newRoute.Id + " saved!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditRoute(Route editedRoute)
        {
            try
            {
                Routes route = await _db.Routes.FindAsync(editedRoute.Id);
                route.DepartureTime = editedRoute.DepartureTime;
                route.ArrivalTime = editedRoute.ArrivalTime;
                route.TicketsLeft = editedRoute.TicketsLeft;

                var boat = await _db.Boats.FirstOrDefaultAsync(b => b.BoatName == editedRoute.BoatName);
                var depTerminal = await _db.Terminals.FirstOrDefaultAsync(t => t.TerminalName == editedRoute.DepartureTerminalName && t.Street == editedRoute.DepartureTerminalStreet);
                var arrTerminal = await _db.Terminals.FirstOrDefaultAsync(t => t.TerminalName == editedRoute.ArrivalTerminalName && t.Street == editedRoute.ArrivalTerminalStreet);

                route.Boat = boat;
                route.ArrivalPlace = arrTerminal;
                route.DeparturePlace = depTerminal;
                
                await _db.SaveChangesAsync();
                _log.LogInformation(editedRoute.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteRoute(int id)
        {
            try
            {
                Routes route = await _db.Routes.FindAsync(id);
                var checkRoutesInOrder = await _db.Orders.FirstOrDefaultAsync(o => o.Route.DepartureTime == route.DepartureTime
                && o.Route.DeparturePlace.TerminalName == route.DeparturePlace.TerminalName
                && o.Route.ArrivalPlace.TerminalName == route.ArrivalPlace.TerminalName);

                if(checkRoutesInOrder == null)
                {
                    _db.Routes.Remove(route);
                    await _db.SaveChangesAsync();
                    _log.LogInformation("Route with id:" + id + " deleted!");
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        //Order methods:
        public async Task<List<Order>> GetAllOrders()
        {
            try
            {
                List<Order> allOrders = await _db.Orders.Select(o => new Order
                {
                    Id = o.Id,
                    TicketAmount = o.TicketAmount,
                    TotalPrice = o.TotalPrice,
                    DepartureTime = o.Route.DepartureTime,
                    ArrivalTime = o.Route.ArrivalTime,
                    TicketsLeft = o.Route.TicketsLeft,
                    BoatName = o.Route.Boat.BoatName,
                    Capacity = o.Route.Boat.Capacity,
                    TicketPrice = o.Route.Boat.TicketPrice,
                    ArrivalTerminalName = o.Route.ArrivalPlace.TerminalName,
                    ArrivalTerminalStreet = o.Route.ArrivalPlace.Street,
                    ArrivalTerminalCity = o.Route.ArrivalPlace.TerminalAddress.City,
                    ArrivalTerminalZipCode = o.Route.ArrivalPlace.TerminalAddress.ZipCode,
                    DepartureTerminalName = o.Route.DeparturePlace.TerminalName,
                    DepartureTerminalStreet = o.Route.DeparturePlace.Street,
                    DepartureTerminalZipCode = o.Route.DeparturePlace.TerminalAddress.ZipCode,
                    DepartureTerminalCity = o.Route.DeparturePlace.TerminalAddress.City,
                    Firstname = o.Customer.Firstname,
                    Lastname = o.Customer.Lastname,
                    Street = o.Customer.Street,
                    Phonenr = o.Customer.Phonenr,
                    Email = o.Customer.Email,
                    ZipCode = o.Customer.Postplace.ZipCode,
                    City = o.Customer.Postplace.City
                }).ToListAsync();
                return allOrders;
            }
            catch
            {
                return null;
            }
        }

        public async Task<Order> GetOneOrder(int id)
        {
            try
            {
                Orders order = await _db.Orders.FindAsync(id);
                var fetchedOrder = new Order()
                {
                    Id = order.Id,
                    TicketAmount = order.TicketAmount,
                    TotalPrice = order.TotalPrice,
                    DepartureTime = order.Route.DepartureTime,
                    ArrivalTime = order.Route.ArrivalTime,
                    TicketsLeft = order.Route.TicketsLeft,
                    BoatName = order.Route.Boat.BoatName,
                    Capacity = order.Route.Boat.Capacity,
                    TicketPrice = order.Route.Boat.TicketPrice,
                    ArrivalTerminalName = order.Route.ArrivalPlace.TerminalName,
                    ArrivalTerminalStreet = order.Route.ArrivalPlace.Street,
                    ArrivalTerminalCity = order.Route.ArrivalPlace.TerminalAddress.City,
                    ArrivalTerminalZipCode = order.Route.ArrivalPlace.TerminalAddress.ZipCode,
                    DepartureTerminalName = order.Route.DeparturePlace.TerminalName,
                    DepartureTerminalStreet = order.Route.DeparturePlace.Street,
                    DepartureTerminalZipCode = order.Route.DeparturePlace.TerminalAddress.ZipCode,
                    DepartureTerminalCity = order.Route.DeparturePlace.TerminalAddress.City,
                    Firstname = order.Customer.Firstname,
                    Lastname = order.Customer.Lastname,
                    Street = order.Customer.Street,
                    Phonenr = order.Customer.Phonenr,
                    Email = order.Customer.Email,
                    ZipCode = order.Customer.Postplace.ZipCode,
                    City = order.Customer.Postplace.City
                };
                return fetchedOrder;
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> SaveOrder(Order order)
        {
            try
            {
                //The order that is created and added to the database
                var newOrder = new Orders();

                //The customer for the order, gets its info from the order parameter sent from the frontend
                var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Email == order.Email);
                if (customer == null)
                {
                    customer = new Customers
                    {
                        Firstname = order.Firstname,
                        Lastname = order.Lastname,
                        Street = order.Street,
                        Phonenr = order.Phonenr,
                        Email = order.Email
                    };
                }

                var checkPostPlace = await _db.PostPlaces.FirstOrDefaultAsync(p => p.ZipCode == order.ZipCode);
                //If the postplace doesnt already exist we create a new PostPlace
                if (checkPostPlace == null)
                {
                    var newPostPlace = new PostPlaces
                    {
                        ZipCode = order.ZipCode,
                        City = order.City
                    };
                    customer.Postplace = newPostPlace;
                }
                else
                {
                    customer.Postplace = checkPostPlace;
                }

                //The route for the order                
                var route = await _db.Routes.FirstOrDefaultAsync(r => r.DepartureTime == order.DepartureTime
                && r.DeparturePlace.TerminalName == order.DepartureTerminalName
                && r.ArrivalPlace.TerminalName == order.ArrivalTerminalName);

                newOrder.TicketAmount = order.TicketAmount;
                newOrder.TotalPrice = order.TotalPrice;
                newOrder.Customer = customer;
                newOrder.Route = route;

                _db.Orders.Add(newOrder);

                await _db.SaveChangesAsync();
                _log.LogInformation("Order with id: " + newOrder.Id + " saved!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteOrder(int id)
        {
            try
            {
                Orders order = await _db.Orders.FindAsync(id);
                _db.Orders.Remove(order);
                await _db.SaveChangesAsync();
                _log.LogInformation("Order with id: " + id + " deleted!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EditOrder(Order editedOrder)
        {
            try
            {
                Orders order = await _db.Orders.FindAsync(editedOrder.Id);
                order.TicketAmount = editedOrder.TicketAmount;
                order.TotalPrice = editedOrder.TotalPrice;

                var route = await _db.Routes.FirstOrDefaultAsync(r => r.DepartureTime == editedOrder.DepartureTime
                && r.DeparturePlace.TerminalName == editedOrder.DepartureTerminalName
                && r.ArrivalPlace.TerminalName == editedOrder.ArrivalTerminalName);
                var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Email == editedOrder.Email);

                order.Route = route;
                order.Customer = customer;
                
                await _db.SaveChangesAsync();
                _log.LogInformation(editedOrder.ToString() + " edited!");
                return true;
            }
            catch
            {
                return false;
            }
        }

        //Admin user methods:
        public static byte[] CreateHash(string password, byte[] salt)
        {
            return KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 1000,
                numBytesRequested: 32);
        }

        public static byte[] CreateSalt()
        {
            var csp = new RNGCryptoServiceProvider();
            var salt = new byte[24];
            csp.GetBytes(salt);
            return salt;
        }

        public async Task<bool> LogIn(User user)
        {
            try
            {
                Users foundUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                byte[] hash = CreateHash(user.Password, foundUser.Salt);
                bool ok = hash.SequenceEqual(foundUser.Password);
                if(ok)
                {
                    return true;
                }
                else
                {
                    _log.LogInformation("Wrong password!");
                    return false;
                }
            }
            catch
            {
                _log.LogInformation("Something went wrong logging in.");
                return false;
            }
        }
    }
}
