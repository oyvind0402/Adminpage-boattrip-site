using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SemesterOppgave2.DAL
{
    public class Customers
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Street { get; set; }
        public string Phonenr { get; set; }
        public string Email { get; set; }
        virtual public PostPlaces Postplace { get; set; }
    }

    public class PostPlaces
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ZipCode { get; set; }
        public string City { get; set; }
    }

    public class Routes
    {
        public int Id { get; set; }
        public string DepartureTime { get; set; }
        public string ArrivalTime { get; set; }
        public int TicketsLeft { get; set; }
        public virtual Boats Boat { get; set; }
        public virtual Terminals DeparturePlace { get; set; }
        public virtual Terminals ArrivalPlace { get; set; }
    }

    public class Terminals
    {
        public int Id { get; set; }
        public string TerminalName { get; set; }
        public string Street { get; set; }
        public virtual PostPlaces TerminalAddress { get; set; }

    }
    public class Orders
    {
        public int Id { get; set; }
        public int TicketAmount { get; set; }
        public int TotalPrice { get; set; }
        public virtual Routes Route { get; set; }
        public virtual Customers Customer { get; set; }
    }


    public class Boats
    {
        public int Id { get; set; }
        public string BoatName { get; set; }
        public int Capacity { get; set; }
        public int TicketPrice { get; set; }
    }

    public class Users
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
    }
    public class BoatTripContext : DbContext
    {
       public BoatTripContext(DbContextOptions<BoatTripContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Customers> Customers { get; set; }
        public DbSet<PostPlaces> PostPlaces { get; set; }
        public DbSet<Boats> Boats { get; set; }
        public DbSet<Routes> Routes { get; set; }
        public DbSet<Terminals> Terminals { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }
}
