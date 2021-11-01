using KundeAppTest;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using SemesterOppgave2.Controllers;
using SemesterOppgave2.DAL;
using SemesterOppgave2.Model;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BoattripTest
{
    public class PostPlaceTest
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
            var postPlace1 = new PostPlace
            {
                City = "Oslo",
                ZipCode = "1111"
            };

            var postPlace2 = new PostPlace
            {
                City = "Helsinki",
                ZipCode = "2100"
            };

            var postPlace3 = new PostPlace
            {
                City = "Kieel-Gaarden",
                ZipCode = "24143"
            };

            var postPlaceList = new List<PostPlace>();
            postPlaceList.Add(postPlace1);
            postPlaceList.Add(postPlace2);
            postPlaceList.Add(postPlace3);

            mockRep.Setup(p => p.GetAllPostPlaces()).ReturnsAsync(postPlaceList);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllPostPlaces() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<PostPlace>>((List<PostPlace>)result.Value, postPlaceList);
        }

        [Fact]
        public async Task GetAllLoggedInOKErrorDB()
        {
            var postPlaceList = new List<PostPlace>();

            mockRep.Setup(p => p.GetAllPostPlaces()).ReturnsAsync(() => null);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllPostPlaces() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            mockRep.Setup(p => p.GetAllPostPlaces()).ReturnsAsync(It.IsAny<List<PostPlace>>());

            var boatController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatController.GetAllPostPlaces() as UnauthorizedObjectResult;

            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var postplace = new PostPlace
            {
                City = "Oslo",
                ZipCode = "1111"
            };

            mockRep.Setup(p => p.GetOnePostPlace(It.IsAny<string>())).ReturnsAsync(postplace);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetOnePostPlace(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<PostPlace>(postplace, (PostPlace)result.Value);
        }

        [Fact]
        public async Task GetOneLoggedInNotOK()
        {
            mockRep.Setup(p => p.GetOnePostPlace(It.IsAny<string>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetOnePostPlace(It.IsAny<string>()) as NotFoundObjectResult;

            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that postplace!", result.Value);
        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            mockRep.Setup(p => p.GetOnePostPlace(It.IsAny<string>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetOnePostPlace(It.IsAny<string>()) as UnauthorizedObjectResult;

            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(p => p.SavePostPlace(It.IsAny<PostPlace>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var resultat = await boatTripController.SavePostPlace(It.IsAny<PostPlace>()) as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Postplace saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(p => p.SavePostPlace(It.IsAny<PostPlace>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.SavePostPlace(It.IsAny<PostPlace>()) as BadRequestObjectResult;

            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that postplace!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInFailModel()
        {
            var postplace = new PostPlace
            {
                City = "",
                ZipCode = "1234"
            };

            mockRep.Setup(p => p.SavePostPlace(postplace)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("City", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.SavePostPlace(postplace) as BadRequestObjectResult;

            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }

        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(p => p.SavePostPlace(It.IsAny<PostPlace>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var resultat = await boatTripController.SavePostPlace(It.IsAny<PostPlace>()) as UnauthorizedObjectResult;

            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(p => p.DeletePostPlace(It.IsAny<string>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var resultat = await boatTripController.DeletePostPlace(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Postplace deleted!", resultat.Value);
        }

        [Fact]
        public async Task DeleteNotLoggedIn()
        {
            mockRep.Setup(p => p.DeletePostPlace(It.IsAny<string>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var resultat = await boatTripController.DeletePostPlace(It.IsAny<string>()) as UnauthorizedObjectResult;

            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInNotOK()
        {
            mockRep.Setup(p => p.DeletePostPlace(It.IsAny<string>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var resultat = await boatTripController.DeletePostPlace(It.IsAny<string>()) as NotFoundObjectResult;

            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that postplace!", resultat.Value);
        }
    }
}
