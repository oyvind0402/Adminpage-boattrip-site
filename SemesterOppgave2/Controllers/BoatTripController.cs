using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SemesterOppgave2.DAL;
using SemesterOppgave2.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SemesterOppgave2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoatTripController : ControllerBase
    {
        private readonly IBoatTripRepository _db;
        private readonly ILogger<BoatTripRepository> _log;
        private const string _loggedIn = "loggedIn";
        private const string _notLoggedIn = "";

        public BoatTripController(IBoatTripRepository db, ILogger<BoatTripRepository> log)
        {
            _db = db;
            _log = log;
        }

        //Customer methods:
        [HttpGet]
        [Route("getallcustomers")]
        public async Task<ActionResult> GetAllCustomers()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<Customer> allCustomers = await _db.GetAllCustomers();
            return Ok(allCustomers);
        }

        [HttpGet]
        [Route("getonecustomer/{id}")]
        public async Task<ActionResult> GetOneCustomer(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            Customer customer = await _db.GetOneCustomer(id);
            if (customer == null)
            {
                _log.LogInformation("Could not find that customer!");
                return NotFound("Could not find that customer!");
            }
            return Ok(customer);
        }

        [HttpPost]
        [Route("savecustomer")]
        public async Task<ActionResult> SaveCustomer(Customer customer)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool saveCustomer = await _db.SaveCustomer(customer);
                if (!saveCustomer)
                {
                    _log.LogInformation("Could not save that customer!");
                    return BadRequest("Could not save that customer!");
                }
                return Ok("Customer saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deletecustomer/{id}")]
        public async Task<ActionResult> DeleteCustomer(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            bool deleteCustomer = await _db.DeleteCustomer(id);
            if (!deleteCustomer)
            {
                _log.LogInformation("Could not delete that customer!");
                return NotFound("Could not delete that customer!");
            }
            return Ok("Customer deleted!");
        }

        [HttpPut]
        [Route("editcustomer")]
        public async Task<ActionResult> EditCustomer(Customer customer)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool editCustomer = await _db.EditCustomer(customer);
                if (!editCustomer)
                {
                    _log.LogInformation("Could not edit that customer!");
                    return NotFound("Could not edit that customer!");
                }
                return Ok("Customer edited!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //PostPlace methods:
        [HttpGet]
        [Route("getallpostplaces")]
        public async Task<ActionResult> GetAllPostPlaces()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<PostPlace> allPostPlaces = await _db.GetAllPostPlaces();
            return Ok(allPostPlaces);
        }

        [HttpGet]
        [Route("getonepostplace/{zipCode}")]
        public async Task<ActionResult> GetOnePostPlace(string zipCode)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            PostPlace postPlace = await _db.GetOnePostPlace(zipCode);
            if (postPlace == null)
            {
                _log.LogInformation("Could not find that postplace!");
                return NotFound("Could not find that postplace!");
            }
            return Ok(postPlace);
        }

        [HttpPost]
        [Route("savepostplace")]
        public async Task<ActionResult> SavePostPlace(PostPlace postPlace)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool savePostPlace = await _db.SavePostPlace(postPlace);
                if (!savePostPlace)
                {
                    _log.LogInformation("Could not save that postplace!");
                    return BadRequest("Could not save that postplace!");
                }
                return Ok("Postplace saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deletepostplace/{zipCode}")]
        public async Task<ActionResult> DeletePostPlace(string zipCode)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            bool deletedPostPlace = await _db.DeletePostPlace(zipCode);
            if (!deletedPostPlace)
            {
                _log.LogInformation("Could not delete that postplace!");
                return NotFound("Could not delete that postplace!");
            }
            return Ok("Postplace deleted!");
        }

        [HttpPut]
        [Route("editpostplace")]
        public async Task<ActionResult> EditPostPlace(PostPlace postPlace)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool editPostPlace = await _db.EditPostPlace(postPlace);
                if (!editPostPlace)
                {
                    _log.LogInformation("Could not edit that postplace!");
                    return NotFound("Could not edit that postplace!");
                }
                return Ok("Postplace edited!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //Boat methods:
        [HttpGet]
        [Route("getallboats")]
        public async Task<ActionResult> GetAllBoats()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<Boat> allBoats = await _db.GetAllBoats();
            return Ok(allBoats);
        }

        [HttpGet]
        [Route("getoneboat/{id}")]
        public async Task<ActionResult> GetOneBoat(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            Boat boat = await _db.GetOneBoat(id);
            if (boat == null)
            {
                _log.LogInformation("Could not find that boat!");
                return NotFound("Could not find that boat!");
            }
            return Ok(boat);
        }

        [HttpPost]
        [Route("saveboat")]
        public async Task<ActionResult> SaveBoat(Boat boat)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool saveBoat = await _db.SaveBoat(boat);
                if (!saveBoat)
                {
                    _log.LogInformation("Could not save that boat!");
                    return BadRequest("Could not save that boat!");
                }
                return Ok("Boat saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deleteboat/{id}")]
        public async Task<ActionResult> DeleteBoat(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            bool deleteBoat = await _db.DeleteBoat(id);
            if (!deleteBoat)
            {
                _log.LogInformation("Could not delete that boat!");
                return NotFound("Could not delete that boat!");
            }
            return Ok("Boat deleted!");
        }

        [HttpPut]
        [Route("editboat")]
        public async Task<ActionResult> EditBoat(Boat boat)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool editBoat = await _db.EditBoat(boat);
                if (!editBoat)
                {
                    _log.LogInformation("Could not edit that boat!");
                    return NotFound("Could not edit that boat!");
                }
                return Ok("Boat edited!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //Terminal methods:
        [HttpGet]
        [Route("getallterminals")]
        public async Task<ActionResult> GetAllTerminals()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<Terminal> allTerminals = await _db.GetAllTerminals();
            return Ok(allTerminals);
        }

        [HttpGet]
        [Route("getoneterminal/{id}")]
        public async Task<ActionResult> GetOneTerminal(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            Terminal terminal = await _db.GetOneTerminal(id);
            if (terminal == null)
            {
                _log.LogInformation("Could not find that terminal!");
                return NotFound("Could not find that terminal!");
            }
            return Ok(terminal);
        }

        [HttpPost]
        [Route("saveterminal")]
        public async Task<ActionResult> SaveTerminal(Terminal terminal)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool saveTerminal = await _db.SaveTerminal(terminal);
                if (!saveTerminal)
                {
                    _log.LogInformation("Could not save that terminal!");
                    return BadRequest("Could not save that terminal!");
                }
                return Ok("Terminal saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deleteterminal{id}")]
        public async Task<ActionResult> DeleteTerminal(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            bool deletedTerminal = await _db.DeleteTerminal(id);
            if (!deletedTerminal)
            {
                _log.LogInformation("Could not delete that terminal!");
                return NotFound("Could not delete that terminal!");
            }
            return Ok("Terminal deleted!");
        }

        [HttpPut]
        [Route("editterminal")]
        public async Task<ActionResult> EditTerminal(Terminal terminal)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool editTerminal = await _db.EditTerminal(terminal);
                if (!editTerminal)
                {
                    _log.LogInformation("Could not edit that terminal!");
                    return NotFound("Could not edit that terminal!");
                }
                return Ok("Terminal edited!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //Route methods:
        [HttpGet]
        [Route("getallroutes")]
        public async Task<ActionResult> GetAllRoutes()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<Route> allRoutes = await _db.GetAllRoutes();
            return Ok(allRoutes);
        }

        [HttpGet]
        [Route("getoneroute/{id}")]
        public async Task<ActionResult> GetOneRoute(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            Route route = await _db.GetOneRoute(id);
            if (route == null)
            {
                _log.LogInformation("Could not find that route!");
                return NotFound("Could not find that route!");
            }
            return Ok(route);
        }

        [HttpPost]
        [Route("saveroute")]
        public async Task<ActionResult> SaveRoute(Route route)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            if (ModelState.IsValid)
            {
                bool saveRoute = await _db.SaveRoute(route);
                if (!saveRoute)
                {
                    _log.LogInformation("Could not save that route!");
                    return BadRequest("Could not save that route!");
                }
                return Ok("Route saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deleteroute/{id}")]
        public async Task<ActionResult> DeleteRoute(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }

            bool deleteRoute = await _db.DeleteRoute(id);
            if (!deleteRoute)
            {
                _log.LogInformation("Could not delete that route!");
                return NotFound("Could not delete that route!");
            }
            return Ok("Route deleted!");
        }

        [HttpPut]
        [Route("editroute")]
        public async Task<ActionResult> EditRoute(Route route)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            if (ModelState.IsValid)
            {
                bool editRoute = await _db.EditRoute(route);
                if (!editRoute)
                {
                    _log.LogInformation("Could not edit that route!");
                    return NotFound("Could not edit that route!");
                }
                return Ok("Route edited!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //Order methods:
        [HttpGet]
        [Route("getallorders")]
        public async Task<ActionResult> GetAllOrders()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            List<Order> allOrders = await _db.GetAllOrders();
            return Ok(allOrders);
        }

        [HttpGet]
        [Route("getoneorder/{id}")]
        public async Task<ActionResult> GetOneOrder(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            Order order = await _db.GetOneOrder(id);
            if (order == null)
            {
                _log.LogInformation("Could not find that order!");
                return NotFound("Could not find that order!");
            }
            return Ok(order);
        }

        [HttpPost]
        [Route("saveorder")]
        public async Task<ActionResult> SaveOrder(Order order)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            bool saveOrder = await _db.SaveOrder(order);
            if (ModelState.IsValid)
            {
                if (!saveOrder)
                {
                    _log.LogInformation("Could not save that order!");
                    return BadRequest("Could not save that order!");
                }
                return Ok("Order saved!");
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        [HttpDelete]
        [Route("deleteorder/{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            bool deleteOrder = await _db.DeleteOrder(id);
            if(!deleteOrder)
            {
                _log.LogInformation("Could not delete that order!");
                return NotFound("Could not delete that order!");
            }
            return Ok("Order deleted!");
        }

        [HttpPut]
        [Route("editorder")]
        public async Task<ActionResult> EditOrder(Order order)
        {
            if(string.IsNullOrEmpty(HttpContext.Session.GetString(_loggedIn)))
            {
                return Unauthorized("Not logged in!");
            }
            bool editOrder = await _db.EditOrder(order);
            if(ModelState.IsValid)
            {
                if (!editOrder)
                {
                    _log.LogInformation("Could not edit that order!");
                    return NotFound("Could not edit that order!");
                }
                return Ok("Order edited!");
            } else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }

        //Admin user methods:
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LogIn(User user)
        {
            if(ModelState.IsValid)
            {
                bool logInOK = await _db.LogIn(user);
                if(!logInOK)
                {
                    _log.LogInformation("Login failed!");
                    HttpContext.Session.SetString(_loggedIn, _notLoggedIn);
                    return Ok(false);
                }
                HttpContext.Session.SetString(_loggedIn, _loggedIn);
                return Ok(true);
            }
            else
            {
                _log.LogInformation("Input not valid!");
                return BadRequest("Input not valid!");
            }
        }
        [HttpGet]
        [Route("logout")]
        public void LogOut()
        {
            HttpContext.Session.SetString(_loggedIn, _notLoggedIn);
        }
    }
}
