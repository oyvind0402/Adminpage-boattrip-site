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
    public class TerminalTest
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

            var terminal1 = new Terminal { 
                TerminalName = "Oslo", 
                Street = "Schweigaards gate 1",
                ZipCode = "2222",
                City = "Oslo"
            };
            var terminal2 = new Terminal { 
                TerminalName = "Kiel", 
                Street = "Kiel kai",
                ZipCode = "2222",
                City = "Oslo"
            };
            var terminal3 = new Terminal { 
                TerminalName = "Bergen", 
                Street = "Sundts gate 1",
                ZipCode = "2222",
                City = "Oslo"
            };

            var terminalList = new List<Terminal>();
            terminalList.Add(terminal1);
            terminalList.Add(terminal2);
            terminalList.Add(terminal3);

            mockRep.Setup(k => k.GetAllTerminals()).ReturnsAsync(terminalList);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;


            //act

            var result = await boatTripController.GetAllTerminals() as OkObjectResult;

            //assert

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);

            Assert.Equal<List<Terminal>>((List<Terminal>)result.Value, terminalList);

        }

        [Fact]
        public async Task GetAllLoggedInOKErrorDB()
        {
            var terminalList = new List<Terminal>();

            mockRep.Setup(t => t.GetAllTerminals()).ReturnsAsync(() => null);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllTerminals() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetAllTerminals()).ReturnsAsync(It.IsAny<List<Terminal>>());

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetAllTerminals() as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var terminal1 = new Terminal
            {
                TerminalName = "Oslo",
                Street = "Schweigaards gate 1",
                ZipCode = "2222",
                City = "Oslo"
            };

            mockRep.Setup(k => k.GetOneTerminal(It.IsAny<int>())).ReturnsAsync(terminal1);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneTerminal(It.IsAny<int>()) as OkObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Terminal>(terminal1, (Terminal)result.Value);
        }
        [Fact]
        public async Task GetOneLoggedInNotOK()
        {

            mockRep.Setup(k => k.GetOneTerminal(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetOneTerminal(It.IsAny<int>()) as NotFoundObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that terminal!", result.Value);

        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetOneTerminal(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneTerminal(It.IsAny<int>()) as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(k => k.SaveTerminal(It.IsAny<Terminal>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveTerminal(It.IsAny<Terminal>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Terminal saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(k => k.SaveTerminal(It.IsAny<Terminal>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveTerminal(It.IsAny<Terminal>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that terminal!", result.Value);
        }
        [Fact]

        public async Task SaveLoggedInFailModel()
        {
            var terminal1 = new Terminal
            {
                TerminalName = "",
                Street = "Schweigaards gate 1",
                ZipCode = "2222",
                City = "Oslo"
            };

            mockRep.Setup(k => k.SaveTerminal(terminal1)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("TerminalName", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveTerminal(terminal1) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }
        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(k => k.SaveTerminal(It.IsAny<Terminal>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveTerminal(It.IsAny<Terminal>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }
        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(k => k.DeleteTerminal(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteTerminal(It.IsAny<int>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Terminal deleted!", resultat.Value);
        }

        [Fact]
        public async Task DeleteNotLoggedIn()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteTerminal(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteTerminal(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInNotOK()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteTerminal(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteTerminal(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that terminal!", resultat.Value);
        }

        [Fact]
        public async Task EditLoggedInOK()
        {
            mockRep.Setup(t => t.EditTerminal(It.IsAny<Terminal>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.EditTerminal(It.IsAny<Terminal>()) as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal("Terminal edited!", result.Value);
        }

        [Fact]
        public async Task EditLoggedInNotOK()
        {
            mockRep.Setup(t => t.EditTerminal(It.IsAny<Terminal>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.EditTerminal(It.IsAny<Terminal>()) as NotFoundObjectResult;

            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not edit that terminal!", result.Value);
        }

        [Fact]
        public async Task EditNotLoggedIn()
        {
            mockRep.Setup(t => t.EditTerminal(It.IsAny<Terminal>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.EditTerminal(It.IsAny<Terminal>()) as UnauthorizedObjectResult;

            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task EditLoggedInWrongModel()
        {
            var terminal = new Terminal
            {
                TerminalName = "",
                Street = "Schweigaards gate 1",
                ZipCode = "2222",
                City = "Oslo"
            }; ;

            mockRep.Setup(t => t.EditTerminal(terminal)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            boatTripController.ModelState.AddModelError("TerminalName", "Input not valid!");
            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.EditTerminal(terminal) as BadRequestObjectResult;

            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }
    }
}
