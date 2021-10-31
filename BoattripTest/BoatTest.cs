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
    public class BoatTest
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
            var boat1 = new Boat { BoatName = "Colorline", Capacity = 1000, TicketPrice = 400 };
            var boat2 = new Boat { BoatName = "Hurtigruten", Capacity = 600, TicketPrice = 1250 };
            var boat3 = new Boat { BoatName = "DFDS", Capacity = 400, TicketPrice = 650 };

            var boatList = new List<Boat>();
            boatList.Add(boat1);
            boatList.Add(boat2);
            boatList.Add(boat3);

            mockRep.Setup(b => b.GetAllBoats()).ReturnsAsync(boatList);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;


            //act

            var result = await boatTripController.GetAllBoats() as OkObjectResult;

            //assert

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);

            Assert.Equal<List<Boat>>((List < Boat >)result.Value, boatList);

        }

        [Fact]
        public async Task GetAllLoggedInOKErrorDB()
        {
            var boatList = new List<Boat>();

            mockRep.Setup(k => k.GetAllBoats()).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllBoats() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetAllBoats()).ReturnsAsync(It.IsAny<List<Boat>>());

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetAllBoats() as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var boat1 = new Boat { BoatName = "Colorline", Capacity = 1000, TicketPrice = 400 };

            mockRep.Setup(k => k.GetOneBoat(It.IsAny<int>())).ReturnsAsync(boat1);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneBoat(It.IsAny<int>()) as OkObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Boat>(boat1, (Boat)result.Value);
        }
        [Fact]
        public async Task GetOneLoggedInNotOK()
        {

            mockRep.Setup(k => k.GetOneBoat(It.IsAny<int>())).ReturnsAsync(()=>null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetOneBoat(It.IsAny<int>()) as NotFoundObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that boat!", result.Value);

        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetOneBoat(It.IsAny<int>())).ReturnsAsync(()=> null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneBoat(It.IsAny<int>()) as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(k => k.SaveBoat(It.IsAny<Boat>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveBoat(It.IsAny<Boat>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Boat saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(k => k.SaveBoat(It.IsAny<Boat>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveBoat(It.IsAny<Boat>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that boat!", result.Value);
        }
        [Fact]

        public async Task SaveLoggedInFailModel()
        {
            var boat1 = new Boat { BoatName = "", Capacity = 1000, TicketPrice = 400 };


            mockRep.Setup(k => k.SaveBoat(boat1)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("BoatName", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveBoat(boat1) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }
        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(k => k.SaveBoat(It.IsAny<Boat>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveBoat(It.IsAny<Boat>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }
        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(k => k.DeleteBoat(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteBoat(It.IsAny<int>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Boat deleted!", resultat.Value);
        }

        [Fact]
        public async Task DeleteNotLoggedIn()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteBoat(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteBoat(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInNotOK()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteBoat(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteBoat(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that boat!", resultat.Value);
        }

    }
}
