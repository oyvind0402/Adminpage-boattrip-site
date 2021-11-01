using Moq;
using SemesterOppgave2.DAL;
using SemesterOppgave2.Model;
using System;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Http;
using KundeAppTest;
using System.Collections.Generic;
using SemesterOppgave2.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BoattripTest
{
    public class RouteTest
    {
        private const string _loggedIn = "loggedIn";
        private const string _notLoggedIn = "";

        private readonly Mock<IBoatTripRepository> mockRep = new Mock<IBoatTripRepository>();
        private readonly Mock<ILogger<BoatTripRepository>> mockLog = new Mock<ILogger<BoatTripRepository>>();


        private readonly Mock<HttpContext> mockHttpContext = new Mock<HttpContext>();
        private readonly MockHttpSession mockSession = new MockHttpSession();


        [Fact]
        public async Task GetAllLoggedInOK()
        {

            //Arrange
            var route1 = new Route {
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,
                BoatName = "ColorLine",
                Capacity = 500,
                TicketPrice = 1200,
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34"
            };

            var route2 = new Route
            {
                DepartureTime = "14-10-2021",
                ArrivalTime = "15-10-2021",
                TicketsLeft = 440,
                BoatName = "ColorLine",
                Capacity = 500,
                TicketPrice = 1200,
                ArrivalTerminalName = "Kiel",
                ArrivalTerminalCity = "Kiel",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "KielStreet 2",
                DepartureTerminalName = "Oslo",
                DepartureTerminalCity = "Oslo",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "Oslostreet 34"
            };

            var route3 = new Route
            {
                DepartureTime = "16-10-2021",
                ArrivalTime = "17-10-2021",
                TicketsLeft = 200,
                BoatName = "ColorLine",
                Capacity = 500,
                TicketPrice = 1200,
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34"
            };

            var routLsit = new List<Route>();
            routLsit.Add(route1);
            routLsit.Add(route2);
            routLsit.Add(route3);

            mockRep.Setup(k => k.GetAllRoutes()).ReturnsAsync(routLsit);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;


            //act

            var result = await boatTripController.GetAllRoutes() as OkObjectResult;

            //assert

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);

            Assert.Equal<List<Route>>((List<Route>)result.Value, routLsit);

        }

        [Fact]
        public async Task GetAllLoggedInOKErrorDB()
        {
            var routeListe = new List<Route>();

            mockRep.Setup(r => r.GetAllRoutes()).ReturnsAsync(() => null);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllRoutes() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetAllRoutes()).ReturnsAsync(It.IsAny<List<Route>>());

            var boatController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatController.GetAllRoutes() as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var route1 = new Route
            {
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,
                BoatName = "ColorLine",
                Capacity = 500,
                TicketPrice = 1200,
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34"
            };


            mockRep.Setup(k => k.GetOneRoute(It.IsAny<int>())).ReturnsAsync(route1);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneRoute(It.IsAny<int>()) as OkObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Route>(route1, (Route)result.Value);
        }
        [Fact]
        public async Task GetOneLoggedInNotOK()
        {

            mockRep.Setup(k => k.GetOneRoute(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetOneRoute(It.IsAny<int>()) as NotFoundObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that route!", result.Value);

        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetOneRoute(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneRoute(It.IsAny<int>()) as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(k => k.SaveRoute(It.IsAny<Route>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveRoute(It.IsAny<Route>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Route saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(k => k.SaveRoute(It.IsAny<Route>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveRoute(It.IsAny<Route>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that route!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInFailModel()
        {
            var route1 = new Route
            {
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,
                BoatName = "",
                Capacity = 500,
                TicketPrice = 1200,
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34"
            };

            mockRep.Setup(k => k.SaveRoute(route1)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("BoatName", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveRoute(route1) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }

        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(k => k.SaveRoute(It.IsAny<Route>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveRoute(It.IsAny<Route>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }
        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(k => k.DeleteRoute(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteRoute(It.IsAny<int>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Route deleted!", resultat.Value);
        }

        [Fact]
        public async Task DeleteNotLoggedIn()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteRoute(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteRoute(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInNotOK()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteRoute(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteRoute(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that route!", resultat.Value);
        }



    }
}
