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
    public class CustomerTest
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
            var customer1 = new Customer { 
                Firstname = "Eivind", 
                Lastname = "Ekeberg", 
                Street = "Osloveien 12", 
                Phonenr = "21111111", 
                Email = "eivind-ekeberg@gmail.com",
                ZipCode= "2222",
                City = "Oslo"
            };
            var customer2 = new Customer { 
                Firstname = "Lina", 
                Lastname = "Hekkestad", 
                Street = "Trondheimvei 12", 
                Phonenr = "22222222", 
                Email = "lina-hekkestad@gmail.com",
                ZipCode = "4567",
                City ="Kristiansand"

            };
            var customer3 = new Customer { 
                Firstname = "Håkon", 
                Lastname = "Håkonsen", 
                Street = "Kristiandsandgata 12", 
                Phonenr = "33333333", 
                Email = "haakon-haakonsen@gmail.com",
                ZipCode = "4567",
                City = "Kristiansand"

            };

            var customerList = new List<Customer>();
            customerList.Add(customer1);
            customerList.Add(customer3);
            customerList.Add(customer2);

            mockRep.Setup(k => k.GetAllCustomers()).ReturnsAsync(customerList);
            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;


            //act

            var result = await boatTripController.GetAllCustomers() as OkObjectResult;

            //assert

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);

            Assert.Equal<List<Customer>>((List<Customer>)result.Value, customerList);

        }

        [Fact]
        public async Task GetAllLoggedInOKErrorDB()
        {
            var customerList = new List<Customer>();

            mockRep.Setup(c => c.GetAllCustomers()).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            var result = await boatTripController.GetAllCustomers() as OkObjectResult;

            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task GetAllNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetAllCustomers()).ReturnsAsync(It.IsAny<List<Customer>>());

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);
            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetAllCustomers() as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task GetOneLoggedIn()
        {
            //arrange
            var customer1 = new Customer
            {
                Firstname = "Eivind",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2222",
                City = "Oslo"
            };
            mockRep.Setup(k => k.GetOneCustomer(It.IsAny<int>())).ReturnsAsync(customer1);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneCustomer(It.IsAny<int>()) as OkObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Customer>(customer1, (Customer)result.Value);
        }
        [Fact]
        public async Task GetOneLoggedInNotOK()
        {

            mockRep.Setup(k => k.GetOneCustomer(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act
            var result = await boatTripController.GetOneCustomer(It.IsAny<int>()) as NotFoundObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Could not find that customer!", result.Value);

        }

        [Fact]
        public async Task GetOneNotLoggedIn()
        {
            //arrange

            mockRep.Setup(k => k.GetOneCustomer(It.IsAny<int>())).ReturnsAsync(() => null);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            //act

            var result = await boatTripController.GetOneCustomer(It.IsAny<int>()) as UnauthorizedObjectResult;

            //assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Not logged in!", result.Value);
        }

        [Fact]
        public async Task SaveLoggedInOK()
        {
            mockRep.Setup(k => k.SaveCustomer(It.IsAny<Customer>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveCustomer(It.IsAny<Customer>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Customer saved!", resultat.Value);
        }

        [Fact]
        public async Task SaveLoggedInNotOK()
        {
            mockRep.Setup(k => k.SaveCustomer(It.IsAny<Customer>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveCustomer(It.IsAny<Customer>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Could not save that customer!", result.Value);
        }
        [Fact]

        public async Task SaveLoggedInFailModel()
        {
            var customer1 = new Customer
            {
                Firstname = "",
                Lastname = "Ekeberg",
                Street = "Osloveien 12",
                Phonenr = "21111111",
                Email = "eivind-ekeberg@gmail.com",
                ZipCode = "2222",
                City = "Oslo"
            };

            mockRep.Setup(k => k.SaveCustomer(customer1)).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            boatTripController.ModelState.AddModelError("Firstname", "Input not valid!");

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await boatTripController.SaveCustomer(customer1) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Input not valid!", result.Value);
        }
        [Fact]
        public async Task SaveNotLoggedIn()
        {
            mockRep.Setup(k => k.SaveCustomer(It.IsAny<Customer>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.SaveCustomer(It.IsAny<Customer>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }
        [Fact]
        public async Task DeleteLoggedInOK()
        {
            mockRep.Setup(k => k.DeleteCustomer(It.IsAny<int>())).ReturnsAsync(true);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteCustomer(It.IsAny<int>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.Equal("Customer deleted!", resultat.Value);
        }

        [Fact]
        public async Task DeleteNotLoggedIn()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteCustomer(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _notLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteCustomer(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Not logged in!", resultat.Value);
        }

        [Fact]
        public async Task DeleteLoggedInNotOK()
        {
            // Arrange

            mockRep.Setup(k => k.DeleteCustomer(It.IsAny<int>())).ReturnsAsync(false);

            var boatTripController = new BoatTripController(mockRep.Object, mockLog.Object);

            mockSession[_loggedIn] = _loggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            boatTripController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await boatTripController.DeleteCustomer(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Could not delete that customer!", resultat.Value);
        }

    }
}
