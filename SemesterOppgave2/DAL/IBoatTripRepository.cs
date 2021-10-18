using SemesterOppgave2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SemesterOppgave2.DAL
{
    public interface IBoatTripRepository
    {
        Task<List<Customer>> GetAllCustomers();
        Task<Customer> GetOneCustomer(int id);
        Task<bool> SaveCustomer(Customer customer);
        Task<bool> DeleteCustomer(int id);
        Task<bool> EditCustomer(Customer changedCustomer);

        Task<List<PostPlace>> GetAllPostPlaces();
        Task<PostPlace> GetOnePostPlace(string zipCode);
        Task<bool> SavePostPlace(PostPlace postPlace);
        Task<bool> DeletePostPlace(string zipCode);
        Task<bool> EditPostPlace(PostPlace postPlace);

        Task<List<Boat>> GetAllBoats();
        Task<Boat> GetOneBoat(int id);
        Task<bool> SaveBoat(Boat boat);
        Task<bool> DeleteBoat(int id);
        Task<bool> EditBoat(Boat changedBoat);

        Task<List<Terminal>> GetAllTerminals();
        Task<Terminal> GetOneTerminal(int id);
        Task<bool> SaveTerminal(Terminal terminal);
        Task<bool> DeleteTerminal(int id);
        Task<bool> EditTerminal(Terminal changedTerminal);

        Task<List<Route>> GetAllRoutes();
        Task<Route> GetOneRoute(int id);
        Task<bool> SaveRoute(Route route);
        Task<bool> DeleteRoute(int id);
        Task<bool> EditRoute(Route editedRoute);

        Task<List<Order>> GetAllOrders();
        Task<Order> GetOneOrder(int id);
        Task<bool> SaveOrder(Order order);
    }
}
