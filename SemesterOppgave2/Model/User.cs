using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SemesterOppgave2.Model
{
    //Will only need this model if we want to create a sign up solution, which it doesnt say we need in the assignment
    public class User
    {
        public int Id { get; set; }
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$")]
        public string Email { get; set; }
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)([a-zA-Z\d]{6,})$")]
        public string Password { get; set; }
    }
}
