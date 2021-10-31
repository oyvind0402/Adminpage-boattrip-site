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
    public class OrderTest
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
            var order1 = new Order
            {
                //order info
                TicketAmount = 3,
                TotalPrice = 1200,

                //route info
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,

                //arrival info
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",

                //departure info
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34",

                //boat info
                BoatName = "Colorline",
                Capacity = 1000,
                TicketPrice = 400,

                //customer
                Firstname = "Eivind", 
                Lastname = "Ekeberg", 
                Street = "Osloveien 12", 
                Phonenr = "21111111", 
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2233",
                City = "Oslo",
            };

            var order2 = new Order
            {
                //order info
                TicketAmount = 3,
                TotalPrice = 1200,

                //route info
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 420,

                //arrival info
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",

                //departure info
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34",

                //boat info
                BoatName = "Colorline",
                Capacity = 1000,
                TicketPrice = 400,

                //customer
                Firstname = "Eivind",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2233",
                City = "Oslo",
            };

            var order3 = new Order
            {
                //order info
                TicketAmount = 3,
                TotalPrice = 1200,

                //route info
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,

                //arrival info
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",

                //departure info
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34",

                //boat info
                BoatName = "Colorline",
                Capacity = 1000,
                TicketPrice = 400,

                //customer
                Firstname = "Eivind",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2233",
                City = "Oslo",
            };

            var orderList = new List<Order>();
            orderList.Add(order1);
            orderList.Add(order2);
            orderList.Add(order3);

            mockRep.Setup(k => k.GetAllOrders()).ReturnsAsync(orderList);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;


            //act

            var result = await boatTripController.GetAllOrders() as OkObjectResult;

            //assert

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);

            Assert.Equal<List<Order>>((List<Order>)result.Value, orderList);

        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetAllOrders()).ReturnsAsync(It.IsAny<List<Order>>());

            var boatController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatController.GetAllOrders() as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var order1 = new Order
            {
                //order info
                TicketAmount = 3,
                TotalPrice = 1200,

                //route info
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,

                //arrival info
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",

                //departure info
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34",

                //boat info
                BoatName = "Colorline",
                Capacity = 1000,
                TicketPrice = 400,

                //customer
                Firstname = "Eivind",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2233",
                City = "Oslo",
            };

            mockRep.Setup(k => k.GetOneOrder(It.IsAny<int>())).ReturnsAsync(order1);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneOrder(It.IsAny<int>()) as OkObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Order>(order1, (Order)result.Value);
        }
        [Fact]
        public async Task GetOneLoggedInNotOK()
        {

            mockRep.Setup(k => k.GetOneOrder(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetOneOrder(It.IsAny<int>()) as NotFoundObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that order!", result.Value);

        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetOneOrder(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneOrder(It.IsAny<int>()) as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(k => k.SaveOrder(It.IsAny<Order>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveOrder(It.IsAny<Order>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Order saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(k => k.SaveOrder(It.IsAny<Order>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveOrder(It.IsAny<Order>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that order!", result.Value);
        }
        [Fact]

        public async Task SaveLoggedInFailModel()
        {
            var order1 = new Order
            {
                //order info
                TicketAmount = 3,
                TotalPrice = 1200,

                //route info
                DepartureTime = "12-10-2021",
                ArrivalTime = "13-10-2021",
                TicketsLeft = 400,

                //arrival info
                ArrivalTerminalName = "Oslo",
                ArrivalTerminalCity = "Oslo",
                ArrivalTerminalZipCode = "2343",
                ArrivalTerminalStreet = "OsloStreet 2",

                //departure info
                DepartureTerminalName = "Kiel",
                DepartureTerminalCity = "Kiel",
                DepartureTerminalZipCode = "3333",
                DepartureTerminalStreet = "KielStreet 34",

                //boat info
                BoatName = "Colorline",
                Capacity = 1000,
                TicketPrice = 400,

                //customer
                Firstname = "",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2233",
                City = "Oslo",
            };

            mockRep.Setup(k => k.SaveOrder(order1)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("BoatName", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveOrder(order1) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }
        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(k => k.SaveOrder(It.IsAny<Order>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveOrder(It.IsAny<Order>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }


        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(k => k.DeleteOrder(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteOrder(It.IsAny<int>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Order deleted!", resultat.Value);
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
            var resultat = await boatTripController.DeleteOrder(It.IsAny<int>()) as UnauthorizedObjectResult;

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
            var resultat = await boatTripController.DeleteOrder(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that order!", resultat.Value);
        }
    }
}
